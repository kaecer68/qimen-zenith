'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QimenBoard } from '@/components/qimen/QimenBoard';
import { QimenAnalysis } from '@/components/qimen/QimenAnalysis';
import { RecordsManager } from '@/components/qimen/RecordsManager';
import { ExportPanel } from '@/components/qimen/ExportPanel';
import { TeachingSystem } from '@/components/qimen/TeachingSystem';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen, QimenPlate } from '@/lib/qimen/core';
import { SHICHEN, calculateHourPillar, getShichenIndex, isEarlyZiHour } from '@/lib/qimen/hourPillar';
import { PALACE_SYMBOLISM, LIUQIN_RELATIONS, MatterType, getMatterPalace, getLiuqinDescription, needsLiuqin, getApplicableLiuqin, MATTER_CONFIG } from '@/lib/qimen/symbolism';

export function QimenCalculator() {
  const now = new Date();
  const [date, setDate] = useState(now.toISOString().split('T')[0]);
  const [hour, setHour] = useState(now.getHours());
  const [matterType, setMatterType] = useState<MatterType>('general');
  const [liuqin, setLiuqin] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plate, setPlate] = useState<QimenPlate | null>(null);
  const [isAutoCalc, setIsAutoCalc] = useState(false);

  // 自動更新當前時辰顯示
  const currentShichenIndex = getShichenIndex(hour);
  const currentShichen = SHICHEN[currentShichenIndex];

  // 設為當前時間
  const handleSetNow = () => {
    const n = new Date();
    setDate(n.toISOString().split('T')[0]);
    setHour(n.getHours());
  };

  const handleCalculate = useCallback(async () => {
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
  }, [date, hour]);

  // 使用 ref 追蹤最新的 handleCalculate 函數
  const handleCalculateRef = useRef(handleCalculate);
  useEffect(() => {
    handleCalculateRef.current = handleCalculate;
  }, [handleCalculate]);

  // 當時間參數改變且已有排盤結果時，自動重新計算
  useEffect(() => {
    if (plate && isAutoCalc && !loading) {
      handleCalculateRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, date, isAutoCalc]);

  // 首次排盤後啟用自動計算
  const handleFirstCalculate = async () => {
    await handleCalculate();
    setIsAutoCalc(true);
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

          {/* 問事類型選擇 */}
          <div className="grid gap-2">
            <Label htmlFor="matter">問事類型</Label>
            <select
              id="matter"
              value={matterType}
              onChange={(e) => {
                setMatterType(e.target.value as MatterType);
                setLiuqin(''); // 重置六親選擇
              }}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Object.entries(MATTER_CONFIG).map(([key, config]: [string, typeof MATTER_CONFIG[MatterType]]) => (
                <option key={key} value={key}>
                  {config.name} - {config.description}
                </option>
              ))}
            </select>
            {matterType !== 'general' && (
              <div className="text-xs text-muted-foreground">
                用神：{getMatterPalace(matterType).description}
              </div>
            )}
          </div>

          {/* 六親關係選擇（僅當問事類型需要時顯示） */}
          {needsLiuqin(matterType) && (
            <div className="grid gap-2">
              <Label htmlFor="liuqin">對方身份（六親）</Label>
              <select
                id="liuqin"
                value={liuqin}
                onChange={(e) => setLiuqin(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">請選擇對方身份...</option>
                {getApplicableLiuqin(matterType).map((relation: typeof LIUQIN_RELATIONS[number]) => (
                  <option key={relation.key} value={relation.key}>
                    {relation.palaceName}【{relation.description}】
                  </option>
                ))}
              </select>
              {liuqin && (
                <div className="text-xs text-amber-600">
                  {getLiuqinDescription(liuqin)}
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSetNow}
              className="flex-shrink-0"
            >
              當前時刻
            </Button>
            <Button 
              onClick={handleFirstCalculate}
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
          <QimenBoard 
            plate={plate} 
            matterType={matterType}
            liuqin={liuqin}
          />
          <QimenAnalysis 
            plate={plate} 
            matterType={matterType}
            liuqin={liuqin}
          />
          <RecordsManager
            currentPlate={plate}
            currentMatterType={matterType}
            currentLiuqin={liuqin}
          />
          <ExportPanel
            plate={plate}
            matterType={matterType}
            liuqin={liuqin}
          />
          <TeachingSystem />
        </>
      )}
    </div>
  );
}
