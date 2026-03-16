'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { QimenPlate } from '@/lib/qimen/core';
import { MatterType } from '@/lib/qimen/symbolism';
import { 
  exportAsText, 
  downloadTextFile,
  exportAsCSV,
  downloadCSVFile,
  downloadHTMLFile,
  printPlate,
  generatePlateDescription
} from '@/lib/qimen/export';
import { FileText, Download, Printer, Table, FileCode, Image } from 'lucide-react';

interface ExportPanelProps {
  plate: QimenPlate;
  matterType: MatterType;
  liuqin?: string;
}

export function ExportPanel({ plate, matterType, liuqin }: ExportPanelProps) {
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');

  // 預覽文字格式
  const handlePreviewText = () => {
    const content = exportAsText(plate, matterType, liuqin);
    setPreviewContent(content);
    setPreviewTitle('文字格式預覽');
    setIsPreviewOpen(true);
  };

  // 下載文字檔
  const handleDownloadText = () => {
    const content = exportAsText(plate, matterType, liuqin);
    const filename = `qimen-${plate.date}-${plate.shichen || 'plate'}.txt`;
    downloadTextFile(content, filename);
  };

  // 下載 CSV
  const handleDownloadCSV = () => {
    const content = exportAsCSV(plate);
    const filename = `qimen-${plate.date}.csv`;
    downloadCSVFile(content, filename);
  };

  // 下載 HTML
  const handleDownloadHTML = () => {
    downloadHTMLFile(plate, matterType, liuqin);
  };

  // 列印
  const handlePrint = () => {
    printPlate(plate, matterType, liuqin);
  };

  // 複製到剪貼簿
  const handleCopyToClipboard = async () => {
    const content = exportAsText(plate, matterType, liuqin);
    try {
      await navigator.clipboard.writeText(content);
      alert('已複製到剪貼簿');
    } catch {
      alert('複製失敗，請手動複製');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">匯出排盤</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* 文字格式 */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <Button
              variant="outline"
              className="flex-col h-auto py-4 px-2"
              onClick={handlePreviewText}
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm">預覽文字</span>
            </Button>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{previewTitle}</DialogTitle>
                <DialogDescription>
                  {plate.date} · {plate.shichen || ''} · {plate.yinYang}{plate.juNumber}局
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[50vh] text-sm whitespace-pre-wrap font-mono">
                  {previewContent}
                </pre>
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleDownloadText} className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    下載 TXT
                  </Button>
                  <Button variant="outline" onClick={handleCopyToClipboard} className="flex-1">
                    複製文字
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* CSV 格式 */}
          <Button
            variant="outline"
            className="flex-col h-auto py-4 px-2"
            onClick={handleDownloadCSV}
          >
            <Table className="w-6 h-6 mb-2" />
            <span className="text-sm">下載 CSV</span>
          </Button>

          {/* HTML 格式 */}
          <Button
            variant="outline"
            className="flex-col h-auto py-4 px-2"
            onClick={handleDownloadHTML}
          >
            <FileCode className="w-6 h-6 mb-2" />
            <span className="text-sm">下載 HTML</span>
          </Button>

          {/* 列印 */}
          <Button
            variant="outline"
            className="flex-col h-auto py-4 px-2"
            onClick={handlePrint}
          >
            <Printer className="w-6 h-6 mb-2" />
            <span className="text-sm">列印</span>
          </Button>

          {/* 圖片匯出（暫時提示） */}
          <Button
            variant="outline"
            className="flex-col h-auto py-4 px-2 opacity-50"
            disabled
            title="圖片匯出需要 html2canvas 庫，暫未啟用"
          >
            <Image className="w-6 h-6 mb-2" />
            <span className="text-sm">圖片（開發中）</span>
          </Button>
        </div>

        {/* 說明 */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">匯出格式說明：</p>
          <ul className="space-y-1 list-disc list-inside">
            <li><strong>文字格式</strong>：純文字排盤，適合保存和分享</li>
            <li><strong>CSV 格式</strong>：表格數據，適合匯入 Excel 分析</li>
            <li><strong>HTML 格式</strong>：精美網頁，適合打印和展示</li>
            <li><strong>列印</strong>：直接輸出到印表機</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
