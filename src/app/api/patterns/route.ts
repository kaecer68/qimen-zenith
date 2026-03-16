/**
 * GET /api/patterns?id=xxx&type=xxx&search=xxx
 *
 * 格局查詢手冊 API — proxies to Go gRPC backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { qimenClient, PatternTypeProto } from '@/lib/grpc-client';
import { normalizePattern } from '@/lib/grpc-normalize';

/**
 * GET /api/patterns
 *
 * Query Parameters:
 *   - id: 格局 ID（選填）
 *   - type: auspicious / inauspicious / special / combination（選填）
 *   - search: 關鍵字搜尋（選填）
 *
 * Response: QimenPattern | QimenPattern[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const req: Record<string, unknown> = {};
    if (id) req.pattern_id = id;
    if (type && PatternTypeProto[type]) req.type = PatternTypeProto[type];
    if (search) req.search = search;

    const res = await qimenClient.getPatterns(req);

    if (!res.success) {
      const status = (res.error_code === 'PATTERN_NOT_FOUND') ? 404 : 500;
      return NextResponse.json({ error: res.error, code: res.error_code }, { status });
    }

    const patterns = (res.patterns ?? []).map(normalizePattern);

    if (id) {
      return NextResponse.json({
        success: true,
        data: patterns[0] ?? null,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      success: true,
      data: patterns,
      meta: {
        count: patterns.length,
        total: res.total ?? patterns.length,
        filters: { type, search },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] /api/patterns error:', error);
    return NextResponse.json(
      { error: '獲取格局失敗', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
