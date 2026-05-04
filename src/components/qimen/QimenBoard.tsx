'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QimenPlate, PALACES, DOORS, STARS } from '@/lib/qimen/core';
import { MatterType, LIUQIN_RELATIONS, PALACE_SYMBOLISM, getMatterPalace, MATTER_CONFIG } from '@/lib/qimen/symbolism';
import { Compass, Star, DoorOpen, Flame, Mountain } from 'lucide-react';

interface QimenBoardProps {
  plate: QimenPlate;
  matterType?: MatterType;
  liuqin?: string;
}

export function QimenBoard({ plate, matterType = 'general', liuqin }: QimenBoardProps) {
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const earthPlate = Object.fromEntries(plate.earthPlate);

  const getMainPalace = (): number => {
    if (matterType === 'general') return 5;

    const matterPalace = getMatterPalace(matterType, { humanPlate, starsPlate });
    if (matterPalace.palace > 0) return matterPalace.palace;

    if (liuqin) {
      const relation = LIUQIN_RELATIONS.find(r => r.key === liuqin);
      if (relation) return relation.palace;
    }

    return 5;
  };

  const mainPalace = getMainPalace();
  const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const getDoorColor = (door: string) => {
    if (['開門', '休門', '生門'].includes(door)) return 'text-emerald-400';
    if (['死門', '驚門', '傷門'].includes(door)) return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <Card className="card-elevated border-0">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-xl font-display text-gradient-gold">
            奇門遁甲盤
          </CardTitle>
        </div>
        <div className="text-sm text-stone-400 space-y-1">
          <div>
            {plate.date} · {plate.yearGanZhi}年 {plate.monthGanZhi}月 {plate.dayGanZhi}日 {plate.hourGanZhi}時
            {plate.shichen && (
              <span className="ml-1 text-amber-500 font-medium">（{plate.shichen}）</span>
            )}
          </div>
          {matterType !== 'general' && (
            <div className="text-amber-500/80 text-xs">
              問：{MATTER_CONFIG[matterType].name}
              {liuqin && ` · ${LIUQIN_RELATIONS.find(r => r.key === liuqin)?.name}`}
              {mainPalace !== 5 && ` · 主事：${PALACE_SYMBOLISM[mainPalace]?.name}`}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-2xl mx-auto">
          {palaceOrder.map((palaceIndex) => {
            const palace = PALACES.find(p => p.index === palaceIndex);
            if (!palace) return null;

            const isCenter = palaceIndex === 5;
            const isMainPalace = palaceIndex === mainPalace;

            return (
              <div
                key={palaceIndex}
                className={cn(
                  "relative aspect-square rounded-xl p-2 md:p-4 flex flex-col items-center justify-between text-center",
                  "border transition-all duration-300 hover:scale-[1.02]",
                  isCenter && "bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30 glow-gold",
                  !isCenter && "bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50",
                  isMainPalace && !isCenter && "border-amber-500/40 bg-amber-500/5"
                )}
              >
                {isMainPalace && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-slate-900 font-bold shadow-lg">
                    主
                  </div>
                )}

                <div className="w-full flex justify-between items-start">
                  <span className="text-[10px] md:text-xs text-stone-500 font-medium">
                    {palace.name}
                  </span>
                  <span className="text-[10px] text-stone-600">
                    {palace.trigram}
                  </span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center gap-1">
                  {starsPlate[palaceIndex] && (
                    <div className="text-xs md:text-sm text-blue-400 font-medium">
                      {starsPlate[palaceIndex]}
                    </div>
                  )}

                  {spiritPlate[palaceIndex] && (
                    <div className="text-[10px] md:text-xs text-purple-400">
                      {spiritPlate[palaceIndex]}
                    </div>
                  )}

                  <div className="text-2xl md:text-4xl font-bold text-gradient-gold my-1">
                    {heavenPlate[palaceIndex] || ''}
                  </div>

                  {earthPlate[palaceIndex] && (
                    <div className="text-xs text-stone-500">
                      地{earthPlate[palaceIndex]}
                    </div>
                  )}

                  {humanPlate[palaceIndex] && (
                    <div className={cn("text-sm md:text-base font-semibold", getDoorColor(humanPlate[palaceIndex]))}>
                      {humanPlate[palaceIndex]}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-stone-600">
                  {palace.element}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm text-stone-500">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-blue-400" />
            <span>九星</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>八神</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>天盤</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>八門</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
