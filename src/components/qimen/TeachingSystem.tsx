'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TeachingPanel } from './TeachingPanel';
import { CaseStudyPanel } from './CaseStudyPanel';
import { PatternLookupPanel } from './PatternLookupPanel';
import { GraduationCap, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

type TeachingTab = 'teaching' | 'cases' | 'patterns';

export function TeachingSystem() {
  const [activeTab, setActiveTab] = useState<TeachingTab>('teaching');

  const tabs = [
    { id: 'teaching' as TeachingTab, label: '基礎教學', icon: GraduationCap },
    { id: 'cases' as TeachingTab, label: '案例分析', icon: BookOpen },
    { id: 'patterns' as TeachingTab, label: '格局查詢', icon: Sparkles },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">奇門遁甲學習中心</CardTitle>
            <p className="text-sm text-muted-foreground">
              系統化學習奇門遁甲知識
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tab 導航 */}
        <div className="flex gap-2 mb-4 border-b pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* 內容區域 */}
        <div className="mt-4">
          {activeTab === 'teaching' && <TeachingPanel />}
          {activeTab === 'cases' && <CaseStudyPanel />}
          {activeTab === 'patterns' && <PatternLookupPanel />}
        </div>
      </CardContent>
    </Card>
  );
}
