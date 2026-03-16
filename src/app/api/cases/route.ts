/**
 * GET /api/cases?id=xxx&tag=xxx&type=xxx&search=xxx
 *
 * 案例分析庫 API — proxies to Go gRPC backend.
 */

import { NextRequest, NextResponse } from 'next/server';
import { qimenClient, MatterTypeProto } from '@/lib/grpc-client';
import { normalizeCase } from '@/lib/grpc-normalize';

/**
 * GET /api/cases
 *
 * Query Parameters:
 *   - id: 案例 ID（選填）
 *   - tag: 標籤篩選（選填）
 *   - type: 問事類型篩選（選填）
 *   - search: 關鍵字搜尋（選填）
 *
 * Response: CaseStudy | CaseStudy[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tag = searchParams.get('tag');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const req: Record<string, unknown> = {};
    if (id) req.case_id = id;
    if (tag) req.tag = tag;
    if (type && MatterTypeProto[type]) req.matter_type = MatterTypeProto[type];
    if (search) req.search = search;

    const res = await qimenClient.getCases(req);

    if (!res.success) {
      const status = (res.error_code === 'CASE_NOT_FOUND') ? 404 : 500;
      return NextResponse.json({ error: res.error, code: res.error_code }, { status });
    }

    const cases = (res.cases ?? []).map(normalizeCase);

    if (id) {
      return NextResponse.json({
        success: true,
        data: cases[0] ?? null,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      success: true,
      data: cases,
      meta: {
        count: cases.length,
        total: res.total ?? cases.length,
        filters: { tag, type, search },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] /api/cases error:', error);
    return NextResponse.json(
      { error: '獲取案例失敗', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
