/**
 * 排盤記錄儲存系統
 * 使用 localStorage 儲存排盤歷史
 */

import { QimenPlate } from './core';
import { MatterType } from './symbolism';

/**
 * 排盤記錄資料結構
 */
export interface QimenRecord {
  /** 唯一識別碼 */
  id: string;
  /** 記錄名稱/標題 */
  title: string;
  /** 建立時間 */
  createdAt: string;
  /** 排盤日期 */
  date: string;
  /** 排盤時辰 */
  hour: number;
  /** 時辰名稱 */
  shichen?: string;
  /** 問事類型 */
  matterType: MatterType;
  /** 六親關係 */
  liuqin?: string;
  /** 備註 */
  notes: string;
  /** 標籤 */
  tags: string[];
  /** 排盤數據 */
  plate: QimenPlate;
  /** 收藏標記 */
  isFavorite: boolean;
}

/**
 * 記錄查詢選項
 */
export interface RecordQueryOptions {
  /** 搜尋關鍵詞 */
  search?: string;
  /** 問事類型篩選 */
  matterType?: MatterType;
  /** 標籤篩選 */
  tags?: string[];
  /** 收藏篩選 */
  favoriteOnly?: boolean;
  /** 日期範圍 */
  dateFrom?: string;
  dateTo?: string;
  /** 排序方式 */
  sortBy?: 'date' | 'createdAt' | 'title';
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

const STORAGE_KEY = 'qimen-zenith-records';

/**
 * 生成唯一識別碼
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 儲存排盤記錄
 */
export function saveRecord(record: Omit<QimenRecord, 'id' | 'createdAt'>): QimenRecord {
  const newRecord: QimenRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  const records = getAllRecords();
  records.unshift(newRecord); // 新記錄放前面
  
  // 限制儲存量（最多 100 條）
  const trimmedRecords = records.slice(0, 100);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedRecords));
  
  return newRecord;
}

/**
 * 獲取所有記錄
 */
export function getAllRecords(): QimenRecord[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 根據 ID 獲取記錄
 */
export function getRecordById(id: string): QimenRecord | null {
  const records = getAllRecords();
  return records.find(r => r.id === id) || null;
}

/**
 * 更新記錄
 */
export function updateRecord(
  id: string, 
  updates: Partial<Omit<QimenRecord, 'id' | 'createdAt'>>
): QimenRecord | null {
  const records = getAllRecords();
  const index = records.findIndex(r => r.id === id);
  
  if (index === -1) return null;
  
  records[index] = {
    ...records[index],
    ...updates,
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return records[index];
}

/**
 * 刪除記錄
 */
export function deleteRecord(id: string): boolean {
  const records = getAllRecords();
  const filtered = records.filter(r => r.id !== id);
  
  if (filtered.length === records.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * 查詢記錄
 */
export function queryRecords(options: RecordQueryOptions = {}): QimenRecord[] {
  let records = getAllRecords();
  
  // 搜尋篩選
  if (options.search) {
    const search = options.search.toLowerCase();
    records = records.filter(r => 
      r.title.toLowerCase().includes(search) ||
      r.notes.toLowerCase().includes(search) ||
      r.tags.some(t => t.toLowerCase().includes(search))
    );
  }
  
  // 問事類型篩選
  if (options.matterType) {
    records = records.filter(r => r.matterType === options.matterType);
  }
  
  // 標籤篩選
  if (options.tags && options.tags.length > 0) {
    records = records.filter(r => 
      options.tags!.some(tag => r.tags.includes(tag))
    );
  }
  
  // 收藏篩選
  if (options.favoriteOnly) {
    records = records.filter(r => r.isFavorite);
  }
  
  // 日期範圍篩選
  if (options.dateFrom) {
    records = records.filter(r => r.date >= options.dateFrom!);
  }
  if (options.dateTo) {
    records = records.filter(r => r.date <= options.dateTo!);
  }
  
  // 排序
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  
  records.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = a.date.localeCompare(b.date);
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
      default:
        comparison = a.createdAt.localeCompare(b.createdAt);
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return records;
}

/**
 * 切換收藏狀態
 */
export function toggleFavorite(id: string): boolean {
  const record = getRecordById(id);
  if (!record) return false;
  
  updateRecord(id, { isFavorite: !record.isFavorite });
  return !record.isFavorite;
}

/**
 * 獲取所有標籤（去重）
 */
export function getAllTags(): string[] {
  const records = getAllRecords();
  const tagsSet = new Set<string>();
  
  records.forEach(r => {
    r.tags.forEach(tag => tagsSet.add(tag));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * 獲取統計資訊
 */
export function getRecordsStats(): {
  total: number;
  favorite: number;
  byMatterType: Record<string, number>;
  recentCount: number; // 最近 7 天
} {
  const records = getAllRecords();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const byMatterType: Record<string, number> = {};
  
  records.forEach(r => {
    byMatterType[r.matterType] = (byMatterType[r.matterType] || 0) + 1;
  });
  
  return {
    total: records.length,
    favorite: records.filter(r => r.isFavorite).length,
    byMatterType,
    recentCount: records.filter(r => new Date(r.createdAt) > sevenDaysAgo).length,
  };
}

/**
 * 匯出記錄為 JSON
 */
export function exportRecords(): string {
  const records = getAllRecords();
  return JSON.stringify(records, null, 2);
}

/**
 * 從 JSON 匯入記錄
 */
export function importRecords(jsonData: string): { success: number; failed: number } {
  try {
    const records = JSON.parse(jsonData) as QimenRecord[];
    const existing = getAllRecords();
    
    let success = 0;
    let failed = 0;
    
    records.forEach(r => {
      if (r.id && r.plate && r.date) {
        // 檢查是否已存在
        const exists = existing.some(e => e.id === r.id);
        if (!exists) {
          existing.push(r);
          success++;
        }
      } else {
        failed++;
      }
    });
    
    // 排序並限制數量
    existing.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const trimmed = existing.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    
    return { success, failed };
  } catch {
    return { success: 0, failed: 0 };
  }
}

/**
 * 清除所有記錄
 */
export function clearAllRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}
