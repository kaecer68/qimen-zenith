/**
 * GET /api/teaching/sections
 * GET /api/teaching/sections/:id
 * 
 * 奇門遁甲基礎教學 API
 * 提供教學章節內容
 */

import { NextRequest, NextResponse } from 'next/server';
import { TEACHING_SECTIONS, getTeachingSection, getAllTeachingSections } from '@/lib/qimen/teaching';

/**
 * GET /api/teaching/sections?id=xxx
 * 
 * Query Parameters:
 *   - id: 章節 ID（選填，無則返回全部）
 * 
 * Response: TeachingSection | TeachingSection[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const section = getTeachingSection(id);
      if (!section) {
        return NextResponse.json(
          { error: '章節不存在', code: 'SECTION_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: section,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    // 返回全部章節
    const sections = getAllTeachingSections();
    
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
