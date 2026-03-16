/**
 * 奇門遁甲 - 日家奇門核心邏輯
 * 
 * 日家奇門特點：
 * - 以日干支為基準
 * - 每五日換一局（一元）
 * - 一年 360 日，分為 72 局
 */

// 九宮八卦對應關係
export const PALACES = [
  { index: 4, name: '巽四宮', trigram: '巽', direction: '東南', element: '木' },
  { index: 9, name: '離九宮', trigram: '離', direction: '南', element: '火' },
  { index: 2, name: '坤二宮', trigram: '坤', direction: '西南', element: '土' },
  { index: 3, name: '震三宮', trigram: '震', direction: '東', element: '木' },
  { index: 5, name: '中五宮', trigram: '中', direction: '中央', element: '土' },
  { index: 7, name: '兌七宮', trigram: '兌', direction: '西', element: '金' },
  { index: 8, name: '艮八宮', trigram: '艮', direction: '東北', element: '土' },
  { index: 1, name: '坎一宮', trigram: '坎', direction: '北', element: '水' },
  { index: 6, name: '乾六宮', trigram: '乾', direction: '西北', element: '金' },
] as const;

// 三奇六儀
export const QIYI_SEQUENCE = [
  '戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'
] as const;

// 八門
export const DOORS = [
  { name: '休門', element: '水', auspicious: '大吉', direction: '北' },
  { name: '生門', element: '土', auspicious: '大吉', direction: '東北' },
  { name: '傷門', element: '木', auspicious: '凶', direction: '東' },
  { name: '杜門', element: '木', auspicious: '平', direction: '東南' },
  { name: '景門', element: '火', auspicious: '中平', direction: '南' },
  { name: '死門', element: '土', auspicious: '大凶', direction: '西南' },
  { name: '驚門', element: '金', auspicious: '凶', direction: '西' },
  { name: '開門', element: '金', auspicious: '吉', direction: '西北' },
] as const;

// 八神（陰遁和陽遁順序不同）
export const SPIRITS_YANG = ['值符', '螣蛇', '太陰', '六合', '白虎', '玄武', '九地', '九天'] as const;
export const SPIRITS_YIN = ['值符', '九天', '九地', '玄武', '白虎', '六合', '太陰', '螣蛇'] as const;

// 九星
export const STARS = [
  { name: '天蓬', element: '水', auspicious: '凶', number: 1 },
  { name: '天任', element: '土', auspicious: '吉', number: 8 },
  { name: '天沖', element: '木', auspicious: '吉', number: 3 },
  { name: '天輔', element: '木', auspicious: '大吉', number: 4 },
  { name: '天英', element: '火', auspicious: '中平', number: 9 },
  { name: '天芮', element: '土', auspicious: '凶', number: 2 },
  { name: '天柱', element: '金', auspicious: '凶', number: 6 },
  { name: '天心', element: '金', auspicious: '大吉', number: 7 },
] as const;

// 天干對應的宮位（地盤固定）
export const EARTH_PLATE: Record<string, number> = {
  '戊': 5, '己': 6, '庚': 7, '辛': 8, '壬': 9, '癸': 1, '丁': 2, '丙': 3, '乙': 4,
};

// 地支藏干
export const BRANCH_STEMS: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 六十甲子
export const SIXTY_JIAZI = [
  '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
  '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
  '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
  '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
  '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
  '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥',
] as const;

// 日家奇門局數對應表（簡化版，基於節氣）
// 實際需要更複雜的曆法計算
export function getDailyQimenJuNumber(date: Date, solarTermIndex: number): { juNumber: number; isYang: boolean } {
  // 冬至後陽遁，夏至後陰遁
  // 冬至 = index 0, 夏至 = index 12
  const isYang = solarTermIndex >= 0 && solarTermIndex < 12;
  
  // 簡化的局數計算（實際應基於日干支更精確計算）
  // 每五日一換局，一年 72 局
  const dayOfYear = getDayOfYear(date);
  const juNumber = ((dayOfYear % 9) || 9) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  
  return { juNumber, isYang };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// 計算天盤（三奇六儀在九宮的分布）
export function calculateHeavenPlate(juNumber: number, isYang: boolean): Map<number, string> {
  const heavenPlate = new Map<number, string>();
  const sequence = [...QIYI_SEQUENCE];
  
  // 根據局數確定起始位置
  let startIndex = juNumber - 1;
  
  // 陽遁順行，陰遁逆行
  for (let i = 0; i < 9; i++) {
    const palaceIndex = isYang 
      ? ((startIndex + i) % 9) + 1  // 順行：1,2,3,4,5,6,7,8,9
      : ((startIndex - i + 9) % 9) + 1;  // 逆行：1,9,8,7,6,5,4,3,2
    
    // 跳過中五宮（實際歸於坤二宮）
    const actualPalace = palaceIndex === 5 ? 2 : palaceIndex;
    heavenPlate.set(actualPalace, sequence[i]);
  }
  
  return heavenPlate;
}

// 計算人盤（八門分布）
export function calculateHumanPlate(juNumber: number, isYang: boolean): Map<number, string> {
  const humanPlate = new Map<number, string>();
  
  // 值使門根據局數確定
  const doorSequence = [...DOORS.map(d => d.name)];
  
  // 簡化的八門排法（實際應根據日干支更精確計算）
  const startDoorIndex = (juNumber - 1) % 8;
  
  for (let i = 0; i < 8; i++) {
    const palaceIndex = isYang
      ? ((juNumber + i - 1) % 8) + 1
      : ((juNumber - i + 7) % 8) + 1;
    
    // 跳過中五宮
    const actualPalace = palaceIndex >= 5 ? palaceIndex + 1 : palaceIndex;
    const doorIndex = (startDoorIndex + i) % 8;
    humanPlate.set(actualPalace, doorSequence[doorIndex]);
  }
  
  return humanPlate;
}

// 計算神盤（八神分布）
export function calculateSpiritPlate(isYang: boolean): Map<number, string> {
  const spiritPlate = new Map<number, string>();
  const spirits = isYang ? SPIRITS_YANG : SPIRITS_YIN;
  
  // 八神固定在八宮（跳過中五宮）
  const palaceOrder = [1, 8, 3, 4, 9, 2, 7, 6]; // 順序排列的八宮
  
  for (let i = 0; i < 8; i++) {
    spiritPlate.set(palaceOrder[i], spirits[i]);
  }
  
  return spiritPlate;
}

// 計算九星分布
export function calculateStars(juNumber: number, isYang: boolean): Map<number, string> {
  const starsPlate = new Map<number, string>();
  const stars = [...STARS.map(s => s.name)];
  
  // 根據局數確定天蓬星位置
  const startIndex = (juNumber - 1) % 9;
  
  for (let i = 0; i < 9; i++) {
    const palaceIndex = isYang
      ? ((startIndex + i) % 9) + 1
      : ((startIndex - i + 9) % 9) + 1;
    
    const actualPalace = palaceIndex === 5 ? 2 : palaceIndex;
    const starIndex = i % 8; // 九星，但中五宮寄坤二宮
    starsPlate.set(actualPalace, stars[starIndex]);
  }
  
  return starsPlate;
}

// 完整的奇門盤結構
export interface QimenPlate {
  date: string;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  juNumber: number;
  isYang: boolean;
  yinYang: string;
  solarTerm: string;
  earthPlate: Map<number, string>;  // 地盤（固定）
  heavenPlate: Map<number, string>; // 天盤
  humanPlate: Map<number, string>;  // 人盤（八門）
  spiritPlate: Map<number, string>;  // 神盤
  starsPlate: Map<number, string>;   // 九星
}

// 主計算函數
export function calculateDailyQimen(
  date: Date,
  yearGanZhi: string,
  monthGanZhi: string,
  dayGanZhi: string,
  hourGanZhi: string,
  solarTerm: string,
  solarTermIndex: number
): QimenPlate {
  const { juNumber, isYang } = getDailyQimenJuNumber(date, solarTermIndex);
  
  return {
    date: date.toISOString().split('T')[0],
    yearGanZhi,
    monthGanZhi,
    dayGanZhi,
    hourGanZhi,
    juNumber,
    isYang,
    yinYang: isYang ? '陽遁' : '陰遁',
    solarTerm,
    earthPlate: new Map(Object.entries(EARTH_PLATE).map(([k, v]) => [v, k])),
    heavenPlate: calculateHeavenPlate(juNumber, isYang),
    humanPlate: calculateHumanPlate(juNumber, isYang),
    spiritPlate: calculateSpiritPlate(isYang),
    starsPlate: calculateStars(juNumber, isYang),
  };
}

// ==========================================
// 奇門遁甲分析系統 - 吉凶解說
// ==========================================

export interface PalaceRating {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  score: number; // 0-100
  summary: string;
  detail?: string;
}

export interface MatterRating {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  palace: number;
  summary: string;
  advice: string;
  direction?: string;
}

export interface OverallAnalysis {
  trend: '上升' | '平穩' | '下降';
  strategy: string;
  bestDirection: string;
  summary: string;
}

export interface QimenAnalysisResult {
  palaceRatings: Map<number, PalaceRating>;
  matters: {
    wealth: MatterRating;
    career: MatterRating;
    travel: MatterRating;
    health: MatterRating;
    relationship: MatterRating;
    study: MatterRating;
  };
  overall: OverallAnalysis;
}

// 九星吉凶權重
const STAR_WEIGHT: Record<string, number> = {
  '天蓬': -20, '天任': 15, '天沖': 15, '天輔': 25,
  '天英': 5, '天芮': -20, '天柱': -20, '天心': 25,
};

// 八門吉凶權重
const DOOR_WEIGHT: Record<string, number> = {
  '休門': 25, '生門': 25, '傷門': -20, '杜門': 0,
  '景門': 5, '死門': -30, '驚門': -20, '開門': 20,
};

// 八神吉凶權重
const SPIRIT_WEIGHT: Record<string, number> = {
  '值符': 20, '螣蛇': -10, '太陰': 15, '六合': 15,
  '白虎': -20, '玄武': -15, '九地': 10, '九天': 15,
};

// 計算單宮評級
export function calculatePalaceRating(
  palaceIndex: number,
  star: string | undefined,
  door: string | undefined,
  spirit: string | undefined,
  heavenStem: string | undefined
): PalaceRating {
  let score = 50; // 基準分
  
  // 加權計算
  if (star && STAR_WEIGHT[star]) score += STAR_WEIGHT[star];
  if (door && DOOR_WEIGHT[door]) score += DOOR_WEIGHT[door];
  if (spirit && SPIRIT_WEIGHT[spirit]) score += SPIRIT_WEIGHT[spirit];
  
  // 三奇加分
  if (heavenStem === '乙' || heavenStem === '丙' || heavenStem === '丁') {
    score += 15;
  }
  
  // 六儀中的吉幹
  if (heavenStem === '戊' || heavenStem === '己') {
    score += 5;
  }
  
  // 確保分數在範圍內
  score = Math.max(0, Math.min(100, score));
  
  // 判定等級
  let level: PalaceRating['level'];
  if (score >= 80) level = '大吉';
  else if (score >= 60) level = '吉';
  else if (score >= 40) level = '平';
  else if (score >= 20) level = '凶';
  else level = '大凶';
  
  // 生成摘要
  const elements: string[] = [];
  if (star) elements.push(star);
  if (door) elements.push(door);
  if (spirit) elements.push(spirit);
  
  const summary = generatePalaceSummary(level, door, star, spirit);
  
  return { level, score, summary };
}

function generatePalaceSummary(
  level: PalaceRating['level'],
  door: string | undefined,
  star: string | undefined,
  spirit: string | undefined
): string {
  const summaries: Record<string, string[]> = {
    '大吉': [
      '吉星高照，諸事皆宜',
      '貴人相助，機緣絕佳',
      '氣運亨通，百事順遂',
    ],
    '吉': [
      '吉神護佑，謀事可成',
      '氣場平和，穩步前進',
      '機遇可期，謹慎把握',
    ],
    '平': [
      '吉凶參半，靜觀其變',
      '勢均力敵，宜守不宜攻',
      '平淡無奇，韜光養晦',
    ],
    '凶': [
      '凶煞臨宮，諸事謹慎',
      '阻礙重重，宜退不宜進',
      '時運不濟，靜待時機',
    ],
    '大凶': [
      '凶星聚集，百事忌用',
      '禍福難測，宜靜不宜動',
      '氣場低迷，當避其鋒',
    ],
  };
  
  const baseSummaries = summaries[level];
  return baseSummaries[Math.floor(Math.random() * baseSummaries.length)];
}

// 分析各項事宜
export function analyzeMatters(plate: QimenPlate): QimenAnalysisResult['matters'] {
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  
  // 找到各門所在宮位
  const findPalaceByDoor = (doorName: string): number => {
    for (let i = 1; i <= 9; i++) {
      if (humanPlate[i] === doorName) return i;
    }
    return 1;
  };
  
  // 找到各星所在宮位
  const findPalaceByStar = (starName: string): number => {
    for (let i = 1; i <= 9; i++) {
      if (starsPlate[i] === starName) return i;
    }
    return 1;
  };
  
  // 財運分析 - 生門為主
  const wealthPalace = findPalaceByDoor('生門') || findPalaceByStar('天任');
  const wealthRating = analyzeMatter(plate, wealthPalace, 'wealth');
  
  // 官運分析 - 開門為主
  const careerPalace = findPalaceByDoor('開門') || findPalaceByStar('天心');
  const careerRating = analyzeMatter(plate, careerPalace, 'career');
  
  // 出行分析 - 景門/開門
  const travelPalace = findPalaceByDoor('景門') || findPalaceByDoor('開門') || 9;
  const travelRating = analyzeMatter(plate, travelPalace, 'travel');
  
  // 健康分析 - 天芮/死門
  const healthPalace = findPalaceByStar('天芮') || findPalaceByDoor('死門') || 2;
  const healthRating = analyzeMatter(plate, healthPalace, 'health');
  
  // 人際分析 - 休門/六合
  const relationshipPalace = findPalaceByDoor('休門') || 1;
  const relationshipRating = analyzeMatter(plate, relationshipPalace, 'relationship');
  
  // 學業分析 - 景門/天輔
  const studyPalace = findPalaceByDoor('景門') || findPalaceByStar('天輔') || 4;
  const studyRating = analyzeMatter(plate, studyPalace, 'study');
  
  return {
    wealth: wealthRating,
    career: careerRating,
    travel: travelRating,
    health: healthRating,
    relationship: relationshipRating,
    study: studyRating,
  };
}

function analyzeMatter(
  plate: QimenPlate,
  palaceIndex: number,
  matterType: string
): MatterRating {
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  
  const door = humanPlate[palaceIndex];
  const star = starsPlate[palaceIndex];
  const spirit = spiritPlate[palaceIndex];
  
  const rating = calculatePalaceRating(palaceIndex, star, door, spirit, undefined);
  
  const matterAdvice: Record<string, Record<string, string>> = {
    wealth: {
      '大吉': '財運亨通，宜投資理財、拓展業務',
      '吉': '財路順遂，可穩步求財',
      '平': '財運平平，保守理財為宜',
      '凶': '財運受阻，不宜大額投資',
      '大凶': '破財之兆，當守不宜攻',
    },
    career: {
      '大吉': '官運亨通，升遷有望',
      '吉': '事業順遂，謀事可成',
      '平': '事業平穩，宜守成',
      '凶': '仕途受阻，宜低調',
      '大凶': '官非纏身，謹言慎行',
    },
    travel: {
      '大吉': '出行大吉，一路順風',
      '吉': '旅途平安，諸事順遂',
      '平': '出行平平，無大礙',
      '凶': '出行有阻，宜改期',
      '大凶': '遠行不利，當避之',
    },
    health: {
      '大吉': '身強體健，百病不侵',
      '吉': '健康良好，注意保養',
      '平': '身體無恙，宜調養',
      '凶': '小病纏身，當心調養',
      '大凶': '病厄臨身，速就醫',
    },
    relationship: {
      '大吉': '人緣極佳，貴人相助',
      '吉': '人和事順，交遊廣闊',
      '平': '人際平和，無大喜憂',
      '凶': '口舌是非，謹言慎行',
      '大凶': '人際緊張，宜獨處',
    },
    study: {
      '大吉': '學業精進，金榜題名',
      '吉': '學習順利，事半功倍',
      '平': '學業平平，宜勤勉',
      '凶': '學習受阻，需加把勁',
      '大凶': '考運不佳，當調整',
    },
  };
  
  const palace = PALACES.find(p => p.index === palaceIndex);
  
  return {
    level: rating.level,
    palace: palaceIndex,
    summary: `${palace?.name}：${door || '無門'}、${star || '無星'}`,
    advice: matterAdvice[matterType][rating.level],
    direction: palace?.direction,
  };
}

// 全局分析
export function analyzeOverall(plate: QimenPlate): OverallAnalysis {
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  
  // 計算整體趨勢
  let totalScore = 50;
  
  // 統計各宮評分
  for (let i = 1; i <= 9; i++) {
    const rating = calculatePalaceRating(
      i,
      starsPlate[i],
      humanPlate[i],
      spiritPlate[i],
      undefined
    );
    totalScore += (rating.score - 50) / 9;
  }
  
  const trend: OverallAnalysis['trend'] = totalScore >= 55 ? '上升' : totalScore >= 45 ? '平穩' : '下降';
  
  // 找出最佳方位
  let bestPalace = 1;
  let bestScore = 0;
  for (let i = 1; i <= 9; i++) {
    const rating = calculatePalaceRating(
      i,
      starsPlate[i],
      humanPlate[i],
      spiritPlate[i],
      undefined
    );
    if (rating.score > bestScore) {
      bestScore = rating.score;
      bestPalace = i;
    }
  }
  
  const bestPalaceInfo = PALACES.find(p => p.index === bestPalace);
  
  // 生成策略
  const strategies: Record<string, string> = {
    '上升': '今日氣運上升，宜進取開創，主動出擊',
    '平穩': '今日氣場平和，宜守成待機，穩紮穩打',
    '下降': '今日運勢下行，宜韜光養晦，保守為上',
  };
  
  // 生成綜合摘要
  const yinYangDesc = plate.isYang ? '陽遁主生發，萬物向上' : '陰遁主收斂，以靜制動';
  const juDesc = `${plate.yinYang}${plate.juNumber}局`;
  
  return {
    trend,
    strategy: strategies[trend],
    bestDirection: `${bestPalaceInfo?.direction}（${bestPalaceInfo?.name}）`,
    summary: `${juDesc}，${yinYangDesc}。今日整體${trend === '上升' ? '氣運向好' : trend === '平穩' ? '氣場平和' : '運勢低迷'}，${strategies[trend]}。`,
  };
}

// 主分析函數
export function generateQimenAnalysis(plate: QimenPlate): QimenAnalysisResult {
  // 計算各宮評級
  const palaceRatings = new Map<number, PalaceRating>();
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  
  for (let i = 1; i <= 9; i++) {
    const rating = calculatePalaceRating(
      i,
      starsPlate[i],
      humanPlate[i],
      spiritPlate[i],
      heavenPlate[i]
    );
    palaceRatings.set(i, rating);
  }
  
  // 分析各項事宜
  const matters = analyzeMatters(plate);
  
  // 全局分析
  const overall = analyzeOverall(plate);
  
  return {
    palaceRatings,
    matters,
    overall,
  };
}

// ==========================================
// 增強分析系統 - 三奇六儀與門星神組合
// ==========================================

import { 
  getQiyiCombination, 
  getStemInfo, 
  isOddity,
  THREE_ODDITIES,
  SIX_YI 
} from './qiyiKnowledge';
import { 
  analyzeCombination,
  DOOR_INTERPRETATIONS,
  STAR_INTERPRETATIONS,
  SPIRIT_INTERPRETATIONS 
} from './combinationKnowledge';

// 增強分析結果型別
export interface EnhancedPalaceRating extends PalaceRating {
  combinationAnalysis?: {
    level: '大吉' | '吉' | '平' | '凶' | '大凶';
    interpretation: string;
    advice: string;
    doorInterp: string;
    starInterp: string;
    spiritInterp: string;
  };
  qiyiAnalysis?: {
    stem: string;
    isOddity: boolean;
    combination: string | null;
    interpretation: string;
    advice: string;
  };
}

// 分析單宮的增強資訊
export function analyzePalaceEnhanced(
  palaceIndex: number,
  plate: QimenPlate
): EnhancedPalaceRating {
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  
  const door = humanPlate[palaceIndex];
  const star = starsPlate[palaceIndex];
  const spirit = spiritPlate[palaceIndex];
  const heavenStem = heavenPlate[palaceIndex];
  
  // 基礎評級
  const baseRating = calculatePalaceRating(palaceIndex, star, door, spirit, heavenStem);
  
  // 組合分析
  let combinationAnalysis;
  if (door && star && spirit) {
    const combo = analyzeCombination(door, star, spirit);
    combinationAnalysis = {
      level: combo.level,
      interpretation: combo.interpretation,
      advice: combo.advice,
      doorInterp: combo.details.doorInterp,
      starInterp: combo.details.starInterp,
      spiritInterp: combo.details.spiritInterp,
    };
  }
  
  // 三奇六儀分析
  let qiyiAnalysis;
  if (heavenStem) {
    const stemInfo = getStemInfo(heavenStem);
    const isOddityResult = isOddity(heavenStem);
    
    // 尋找組合（與地盤的組合）
    const earthPlate = Object.fromEntries(plate.earthPlate);
    const earthStem = earthPlate[palaceIndex];
    const combination = earthStem ? getQiyiCombination(heavenStem, earthStem) : null;
    
    qiyiAnalysis = {
      stem: heavenStem,
      isOddity: isOddityResult,
      combination: combination?.name || null,
      interpretation: combination?.interpretation || stemInfo?.interpretation || '',
      advice: combination?.advice || (isOddityResult ? '三奇臨宮，諸事皆宜' : '謹慎行事'),
    };
  }
  
  return {
    ...baseRating,
    combinationAnalysis,
    qiyiAnalysis,
  };
}

// 生成增強版宮位解釋
export function generateEnhancedPalaceSummary(
  rating: EnhancedPalaceRating
): string {
  const parts: string[] = [];
  
  // 基礎摘要
  parts.push(rating.summary);
  
  // 組合分析
  if (rating.combinationAnalysis) {
    parts.push(`門星神組合：${rating.combinationAnalysis.interpretation}`);
  }
  
  // 三奇六儀分析
  if (rating.qiyiAnalysis) {
    const qiyiPrefix = rating.qiyiAnalysis.isOddity ? '【三奇】' : '';
    parts.push(`${qiyiPrefix}天盤${rating.qiyiAnalysis.stem}：${rating.qiyiAnalysis.interpretation}`);
  }
  
  return parts.join('；');
}

// 匯出知識庫供外部使用
export { 
  THREE_ODDITIES, 
  SIX_YI, 
  DOOR_INTERPRETATIONS, 
  STAR_INTERPRETATIONS, 
  SPIRIT_INTERPRETATIONS 
};

