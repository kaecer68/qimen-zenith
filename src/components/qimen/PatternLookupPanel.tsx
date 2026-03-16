'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  QIMEN_PATTERNS, 
  getPatternById, 
  getPatternsByType,
  searchPatterns,
  getPatternTypeName,
  getPatternTypeColor,
  PatternType,
  QimenPattern 
} from '@/lib/qimen/patterns';
import { Search, BookOpen, ChevronLeft, Sparkles, AlertTriangle, Star, X, Filter } from 'lucide-react';

const PATTERN_TYPES: PatternType[] = ['auspicious', 'combination', 'special', 'inauspicious'];

export function PatternLookupPanel() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PatternType | null>(null);

  const selectedPattern = selectedPatternId ? getPatternById(selectedPatternId) : null;

  // 篩選格局
  const filteredPatterns = searchQuery
    ? searchPatterns(searchQuery)
    : selectedType
    ? getPatternsByType(selectedType)
    : QIMEN_PATTERNS;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType(null);
  };

  const getTypeIcon = (type: PatternType) => {
    switch (type) {
      case 'auspicious':
        return <Sparkles className="w-4 h-4" />;
      case 'inauspicious':
        return <AlertTriangle className="w-4 h-4" />;
      case 'special':
        return <Star className="w-4 h-4" />;
      case 'combination':
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (selectedPattern) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <Button 
            variant="ghost" 
            className="w-fit -ml-4 mb-2"
            onClick={() => setSelectedPatternId(null)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回格局列表
          </Button>
          
          <div className="flex items-center gap-2 mb-2">
            {getTypeIcon(selectedPattern.type)}
            <span className="text-sm text-muted-foreground">
              {getPatternTypeName(selectedPattern.type)}
            </span>
          </div>
          
          <CardTitle className="text-lg">{selectedPattern.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{selectedPattern.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 格局類型標籤 */}
          <Badge className={cn(getPatternTypeColor(selectedPattern.type))}>
            {getPatternTypeName(selectedPattern.type)}
          </Badge>

          {/* 形成條件 */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              形成條件
            </h4>
            <ul className="space-y-1.5">
              {selectedPattern.conditions.map((condition, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">{idx + 1}.</span>
                  {condition}
                </li>
              ))}
            </ul>
          </div>

          {/* 解讀 */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">格局解讀</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedPattern.interpretation}
            </p>
          </div>

          {/* 適用範圍 */}
          <div className="space-y-2">
            <h4 className="font-medium">適用事項</h4>
            <div className="flex flex-wrap gap-1">
              {selectedPattern.applicableMatters.map((matter, idx) => (
                <Badge key={idx} variant="secondary">
                  {matter}
                </Badge>
              ))}
            </div>
          </div>

          {/* 化解方法 */}
          {selectedPattern.remedies && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">化解建議</h4>
              <p className="text-sm text-amber-800">{selectedPattern.remedies}</p>
            </div>
          )}

          {/* 實例 */}
          {selectedPattern.examples && selectedPattern.examples.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">實例參考</h4>
              <ul className="space-y-1">
                {selectedPattern.examples.map((example, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">格局查詢手冊</span>
        </div>
        <CardTitle className="text-lg">奇門格局</CardTitle>
        <p className="text-sm text-muted-foreground">
          快速查詢常用吉凶格局，掌握解盤關鍵
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 搜尋 */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜尋格局名稱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* 類型篩選 */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2">
            {PATTERN_TYPES.map((type) => (
              <Badge
                key={type}
                variant={selectedType === type ? 'default' : 'outline'}
                className={cn(
                  "cursor-pointer flex items-center gap-1",
                  selectedType === type && getPatternTypeColor(type)
                )}
                onClick={() => setSelectedType(selectedType === type ? null : type)}
              >
                {getTypeIcon(type)}
                {getPatternTypeName(type)}
              </Badge>
            ))}
          </div>
        )}

        {(searchQuery || selectedType) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
            <X className="w-3 h-3 mr-1" />
            清除篩選
          </Button>
        )}

        {/* 格局列表 */}
        <div className="space-y-2">
          {filteredPatterns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              沒有符合條件的格局
            </div>
          ) : (
            filteredPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedPatternId(pattern.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{pattern.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getPatternTypeColor(pattern.type))}
                      >
                        {getPatternTypeName(pattern.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="ml-2 text-muted-foreground">
                    {getTypeIcon(pattern.type)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 統計 */}
        <div className="text-xs text-muted-foreground text-center">
          共 {QIMEN_PATTERNS.length} 種格局 · 
          大吉 {getPatternsByType('auspicious').length} 種 · 
          凶格 {getPatternsByType('inauspicious').length} 種
        </div>

        {/* 說明 */}
        <div className="p-3 bg-muted/50 rounded-lg text-xs text-muted-foreground space-y-1">
          <p><strong>大吉格局：</strong>三奇得使、九遁吉格等，主百事順遂</p>
          <p><strong>組合格局：</strong>龍返首、鳥跌穴等，特定天干組合</p>
          <p><strong>特殊格局：</strong>天乙伏宮等，特殊神煞組合</p>
          <p><strong>凶格：</strong>五不遇時、六儀擊刑等，需謹慎化解</p>
        </div>
      </CardContent>
    </Card>
  );
}
