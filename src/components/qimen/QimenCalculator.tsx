'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QimenBoard } from '@/components/qimen/QimenBoard';
import { QimenAnalysis } from '@/components/qimen/QimenAnalysis';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen, QimenPlate } from '@/lib/qimen/core';

export function QimenCalculator() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plate, setPlate] = useState<QimenPlate | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 獲取曆法數據
      const lunarData = await getLunarData(date);
      
      // 計算日家奇門盤
      const calculatedPlate = calculateDailyQimen(
        new Date(date),
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        lunarData.pillars.hour,
        lunarData.solar_term.name,
        lunarData.solar_term.index
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
          <CardTitle>日家奇門排盤</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="date">選擇日期</Label>
            <div className="flex gap-2">
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? '計算中...' : '排盤'}
              </Button>
            </div>
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
