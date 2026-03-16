/**
 * 宮位生剋關係分析系統
 * 分析九宮之間的五行相生相剋關係
 */

import { QimenPlate, PalaceRating, calculatePalaceRating } from './core';
import { PALACE_SYMBOLISM, MatterType, MATTER_CONFIG } from './symbolism';

/**
 * 五行元素
 */
export type FiveElement = '金' | '木' | '水' | '火' | '土';

/**
 * 生剋關係類型
 */
export type RelationType = '生' | '剋' | '被生' | '被剋' | '比和';

/**
 * 宮位生剋分析結果
 */
export interface PalaceRelation {
  /** 目標宮位 */
  targetPalace: number;
  /** 目標宮位名稱 */
  targetName: string;
  /** 關係類型 */
  relation: RelationType;
  /** 生剋強度 (-3 到 +3) */
  strength: number;
  /** 關係描述 */
  description: string;
  /** 吉凶影響 */
  effect: '吉' | '平' | '凶';
}

/**
 * 單宮生剋分析
 */
export interface PalaceKzAnalysis {
  /** 宮位編號 */
  palace: number;
  /** 宮位名稱 */
  palaceName: string;
  /** 本宮五行 */
  element: FiveElement;
  /** 生我者（來生我的宮位） */
  shengWo: PalaceRelation[];
  /** 我生者（我去生的宮位） */
  woSheng: PalaceRelation[];
  /** 剋我者（來剋我的宮位） */
  keWo: PalaceRelation[];
  /** 我剋者（我去剋的宮位） */
  woKe: PalaceRelation[];
  /** 比和（同五行） */
  biHe: PalaceRelation[];
  /** 綜合評分 */
  score: number;
  /** 綜合評語 */
  summary: string;
}

/**
 * 五行相生：木→火→土→金→水→木
 */
const SHENG_CYCLE: Record<FiveElement, FiveElement> = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木',
};

/**
 * 五行相剋：木剋土，土剋水，水剋火，火剋金，金剋木
 */
const KE_CYCLE: Record<FiveElement, FiveElement> = {
  '木': '土',
  '土': '水',
  '水': '火',
  '火': '金',
  '金': '木',
};

/**
 * 五行強度權重
 */
const ELEMENT_STRENGTH: Record<FiveElement, number> = {
  '金': 1,
  '木': 1,
  '水': 1,
  '火': 1,
  '土': 1,
};

/**
 * 計算兩個宮位的生剋關係
 */
export function calculateRelation(
  fromPalace: number,
  toPalace: number
): PalaceRelation | null {
  const fromInfo = PALACE_SYMBOLISM[fromPalace];
  const toInfo = PALACE_SYMBOLISM[toPalace];
  
  if (!fromInfo || !toInfo) return null;
  
  const fromElement = fromInfo.element as FiveElement;
  const toElement = toInfo.element as FiveElement;
  
  // 比和（同五行）
  if (fromElement === toElement) {
    return {
      targetPalace: toPalace,
      targetName: toInfo.name,
      relation: '比和',
      strength: 1,
      description: `${fromInfo.name}（${fromElement}）與${toInfo.name}（${toElement}）比和，氣場相合`,
      effect: '平',
    };
  }
  
  // 生對方
  if (SHENG_CYCLE[fromElement] === toElement) {
    return {
      targetPalace: toPalace,
      targetName: toInfo.name,
      relation: '生',
      strength: 2,
      description: `${fromInfo.name}（${fromElement}）生${toInfo.name}（${toElement}），我生之為泄氣`,
      effect: '平',
    };
  }
  
  // 被對方生
  if (SHENG_CYCLE[toElement] === fromElement) {
    return {
      targetPalace: toPalace,
      targetName: toInfo.name,
      relation: '被生',
      strength: 2,
      description: `${toInfo.name}（${toElement}）生${fromInfo.name}（${fromElement}），生我者為父母`,
      effect: '吉',
    };
  }
  
  // 剋對方
  if (KE_CYCLE[fromElement] === toElement) {
    return {
      targetPalace: toPalace,
      targetName: toInfo.name,
      relation: '剋',
      strength: 2,
      description: `${fromInfo.name}（${fromElement}）剋${toInfo.name}（${toElement}），我剋之為妻財`,
      effect: '平',
    };
  }
  
  // 被對方剋
  if (KE_CYCLE[toElement] === fromElement) {
    return {
      targetPalace: toPalace,
      targetName: toInfo.name,
      relation: '被剋',
      strength: -2,
      description: `${toInfo.name}（${toElement}）剋${fromInfo.name}（${fromElement}），剋我者為官鬼`,
      effect: '凶',
    };
  }
  
  return null;
}

/**
 * 分析單宮的生剋關係
 */
export function analyzePalaceKz(palaceIndex: number): PalaceKzAnalysis {
  const palaceInfo = PALACE_SYMBOLISM[palaceIndex];
  const element = palaceInfo.element as FiveElement;
  
  const shengWo: PalaceRelation[] = [];
  const woSheng: PalaceRelation[] = [];
  const keWo: PalaceRelation[] = [];
  const woKe: PalaceRelation[] = [];
  const biHe: PalaceRelation[] = [];
  
  // 分析與其他八宮的關係
  for (let i = 1; i <= 9; i++) {
    if (i === palaceIndex) continue;
    if (i === 5) continue; // 中宮特殊處理
    
    const relation = calculateRelation(palaceIndex, i);
    if (!relation) continue;
    
    switch (relation.relation) {
      case '被生':
        shengWo.push(relation);
        break;
      case '生':
        woSheng.push(relation);
        break;
      case '被剋':
        keWo.push(relation);
        break;
      case '剋':
        woKe.push(relation);
        break;
      case '比和':
        biHe.push(relation);
        break;
    }
  }
  
  // 計算綜合評分
  let score = 50; // 基準分
  shengWo.forEach(r => score += r.strength * 3);
  woSheng.forEach(r => score += r.strength * 1);
  keWo.forEach(r => score += r.strength * 3);
  woKe.forEach(r => score += r.strength * 2);
  biHe.forEach(r => score += r.strength * 1);
  
  score = Math.max(0, Math.min(100, score));
  
  // 生成評語
  const summary = generateKzSummary(
    palaceInfo.name,
    element,
    shengWo.length,
    keWo.length,
    woSheng.length,
    woKe.length
  );
  
  return {
    palace: palaceIndex,
    palaceName: palaceInfo.name,
    element,
    shengWo,
    woSheng,
    keWo,
    woKe,
    biHe,
    score,
    summary,
  };
}

/**
 * 分析用神宮位與其他宮位的生剋關係
 */
export function analyzeGodPalaceRelations(
  plate: QimenPlate,
  godPalace: number,
  matterType: MatterType
): {
  /** 有利宮位（來生我或我剋之宮） */
  beneficial: PalaceRelation[];
  /** 不利宮位（來剋我或我生之宮泄氣） */
  harmful: PalaceRelation[];
  /** 中性宮位（比和） */
  neutral: PalaceRelation[];
  /** 綜合建議 */
  recommendations: string[];
} {
  const analysis = analyzePalaceKz(godPalace);
  
  // 有利宮位：來生我（被生）+ 我去剋（妻財）
  const beneficial = [
    ...analysis.shengWo,
    ...analysis.woKe,
  ];
  
  // 不利宮位：來剋我（官鬼）+ 我生之（泄氣）
  const harmful = [
    ...analysis.keWo,
    ...analysis.woSheng,
  ];
  
  // 中性：比和
  const neutral = analysis.biHe;
  
  // 生成建議
  const recommendations: string[] = [];
  
  const matterName = MATTER_CONFIG[matterType].name;
  
  if (beneficial.length > 0) {
    const palaceNames = beneficial.map(b => b.targetName).join('、');
    recommendations.push(`有利方位：${palaceNames}，${matterName}宜向此方發展`);
  }
  
  if (harmful.length > 0) {
    const palaceNames = harmful.map(h => h.targetName).join('、');
    recommendations.push(`不利方位：${palaceNames}，${matterName}宜避開此方`);
  }
  
  if (analysis.keWo.length > 0) {
    recommendations.push('用神宮位能剋制其他宮位，表示能掌控局面');
  }
  
  if (analysis.shengWo.length > 0) {
    recommendations.push('有其他宮位生助，表示得外力支持');
  }
  
  if (analysis.keWo.length === 0 && analysis.woKe.length === 0) {
    recommendations.push('生剋關係平和，宜穩健行事');
  }
  
  return {
    beneficial,
    harmful,
    neutral,
    recommendations,
  };
}

/**
 * 生成生剋評語
 */
function generateKzSummary(
  palaceName: string,
  element: FiveElement,
  shengWoCount: number,
  keWoCount: number,
  woShengCount: number,
  woKeCount: number
): string {
  const parts: string[] = [];
  
  parts.push(`${palaceName}屬${element}`);
  
  if (shengWoCount > 0) {
    parts.push(`得${shengWoCount}宮生助`);
  }
  
  if (keWoCount > 0) {
    parts.push(`受${keWoCount}宮剋制`);
  }
  
  if (woShengCount > 0) {
    parts.push(`泄氣於${woShengCount}宮`);
  }
  
  if (woKeCount > 0) {
    parts.push(`剋制${woKeCount}宮`);
  }
  
  // 綜合判斷
  if (shengWoCount > keWoCount) {
    parts.push('整體氣場較旺');
  } else if (keWoCount > shengWoCount) {
    parts.push('整體氣場受制');
  } else {
    parts.push('氣場平和');
  }
  
  return parts.join('，');
}

/**
 * 分析九宮整體生剋格局
 */
export function analyzeOverallKzPattern(plate: QimenPlate): {
  /** 最旺宮位 */
  strongest: number;
  /** 最弱宮位 */
  weakest: number;
  /** 生剋平衡度 */
  balance: '平衡' | '偏旺' | '偏弱';
  /** 整體評語 */
  summary: string;
} {
  // 計算所有宮位的生剋評分
  const scores: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    if (i === 5) continue; // 中宮暫不計算
    const analysis = analyzePalaceKz(i);
    scores[i] = analysis.score;
  }
  
  // 找出最旺和最弱
  let strongest = 1;
  let weakest = 1;
  let maxScore = scores[1];
  let minScore = scores[1];
  
  for (let i = 2; i <= 9; i++) {
    if (i === 5) continue;
    if (scores[i] > maxScore) {
      maxScore = scores[i];
      strongest = i;
    }
    if (scores[i] < minScore) {
      minScore = scores[i];
      weakest = i;
    }
  }
  
  // 計算平衡度
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
  const variance = Object.values(scores).reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / Object.keys(scores).length;
  
  let balance: '平衡' | '偏旺' | '偏弱';
  if (variance < 100) {
    balance = '平衡';
  } else if (avgScore > 50) {
    balance = '偏旺';
  } else {
    balance = '偏弱';
  }
  
  const strongPalace = PALACE_SYMBOLISM[strongest];
  const weakPalace = PALACE_SYMBOLISM[weakest];
  
  const summary = `整體生剋${balance}，${strongPalace.name}最旺（${maxScore}分），${weakPalace.name}最弱（${minScore}分）`;
  
  return {
    strongest,
    weakest,
    balance,
    summary,
  };
}

/**
 * 比較兩個宮位
 */
export function comparePalaces(
  palaceA: number,
  palaceB: number
): {
  /** 宮位A資訊 */
  palaceAInfo: { name: string; element: FiveElement };
  /** 宮位B資訊 */
  palaceBInfo: { name: string; element: FiveElement };
  /** 關係描述 */
  relation: string;
  /** 吉凶 */
  effect: '吉' | '平' | '凶';
  /** 建議 */
  advice: string;
} {
  const infoA = PALACE_SYMBOLISM[palaceA];
  const infoB = PALACE_SYMBOLISM[palaceB];
  
  const elementA = infoA.element as FiveElement;
  const elementB = infoB.element as FiveElement;
  
  const relation = calculateRelation(palaceA, palaceB);
  
  let advice = '';
  if (relation?.relation === '生') {
    advice = `${infoA.name}對${infoB.name}有助益，合作順利`;
  } else if (relation?.relation === '被生') {
    advice = `${infoB.name}對${infoA.name}有助益，可得支持`;
  } else if (relation?.relation === '剋') {
    advice = `${infoA.name}能掌控${infoB.name}，主動權在我`;
  } else if (relation?.relation === '被剋') {
    advice = `${infoA.name}受${infoB.name}制約，宜謹慎應對`;
  } else {
    advice = '兩宮比和，合作平和';
  }
  
  return {
    palaceAInfo: { name: infoA.name, element: elementA },
    palaceBInfo: { name: infoB.name, element: elementB },
    relation: relation?.description || '無特殊關係',
    effect: relation?.effect || '平',
    advice,
  };
}
