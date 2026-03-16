'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  getAllTeachingSections, 
  getTeachingSection, 
  TeachingSection,
  TeachingContent 
} from '@/lib/qimen/teaching';
import { BookOpen, ChevronLeft, ChevronRight, GraduationCap, Lightbulb } from 'lucide-react';

export function TeachingPanel() {
  const sections = getAllTeachingSections();
  const [currentSectionId, setCurrentSectionId] = useState<string>(sections[0]?.id || '');
  const currentSection = getTeachingSection(currentSectionId);

  const currentIndex = sections.findIndex(s => s.id === currentSectionId);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < sections.length - 1;

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentSectionId(sections[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentSectionId(sections[currentIndex + 1].id);
    }
  };

  const renderContent = (content: TeachingContent, idx: number) => {
    switch (content.type) {
      case 'text':
        return (
          <p key={idx} className="text-muted-foreground leading-relaxed">
            {content.content}
          </p>
        );
      
      case 'highlight':
        return (
          <div 
            key={idx} 
            className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg my-4"
          >
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-amber-900 font-medium">{content.content}</p>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div key={idx} className="my-4">
            <p className="font-medium mb-2">{content.content}</p>
            <ul className="space-y-1.5">
              {content.items?.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      
      case 'table':
        return (
          <div key={idx} className="my-4 overflow-x-auto">
            <p className="font-medium mb-2">{content.content}</p>
            {content.tableData && (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    {content.tableData.headers.map((header, i) => (
                      <th key={i} className="p-2 text-left font-medium border">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.tableData.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-muted/50">
                      {row.map((cell, j) => (
                        <td key={j} className="p-2 border text-muted-foreground">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">奇門遁甲教學</span>
        </div>
        <CardTitle className="text-lg">{currentSection?.title || '基礎教學'}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {currentSection?.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 章節導航 */}
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Badge
              key={section.id}
              variant={section.id === currentSectionId ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCurrentSectionId(section.id)}
            >
              {section.order}. {section.title}
            </Badge>
          ))}
        </div>

        {/* 進度條 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>進度：</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / sections.length) * 100}%` }}
            />
          </div>
          <span>{currentIndex + 1} / {sections.length}</span>
        </div>

        {/* 內容區域 */}
        <div className="border rounded-lg p-4 space-y-4 min-h-[300px]">
          {currentSection?.content.map((content, idx) => renderContent(content, idx))}
        </div>

        {/* 導航按鈕 */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            上一章
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentSection?.order}. {currentSection?.title}
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex items-center gap-1"
          >
            下一章
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
