/**
 * GET /api/qimen/analysis?date=YYYY-MM-DD&hour=0-23&mode=basic|enhanced
 *
 * 奇門遁甲分析 API — proxies to Go gRPC backend.
 *
 * Query Parameters:
 *   - date: 日期，格式 YYYY-MM-DD（選填，預設今天）
 *   - hour: 小時數 0-23（選填，預設當前小時）
 *   - mode: basic（基礎）或 enhanced（增強），預設 basic
 *
 * Response: QimenAnalysisJSON | EnhancedAnalysisJSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';
import { normalizePlate, normalizeAnalysis, normalizeEnhanced } from '@/lib/grpc-normalize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const hourParam = searchParams.get('hour');
    const mode = searchParams.get('mode') || 'basic';

    if (mode !== 'basic' && mode !== 'enhanced') {
      return NextResponse.json(
        { error: 'mode 參數無效，請使用 basic 或 enhanced', code: 'INVALID_MODE' },
        { status: 400 }
      );
    }

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

    const req = { date: dateStr, hour };

    const res = mode === 'enhanced'
      ? await qimenClient.analyzeEnhanced(req)
      : await qimenClient.analyzePlate(req);

    if (!res.success) {
      const isLunar = (res.error_code || '').includes('LUNAR');
      return NextResponse.json(
        { error: res.error, code: res.error_code },
        { status: isLunar ? 503 : 500 }
      );
    }

    const data: Record<string, unknown> = {
      plate: normalizePlate(res.plate),
      analysis: normalizeAnalysis(res.analysis),
    };
    if (mode === 'enhanced') {
      data.enhanced = normalizeEnhanced(res.enhanced);
    }

    return NextResponse.json({
      success: true,
      data,
      meta: {
        mode,
        timestamp: res.meta?.timestamp ?? new Date().toISOString(),
        version: res.meta?.version ?? '1.0.0',
      },
    });
  } catch (error) {
    console.error('[API] /api/qimen/analysis error:', error);
    const message = error instanceof Error ? error.message : '分析計算失敗';
    const isBackend = message.includes('connect') || message.includes('UNAVAILABLE');
    return NextResponse.json(
      {
        error: isBackend ? '無法連接 Go 後端服務，請確認服務已啟動' : message,
        code: isBackend ? 'BACKEND_UNAVAILABLE' : 'ANALYSIS_ERROR',
      },
      { status: isBackend ? 503 : 500 }
    );
  }
}
