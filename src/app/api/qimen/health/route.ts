/**
 * GET /api/qimen/health
 *
 * 健康檢查 API — proxies to Go gRPC backend.
 *
 * Response:
 *   - status: "ok" | "degraded"
 *   - services: 各服務狀態
 */

import { NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';

export async function GET() {
  const health: {
    status: 'ok' | 'degraded';
    version: string;
    timestamp: string;
    services: {
      goBackend: { status: 'ok' | 'unavailable'; message?: string };
    };
  } = {
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      goBackend: { status: 'ok' },
    },
  };

  try {
    const res = await qimenClient.health();
    health.services.goBackend = { status: 'ok' };
    health.version = res.version ?? '1.0.0';
  } catch {
    health.status = 'degraded';
    health.services.goBackend = {
      status: 'unavailable',
      message: 'Go gRPC 後端服務無法連接，請確認 cmd/server/main.go 已啟動',
    };
  }

  return NextResponse.json(health, { status: health.status === 'ok' ? 200 : 503 });
}
