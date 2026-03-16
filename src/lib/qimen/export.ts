/**
 * 排盤匯出功能
 * 支援 PDF 和圖片格式匯出
 */

import { QimenPlate } from './core';
import { MatterType, MATTER_CONFIG } from './symbolism';

/**
 * 匯出選項
 */
export interface ExportOptions {
  /** 匯出格式 */
  format: 'pdf' | 'png';
  /** 包含分析 */
  includeAnalysis: boolean;
  /** 包含解說 */
  includeInterpretation: boolean;
  /** 紙張大小（PDF） */
  pageSize?: 'a4' | 'a3' | 'letter';
  /** 方向（PDF） */
  orientation?: 'portrait' | 'landscape';
  /** 品質（PNG） */
  quality?: 'high' | 'medium' | 'low';
}

/**
 * 生成排盤文字描述
 */
export function generatePlateDescription(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): string {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════');
  lines.push('           奇門遁甲排盤結果');
  lines.push('═══════════════════════════════════════');
  lines.push('');
  
  // 基本資訊
  lines.push(`【日期】${plate.date}`);
  lines.push(`【時辰】${plate.shichen || ''} (${plate.hourGanZhi}時)`);
  lines.push(`【節氣】${plate.solarTerm}`);
  lines.push(`【遁局】${plate.yinYang} ${plate.juNumber}局`);
  lines.push('');
  
  // 四柱
  lines.push(`【年柱】${plate.yearGanZhi}`);
  lines.push(`【月柱】${plate.monthGanZhi}`);
  lines.push(`【日柱】${plate.dayGanZhi}`);
  lines.push(`【時柱】${plate.hourGanZhi}`);
  lines.push('');
  
  // 問事資訊
  if (matterType !== 'general') {
    lines.push(`【問事】${MATTER_CONFIG[matterType].name}`);
    if (liuqin) {
      lines.push(`【對方】${liuqin}`);
    }
    lines.push('');
  }
  
  // 九宮格
  lines.push('【九宮排盤】');
  lines.push('');
  
  const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  const earthPlate = Object.fromEntries(plate.earthPlate);
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  
  // 格式化九宮格
  const formatPalace = (idx: number) => {
    const palace = palaceOrder[idx];
    const lines2: string[] = [];
    lines2.push(`${heavenPlate[palace] || '　'}${starsPlate[palace] || '　'}`);
    lines2.push(`${spiritPlate[palace] || '　'}${humanPlate[palace] || '　'}`);
    lines2.push(`${earthPlate[palace] || '　'}`);
    return lines2.join('\n');
  };
  
  // 九宮格 3x3 布局
  const row1 = [
    `巽四宮\n${formatPalace(0)}`,
    `離九宮\n${formatPalace(1)}`,
    `坤二宮\n${formatPalace(2)}`
  ];
  const row2 = [
    `震三宮\n${formatPalace(3)}`,
    `中五宮\n寄坤二宮`,
    `兌七宮\n${formatPalace(4)}`
  ];
  const row3 = [
    `艮八宮\n${formatPalace(5)}`,
    `坎一宮\n${formatPalace(6)}`,
    `乾六宮\n${formatPalace(7)}`
  ];
  
  lines.push(row1.join(' | '));
  lines.push('─'.repeat(50));
  lines.push(row2.join(' | '));
  lines.push('─'.repeat(50));
  lines.push(row3.join(' | '));
  lines.push('');
  
  lines.push('═══════════════════════════════════════');
  lines.push('  奇門遁甲專業排盤系統 - Qimen Zenith');
  lines.push('═══════════════════════════════════════');
  
  return lines.join('\n');
}

/**
 * 匯出為文字檔
 */
export function exportAsText(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): string {
  return generatePlateDescription(plate, matterType, liuqin);
}

/**
 * 下載文字檔
 */
export function downloadTextFile(
  content: string,
  filename: string
): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 匯出九宮格為 CSV
 */
export function exportAsCSV(plate: QimenPlate): string {
  const headers = ['宮位', '方位', '天盤', '地盤', '人盤', '神盤', '星盤'];
  
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  const earthPlate = Object.fromEntries(plate.earthPlate);
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  
  const palaceNames: Record<number, string> = {
    1: '坎一宮', 2: '坤二宮', 3: '震三宮', 4: '巽四宮',
    5: '中五宮', 6: '乾六宮', 7: '兌七宮', 8: '艮八宮', 9: '離九宮'
  };
  
  const directions: Record<number, string> = {
    1: '北', 2: '西南', 3: '東', 4: '東南',
    5: '中', 6: '西北', 7: '西', 8: '東北', 9: '南'
  };
  
  const rows = [1, 8, 3, 4, 9, 2, 7, 6, 5].map(palace => [
    palaceNames[palace],
    directions[palace],
    heavenPlate[palace] || '',
    earthPlate[palace] || '',
    humanPlate[palace] || '',
    spiritPlate[palace] || '',
    starsPlate[palace] || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * 下載 CSV 檔
 */
export function downloadCSVFile(
  content: string,
  filename: string
): void {
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * HTML 模板（用於匯出）
 */
export function generateHTMLContent(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): string {
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  const earthPlate = Object.fromEntries(plate.earthPlate);
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  
  const palaceCell = (palace: number, name: string) => `
    <div class="palace">
      <div class="palace-name">${name}</div>
      <div class="palace-content">
        <div class="heaven">${heavenPlate[palace] || '　'}</div>
        <div class="star">${starsPlate[palace] || ''}</div>
        <div class="spirit">${spiritPlate[palace] || ''}</div>
        <div class="door">${humanPlate[palace] || ''}</div>
        <div class="earth">${earthPlate[palace] || '　'}</div>
      </div>
    </div>
  `;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>奇門遁甲排盤 - ${plate.date}</title>
  <style>
    body {
      font-family: "Noto Sans TC", "Microsoft JhengHei", sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 15px;
      font-size: 14px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
    }
    .info-label {
      color: #666;
    }
    .info-value {
      font-weight: bold;
      color: #333;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      background: #333;
      padding: 2px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .palace {
      background: white;
      padding: 15px;
      text-align: center;
      min-height: 120px;
    }
    .palace-name {
      font-weight: bold;
      color: #666;
      font-size: 12px;
      margin-bottom: 8px;
    }
    .palace-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .heaven {
      font-size: 24px;
      font-weight: bold;
      color: #333;
    }
    .star {
      font-size: 12px;
      color: #0066cc;
    }
    .door {
      font-size: 14px;
      color: #cc6600;
    }
    .spirit {
      font-size: 11px;
      color: #6600cc;
    }
    .earth {
      font-size: 12px;
      color: #999;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding: 15px;
      color: #999;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>奇門遁甲排盤結果</h1>
    <div class="info">
      <div class="info-item">
        <span class="info-label">日期：</span>
        <span class="info-value">${plate.date}</span>
      </div>
      <div class="info-item">
        <span class="info-label">時辰：</span>
        <span class="info-value">${plate.shichen || ''} (${plate.hourGanZhi})</span>
      </div>
      <div class="info-item">
        <span class="info-label">節氣：</span>
        <span class="info-value">${plate.solarTerm}</span>
      </div>
      <div class="info-item">
        <span class="info-label">遁局：</span>
        <span class="info-value">${plate.yinYang} ${plate.juNumber}局</span>
      </div>
      <div class="info-item">
        <span class="info-label">年柱：</span>
        <span class="info-value">${plate.yearGanZhi}</span>
      </div>
      <div class="info-item">
        <span class="info-label">月柱：</span>
        <span class="info-value">${plate.monthGanZhi}</span>
      </div>
      <div class="info-item">
        <span class="info-label">日柱：</span>
        <span class="info-value">${plate.dayGanZhi}</span>
      </div>
      <div class="info-item">
        <span class="info-label">時柱：</span>
        <span class="info-value">${plate.hourGanZhi}</span>
      </div>
    </div>
  </div>
  
  <div class="board">
    ${palaceCell(4, '巽四宮')}
    ${palaceCell(9, '離九宮')}
    ${palaceCell(2, '坤二宮')}
    ${palaceCell(3, '震三宮')}
    <div class="palace" style="display: flex; align-items: center; justify-content: center;">
      <div style="text-align: center;">
        <div style="font-size: 14px; color: #666;">中五宮</div>
        <div style="font-size: 12px; color: #999; margin-top: 5px;">寄坤二宮</div>
      </div>
    </div>
    ${palaceCell(7, '兌七宮')}
    ${palaceCell(8, '艮八宮')}
    ${palaceCell(1, '坎一宮')}
    ${palaceCell(6, '乾六宮')}
  </div>
  
  <div class="footer">
    <p>奇門遁甲專業排盤系統 - Qimen Zenith</p>
    <p>Generated on ${new Date().toLocaleString('zh-TW')}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 匯出為 HTML 檔
 */
export function downloadHTMLFile(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): void {
  const content = generateHTMLContent(plate, matterType, liuqin);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `qimen-plate-${plate.date}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 將元素轉換為圖片（使用 html2canvas 原理的簡化版）
 * 實際實現需要引入 html2canvas 庫
 */
export async function exportAsImage(
  elementId: string,
  options: { quality?: number; scale?: number } = {}
): Promise<string | null> {
  // 檢查是否在瀏覽器環境
  if (typeof window === 'undefined') return null;
  
  // 這裡返回一個提示，實際實現需要 html2canvas
  console.log('Image export requires html2canvas library');
  console.log('Element ID:', elementId);
  console.log('Options:', options);
  
  return null;
}

/**
 * 列印排盤
 */
export function printPlate(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): void {
  const html = generateHTMLContent(plate, matterType, liuqin);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}
