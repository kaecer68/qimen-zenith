'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QimenBoard } from '@/components/qimen/QimenBoard';
import { QimenAnalysis } from '@/components/qimen/QimenAnalysis';
import { RecordsManager } from '@/components/qimen/RecordsManager';
import { ExportPanel } from '@/components/qimen/ExportPanel';
import { TeachingSystem } from '@/components/qimen/TeachingSystem';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen, QimenPlate } from '@/lib/qimen/core';
import { SHICHEN, calculateHourPillar, getShichenIndex, isEarlyZiHour } from '@/lib/qimen/hourPillar';
import { MatterType, LIUQIN_RELATIONS, getMatterPalace, needsLiuqin, getApplicableLiuqin, MATTER_CONFIG } from '@/lib/qimen/symbolism';
import { Calendar, Clock, Compass, BookOpen, Sparkles } from 'lucide-react';

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

  const currentShichenIndex = getShichenIndex(hour);
  const currentShichen = SHICHEN[currentShichenIndex];

  const handleSetNow = () => {
    const n = new Date();
    setDate(n.toISOString().split('T')[0]);
    setHour(n.getHours());
  };

  const handleCalculate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let queryDate = date;
      if (isEarlyZiHour(hour)) {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }

      const lunarData = await getLunarData(queryDate);
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hour);

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

  const handleCalculateRef = useRef(handleCalculate);
  useEffect(() => {
    handleCalculateRef.current = handleCalculate;
  }, [handleCalculate]);

  useEffect(() => {
    if (plate && isAutoCalc && !loading) {
      handleCalculateRef.current();
    }
  }, [hour, date, isAutoCalc]);

  const handleFirstCalculate = async () => {
    await handleCalculate();
    setIsAutoCalc(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <section className="card-elevated rounded-xl p-6 md:p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center border border-amber-500/20">
            <Compass className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">排盤設定</h2>
            <p className="text-sm text-stone-500">選擇日期、時辰與問事類型</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-amber-500/70" />
              選擇日期
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-qimen h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shichen" className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-amber-500/70" />
              選擇時辰
            </Label>
            <select
              id="shichen"
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="input-qimen h-11 w-full rounded-md px-3 text-sm"
            >
              {SHICHEN.map((sc, idx) => (
                <option key={idx} value={sc.start}>
                  {sc.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-stone-500">
              當前選擇：<span className="font-medium text-amber-500">{currentShichen.name}</span>
              {isEarlyZiHour(hour) && (
                <span className="ml-2 text-amber-600">（早子時，日柱按下一日計算）</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matter" className="flex items-center gap-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 text-amber-500/70" />
              問事類型
            </Label>
            <select
              id="matter"
              value={matterType}
              onChange={(e) => {
                setMatterType(e.target.value as MatterType);
                setLiuqin('');
              }}
              className="input-qimen h-11 w-full rounded-md px-3 text-sm"
            >
              {Object.entries(MATTER_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
            {matterType !== 'general' && (
              <div className="text-xs text-stone-500">
                用神：{getMatterPalace(matterType).description}
              </div>
            )}
          </div>

          {needsLiuqin(matterType) && (
            <div className="space-y-2">
              <Label htmlFor="liuqin" className="text-sm font-medium">對方身份（六親）</Label>
              <select
                id="liuqin"
                value={liuqin}
                onChange={(e) => setLiuqin(e.target.value)}
                className="input-qimen h-11 w-full rounded-md px-3 text-sm"
              >
                <option value="">請選擇對方身份...</option>
                {getApplicableLiuqin(matterType).map((relation) => (
                  <option key={relation.key} value={relation.key}>
                    {relation.palaceName}【{relation.description}】
                  </option>
                ))}
              </select>
              {liuqin && (
                <div className="text-xs text-amber-600/80">
                  {getLiuqinDescription(liuqin)}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleSetNow}
            className="flex-shrink-0 border-stone-700 hover:border-amber-500/50 hover:bg-amber-500/5"
          >
            <Clock className="w-4 h-4 mr-2" />
            當前時刻
          </Button>
          <Button
            onClick={handleFirstCalculate}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-semibold shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? '推演中...' : '開始排盤'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
            {error}
          </div>
        )}
      </section>

      {plate && (
        <div className="space-y-8 animate-slide-up stagger-2">
          <div className="divider-gold" />

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <TeachingSystem />
        </div>
      )}
    </div>
  );
}

function getLiuqinDescription(key: string): string {
  const relation = LIUQIN_RELATIONS.find(r => r.key === key);
  return relation?.description || '';
}
