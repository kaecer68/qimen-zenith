/**
 * 奇門盤序列化工具
 * 將 QimenPlate 中的 Map 結構轉為 JSON 可序列化的格式
 */

import type { QimenPlate, QimenAnalysisResult, EnhancedPalaceRating } from './core';

/** JSON 序列化版的奇門盤 */
export interface QimenPlateJSON {
  date: string;
  yearGanZhi: string;
  monthGanZhi: string;
  dayGanZhi: string;
  hourGanZhi: string;
  juNumber: number;
  isYang: boolean;
  yinYang: string;
  solarTerm: string;
  earthPlate: Record<string, string>;
  heavenPlate: Record<string, string>;
  humanPlate: Record<string, string>;
  spiritPlate: Record<string, string>;
  starsPlate: Record<string, string>;
}

/** JSON 序列化版的分析結果 */
export interface QimenAnalysisJSON {
  palaceRatings: Record<string, {
    level: string;
    score: number;
    summary: string;
    detail?: string;
  }>;
  matters: QimenAnalysisResult['matters'];
  overall: QimenAnalysisResult['overall'];
}

/** JSON 序列化版的增強分析 */
export interface EnhancedAnalysisJSON {
  palaces: Record<string, EnhancedPalaceRating>;
}

/** 將 QimenPlate 轉為 JSON 格式 */
export function serializePlate(plate: QimenPlate): QimenPlateJSON {
  return {
    date: plate.date,
    yearGanZhi: plate.yearGanZhi,
    monthGanZhi: plate.monthGanZhi,
    dayGanZhi: plate.dayGanZhi,
    hourGanZhi: plate.hourGanZhi,
    juNumber: plate.juNumber,
    isYang: plate.isYang,
    yinYang: plate.yinYang,
    solarTerm: plate.solarTerm,
    earthPlate: Object.fromEntries(plate.earthPlate),
    heavenPlate: Object.fromEntries(plate.heavenPlate),
    humanPlate: Object.fromEntries(plate.humanPlate),
    spiritPlate: Object.fromEntries(plate.spiritPlate),
    starsPlate: Object.fromEntries(plate.starsPlate),
  };
}

/** 將分析結果轉為 JSON 格式 */
export function serializeAnalysis(result: QimenAnalysisResult): QimenAnalysisJSON {
  return {
    palaceRatings: Object.fromEntries(
      Array.from(result.palaceRatings.entries()).map(([k, v]) => [String(k), v])
    ),
    matters: result.matters,
    overall: result.overall,
  };
}
