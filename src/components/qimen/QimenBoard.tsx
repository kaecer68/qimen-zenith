'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { QimenPlate, PALACES, DOORS, STARS } from '@/lib/qimen/core';

interface QimenBoardProps {
  plate: QimenPlate;
}

export function QimenBoard({ plate }: QimenBoardProps) {
  // 將 Map 轉換為易用的對象
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const earthPlate = Object.fromEntries(plate.earthPlate);

  // 九宮格順序（按洛書數順序排列，用於正確顯示九宮格）
  const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">
          奇門遁甲盤
        </CardTitle>
        <div className="text-base text-muted-foreground">
          {plate.date} · {plate.yearGanZhi}年 {plate.monthGanZhi}月 {plate.dayGanZhi}日 {plate.hourGanZhi}時
          {plate.shichen && (
            <span className="ml-1 text-primary font-medium">（{plate.shichen}）</span>
          )}
        </div>
        <div className="text-lg font-medium text-primary">
          {plate.solarTerm} · {plate.yinYang} · {plate.juNumber}局
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {/* 九宮格布局 */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {palaceOrder.map((palaceIndex) => {
            const palace = PALACES.find(p => p.index === palaceIndex);
            if (!palace) return null;

            const isCenter = palaceIndex === 5;
            
            return (
              <div
                key={palaceIndex}
                className={cn(
                  "aspect-square border-2 rounded-lg p-3 flex flex-col items-center justify-center text-center min-h-[180px] md:min-h-[220px]",
                  isCenter && "bg-primary/10 border-primary",
                  !isCenter && "border-border bg-card"
                )}
              >
                {/* 宮位名稱和數字 */}
                <div className="text-base font-bold text-muted-foreground mb-1">
                  {palace.name}
                </div>

                {/* 九星 */}
                {starsPlate[palaceIndex] && (
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {starsPlate[palaceIndex]}
                  </div>
                )}

                {/* 八神 */}
                {spiritPlate[palaceIndex] && (
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {spiritPlate[palaceIndex]}
                  </div>
                )}

                {/* 天盤（三奇六儀）*/}
                <div className="text-3xl font-bold my-2">
                  {heavenPlate[palaceIndex] || ''}
                </div>

                {/* 地盤（固定）*/}
                {earthPlate[palaceIndex] && (
                  <div className="text-base text-muted-foreground">
                    地{earthPlate[palaceIndex]}
                  </div>
                )}

                {/* 八門 */}
                {humanPlate[palaceIndex] && (
                  <div className={cn(
                    "text-lg font-semibold mt-1",
                    humanPlate[palaceIndex] === '開門' || humanPlate[palaceIndex] === '休門' || humanPlate[palaceIndex] === '生門'
                      ? "text-green-600 dark:text-green-400"
                      : humanPlate[palaceIndex] === '死門' || humanPlate[palaceIndex] === '驚門' || humanPlate[palaceIndex] === '傷門'
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                  )}>
                    {humanPlate[palaceIndex]}
                  </div>
                )}

                {/* 八卦 */}
                <div className="text-sm text-muted-foreground mt-1">
                  {palace.trigram} · {palace.element}
                </div>
              </div>
            );
          })}
        </div>

        {/* 圖例 */}
        <div className="mt-6 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-foreground">天</span>
            <span>天盤（三奇六儀）</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">星</span>
            <span>九星</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600 dark:text-green-400 font-medium">門</span>
            <span>八門</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-600 dark:text-purple-400">神</span>
            <span>八神</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
