/**
 * 時空分析報告系統（進階）
 * 綜合分析時間、空間、干支、節氣等因素
 */

import { QimenPlate, PalaceRating } from './core';
import { 
  MatterType, 
  MATTER_CONFIG, 
  PALACE_SYMBOLISM,
  getMatterPalace 
} from './symbolism';
import { analyzePalaceKz, FiveElement } from './palaceRelation';

/**
 * 時辰吉凶資訊
 */
export interface ShichenAnalysis {
  /** 時辰名稱 */
  name: string;
  /** 時辰地支 */
  branch: string;
  /** 時干 */
  stem: string;
  /** 時辰吉凶 */
  auspiciousness: '吉' | '平' | '凶';
  /** 時辰描述 */
  description: string;
  /** 適合事項 */
  suitable: string[];
  /** 不適合事項 */
  unsuitable: string[];
}

/**
 * 方位吉凶分析
 */
export interface DirectionAnalysis {
  /** 方位 */
  direction: string;
  /** 八卦 */
  trigram: string;
  /** 宮位 */
  palace: number;
  /** 吉凶 */
  auspiciousness: '吉' | '平' | '凶';
  /** 五行 */
  element: FiveElement;
  /** 描述 */
  description: string;
  /** 建議 */
  advice: string;
}

/**
 * 節氣分析
 */
export interface SolarTermAnalysis {
  /** 節氣名稱 */
  name: string;
  /** 節氣索引 */
  index: number;
  /** 陰陽遁 */
  yinYang: '陽遁' | '陰遁';
  /** 當令五行 */
  rulingElement: FiveElement;
  /** 氣運強弱 */
  qiStrength: '旺' | '相' | '休' | '囚' | '死';
  /** 描述 */
  description: string;
}

/**
 * 干支關係分析
 */
export interface GanZhiAnalysis {
  /** 年柱 */
  year: { ganZhi: string; element: FiveElement; description: string };
  /** 月柱 */
  month: { ganZhi: string; element: FiveElement; description: string };
  /** 日柱 */
  day: { ganZhi: string; element: FiveElement; description: string };
  /** 時柱 */
  hour: { ganZhi: string; element: FiveElement; description: string };
  /** 日時關係 */
  dayHourRelation: string;
  /** 整體評語 */
  summary: string;
}

/**
 * 時空分析報告
 */
export interface SpaceTimeReport {
  /** 時辰分析 */
  shichen: ShichenAnalysis;
  /** 節氣分析 */
  solarTerm: SolarTermAnalysis;
  /** 干支分析 */
  ganZhi: GanZhiAnalysis;
  /** 八方位分析 */
  eightDirections: DirectionAnalysis[];
  /** 當日最佳時辰 */
  bestHours: string[];
  /** 當日最佳方位 */
  bestDirections: string[];
  /** 用神宮位時空評估 */
  godPalaceSpacetime: {
    palace: number;
    palaceName: string;
    timeSuitability: '吉' | '平' | '凶';
    spaceSuitability: '吉' | '平' | '凶';
    combinedScore: number;
    summary: string;
  };
  /** 綜合建議 */
  recommendations: string[];
  /** 注意事項 */
  warnings: string[];
}

/**
 * 時辰吉凶資料庫
 */
const SHICHEN_AUSPICIOUSNESS: Record<string, { level: '吉' | '平' | '凶'; desc: string }> = {
  '子': { level: '吉', desc: '子時陽生，萬物滋長，宜謀劃、休息' },
  '丑': { level: '平', desc: '丑時土旺，宜守成、積累' },
  '寅': { level: '吉', desc: '寅時木旺，宜進取、行動' },
  '卯': { level: '吉', desc: '卯時日出，宜開始新事' },
  '辰': { level: '平', desc: '辰時土旺，宜處理雜務' },
  '巳': { level: '吉', desc: '巳時火旺，宜社交、談判' },
  '午': { level: '吉', desc: '午時陽盛，諸事皆宜' },
  '未': { level: '平', desc: '未時土旺，宜穩健行事' },
  '申': { level: '平', desc: '申時金旺，宜決斷、收尾' },
  '酉': { level: '平', desc: '酉時日落，宜收斂、總結' },
  '戌': { level: '凶', desc: '戌時土燥，宜謹慎、避免衝動' },
  '亥': { level: '凶', desc: '亥時陰盛，宜休息、不宜妄動' },
};

/**
 * 時辰適宜事項
 */
const SHICHEN_SUITABLE: Record<string, string[]> = {
  '子': ['休息', '謀劃', '祈願'],
  '丑': ['學習', '積累', '守成'],
  '寅': ['行動', '出發', '開始'],
  '卯': ['工作', '運動', '見面'],
  '辰': ['處理事務', '整理'],
  '巳': ['談判', '社交', '簽約'],
  '午': ['會議', '用餐', '重要決定'],
  '未': ['穩健工作', '檢查'],
  '申': ['決斷', '收尾', '總結'],
  '酉': ['收斂', '準備', '計劃'],
  '戌': ['內省', '休息'],
  '亥': ['休息', '睡眠'],
};

/**
 * 節氣五行對應
 */
const SOLAR_TERM_ELEMENTS: Record<string, FiveElement> = {
  '立春': '木', '雨水': '木', '驚蟄': '木', '春分': '木', '清明': '木', '谷雨': '木',
  '立夏': '火', '小滿': '火', '芒種': '火', '夏至': '火', '小暑': '火', '大暑': '火',
  '立秋': '金', '處暑': '金', '白露': '金', '秋分': '金', '寒露': '金', '霜降': '金',
  '立冬': '水', '小雪': '水', '大雪': '水', '冬至': '水', '小寒': '水', '大寒': '水',
};

/**
 * 節氣名稱到索引的映射
 */
const SOLAR_TERM_INDEX: Record<string, number> = {
  '冬至': 0, '小寒': 1, '大寒': 2, '立春': 3, '雨水': 4, '驚蟄': 5,
  '春分': 6, '清明': 7, '谷雨': 8, '立夏': 9, '小滿': 10, '芒種': 11,
  '夏至': 12, '小暑': 13, '大暑': 14, '立秋': 15, '處暑': 16, '白露': 17,
  '秋分': 18, '寒露': 19, '霜降': 20, '立冬': 21, '小雪': 22, '大雪': 23,
};

/**
 * 生成時空分析報告
 */
export function generateSpaceTimeReport(
  plate: QimenPlate,
  matterType: MatterType
): SpaceTimeReport {
  // 解析時柱
  const hourGanZhi = plate.hourGanZhi;
  const hourBranch = hourGanZhi.charAt(1);
  const hourStem = hourGanZhi.charAt(0);
  
  // 時辰分析
  const shichen = analyzeShichen(hourBranch, hourStem, plate.shichen);
  
  // 節氣分析
  const solarTermIndex = SOLAR_TERM_INDEX[plate.solarTerm] || 0;
  const solarTerm = analyzeSolarTerm(plate.solarTerm, solarTermIndex, plate.isYang, plate.juNumber);
  
  // 干支分析
  const ganZhi = analyzeGanZhi(plate);
  
  // 八方位分析
  const eightDirections = analyzeEightDirections(plate);
  
  // 計算用神宮位
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const matterPalace = getMatterPalace(matterType, { humanPlate, starsPlate });
  let godPalace = matterPalace.palace;
  if (godPalace === 0) godPalace = 5;
  
  // 用神宮位時空評估
  const godPalaceSpacetime = analyzeGodPalaceSpacetime(
    godPalace,
    plate,
    shichen,
    solarTerm
  );
  
  // 計算最佳時辰
  const bestHours = calculateBestHours(plate.dayGanZhi);
  
  // 計算最佳方位
  const bestDirections = calculateBestDirections(godPalace, eightDirections);
  
  // 生成建議
  const recommendations = generateSpacetimeRecommendations(
    matterType,
    godPalaceSpacetime,
    shichen,
    solarTerm
  );
  
  // 生成警告
  const warnings = generateSpacetimeWarnings(shichen, solarTerm, godPalaceSpacetime);

  return {
    shichen,
    solarTerm,
    ganZhi,
    eightDirections,
    bestHours,
    bestDirections,
    godPalaceSpacetime,
    recommendations,
    warnings,
  };
}

/**
 * 分析時辰
 */
function analyzeShichen(
  branch: string,
  stem: string,
  shichenName?: string
): ShichenAnalysis {
  const info = SHICHEN_AUSPICIOUSNESS[branch] || { level: '平', desc: '時辰平平' };
  const suitable = SHICHEN_SUITABLE[branch] || ['一般事務'];
  
  // 根據時干調整吉凶
  let auspiciousness = info.level;
  const luckyStems = ['甲', '乙', '丙', '丁', '戊'];
  const unluckyStems = ['庚', '辛', '壬', '癸'];
  
  if (luckyStems.includes(stem) && auspiciousness !== '凶') {
    auspiciousness = '吉';
  } else if (unluckyStems.includes(stem) && auspiciousness !== '吉') {
    auspiciousness = '平';
  }
  
  return {
    name: shichenName || `${stem}${branch}時`,
    branch,
    stem,
    auspiciousness,
    description: info.desc,
    suitable,
    unsuitable: auspiciousness === '凶' ? ['重要決定', '出行', '投資'] : [],
  };
}

/**
 * 分析節氣
 */
function analyzeSolarTerm(
  name: string,
  index: number,
  isYang: boolean,
  juNumber?: number
): SolarTermAnalysis {
  const element = SOLAR_TERM_ELEMENTS[name] || '土';
  
  // 計算氣運強弱
  let qiStrength: SolarTermAnalysis['qiStrength'];
  if (index % 6 < 2) {
    qiStrength = '旺';
  } else if (index % 6 < 4) {
    qiStrength = '相';
  } else {
    qiStrength = '休';
  }
  
  return {
    name,
    index,
    yinYang: isYang ? '陽遁' : '陰遁',
    rulingElement: element,
    qiStrength,
    description: `${name}，${element}氣${qiStrength}，${isYang ? '陽' : '陰'}遁${juNumber || ''}局`,
  };
}

/**
 * 分析干支關係
 */
function analyzeGanZhi(plate: QimenPlate): GanZhiAnalysis {
  // 簡化的五行對應
  const ganElements: Record<string, FiveElement> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };
  
  const zhiElements: Record<string, FiveElement> = {
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
    '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
  };
  
  const parseGanZhi = (gz: string) => ({
    ganZhi: gz,
    element: ganElements[gz.charAt(0)] || '土',
    description: `${gz}屬${ganElements[gz.charAt(0)] || '土'}`,
  });
  
  const year = parseGanZhi(plate.yearGanZhi);
  const month = parseGanZhi(plate.monthGanZhi);
  const day = parseGanZhi(plate.dayGanZhi);
  const hour = parseGanZhi(plate.hourGanZhi);
  
  // 日時關係
  const dayStem = plate.dayGanZhi.charAt(0);
  const hourStem = plate.hourGanZhi.charAt(0);
  let dayHourRelation = '日時相濟';
  
  if (dayStem === hourStem) {
    dayHourRelation = '日時比和，氣場一致';
  } else if (ganElements[dayStem] === ganElements[hourStem]) {
    dayHourRelation = '日時五行相同，有助益';
  }
  
  return {
    year,
    month,
    day,
    hour,
    dayHourRelation,
    summary: `${year.ganZhi}年 ${month.ganZhi}月 ${day.ganZhi}日 ${hour.ganZhi}時，${dayHourRelation}`,
  };
}

/**
 * 分析八方位
 */
function analyzeEightDirections(plate: QimenPlate): DirectionAnalysis[] {
  const directions: DirectionAnalysis[] = [];
  const palaceOrder = [1, 8, 3, 4, 9, 2, 7, 6]; // 坎艮震巽離坤兌乾
  
  for (const palace of palaceOrder) {
    const info = PALACE_SYMBOLISM[palace];
    const palaceKz = analyzePalaceKz(palace);
    
    // 評估吉凶
    let auspiciousness: '吉' | '平' | '凶' = '平';
    if (palaceKz.score >= 70) {
      auspiciousness = '吉';
    } else if (palaceKz.score <= 30) {
      auspiciousness = '凶';
    }
    
    directions.push({
      direction: info.direction,
      trigram: info.trigram,
      palace,
      auspiciousness,
      element: info.element as FiveElement,
      description: `${info.name}（${info.direction}方）屬${info.element}，${palaceKz.summary}`,
      advice: auspiciousness === '吉' 
        ? `宜向${info.direction}方行事` 
        : auspiciousness === '凶'
        ? `${info.direction}方不利，宜避開`
        : `${info.direction}方平平，審慎行事`,
    });
  }
  
  return directions;
}

/**
 * 分析用神宮位時空適合度
 */
function analyzeGodPalaceSpacetime(
  palace: number,
  plate: QimenPlate,
  shichen: ShichenAnalysis,
  solarTerm: SolarTermAnalysis
): SpaceTimeReport['godPalaceSpacetime'] {
  const palaceInfo = PALACE_SYMBOLISM[palace];
  const palaceKz = analyzePalaceKz(palace);
  
  // 時間適合度
  let timeSuitability: '吉' | '平' | '凶' = '平';
  if (shichen.auspiciousness === '吉' && solarTerm.qiStrength !== '囚') {
    timeSuitability = '吉';
  } else if (shichen.auspiciousness === '凶' || solarTerm.qiStrength === '死') {
    timeSuitability = '凶';
  }
  
  // 空間適合度
  let spaceSuitability: '吉' | '平' | '凶' = '平';
  if (palaceKz.score >= 60) {
    spaceSuitability = '吉';
  } else if (palaceKz.score <= 40) {
    spaceSuitability = '凶';
  }
  
  // 綜合評分
  let combinedScore = 50;
  if (timeSuitability === '吉') combinedScore += 20;
  if (timeSuitability === '凶') combinedScore -= 20;
  if (spaceSuitability === '吉') combinedScore += 20;
  if (spaceSuitability === '凶') combinedScore -= 20;
  
  combinedScore = Math.max(0, Math.min(100, combinedScore));
  
  // 生成評語
  const parts: string[] = [];
  parts.push(`${palaceInfo.name}時空評估`);
  parts.push(`時間：${timeSuitability === '吉' ? '良辰吉時' : timeSuitability === '凶' ? '時機欠佳' : '時機平平'}`);
  parts.push(`空間：${spaceSuitability === '吉' ? '方位得宜' : spaceSuitability === '凶' ? '方位不利' : '方位平平'}`);
  
  return {
    palace,
    palaceName: palaceInfo.name,
    timeSuitability,
    spaceSuitability,
    combinedScore,
    summary: parts.join('，'),
  };
}

/**
 * 計算當日最佳時辰
 */
function calculateBestHours(dayGanZhi: string): string[] {
  const dayStem = dayGanZhi.charAt(0);
  
  // 根據日干推算最佳時辰
  const bestHoursMap: Record<string, string[]> = {
    '甲': ['寅時', '卯時', '辰時'],
    '乙': ['卯時', '辰時', '巳時'],
    '丙': ['巳時', '午時', '未時'],
    '丁': ['午時', '未時', '申時'],
    '戊': ['辰時', '巳時', '午時'],
    '己': ['巳時', '午時', '未時'],
    '庚': ['申時', '酉時', '戌時'],
    '辛': ['酉時', '戌時', '亥時'],
    '壬': ['亥時', '子時', '丑時'],
    '癸': ['子時', '丑時', '寅時'],
  };
  
  return bestHoursMap[dayStem] || ['午時', '未時'];
}

/**
 * 計算最佳方位
 */
function calculateBestDirections(
  godPalace: number,
  directions: DirectionAnalysis[]
): string[] {
  const best: string[] = [];
  
  // 找到用神宮位的方向
  const godDirection = directions.find(d => d.palace === godPalace);
  if (godDirection && godDirection.auspiciousness === '吉') {
    best.push(godDirection.direction);
  }
  
  // 找到其他吉方
  directions
    .filter(d => d.auspiciousness === '吉' && d.palace !== godPalace)
    .slice(0, 2)
    .forEach(d => best.push(d.direction));
  
  return best;
}

/**
 * 生成時空建議
 */
function generateSpacetimeRecommendations(
  matterType: MatterType,
  godPalaceSpacetime: SpaceTimeReport['godPalaceSpacetime'],
  shichen: ShichenAnalysis,
  solarTerm: SolarTermAnalysis
): string[] {
  const recommendations: string[] = [];
  const matterName = MATTER_CONFIG[matterType].name;
  
  // 基於時空評估的建議
  if (godPalaceSpacetime.timeSuitability === '吉') {
    recommendations.push(`當前時辰有利於${matterName}，宜把握時機`);
  }
  
  if (godPalaceSpacetime.spaceSuitability === '吉') {
    recommendations.push(`用神宮位方位得宜，可往${PALACE_SYMBOLISM[godPalaceSpacetime.palace].direction}方發展`);
  }
  
  // 基於節氣的建議
  if (solarTerm.qiStrength === '旺' || solarTerm.qiStrength === '相') {
    recommendations.push(`${solarTerm.name}氣運${solarTerm.qiStrength}，${matterName}宜積極進取`);
  }
  
  // 基於時辰的建議
  if (shichen.suitable.length > 0) {
    recommendations.push(`當前時辰適合：${shichen.suitable.slice(0, 3).join('、')}`);
  }
  
  // 綜合評估
  if (godPalaceSpacetime.combinedScore >= 70) {
    recommendations.push(`時空條件良好，${matterName}可大膽進行`);
  } else if (godPalaceSpacetime.combinedScore >= 50) {
    recommendations.push(`時空條件尚可，${matterName}宜審慎進行`);
  } else {
    recommendations.push(`時空條件欠佳，${matterName}宜韜光養晦`);
  }
  
  return recommendations.slice(0, 5);
}

/**
 * 生成時空警告
 */
function generateSpacetimeWarnings(
  shichen: ShichenAnalysis,
  solarTerm: SolarTermAnalysis,
  godPalaceSpacetime: SpaceTimeReport['godPalaceSpacetime']
): string[] {
  const warnings: string[] = [];
  
  if (shichen.auspiciousness === '凶') {
    warnings.push(`${shichen.name}時運不佳，重大決策宜緩`);
  }
  
  if (solarTerm.qiStrength === '囚' || solarTerm.qiStrength === '死') {
    warnings.push(`${solarTerm.name}氣運${solarTerm.qiStrength}，諸事宜守不宜攻`);
  }
  
  if (godPalaceSpacetime.timeSuitability === '凶') {
    warnings.push('當前時辰與用神相沖，宜選擇其他時段');
  }
  
  if (godPalaceSpacetime.spaceSuitability === '凶') {
    warnings.push(`當前用神宮位方位不利，宜避開${PALACE_SYMBOLISM[godPalaceSpacetime.palace].direction}方`);
  }
  
  if (godPalaceSpacetime.combinedScore < 30) {
    warnings.push('時空條件整體欠佳，今日大事不宜');
  }
  
  return warnings;
}
