/**
 * GET /api/qimen/health
 * 
 * 健康檢查 API
 * 確認奇門遁甲 API 服務是否正常運作
 * 
 * Response:
 *   - status: "ok" | "degraded"
 *   - services: 各服務狀態
 */

import { NextResponse } from 'next/server';
import { getLunarData } from '@/lib/lunar-api';

export async function GET() {
  const health: {
    status: 'ok' | 'degraded';
    version: string;
    timestamp: string;
    services: {
      qimen: { status: 'ok' };
      lunar: { status: 'ok' | 'unavailable'; message?: string };
    };
  } = {
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    services: {
      qimen: { status: 'ok' },
      lunar: { status: 'ok' },
    },
  };

  // 檢查 lunar-zenith 服務
  try {
    const today = new Date().toISOString().split('T')[0];
    await getLunarData(today);
  } catch {
    health.status = 'degraded';
    health.services.lunar = {
      status: 'unavailable',
      message: '曆法服務 (lunar-zenith) 無法連接',
    };
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
