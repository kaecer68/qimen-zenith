/**
 * Lunar-Zenith API 整合模組
 * 用於獲取曆法基礎數據
 */

// lunar-zenith 返回的四柱結構（天干地支索引）
interface PillarRaw {
  StemIndex: number;
  BranchIndex: number;
}

// lunar-zenith 原始 API 回應
interface LunarDataRaw {
  gregorian_date: string;
  julian_day: number;
  delta_t: number;
  lunar: {
    Year: number;
    Month: number;
    Day: number;
    IsLeap: boolean;
  };
  buddhist: string;
  taoist: string;
  pillars: {
    Year: PillarRaw;
    Month: PillarRaw;
    Day: PillarRaw;
    Hour: PillarRaw;
  };
  solar_term: {
    Index: number;
    Name: string;
    Longitude: number;
  };
  twelve_officer: string;
  shen_sha: Array<{
    Name: string;
    Description: string;
  }>;
  holiday_info: {
    is_holiday: boolean;
    name: string;
  };
}

// 轉換後的標準化數據
export interface LunarData {
  gregorian_date: string;
  julian_day: number;
  delta_t: number;
  lunar: {
    year: number;
    month: number;
    day: number;
    is_leap: boolean;
  };
  buddhist: string;
  taoist: string;
  pillars: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  solar_term: {
    index: number;
    name: string;
    longitude: number;
  };
  twelve_officer: string;
  shen_sha: Array<{
    name: string;
    description: string;
  }>;
  holiday_info: {
    is_holiday: boolean;
    name: string;
  };
}

// 十天干
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
// 十二地支
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

/** 將天干地支索引轉為干支字串（如 StemIndex=5, BranchIndex=1 → "己丑"）*/
function pillarToGanZhi(pillar: PillarRaw): string {
  const stem = STEMS[pillar.StemIndex] || '?';
  const branch = BRANCHES[pillar.BranchIndex] || '?';
  return `${stem}${branch}`;
}

/** 將 lunar-zenith 原始回應轉為標準化格式 */
function normalizeLunarData(raw: LunarDataRaw): LunarData {
  return {
    gregorian_date: raw.gregorian_date,
    julian_day: raw.julian_day,
    delta_t: raw.delta_t,
    lunar: {
      year: raw.lunar.Year,
      month: raw.lunar.Month,
      day: raw.lunar.Day,
      is_leap: raw.lunar.IsLeap,
    },
    buddhist: raw.buddhist,
    taoist: raw.taoist,
    pillars: {
      year: pillarToGanZhi(raw.pillars.Year),
      month: pillarToGanZhi(raw.pillars.Month),
      day: pillarToGanZhi(raw.pillars.Day),
      hour: pillarToGanZhi(raw.pillars.Hour),
    },
    solar_term: {
      index: raw.solar_term.Index,
      name: raw.solar_term.Name,
      longitude: raw.solar_term.Longitude,
    },
    twelve_officer: raw.twelve_officer,
    shen_sha: raw.shen_sha.map(s => ({
      name: s.Name,
      description: s.Description,
    })),
    holiday_info: raw.holiday_info,
  };
}

const LUNAR_API_BASE = process.env.NEXT_PUBLIC_LUNAR_API_URL || '/api/lunar';

/**
 * 獲取指定日期的曆法數據
 */
export async function getLunarData(date: string): Promise<LunarData> {
  const response = await fetch(`${LUNAR_API_BASE}/v1/calendar?date=${date}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lunar data: ${response.status} ${response.statusText}`);
  }

  const raw: LunarDataRaw = await response.json();
  return normalizeLunarData(raw);
}

/**
 * 獲取當前日期的曆法數據
 */
export async function getTodayLunarData(): Promise<LunarData> {
  const today = new Date().toISOString().split('T')[0];
  return getLunarData(today);
}

/**
 * 批量獲取日期範圍內的曆法數據
 */
export async function getLunarDataRange(startDate: string, endDate: string): Promise<LunarData[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const results: LunarData[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    try {
      const data = await getLunarData(dateStr);
      results.push(data);
    } catch (error) {
      console.error(`Failed to fetch data for ${dateStr}:`, error);
    }
  }

  return results;
}

/**
 * 格式化干支為顯示文字
 */
export function formatGanZhi(ganZhi: string): string {
  if (!ganZhi || ganZhi.length !== 2) return ganZhi;
  return ganZhi;
}

/**
 * 獲取節氣名稱對照表
 */
export const SOLAR_TERMS = [
  '冬至', '小寒', '大寒', '立春', '雨水', '驚蟄',
  '春分', '清明', '谷雨', '立夏', '小滿', '芒種',
  '夏至', '小暑', '大暑', '立秋', '處暑', '白露',
  '秋分', '寒露', '霜降', '立冬', '小雪', '大雪',
] as const;

/**
 * 根據節氣索引獲取節氣名稱
 */
export function getSolarTermName(index: number): string {
  return SOLAR_TERMS[index] || '未知';
}

/**
 * 判斷是否為陽遁（冬至後至夏至前）
 */
export function isYangDun(solarTermIndex: number): boolean {
  // 冬至 = 0, 夏至 = 12
  return solarTermIndex >= 0 && solarTermIndex < 12;
}
