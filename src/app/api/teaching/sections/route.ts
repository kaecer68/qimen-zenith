/**
 * GET /api/teaching/sections?id=xxx
 *
 * 奇門遁甲基礎教學 API — proxies to Go gRPC backend.
 *
 * Query Parameters:
 *   - id: 章節 ID（選填，無則返回全部）
 *
 * Response: TeachingSection | TeachingSection[]
 */

import { NextRequest, NextResponse } from 'next/server';
import { qimenClient } from '@/lib/grpc-client';
import { normalizeSection } from '@/lib/grpc-normalize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const res = await qimenClient.getTeachingSections({ section_id: id ?? '' });

    if (!res.success) {
      const status = (res.error_code === 'SECTION_NOT_FOUND') ? 404 : 500;
      return NextResponse.json({ error: res.error, code: res.error_code }, { status });
    }

    const sections = (res.sections ?? []).map(normalizeSection);

    if (id) {
      return NextResponse.json({
        success: true,
        data: sections[0] ?? null,
        meta: { timestamp: new Date().toISOString() },
      });
    }

    return NextResponse.json({
      success: true,
      data: sections,
      meta: {
        count: sections.length,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[API] /api/teaching/sections error:', error);
    return NextResponse.json(
      { error: '獲取教學內容失敗', code: 'FETCH_ERROR' },
      { status: 500 }
    );
  }
}
