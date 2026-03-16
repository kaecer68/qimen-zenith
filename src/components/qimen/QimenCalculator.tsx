'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QimenBoard } from '@/components/qimen/QimenBoard';
import { QimenAnalysis } from '@/components/qimen/QimenAnalysis';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen, QimenPlate } from '@/lib/qimen/core';
import { SHICHEN, calculateHourPillar, getShichenIndex, isEarlyZiHour } from '@/lib/qimen/hourPillar';

export function QimenCalculator() {
  const now = new Date();
  const [date, setDate] = useState(now.toISOString().split('T')[0]);
  const [hour, setHour] = useState(now.getHours());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plate, setPlate] = useState<QimenPlate | null>(null);

  // 自動更新當前時辰顯示
  const currentShichenIndex = getShichenIndex(hour);
  const currentShichen = SHICHEN[currentShichenIndex];

  // 設為當前時間
  const handleSetNow = () => {
    const n = new Date();
    setDate(n.toISOString().split('T')[0]);
    setHour(n.getHours());
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 處理早子時（23:00-23:59 屬於下一天的子時）
      let queryDate = date;
      if (isEarlyZiHour(hour)) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }

      // 獲取曆法數據
      const lunarData = await getLunarData(queryDate);
      
      // 本地計算時柱（五鼠遁元法）
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hour);
      
      // 計算奇門盤（帶入時柱）
      const calculatedPlate = calculateDailyQimen(
        new Date(queryDate),
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hour
      );
      
      setPlate(calculatedPlate);
    } catch (err) {
      setError(err instanceof Error ? err.message : '計算失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>奇門遁甲排盤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 日期選擇 */}
          <div className="grid gap-2">
            <Label htmlFor="date">選擇日期</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* 時辰選擇 */}
          <div className="grid gap-2">
            <Label htmlFor="shichen">選擇時辰</Label>
            <select
              id="shichen"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SHICHEN.map((sc, idx) => {
                // 每個時辰取起始小時作為 value
                const hourValue = sc.start;
                return (
                  <option key={idx} value={hourValue}>
                    {sc.label}
                  </option>
                );
              })}
            </select>
            <div className="text-xs text-muted-foreground">
              當前選擇：<span className="font-medium text-foreground">{currentShichen.name}</span>
              {isEarlyZiHour(hour) && (
                <span className="ml-2 text-amber-500">（早子時，日柱按下一日計算）</span>
              )}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSetNow}
              className="flex-shrink-0"
            >
              當前時刻
            </Button>
            <Button 
              onClick={handleCalculate}
              disabled={loading}
              className="flex-1"
            >
              {loading ? '計算中...' : '排盤'}
            </Button>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              錯誤：{error}
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            請先確認 lunar-zenith 服務已啟動於 http://localhost:8080
          </div>
        </CardContent>
      </Card>

      {plate && (
        <>
          <QimenBoard plate={plate} />
          <QimenAnalysis plate={plate} />
        </>
      )}
    </div>
  );
}
