/**
 * GET /api/qimen/plate?date=YYYY-MM-DD&hour=0-23
 *
 * 奇門遁甲排盤 API — proxies to Go gRPC backend.
 *
 * Query Parameters:
 *   - date: 日期，格式 YYYY-MM-DD（選填，預設今天）
 *   - hour: 小時數 0-23（選填，預設當前小時）
 *
 * Response: QimenPlateJSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';
import { normalizePlate } from '@/lib/grpc-normalize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const hourParam = searchParams.get('hour');

    const now = new Date();
    let hour = now.getHours();
    if (hourParam !== null) {
      const parsed = parseInt(hourParam, 10);
      if (isNaN(parsed) || parsed < 0 || parsed > 23) {
        return NextResponse.json(
          { error: 'hour 參數無效，請使用 0-23', code: 'INVALID_HOUR' },
          { status: 400 }
        );
      }
      hour = parsed;
    }

    const dateStr = dateParam || now.toISOString().split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: '日期格式錯誤，請使用 YYYY-MM-DD 格式', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }

    const res = await qimenClient.calculatePlate({ date: dateStr, hour });

    if (!res.success) {
      const isLunar = (res.error_code || '').includes('LUNAR');
      return NextResponse.json(
        { error: res.error, code: res.error_code },
        { status: isLunar ? 503 : 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: normalizePlate(res.plate),
      meta: {
        timestamp: res.meta?.timestamp ?? new Date().toISOString(),
        version: res.meta?.version ?? '1.0.0',
      },
    });
  } catch (error) {
    console.error('[API] /api/qimen/plate error:', error);
    const message = error instanceof Error ? error.message : '排盤計算失敗';
    const isLunar = message.includes('lunar') || message.includes('connect');
    return NextResponse.json(
      {
        error: isLunar ? '無法連接 Go 後端服務，請確認服務已啟動' : message,
        code: isLunar ? 'BACKEND_UNAVAILABLE' : 'CALCULATION_ERROR',
      },
      { status: isLunar ? 503 : 500 }
    );
  }
}
