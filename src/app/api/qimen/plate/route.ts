/**
 * GET /api/qimen/plate?date=YYYY-MM-DD&hour=0-23
 * 
 * 奇門遁甲排盤 API
 * 根據指定日期與時辰計算完整的奇門盤
 * 
 * Query Parameters:
 *   - date: 日期，格式 YYYY-MM-DD（選填，預設今天）
 *   - hour: 小時數 0-23（選填，預設當前小時）→ 本地計算時柱
 * 
 * Response: QimenPlateJSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen } from '@/lib/qimen/core';
import { serializePlate } from '@/lib/qimen/serialize';
import { calculateHourPillar, isEarlyZiHour } from '@/lib/qimen/hourPillar';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const hourParam = searchParams.get('hour');

    // 時辰參數驗證
    const now = new Date();
    let hour: number | undefined;
    if (hourParam !== null) {
      hour = parseInt(hourParam, 10);
      if (isNaN(hour) || hour < 0 || hour > 23) {
        return NextResponse.json(
          { error: 'hour 參數無效，請使用 0-23', code: 'INVALID_HOUR' },
          { status: 400 }
        );
      }
    } else {
      hour = now.getHours();
    }

    // 日期驗證
    const dateStr = dateParam || now.toISOString().split('T')[0];
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

    // 處理早子時（23:00-23:59 屬於下一天的子時）
    let queryDate = dateStr;
    if (hour !== undefined && isEarlyZiHour(hour)) {
      const nextDay = new Date(dateStr);
      nextDay.setDate(nextDay.getDate() + 1);
      queryDate = nextDay.toISOString().split('T')[0];
    }

    // 從 lunar-zenith 獲取曆法數據
    const lunarData = await getLunarData(queryDate);

    // 本地計算時柱（五鼠遁元法）
    const dayStem = lunarData.pillars.day.charAt(0);
    const hourGanZhi = hour !== undefined
      ? calculateHourPillar(dayStem, hour)
      : lunarData.pillars.hour;

    // 計算奇門盤
    const plate = calculateDailyQimen(
      date,
      lunarData.pillars.year,
      lunarData.pillars.month,
      lunarData.pillars.day,
      hourGanZhi,
      lunarData.solar_term.name,
      lunarData.solar_term.index,
      hour
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
