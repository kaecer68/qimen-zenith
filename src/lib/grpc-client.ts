/**
 * gRPC client — connects Next.js API routes to the Go qimen backend.
 *
 * Environment variables:
 *   QIMEN_GRPC_HOST  — contract-derived host:port emitted by .env.ports
 *   GRPC_HOST        — full host:port override for the Go server
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { getQimenGrpcHost } from './runtime-contract';

// ──────────────────────────────────────────────────────────────────────────────
// Proto loading
// ──────────────────────────────────────────────────────────────────────────────

const PROTO_PATH = path.join(process.cwd(), 'proto/qimen.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

type GrpcCallback<Res> = (err: grpc.ServiceError | null, response: Res) => void;

interface QimenGrpcService {
  CalculatePlate: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  AnalyzePlate: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  AnalyzeEnhanced: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  GetTeachingSections: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  GetCases: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  GetPatterns: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
  Health: <Req, Res>(request: Req, callback: GrpcCallback<Res>) => void;
}

interface QimenGrpcCtor {
  new (host: string, credentials: grpc.ChannelCredentials): QimenGrpcService;
}

interface LoadedProto {
  qimen: {
    QimenService: QimenGrpcCtor;
  };
}

const proto = grpc.loadPackageDefinition(packageDef) as unknown as LoadedProto;
const qimenPackage = proto.qimen;

// ──────────────────────────────────────────────────────────────────────────────
// Singleton client
// ──────────────────────────────────────────────────────────────────────────────

function createClient() {
  const host = getQimenGrpcHost();
  return new qimenPackage.QimenService(host, grpc.credentials.createInsecure());
}

let _client: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (!_client) {
    _client = createClient();
  }
  return _client;
}

// ──────────────────────────────────────────────────────────────────────────────
// Promisified helpers
// ──────────────────────────────────────────────────────────────────────────────

function call<Req, Res>(method: string, request: Req): Promise<Res> {
  return new Promise<Res>((resolve, reject) => {
    const client = getClient();
    const rpc = client[method as keyof QimenGrpcService] as QimenGrpcService[keyof QimenGrpcService];
    rpc.call(client, request, (err: grpc.ServiceError | null, response: Res) => {
      if (err) reject(err);
      else resolve(response);
    });
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────────────────────────────────────

export interface CalculatePlateRequest {
  date?: string;
  hour?: number;
  matter_type?: number;
  liuqin?: string;
}

export type AnalyzePlateRequest = CalculatePlateRequest;
export type AnalyzeEnhancedRequest = CalculatePlateRequest;

export interface TeachingRequest {
  section_id?: string;
}

export interface CasesRequest {
  case_id?: string;
  tag?: string;
  matter_type?: number;
  search?: string;
}

export interface PatternsRequest {
  pattern_id?: string;
  type?: number;
  search?: string;
}

export type GrpcScalar = string | number | boolean | null | undefined;
export type GrpcMap = Record<string, GrpcScalar | GrpcMap | GrpcList>;
export type GrpcList = Array<GrpcScalar | GrpcMap | GrpcList>;
export type GrpcMessage = Record<string, GrpcScalar | GrpcMap | GrpcList>;

export interface HealthResponse extends GrpcMessage {
  status?: string;
  version?: string;
  timestamp?: string;
}

export const qimenClient = {
  calculatePlate: (req: CalculatePlateRequest) =>
    call<CalculatePlateRequest, GrpcMessage>('CalculatePlate', req),

  analyzePlate: (req: AnalyzePlateRequest) =>
    call<AnalyzePlateRequest, GrpcMessage>('AnalyzePlate', req),

  analyzeEnhanced: (req: AnalyzeEnhancedRequest) =>
    call<AnalyzeEnhancedRequest, GrpcMessage>('AnalyzeEnhanced', req),

  getTeachingSections: (req: TeachingRequest) =>
    call<TeachingRequest, GrpcMessage>('GetTeachingSections', req),

  getCases: (req: CasesRequest) =>
    call<CasesRequest, GrpcMessage>('GetCases', req),

  getPatterns: (req: PatternsRequest) =>
    call<PatternsRequest, GrpcMessage>('GetPatterns', req),

  health: () => call<Record<string, never>, HealthResponse>('Health', {}),
};

// MatterType enum values (mirrors proto enum)
export const MatterTypeProto: Record<string, number> = {
  general: 1, wealth: 2, career: 3, travel: 4, health: 5,
  relationship: 6, study: 7, lost: 8, legal: 9,
  property: 10, marriage: 11, business: 12, litigation: 13,
};

// PatternType enum values
export const PatternTypeProto: Record<string, number> = {
  auspicious: 1, inauspicious: 2, special: 3, combination: 4,
};
