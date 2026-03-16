'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  QimenRecord, 
  saveRecord, 
  getAllRecords, 
  deleteRecord, 
  toggleFavorite,
  queryRecords,
  getAllTags,
  getRecordsStats,
  exportRecords,
  importRecords,
  clearAllRecords
} from '@/lib/qimen/records';
import { QimenPlate } from '@/lib/qimen/core';
import { MatterType, MATTER_CONFIG } from '@/lib/qimen/symbolism';
import { Star, Trash2, Download, Upload, Search, Filter, X, Heart } from 'lucide-react';

interface RecordsManagerProps {
  currentPlate?: QimenPlate;
  currentMatterType?: MatterType;
  currentLiuqin?: string;
  onLoadRecord?: (record: QimenRecord) => void;
}

export function RecordsManager({ 
  currentPlate, 
  currentMatterType = 'general',
  currentLiuqin,
  onLoadRecord 
}: RecordsManagerProps) {
  const [records, setRecords] = useState<QimenRecord[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, favorite: 0, recentCount: 0, byMatterType: {} as Record<string, number> });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordNotes, setNewRecordNotes] = useState('');
  const [newRecordTags, setNewRecordTags] = useState('');

  // 載入記錄
  const loadRecords = () => {
    const allRecords = queryRecords({
      search: searchQuery || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      favoriteOnly: showFavoritesOnly,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setRecords(allRecords);
    setTags(getAllTags());
    setStats(getRecordsStats());
  };

  useEffect(() => {
    loadRecords();
  }, [searchQuery, selectedTags, showFavoritesOnly]);

  // 儲存當前排盤
  const handleSaveCurrent = () => {
    if (!currentPlate) return;

    const record = saveRecord({
      title: newRecordTitle || `${currentPlate.date} ${currentPlate.shichen || ''}排盤`,
      date: currentPlate.date,
      hour: currentPlate.hour || 0,
      shichen: currentPlate.shichen,
      matterType: currentMatterType,
      liuqin: currentLiuqin,
      notes: newRecordNotes,
      tags: newRecordTags.split(',').map(t => t.trim()).filter(Boolean),
      plate: currentPlate,
      isFavorite: false,
    });

    setIsSaveDialogOpen(false);
    setNewRecordTitle('');
    setNewRecordNotes('');
    setNewRecordTags('');
    loadRecords();
  };

  // 刪除記錄
  const handleDelete = (id: string) => {
    if (confirm('確定要刪除此記錄嗎？')) {
      deleteRecord(id);
      loadRecords();
    }
  };

  // 切換收藏
  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    loadRecords();
  };

  // 匯出記錄
  const handleExport = () => {
    const data = exportRecords();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qimen-records-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 匯入記錄
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importRecords(event.target?.result as string);
      alert(`匯入完成：成功 ${result.success} 條，失敗 ${result.failed} 條`);
      loadRecords();
    };
    reader.readAsText(file);
    e.target.value = ''; // 重置 input
  };

  // 清除所有記錄
  const handleClearAll = () => {
    if (confirm('確定要清除所有記錄嗎？此操作無法復原。')) {
      clearAllRecords();
      loadRecords();
    }
  };

  const getMatterTypeName = (type: MatterType) => MATTER_CONFIG[type]?.name || type;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">排盤記錄</CardTitle>
          <div className="flex items-center gap-2">
            {/* 匯出/匯入 */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1" />
              匯出
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                <Upload className="w-4 h-4 mr-1" />
                匯入
              </div>
            </label>

            {/* 儲存當前 */}
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" disabled={!currentPlate}>
                  儲存當前排盤
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>儲存排盤記錄</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium">標題</label>
                    <Input
                      value={newRecordTitle}
                      onChange={(e) => setNewRecordTitle(e.target.value)}
                      placeholder={`${currentPlate?.date || ''} 排盤`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">備註</label>
                    <Input
                      value={newRecordNotes}
                      onChange={(e) => setNewRecordNotes(e.target.value)}
                      placeholder="添加備註..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">標籤（用逗號分隔）</label>
                    <Input
                      value={newRecordTags}
                      onChange={(e) => setNewRecordTags(e.target.value)}
                      placeholder="例如：財運, 重要, 2024"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleSaveCurrent}>儲存</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>共 {stats.total} 條記錄</span>
          <span>收藏 {stats.favorite} 條</span>
          <span>最近 7 天 {stats.recentCount} 條</span>
        </div>

        {/* 搜尋與篩選 */}
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜尋記錄..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-1" />
                篩選
                {selectedTags.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{selectedTags.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="text-sm font-medium mb-2">標籤篩選</div>
                {tags.length === 0 ? (
                  <div className="text-sm text-muted-foreground">無標籤</div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedTags(prev =>
                            prev.includes(tag)
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          );
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="border-t mt-2 pt-2">
                  <DropdownMenuItem onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}>
                    <Heart className={cn("w-4 h-4 mr-2", showFavoritesOnly && "fill-current")} />
                    僅顯示收藏
                  </DropdownMenuItem>
                </div>
                
                {selectedTags.length > 0 || showFavoritesOnly ? (
                  <div className="border-t mt-2 pt-2">
                    <DropdownMenuItem onClick={() => { setSelectedTags([]); setShowFavoritesOnly(false); }}>
                      <X className="w-4 h-4 mr-2" />
                      清除篩選
                    </DropdownMenuItem>
                  </div>
                ) : null}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {(selectedTags.length > 0 || showFavoritesOnly || searchQuery) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTags([]);
                setShowFavoritesOnly(false);
                setSearchQuery('');
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* 已選標籤顯示 */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                />
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {records.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery || selectedTags.length > 0 || showFavoritesOnly
              ? '沒有符合條件的記錄'
              : '暫無記錄，點擊「儲存當前排盤」添加第一條記錄'}
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <div
                key={record.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{record.title}</span>
                      {record.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>{record.date}</span>
                      {record.shichen && <span>· {record.shichen}</span>}
                      <Badge variant="outline" className="text-xs">
                        {getMatterTypeName(record.matterType)}
                      </Badge>
                    </div>

                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {record.notes}
                      </p>
                    )}

                    {record.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {record.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavorite(record.id)}
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4",
                          record.isFavorite && "fill-red-500 text-red-500"
                        )}
                      />
                    </Button>
                    
                    {onLoadRecord && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLoadRecord(record)}
                      >
                        載入
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 清除所有記錄 */}
        {records.length > 0 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={handleClearAll}
            >
              清除所有記錄
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
