'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  QimenPlate,
  generateQimenAnalysis,
  PalaceRating,
  PALACES,
  analyzePalaceEnhanced,
  EnhancedPalaceRating,
} from '@/lib/qimen/core';
import { 
  MatterType, 
  LIUQIN_RELATIONS, 
  PALACE_SYMBOLISM, 
  getMatterPalace,
  MATTER_CONFIG 
} from '@/lib/qimen/symbolism';

interface QimenAnalysisProps {
  plate: QimenPlate;
  matterType?: MatterType;
  liuqin?: string;
}

type AnalysisMode = 'basic' | 'advanced';
type AnalysisView = 'palaces' | 'matters' | 'overall' | 'qiyi' | 'combinations';

export function QimenAnalysis({ plate, matterType = 'general', liuqin }: QimenAnalysisProps) {
  const [mode, setMode] = useState<AnalysisMode>('basic');
  const [view, setView] = useState<AnalysisView>('overall');

  const analysis = generateQimenAnalysis(plate);
  const palaceRatings = Object.fromEntries(analysis.palaceRatings);

  // 計算主事宮位
  const getMainPalace = (): number => {
    if (matterType === 'general') return 5;
    const humanPlate = Object.fromEntries(plate.humanPlate);
    const starsPlate = Object.fromEntries(plate.starsPlate);
    const matterPalace = getMatterPalace(matterType, { humanPlate, starsPlate });
    if (matterPalace.palace > 0) return matterPalace.palace;
    if (liuqin) {
      const relation = LIUQIN_RELATIONS.find(r => r.key === liuqin);
      if (relation) return relation.palace;
    }
    return 5;
  };

  const mainPalace = getMainPalace();
  const mainPalaceInfo = PALACE_SYMBOLISM[mainPalace];

  // 吉凶等級樣式
  const getLevelStyles = (level: PalaceRating['level']) => {
    const styles = {
      '大吉': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      '吉': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400',
      '平': 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
      '凶': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      '大凶': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
    };
    return styles[level];
  };

  // 趨勢樣式
  const getTrendStyles = (trend: string) => {
    const styles = {
      '上升': 'text-green-600 dark:text-green-400',
      '平穩': 'text-yellow-600 dark:text-yellow-400',
      '下降': 'text-red-600 dark:text-red-400',
    };
    return styles[trend as keyof typeof styles] || 'text-gray-600';
  };

  // 九宮順序
  const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">吉凶解說</CardTitle>
          
          {/* 模式切換 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">模式：</span>
            <Tabs value={mode} onValueChange={(v: string) => setMode(v as AnalysisMode)} className="w-auto">
              <TabsList className="grid w-[140px] grid-cols-2">
                <TabsTrigger value="basic">基礎</TabsTrigger>
                <TabsTrigger value="advanced">進階</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* 視圖切換 */}
        <div className="mt-4">
          <Tabs value={view} onValueChange={(v: string) => setView(v as AnalysisView)}>
            <TabsList className={cn(
              "grid w-full",
              mode === 'advanced' ? 'grid-cols-5' : 'grid-cols-3'
            )}>
              <TabsTrigger value="overall">全局大勢</TabsTrigger>
              <TabsTrigger value="palaces">九宮解說</TabsTrigger>
              <TabsTrigger value="matters">事項分類</TabsTrigger>
              {mode === 'advanced' && (
                <>
                  <TabsTrigger value="qiyi">三奇六儀</TabsTrigger>
                  <TabsTrigger value="combinations">門星神組合</TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 全局大勢視圖 */}
        {view === 'overall' && (
          <div className="space-y-4">
            {/* 整體趨勢 */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-muted-foreground">整體趨勢：</span>
                <span className={cn("text-lg font-bold", getTrendStyles(analysis.overall.trend))}>
                  {analysis.overall.trend}
                </span>
              </div>
              <p className="text-base leading-relaxed">{analysis.overall.summary}</p>
            </div>

            {/* 策略建議 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">今日策略</h4>
                <p className="text-sm text-muted-foreground">{analysis.overall.strategy}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">最佳方位</h4>
                <p className="text-sm text-muted-foreground">{analysis.overall.bestDirection}</p>
              </div>
            </div>

            {/* 進階：宮位統計 */}
            {mode === 'advanced' && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">九宮吉凶分布</h4>
                <div className="grid grid-cols-3 gap-2">
                  {palaceOrder.map((index) => {
                    const rating = palaceRatings[index];
                    const palace = PALACES.find(p => p.index === index);
                    if (!rating) return null;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-2 rounded border text-center",
                          getLevelStyles(rating.level)
                        )}
                      >
                        <div className="text-xs font-medium">{palace?.name}</div>
                        <div className="text-sm font-bold">{rating.level}</div>
                        <div className="text-xs">{rating.score}分</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 九宮解說視圖 */}
        {view === 'palaces' && (
          <div className="space-y-3">
            {palaceOrder.map((index) => {
              const rating = palaceRatings[index];
              const palace = PALACES.find(p => p.index === index);
              const symbolism = PALACE_SYMBOLISM[index];
              if (!rating || !symbolism) return null;

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border",
                    mode === 'advanced' ? 'space-y-3' : 'flex items-center justify-between',
                    index === mainPalace && 'bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700'
                  )}
                >
                  <div className={cn("flex items-center gap-3", mode === 'advanced' ? 'border-b pb-3' : '')}>
                    <Badge
                      variant="outline"
                      className={cn("font-bold", getLevelStyles(rating.level))}
                    >
                      {rating.level}
                    </Badge>
                    <div>
                      <span className="font-semibold">{palace?.name}</span>
                      {index === mainPalace && (
                        <span className="ml-2 text-amber-600 text-sm font-medium">★ 主事宮位</span>
                      )}
                      {mode === 'basic' && (
                        <span className="text-sm text-muted-foreground ml-2">
                          {palace?.direction} · {palace?.element}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={mode === 'advanced' ? 'pl-2' : ''}>
                    <p className={cn(
                      "text-muted-foreground",
                      mode === 'basic' ? 'text-sm' : 'text-base leading-relaxed'
                    )}>
                      {rating.summary}
                    </p>
                    
                    {mode === 'advanced' && (
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="font-medium text-muted-foreground">方位：</span>
                            {symbolism.direction}（{symbolism.trigram}）
                          </div>
                          <div className="bg-muted/50 p-2 rounded">
                            <span className="font-medium text-muted-foreground">五行：</span>
                            {symbolism.element}
                          </div>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium text-muted-foreground">人事：</span>
                          {symbolism.person}
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium text-muted-foreground">身體：</span>
                          {symbolism.bodyPart}
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium text-muted-foreground">宜：</span>
                          {symbolism.suitable.join('、')}
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <span className="font-medium text-muted-foreground">忌：</span>
                          {symbolism.unsuitable.join('、')}
                        </div>
                        <div className="text-right text-muted-foreground text-xs">
                          評分：{rating.score}/100 · {symbolism.time}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 事項分類視圖 */}
        {view === 'matters' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { key: 'wealth', label: '財運', icon: '💰' },
              { key: 'career', label: '官運/事業', icon: '💼' },
              { key: 'travel', label: '出行', icon: '🚗' },
              { key: 'health', label: '健康', icon: '🏥' },
              { key: 'relationship', label: '人際', icon: '🤝' },
              { key: 'study', label: '學業', icon: '📚' },
            ].map(({ key, label, icon }) => {
              const matter = analysis.matters[key as keyof typeof analysis.matters];
              const palace = PALACES.find(p => p.index === matter.palace);
              
              return (
                <div
                  key={key}
                  className={cn(
                    "p-4 rounded-lg border",
                    getLevelStyles(matter.level)
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{icon}</span>
                    <Badge
                      variant="outline"
                      className={cn("font-bold", getLevelStyles(matter.level))}
                    >
                      {matter.level}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-lg mb-1">{label}</h4>
                  
                  <p className={cn(
                    "mb-2",
                    mode === 'basic' ? 'text-sm' : 'text-base'
                  )}>
                    {matter.advice}
                  </p>
                  
                  {mode === 'advanced' && (
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <p className="text-sm opacity-80">
                        <span className="font-medium">用神宮位：</span>
                        {matter.summary}
                      </p>
                      <p className="text-sm opacity-80 mt-1">
                        <span className="font-medium">有利方位：</span>
                        {matter.direction}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 三奇六儀視圖 */}
        {view === 'qiyi' && mode === 'advanced' && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">三奇六儀分析</h4>
              <p className="text-sm text-muted-foreground">
                天盤三奇六儀與地盤的組合關係，揭示各宮位的深層資訊
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {palaceOrder.map((index) => {
                const enhanced = analyzePalaceEnhanced(index, plate);
                const palace = PALACES.find(p => p.index === index);
                const heavenPlate = Object.fromEntries(plate.heavenPlate);
                const earthPlate = Object.fromEntries(plate.earthPlate);
                const stem = heavenPlate[index];
                const earthStem = earthPlate[index];
                
                if (!stem || !enhanced.qiyiAnalysis) return null;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      enhanced.qiyiAnalysis.isOddity 
                        ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' 
                        : 'bg-card border-border'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{palace?.name}</span>
                      {enhanced.qiyiAnalysis.isOddity && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          三奇
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">{stem}</span>
                      <span className="text-muted-foreground">+</span>
                      <span className="text-lg text-muted-foreground">地{earthStem}</span>
                      {enhanced.qiyiAnalysis.combination && (
                        <Badge variant="secondary" className="ml-2">
                          {enhanced.qiyiAnalysis.combination}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {enhanced.qiyiAnalysis.interpretation}
                    </p>
                    
                    <p className="text-sm">
                      <span className="font-medium">建議：</span>
                      {enhanced.qiyiAnalysis.advice}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 門星神組合視圖 */}
        {view === 'combinations' && mode === 'advanced' && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">門星神組合分析</h4>
              <p className="text-sm text-muted-foreground">
                八門、九星、八神的交互作用，揭示各宮位的綜合資訊
              </p>
            </div>
            
            <div className="space-y-3">
              {palaceOrder.map((index) => {
                const enhanced = analyzePalaceEnhanced(index, plate);
                const palace = PALACES.find(p => p.index === index);
                const humanPlate = Object.fromEntries(plate.humanPlate);
                const starsPlate = Object.fromEntries(plate.starsPlate);
                const spiritPlate = Object.fromEntries(plate.spiritPlate);
                
                const door = humanPlate[index];
                const star = starsPlate[index];
                const spirit = spiritPlate[index];
                
                if (!enhanced.combinationAnalysis) return null;
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-lg border",
                      getLevelStyles(enhanced.combinationAnalysis.level)
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{palace?.name}</span>
                        <Badge
                          variant="outline"
                          className={cn("font-bold text-xs", getLevelStyles(enhanced.combinationAnalysis.level))}
                        >
                          {enhanced.combinationAnalysis.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {door && <span className="px-2 py-1 bg-primary/10 rounded">{door}</span>}
                        {star && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">{star}</span>}
                        {spirit && <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded">{spirit}</span>}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-2">
                      {enhanced.combinationAnalysis.interpretation}
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-current/20 text-sm space-y-1">
                      <p><span className="font-medium">八門：</span>{enhanced.combinationAnalysis.doorInterp}</p>
                      <p><span className="font-medium">九星：</span>{enhanced.combinationAnalysis.starInterp}</p>
                      <p><span className="font-medium">八神：</span>{enhanced.combinationAnalysis.spiritInterp}</p>
                    </div>
                    
                    <p className="mt-3 text-sm font-medium">
                      建議：{enhanced.combinationAnalysis.advice}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
