/**
 * GET /api/qimen/analysis?date=YYYY-MM-DD&mode=basic|enhanced
 * 
 * 奇門遁甲分析 API
 * 根據指定日期計算排盤並返回吉凶分析結果
 * 
 * Query Parameters:
 *   - date: 日期，格式 YYYY-MM-DD（選填，預設今天）
 *   - mode: 分析模式，basic（基礎）或 enhanced（增強），預設 basic
 * 
 * Response: QimenAnalysisJSON | EnhancedAnalysisJSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLunarData } from '@/lib/lunar-api';
import {
  calculateDailyQimen,
  generateQimenAnalysis,
  analyzePalaceEnhanced,
} from '@/lib/qimen/core';
import { serializePlate, serializeAnalysis } from '@/lib/qimen/serialize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const mode = searchParams.get('mode') || 'basic';

    // 參數驗證
    if (mode !== 'basic' && mode !== 'enhanced') {
      return NextResponse.json(
        { error: 'mode 參數無效，請使用 basic 或 enhanced', code: 'INVALID_MODE' },
        { status: 400 }
      );
    }

    const dateStr = dateParam || new Date().toISOString().split('T')[0];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return NextResponse.json(
        { error: '日期格式錯誤，請使用 YYYY-MM-DD 格式', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: '無效的日期', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }

    // 從 lunar-zenith 獲取曆法數據
    const lunarData = await getLunarData(dateStr);

    // 計算奇門盤
    const plate = calculateDailyQimen(
      date,
      lunarData.pillars.year,
      lunarData.pillars.month,
      lunarData.pillars.day,
      lunarData.pillars.hour,
      lunarData.solar_term.name,
      lunarData.solar_term.index
    );

    // 基礎排盤數據
    const plateJSON = serializePlate(plate);

    if (mode === 'basic') {
      // 基礎分析
      const analysis = generateQimenAnalysis(plate);
      const analysisJSON = serializeAnalysis(analysis);

      return NextResponse.json({
        success: true,
        data: {
          plate: plateJSON,
          analysis: analysisJSON,
        },
        meta: {
          mode: 'basic',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } else {
      // 增強分析（含三奇六儀 + 門星神組合）
      const analysis = generateQimenAnalysis(plate);
      const analysisJSON = serializeAnalysis(analysis);

      const enhancedPalaces: Record<string, ReturnType<typeof analyzePalaceEnhanced>> = {};
      for (let i = 1; i <= 9; i++) {
        enhancedPalaces[String(i)] = analyzePalaceEnhanced(i, plate);
      }

      return NextResponse.json({
        success: true,
        data: {
          plate: plateJSON,
          analysis: analysisJSON,
          enhanced: {
            palaces: enhancedPalaces,
          },
        },
        meta: {
          mode: 'enhanced',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    }
  } catch (error) {
    console.error('[API] /api/qimen/analysis error:', error);

    const message = error instanceof Error ? error.message : '分析計算失敗';
    const isLunarError = message.includes('lunar') || message.includes('fetch');

    return NextResponse.json(
      {
        error: isLunarError
          ? '無法連接曆法服務 (lunar-zenith)，請確認服務已啟動'
          : message,
        code: isLunarError ? 'LUNAR_SERVICE_UNAVAILABLE' : 'ANALYSIS_ERROR',
      },
      { status: isLunarError ? 503 : 500 }
    );
  }
}
