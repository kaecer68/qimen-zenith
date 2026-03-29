/**
 * gRPC client — connects Next.js API routes to the Go qimen backend.
 *
 * Environment variables:
 *   GRPC_HOST        — full host:port override for the Go server
 *   QIMEN_GRPC_PORT  — contract-derived gRPC port
 *   GRPC_PORT        — legacy alias generated from .env.ports
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

const proto = grpc.loadPackageDefinition(packageDef) as any;
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
    client[method](request, (err: grpc.ServiceError | null, response: Res) => {
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

export interface AnalyzePlateRequest extends CalculatePlateRequest {}
export interface AnalyzeEnhancedRequest extends CalculatePlateRequest {}

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

export const qimenClient = {
  calculatePlate: (req: CalculatePlateRequest) =>
    call<CalculatePlateRequest, any>('CalculatePlate', req),

  analyzePlate: (req: AnalyzePlateRequest) =>
    call<AnalyzePlateRequest, any>('AnalyzePlate', req),

  analyzeEnhanced: (req: AnalyzeEnhancedRequest) =>
    call<AnalyzeEnhancedRequest, any>('AnalyzeEnhanced', req),

  getTeachingSections: (req: TeachingRequest) =>
    call<TeachingRequest, any>('GetTeachingSections', req),

  getCases: (req: CasesRequest) =>
    call<CasesRequest, any>('GetCases', req),

  getPatterns: (req: PatternsRequest) =>
    call<PatternsRequest, any>('GetPatterns', req),

  health: () => call<Record<string, never>, any>('Health', {}),
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
