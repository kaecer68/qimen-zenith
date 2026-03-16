'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  CASE_STUDIES, 
  getCaseStudyById, 
  getAllCaseTags,
  getCaseStudiesByTag,
  getCaseStudiesByMatterType,
  CaseStudy 
} from '@/lib/qimen/caseStudies';
import { MATTER_CONFIG, MatterType } from '@/lib/qimen/symbolism';
import { BookOpen, Search, Filter, ChevronLeft, Lightbulb, Tag, Calendar, MapPin, X } from 'lucide-react';

export function CaseStudyPanel() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedMatterType, setSelectedMatterType] = useState<MatterType | null>(null);

  const selectedCase = selectedCaseId ? getCaseStudyById(selectedCaseId) : null;
  const allTags = getAllCaseTags();

  // 篩選案例
  const filteredCases = CASE_STUDIES.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.title.includes(searchQuery) || 
      c.description.includes(searchQuery) ||
      c.question.includes(searchQuery);
    
    const matchesTag = !selectedTag || c.tags.includes(selectedTag);
    const matchesMatterType = !selectedMatterType || c.matterType === selectedMatterType;
    
    return matchesSearch && matchesTag && matchesMatterType;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedMatterType(null);
  };

  const renderMiniPalace = (plateSnapshot: CaseStudy['plateSnapshot']) => {
    const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
    
    return (
      <div className="grid grid-cols-3 gap-1 text-xs">
        {palaceOrder.map((palace, idx) => (
          <div 
            key={palace} 
            className={cn(
              "p-2 border rounded text-center min-h-[60px] flex flex-col justify-center",
              idx === 4 ? "bg-muted/50" : "bg-muted/30"
            )}
          >
            {idx === 4 ? (
              <span className="text-muted-foreground">中五宮</span>
            ) : (
              <div className="space-y-0.5">
                <div className="font-medium">{plateSnapshot.heavenPlate[palace]}</div>
                <div className="text-[10px] text-muted-foreground">
                  {plateSnapshot.humanPlate[palace]}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (selectedCase) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <Button 
            variant="ghost" 
            className="w-fit -ml-4 mb-2"
            onClick={() => setSelectedCaseId(null)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回案例列表
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">案例分析</span>
          </div>
          <CardTitle className="text-lg">{selectedCase.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{selectedCase.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 基本信息 */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              {selectedCase.date} {selectedCase.hour}
            </Badge>
            <Badge variant="outline">
              {selectedCase.solarTerm} · {selectedCase.yinYang}{selectedCase.juNumber}局
            </Badge>
            <Badge variant="secondary">
              {MATTER_CONFIG[selectedCase.matterType].name}
            </Badge>
            {selectedCase.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          {/* 問題背景 */}
          <div className="space-y-2">
            <h4 className="font-medium">問事</h4>
            <p className="text-sm text-muted-foreground">{selectedCase.question}</p>
            <h4 className="font-medium mt-3">背景</h4>
            <p className="text-sm text-muted-foreground">{selectedCase.background}</p>
          </div>

          {/* 簡化盤面 */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">排盤示意</h4>
            {renderMiniPalace(selectedCase.plateSnapshot)}
          </div>

          {/* 分析內容 */}
          <div className="space-y-3">
            <h4 className="font-medium">分析過程</h4>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">宮位分析</div>
              <p className="text-sm text-muted-foreground">{selectedCase.analysis.palaceAnalysis}</p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">五行分析</div>
              <p className="text-sm text-muted-foreground">{selectedCase.analysis.elementAnalysis}</p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">時空分析</div>
              <p className="text-sm text-muted-foreground">{selectedCase.analysis.timingAnalysis}</p>
            </div>
          </div>

          {/* 結論 */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">結論</h4>
            <p className="text-sm text-amber-800">{selectedCase.conclusion}</p>
          </div>

          {/* 學習要點 */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              學習要點
            </h4>
            <ul className="space-y-1.5">
              {selectedCase.lessons.map((lesson, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">{idx + 1}.</span>
                  {lesson}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">案例分析庫</span>
        </div>
        <CardTitle className="text-lg">經典案例</CardTitle>
        <p className="text-sm text-muted-foreground">
          學習經典奇門遁甲案例，掌握解盤思路
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 搜尋與篩選 */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋案例..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* 標籤篩選 */}
          <div className="flex flex-wrap gap-1">
            <span className="text-sm text-muted-foreground mr-1">標籤：</span>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* 問事類型篩選 */}
          <div className="flex flex-wrap gap-1">
            <span className="text-sm text-muted-foreground mr-1">類型：</span>
            {Object.entries(MATTER_CONFIG).map(([key, config]) => (
              <Badge
                key={key}
                variant={selectedMatterType === key ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => setSelectedMatterType(selectedMatterType === key ? null : key as MatterType)}
              >
                {config.name}
              </Badge>
            ))}
          </div>

          {(searchQuery || selectedTag || selectedMatterType) && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6">
              <X className="w-3 h-3 mr-1" />
              清除篩選
            </Button>
          )}
        </div>

        {/* 案例列表 */}
        <div className="space-y-2">
          {filteredCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              沒有符合條件的案例
            </div>
          ) : (
            filteredCases.map((caseStudy) => (
              <div
                key={caseStudy.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedCaseId(caseStudy.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{caseStudy.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {caseStudy.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{caseStudy.date}</span>
                      <span>·</span>
                      <span>{MATTER_CONFIG[caseStudy.matterType].name}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-2">
                    {caseStudy.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 統計 */}
        <div className="text-xs text-muted-foreground text-center">
          共 {CASE_STUDIES.length} 個經典案例 · 顯示 {filteredCases.length} 個
        </div>
      </CardContent>
    </Card>
  );
}
