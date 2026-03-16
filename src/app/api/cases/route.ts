/**
 * GET /api/cases?id=xxx&tag=xxx&type=xxx&search=xxx
 * 
 * 案例分析庫 API
 * 提供經典案例查詢
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  CASE_STUDIES, 
  getCaseStudyById, 
  getAllCaseTags,
  getCaseStudiesByTag,
  getCaseStudiesByMatterType 
} from '@/lib/qimen/caseStudies';
import { MatterType } from '@/lib/qimen/symbolism';

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
    const type = searchParams.get('type') as MatterType | null;
    const search = searchParams.get('search');

    // 根據 ID 查詢單一案例
    if (id) {
      const caseStudy = getCaseStudyById(id);
      if (!caseStudy) {
        return NextResponse.json(
          { error: '案例不存在', code: 'CASE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: caseStudy,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    let results = [...CASE_STUDIES];

    // 標籤篩選
    if (tag) {
      results = results.filter(c => c.tags.includes(tag));
    }

    // 問事類型篩選
    if (type) {
      results = results.filter(c => c.matterType === type);
    }

    // 關鍵字搜尋
    if (search) {
      const lowerSearch = search.toLowerCase();
      results = results.filter(c => 
        c.title.includes(search) ||
        c.description.includes(search) ||
        c.question.includes(search) ||
        c.tags.some(t => t.includes(search))
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        count: results.length,
        total: CASE_STUDIES.length,
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
