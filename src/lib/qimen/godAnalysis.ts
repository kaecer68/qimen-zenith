/**
 * 用神分析系統（進階）
 * 根據問事類型自動分析用神宮位的深度吉凶
 */

import { QimenPlate, PalaceRating, calculatePalaceRating } from './core';
import { 
  MatterType, 
  MATTER_CONFIG, 
  LIUQIN_RELATIONS, 
  PALACE_SYMBOLISM,
  getMatterPalace 
} from './symbolism';
import { analyzeCombination } from './combinationKnowledge';
import { getStemInfo, isOddity, getQiyiCombination } from './qiyiKnowledge';

/**
 * 用神分析結果
 */
export interface GodAnalysis {
  /** 用神宮位 */
  palace: number;
  /** 宮位名稱 */
  palaceName: string;
  /** 問事類型 */
  matterType: MatterType;
  /** 用神描述 */
  godDescription: string;
  /** 吉凶等級 */
  level: PalaceRating['level'];
  /** 分數 */
  score: number;
  /** 綜合評語 */
  summary: string;
  /** 詳細分析 */
  details: {
    /** 八門分析 */
    door: string | null;
    doorAnalysis: string;
    doorSuitability: '吉' | '平' | '凶';
    /** 九星分析 */
    star: string | null;
    starAnalysis: string;
    /** 八神分析 */
    spirit: string | null;
    spiritAnalysis: string;
    /** 天盤干分析 */
    heavenStem: string | null;
    heavenStemAnalysis: string;
    /** 三奇六儀特殊標記 */
    hasOddity: boolean;
    oddityEffect: string;
  };
  /** 針對問事類型的具體建議 */
  matterAdvice: string[];
  /** 時間因素 */
  timing: {
    season: string;
    suitability: '吉' | '平' | '凶';
    reason: string;
  };
  /** 方位建議 */
  direction: {
    direction: string;
    trigram: string;
    suitability: '吉' | '平' | '凶';
    advice: string;
  };
  /** 綜合建議 */
  recommendations: string[];
  /** 注意事項 */
  warnings: string[];
}

/**
 * 執行用神分析
 */
export function analyzeGod(
  plate: QimenPlate,
  matterType: MatterType,
  liuqin?: string
): GodAnalysis {
  // 獲取用神宮位
  const humanPlate = Object.fromEntries(plate.humanPlate);
  const starsPlate = Object.fromEntries(plate.starsPlate);
  const spiritPlate = Object.fromEntries(plate.spiritPlate);
  const heavenPlate = Object.fromEntries(plate.heavenPlate);
  
  const matterPalace = getMatterPalace(matterType, { humanPlate, starsPlate });
  let palace = matterPalace.palace;
  
  // 如果沒找到用神且提供了六親，使用六親宮位
  if (palace === 0 && liuqin) {
    const relation = LIUQIN_RELATIONS.find(r => r.key === liuqin);
    if (relation) {
      palace = relation.palace;
    }
  }
  
  // 如果還是沒找到，使用中宮
  if (palace === 0 || palace === 5) {
    palace = 5;
  }
  
  const palaceInfo = PALACE_SYMBOLISM[palace];
  const door = humanPlate[palace] || null;
  const star = starsPlate[palace] || null;
  const spirit = spiritPlate[palace] || null;
  const heavenStem = heavenPlate[palace] || null;
  
  // 基礎評級
  const baseRating = calculatePalaceRating(
    palace, 
    star || undefined, 
    door || undefined, 
    spirit || undefined, 
    heavenStem || undefined
  );
  
  // 詳細分析各元素
  const doorAnalysis = analyzeDoorForMatter(door, matterType);
  const starAnalysis = analyzeStarForMatter(star, matterType);
  const spiritAnalysis = analyzeSpiritForMatter(spirit, matterType);
  const heavenStemAnalysis = analyzeHeavenStemForMatter(heavenStem, matterType);
  
  // 檢查三奇
  const hasOddity = heavenStem ? isOddity(heavenStem) : false;
  const oddityEffect = hasOddity && heavenStem
    ? `天盤${heavenStem}為三奇之一，大利${MATTER_CONFIG[matterType].name}`
    : '';
  
  // 生成針對問事的建議
  const matterAdvice = generateMatterAdvice(matterType, baseRating.level, door, star, spirit);
  
  // 時間因素分析
  const timing = analyzeTiming(palace, plate.solarTerm, palaceInfo.season);
  
  // 方位分析
  const direction = analyzeDirection(palace, palaceInfo);
  
  // 生成綜合建議
  const recommendations = generateRecommendations(
    matterType, 
    baseRating.level, 
    door, 
    star, 
    spirit, 
    hasOddity
  );
  
  // 生成警告
  const warnings = generateWarnings(matterType, baseRating.level, door, spirit);
  
  return {
    palace,
    palaceName: palaceInfo.name,
    matterType,
    godDescription: matterPalace.description,
    level: baseRating.level,
    score: baseRating.score,
    summary: generateGodSummary(matterType, palace, baseRating, door, star, spirit, hasOddity),
    details: {
      door,
      doorAnalysis: doorAnalysis.interpretation,
      doorSuitability: doorAnalysis.suitability,
      star,
      starAnalysis: starAnalysis,
      spirit,
      spiritAnalysis: spiritAnalysis,
      heavenStem,
      heavenStemAnalysis,
      hasOddity,
      oddityEffect,
    },
    matterAdvice,
    timing,
    direction,
    recommendations,
    warnings,
  };
}

/**
 * 分析八門對問事的適合度
 */
function analyzeDoorForMatter(
  door: string | null, 
  matterType: MatterType
): { interpretation: string; suitability: '吉' | '平' | '凶' } {
  if (!door) return { interpretation: '無門星', suitability: '平' };
  
  const matterConfig = MATTER_CONFIG[matterType];
  
  // 檢查是否是用神門
  if (door === matterConfig.primaryDoor) {
    return { 
      interpretation: `${door}為用神，大利${matterConfig.name}`, 
      suitability: '吉' 
    };
  }
  
  if (door === matterConfig.secondaryDoor) {
    return { 
      interpretation: `${door}為次要用神，有助${matterConfig.name}`, 
      suitability: '吉' 
    };
  }
  
  // 根據門的吉凶屬性
  const luckyDoors = ['休門', '生門', '開門'];
  const unluckyDoors = ['死門', '驚門', '傷門'];
  const neutralDoors = ['杜門', '景門'];
  
  if (luckyDoors.includes(door)) {
    return { interpretation: `${door}為吉門，有利進行`, suitability: '吉' };
  }
  if (unluckyDoors.includes(door)) {
    return { interpretation: `${door}為凶門，宜守不宜攻`, suitability: '凶' };
  }
  return { interpretation: `${door}為平門，平平而論`, suitability: '平' };
}

/**
 * 分析九星對問事的影響
 */
function analyzeStarForMatter(star: string | null, matterType: MatterType): string {
  if (!star) return '無星';
  
  const starMeanings: Record<string, Record<string, string>> = {
    '天蓬': {
      'general': '智慧之星，宜謀劃',
      'wealth': '財運尚可，宜謀求',
      'career': '職場多變，宜靈活應對',
    },
    '天任': {
      'general': '任勞任怨，宜穩健',
      'wealth': '財運穩定，宜積累',
      'career': '事業穩步，宜守成',
    },
    '天沖': {
      'general': '沖動之星，宜快不宜慢',
      'wealth': '財來快也去快',
      'career': '升遷快速，宜把握',
    },
    '天輔': {
      'general': '輔助之星，貴人相助',
      'wealth': '財運有輔，宜合作',
      'career': '貴人提攜，大利',
      'study': '文昌之星，考試大吉',
    },
    '天英': {
      'general': '英華之星，宜文宜武',
      'wealth': '虛名之財',
      'career': '名氣上升',
    },
    '天芮': {
      'general': '病符之星，宜謹慎',
      'health': '病星臨宮，注意健康',
      'wealth': '財運受阻',
    },
    '天柱': {
      'general': '破壞之星，宜守成',
      'wealth': '財運動盪',
      'career': '職場不穩',
    },
    '天心': {
      'general': '智慧之星，大吉',
      'wealth': '財運亨通',
      'career': '升遷大吉',
      'health': '病癒之星，大利',
    },
    '天禽': {
      'general': '中央之星，平和',
    },
  };
  
  const specific = starMeanings[star]?.[matterType];
  const general = starMeanings[star]?.['general'];
  return specific || general || `${star}臨宮`;
}

/**
 * 分析八神對問事的影響
 */
function analyzeSpiritForMatter(spirit: string | null, matterType: MatterType): string {
  if (!spirit) return '無神';
  
  const spiritMeanings: Record<string, Record<string, string>> = {
    '值符': {
      'general': '貴人護佑，諸事皆宜',
      'career': '領導賞識，升遷有望',
      'wealth': '正財亨通',
    },
    '螣蛇': {
      'general': '虛驚不安，防小人',
      'wealth': '財運反覆',
      'career': '職場多變故',
    },
    '太陰': {
      'general': '陰柔助力，暗中相助',
      'wealth': '暗財可期',
      'career': '暗中得助',
    },
    '六合': {
      'general': '合作大吉，人際和合',
      'wealth': '合作生財',
      'relationship': '感情和合',
    },
    '白虎': {
      'general': '血光之災，宜防意外',
      'health': '注意血光',
      'legal': '官非易起',
    },
    '玄武': {
      'general': '暗中隱蔽，防盜防騙',
      'wealth': '防財物損失',
    },
    '九地': {
      'general': '穩固防守，不宜妄動',
      'wealth': '守財為上',
    },
    '九天': {
      'general': '高飛遠舉，大利出行',
      'career': '志向高遠',
    },
  };
  
  const specific = spiritMeanings[spirit]?.[matterType];
  const general = spiritMeanings[spirit]?.['general'];
  return specific || general || `${spirit}臨宮`;
}

/**
 * 分析天盤干對問事的影響
 */
function analyzeHeavenStemForMatter(stem: string | null, matterType: MatterType): string {
  if (!stem) return '無干';
  
  // 三奇優先
  if (isOddity(stem)) {
    return `${stem}為三奇，大利${MATTER_CONFIG[matterType].name}`;
  }
  
  // 六儀分析
  const stemInfo = getStemInfo(stem);
  return stemInfo?.interpretation || `${stem}臨宮`;
}

/**
 * 分析時間因素
 */
function analyzeTiming(
  palace: number, 
  solarTerm: string, 
  palaceSeason: string
): GodAnalysis['timing'] {
  // 簡化的季節對應分析
  const termToSeason: Record<string, string> = {
    '立春': '春', '雨水': '春', '驚蟄': '春', '春分': '春', '清明': '春', '谷雨': '春',
    '立夏': '夏', '小滿': '夏', '芒種': '夏', '夏至': '夏', '小暑': '夏', '大暑': '夏',
    '立秋': '秋', '處暑': '秋', '白露': '秋', '秋分': '秋', '寒露': '秋', '霜降': '秋',
    '立冬': '冬', '小雪': '冬', '大雪': '冬', '冬至': '冬', '小寒': '冬', '大寒': '冬',
  };
  
  const currentSeason = termToSeason[solarTerm] || '四季';
  const isMatch = palaceSeason.includes(currentSeason);
  
  if (isMatch) {
    return {
      season: palaceSeason,
      suitability: '吉',
      reason: `當前${solarTerm}，${palaceSeason}當令，氣運旺盛`,
    };
  }
  
  return {
    season: palaceSeason,
    suitability: '平',
    reason: `當前${solarTerm}，${palaceSeason}休囚，氣運平平`,
  };
}

/**
 * 分析方位建議
 */
function analyzeDirection(
  palace: number, 
  palaceInfo: typeof PALACE_SYMBOLISM[number]
): GodAnalysis['direction'] {
  const directions: Record<string, '吉' | '平' | '凶'> = {
    '乾': '吉', '坤': '吉', '震': '平', '巽': '吉',
    '坎': '平', '離': '平', '艮': '平', '兌': '平',
    '中': '吉',
  };
  
  const suitability = directions[palaceInfo.trigram] || '平';
  
  return {
    direction: palaceInfo.direction,
    trigram: palaceInfo.trigram,
    suitability,
    advice: suitability === '吉' 
      ? `宜向${palaceInfo.direction}方行動，${palaceInfo.trigram}卦當令`
      : `向${palaceInfo.direction}方平平，宜守不宜攻`,
  };
}

/**
 * 生成用神分析摘要
 */
function generateGodSummary(
  matterType: MatterType,
  palace: number,
  rating: PalaceRating,
  door: string | null,
  star: string | null,
  spirit: string | null,
  hasOddity: boolean
): string {
  const matterName = MATTER_CONFIG[matterType].name;
  const palaceName = PALACE_SYMBOLISM[palace]?.name || `第${palace}宮`;
  
  let summary = `${matterName}用神在${palaceName}，${rating.summary}`;
  
  if (door) {
    summary += `。${door}臨宮`;
  }
  if (hasOddity) {
    summary += '，有三奇護佑';
  }
  if (star) {
    summary += `，${star}照臨`;
  }
  
  return summary;
}

/**
 * 生成針對問事的具體建議
 */
function generateMatterAdvice(
  matterType: MatterType,
  level: PalaceRating['level'],
  door: string | null,
  star: string | null,
  spirit: string | null
): string[] {
  const advice: string[] = [];
  
  // 基於吉凶等級的基礎建議
  if (level === '大吉' || level === '吉') {
    advice.push('當前時機有利，宜把握機遇積極行動');
  } else if (level === '平') {
    advice.push('時機平平，宜守成觀望，不可冒進');
  } else {
    advice.push('當前時機不利，宜韜光養晦，靜待時機');
  }
  
  // 針對不同問事類型的建議
  const matterSpecific: Record<MatterType, string[]> = {
    'general': ['整體運勢可參照用神宮位分析'],
    'wealth': [
      '財運看生門與天任星',
      level === '吉' ? '宜積極投資理財' : '宜保守理財，防破財',
    ],
    'career': [
      '官運看開門與天心星',
      level === '吉' ? '宜主動爭取表現機會' : '宜穩紮穩打，不可躁進',
    ],
    'travel': [
      '出行看景門與天英星',
      level === '吉' ? '出行順利，可放心前往' : '出行宜謹慎，選擇良辰',
    ],
    'health': [
      '健康看死門與天芮星',
      level === '吉' ? '身體康健，病癒有望' : '注意養生，及時就醫',
    ],
    'relationship': [
      '人際看休門與六合',
      level === '吉' ? '人緣和合，貴人相助' : '人際平平，宜主動維護',
    ],
    'study': [
      '學業看景門與天輔星',
      level === '吉' ? '文昌高照，學業精進' : '宜加倍努力，不可懈怠',
    ],
    'lost': [
      '失物看杜門',
      level === '吉' ? '失物可尋，宜往用神方位尋找' : '失物難尋，宜放棄',
    ],
    'legal': [
      '官非看驚門',
      level === '吉' ? '官司有解，宜和解' : '官司纏身，宜請專業協助',
    ],
    'property': [
      '田宅看死門與生門',
      level === '吉' ? '房產交易順利' : '房產事宜宜緩',
    ],
    'marriage': [
      '婚姻看休門與六合',
      level === '吉' ? '姻緣和合，宜談婚論嫁' : '感情多波折，宜耐心經營',
    ],
    'business': [
      '生意看生門與開門',
      level === '吉' ? '商機良好，宜擴展' : '商業保守為上',
    ],
    'litigation': [
      '爭訟看驚門與傷門',
      level === '吉' ? '爭端可解' : '爭端難解，宜退一步',
    ],
  };
  
  advice.push(...(matterSpecific[matterType] || []));
  
  return advice.slice(0, 4); // 限制建議數量
}

/**
 * 生成綜合建議
 */
function generateRecommendations(
  matterType: MatterType,
  level: PalaceRating['level'],
  door: string | null,
  star: string | null,
  spirit: string | null,
  hasOddity: boolean
): string[] {
  const recommendations: string[] = [];
  
  if (hasOddity) {
    recommendations.push('有三奇臨宮，可大膽行事');
  }
  
  if (spirit === '值符') {
    recommendations.push('值符護佑，可求助貴人');
  }
  
  if (spirit === '六合') {
    recommendations.push('六合臨宮，宜合作共贏');
  }
  
  if (star === '天輔') {
    recommendations.push('天輔星照，宜學習進修');
  }
  
  if (level === '大吉' || level === '吉') {
    recommendations.push('吉神護佑，諸事皆宜');
  }
  
  return recommendations;
}

/**
 * 生成注意事項/警告
 */
function generateWarnings(
  matterType: MatterType,
  level: PalaceRating['level'],
  door: string | null,
  spirit: string | null
): string[] {
  const warnings: string[] = [];
  
  if (level === '凶' || level === '大凶') {
    warnings.push('當前時運不濟，重大決策宜緩');
  }
  
  if (spirit === '螣蛇') {
    warnings.push('螣蛇臨宮，防小人暗算');
  }
  
  if (spirit === '白虎') {
    warnings.push('白虎臨宮，注意血光之災');
  }
  
  if (spirit === '玄武') {
    warnings.push('玄武臨宮，防盜防騙');
  }
  
  if (door === '死門' && matterType !== 'health' && matterType !== 'property') {
    warnings.push('死門臨宮，大事不宜');
  }
  
  if (door === '驚門' && matterType !== 'legal' && matterType !== 'litigation') {
    warnings.push('驚門臨宮，防口舌是非');
  }
  
  return warnings;
}

/**
 * 批量分析多個用神
 * 用於綜合分析報告
 */
export function analyzeMultipleGods(
  plate: QimenPlate,
  matterTypes: MatterType[]
): Record<string, GodAnalysis> {
  const results: Record<string, GodAnalysis> = {};
  
  for (const type of matterTypes) {
    results[type] = analyzeGod(plate, type);
  }
  
  return results;
}
