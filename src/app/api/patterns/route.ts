/**
 * GET /api/patterns?id=xxx&type=xxx&search=xxx
 * 
 * 格局查詢手冊 API
 * 提供吉凶格局查詢
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  QIMEN_PATTERNS, 
  getPatternById, 
  getPatternsByType,
  searchPatterns,
  PatternType 
} from '@/lib/qimen/patterns';

/**
 * GET /api/patterns
 * 
 * Query Parameters:
 *   - id: 格局 ID（選填）
 *   - type: 格局類型（auspicious/inauspicious/special/combination，選填）
 *   - search: 關鍵字搜尋（選填）
 * 
 * Response: QimenPattern | QimenPattern[]
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') as PatternType | null;
    const search = searchParams.get('search');

    // 根據 ID 查詢單一格局
    if (id) {
      const pattern = getPatternById(id);
      if (!pattern) {
        return NextResponse.json(
          { error: '格局不存在', code: 'PATTERN_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: pattern,
        meta: {
          timestamp: new Date().toISOString(),
        },
      });
    }

    let results = [...QIMEN_PATTERNS];

    // 類型篩選
    if (type) {
      results = results.filter(p => p.type === type);
    }

    // 關鍵字搜尋
    if (search) {
      results = searchPatterns(search);
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: {
        count: results.length,
        total: QIMEN_PATTERNS.length,
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
