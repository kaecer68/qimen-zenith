/**
 * GET /api/qimen/plate?date=YYYY-MM-DD
 * 
 * 奇門遁甲排盤 API
 * 根據指定日期計算完整的日家奇門盤
 * 
 * Query Parameters:
 *   - date: 日期，格式 YYYY-MM-DD（選填，預設今天）
 * 
 * Response: QimenPlateJSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen } from '@/lib/qimen/core';
import { serializePlate } from '@/lib/qimen/serialize';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    // 日期驗證
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

    // 序列化並回傳
    const result = serializePlate(plate);

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
    });
  } catch (error) {
    console.error('[API] /api/qimen/plate error:', error);

    const message = error instanceof Error ? error.message : '排盤計算失敗';
    const isLunarError = message.includes('lunar') || message.includes('fetch');

    return NextResponse.json(
      {
        error: isLunarError
          ? '無法連接曆法服務 (lunar-zenith)，請確認服務已啟動'
          : message,
        code: isLunarError ? 'LUNAR_SERVICE_UNAVAILABLE' : 'CALCULATION_ERROR',
      },
      { status: isLunarError ? 503 : 500 }
    );
  }
}
