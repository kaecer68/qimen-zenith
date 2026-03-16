/**
 * gRPC 服務器實現
 * 提供奇門遁甲排盤與分析服務
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { resolve } from 'path';
import { getLunarData } from '../lib/lunar-api';
import { calculateDailyQimen, generateQimenAnalysis, analyzePalaceEnhanced, EnhancedPalaceRating } from '../lib/qimen/core';
import { serializePlate, serializeAnalysis } from '../lib/qimen/serialize';
import { calculateHourPillar, isEarlyZiHour } from '../lib/qimen/hourPillar';
import { MatterType } from '../lib/qimen/symbolism';

// 加載 proto 文件
const PROTO_PATH = resolve(__dirname, '../../proto/qimen.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const qimenProto = grpc.loadPackageDefinition(packageDefinition) as any;

// 日期驗證輔助函數
function validateDate(dateStr: string): { valid: boolean; error?: string; date?: Date } {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return { valid: false, error: '日期格式錯誤，請使用 YYYY-MM-DD 格式' };
  }
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { valid: false, error: '無效的日期' };
  }
  
  return { valid: true, date };
}

function validateHour(hour: number): { valid: boolean; error?: string } {
  if (hour < 0 || hour > 23) {
    return { valid: false, error: 'hour 參數無效，請使用 0-23' };
  }
  return { valid: true };
}

// 轉換 MatterType string 到 proto enum
function toProtoMatterType(matterType: string): string {
  const mapping: Record<string, string> = {
    'general': 'MATTER_TYPE_GENERAL',
    'wealth': 'MATTER_TYPE_WEALTH',
    'career': 'MATTER_TYPE_CAREER',
    'travel': 'MATTER_TYPE_TRAVEL',
    'health': 'MATTER_TYPE_HEALTH',
    'relationship': 'MATTER_TYPE_RELATIONSHIP',
    'study': 'MATTER_TYPE_STUDY',
    'lost': 'MATTER_TYPE_LOST',
    'legal': 'MATTER_TYPE_LEGAL',
    'property': 'MATTER_TYPE_PROPERTY',
    'marriage': 'MATTER_TYPE_MARRIAGE',
    'business': 'MATTER_TYPE_BUSINESS',
    'litigation': 'MATTER_TYPE_LITIGATION',
  };
  return mapping[matterType] || 'MATTER_TYPE_UNSPECIFIED';
}

// 轉換 proto enum 到內部 MatterType
function fromProtoMatterType(protoType: string): MatterType {
  const mapping: Record<string, MatterType> = {
    'MATTER_TYPE_GENERAL': 'general',
    'MATTER_TYPE_WEALTH': 'wealth',
    'MATTER_TYPE_CAREER': 'career',
    'MATTER_TYPE_TRAVEL': 'travel',
    'MATTER_TYPE_HEALTH': 'health',
    'MATTER_TYPE_RELATIONSHIP': 'relationship',
    'MATTER_TYPE_STUDY': 'study',
    'MATTER_TYPE_LOST': 'lost',
    'MATTER_TYPE_LEGAL': 'legal',
    'MATTER_TYPE_PROPERTY': 'property',
    'MATTER_TYPE_MARRIAGE': 'marriage',
    'MATTER_TYPE_BUSINESS': 'business',
    'MATTER_TYPE_LITIGATION': 'litigation',
  };
  return mapping[protoType] || 'general';
}

// 序列化盤為 proto 格式
function serializePlateToProto(plate: any) {
  return {
    date: plate.date,
    year_gan_zhi: plate.yearGanZhi,
    month_gan_zhi: plate.monthGanZhi,
    day_gan_zhi: plate.dayGanZhi,
    hour_gan_zhi: plate.hourGanZhi,
    hour: plate.hour || 0,
    shichen: plate.shichen || '',
    ju_number: plate.juNumber,
    is_yang: plate.isYang,
    yin_yang: plate.yinYang,
    solar_term: plate.solarTerm,
    earth_plate: Object.fromEntries(plate.earthPlate),
    heaven_plate: Object.fromEntries(plate.heavenPlate),
    human_plate: Object.fromEntries(plate.humanPlate),
    spirit_plate: Object.fromEntries(plate.spiritPlate),
    stars_plate: Object.fromEntries(plate.starsPlate),
  };
}

// 序列化分析結果為 proto 格式
function serializeAnalysisToProto(analysis: any) {
  const ratings: Record<string, any> = {};
  for (const [key, value] of analysis.palaceRatings.entries()) {
    ratings[key] = {
      level: value.level,
      score: value.score,
      summary: value.summary,
    };
  }
  
  return {
    overall_level: analysis.overallLevel,
    overall_score: analysis.overallScore,
    recommendations: analysis.recommendations,
    palace_ratings: ratings,
    qiyi_analysis: analysis.qiyiAnalysis || [],
    door_star_highlights: analysis.doorStarHighlights || [],
  };
}

// 將增強分析轉換為 proto 格式
function serializeEnhancedToProto(enhanced: EnhancedPalaceRating) {
  const result: any = {
    qiyi_meanings: [],
    door_star_combinations: [],
    door_spirit_combinations: [],
    star_spirit_combinations: [],
    special_patterns: [],
    detailed_advice: [],
  };
  
  if (enhanced.qiyiAnalysis) {
    result.qiyi_meanings.push(
      `${enhanced.qiyiAnalysis.stem}: ${enhanced.qiyiAnalysis.interpretation}`
    );
    result.detailed_advice.push(enhanced.qiyiAnalysis.advice);
  }
  
  if (enhanced.combinationAnalysis) {
    result.door_star_combinations.push(
      `${enhanced.combinationAnalysis.doorInterp}；${enhanced.combinationAnalysis.starInterp}`
    );
    result.door_spirit_combinations.push(enhanced.combinationAnalysis.spiritInterp);
    result.detailed_advice.push(enhanced.combinationAnalysis.advice);
  }
  
  return result;
}

// gRPC 服務實現
const qimenService = {
  // 排盤
  async CalculatePlate(call: any, callback: any) {
    try {
      const { date: dateParam, hour: hourParam, matter_type, liuqin } = call.request;
      
      const now = new Date();
      let hour = hourParam !== undefined ? hourParam : now.getHours();
      
      // 驗證小時
      const hourValidation = validateHour(hour);
      if (!hourValidation.valid) {
        return callback(null, {
          success: false,
          error: hourValidation.error,
          error_code: 'INVALID_HOUR',
        });
      }
      
      // 驗證日期
      const dateStr = dateParam || now.toISOString().split('T')[0];
      const dateValidation = validateDate(dateStr);
      if (!dateValidation.valid) {
        return callback(null, {
          success: false,
          error: dateValidation.error,
          error_code: 'INVALID_DATE',
        });
      }
      
      const date = dateValidation.date!;
      
      // 處理早子時
      let queryDate = dateStr;
      if (isEarlyZiHour(hour)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }
      
      // 獲取曆法數據
      const lunarData = await getLunarData(queryDate);
      
      // 計算時柱
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hour);
      
      // 計算奇門盤
      const plate = calculateDailyQimen(
        date,
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hour
      );
      
      // 轉換為 proto 格式
      const plateProto = serializePlateToProto(serializePlate(plate));
      
      callback(null, {
        success: true,
        plate: plateProto,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (error) {
      console.error('[gRPC] CalculatePlate error:', error);
      const message = error instanceof Error ? error.message : '排盤計算失敗';
      const isLunarError = message.includes('lunar') || message.includes('fetch');
      
      callback(null, {
        success: false,
        error: isLunarError ? '無法連接曆法服務' : message,
        error_code: isLunarError ? 'LUNAR_SERVICE_UNAVAILABLE' : 'CALCULATION_ERROR',
      });
    }
  },
  
  // 分析
  async AnalyzePlate(call: any, callback: any) {
    try {
      const { date: dateParam, hour: hourParam, matter_type, liuqin } = call.request;
      
      const now = new Date();
      let hour = hourParam !== undefined ? hourParam : now.getHours();
      
      // 驗證
      const hourValidation = validateHour(hour);
      if (!hourValidation.valid) {
        return callback(null, {
          success: false,
          error: hourValidation.error,
          error_code: 'INVALID_HOUR',
        });
      }
      
      const dateStr = dateParam || now.toISOString().split('T')[0];
      const dateValidation = validateDate(dateStr);
      if (!dateValidation.valid) {
        return callback(null, {
          success: false,
          error: dateValidation.error,
          error_code: 'INVALID_DATE',
        });
      }
      
      const date = dateValidation.date!;
      
      // 處理早子時
      let queryDate = dateStr;
      if (isEarlyZiHour(hour)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }
      
      // 獲取曆法數據
      const lunarData = await getLunarData(queryDate);
      
      // 計算時柱
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hour);
      
      // 計算奇門盤
      const plate = calculateDailyQimen(
        date,
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hour
      );
      
      // 分析
      const analysis = generateQimenAnalysis(plate);
      
      // 轉換為 proto 格式
      const plateProto = serializePlateToProto(serializePlate(plate));
      const analysisProto = serializeAnalysisToProto(serializeAnalysis(analysis));
      
      callback(null, {
        success: true,
        plate: plateProto,
        analysis: analysisProto,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          mode: 'basic',
        },
      });
    } catch (error) {
      console.error('[gRPC] AnalyzePlate error:', error);
      const message = error instanceof Error ? error.message : '分析計算失敗';
      const isLunarError = message.includes('lunar') || message.includes('fetch');
      
      callback(null, {
        success: false,
        error: isLunarError ? '無法連接曆法服務' : message,
        error_code: isLunarError ? 'LUNAR_SERVICE_UNAVAILABLE' : 'ANALYSIS_ERROR',
      });
    }
  },
  
  // 增強分析
  async AnalyzeEnhanced(call: any, callback: any) {
    try {
      const { date: dateParam, hour: hourParam, matter_type, liuqin } = call.request;
      
      const now = new Date();
      let hour = hourParam !== undefined ? hourParam : now.getHours();
      
      // 驗證
      const hourValidation = validateHour(hour);
      if (!hourValidation.valid) {
        return callback(null, {
          success: false,
          error: hourValidation.error,
          error_code: 'INVALID_HOUR',
        });
      }
      
      const dateStr = dateParam || now.toISOString().split('T')[0];
      const dateValidation = validateDate(dateStr);
      if (!dateValidation.valid) {
        return callback(null, {
          success: false,
          error: dateValidation.error,
          error_code: 'INVALID_DATE',
        });
      }
      
      const date = dateValidation.date!;
      
      // 處理早子時
      let queryDate = dateStr;
      if (isEarlyZiHour(hour)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }
      
      // 獲取曆法數據
      const lunarData = await getLunarData(queryDate);
      
      // 計算時柱
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hour);
      
      // 計算奇門盤
      const plate = calculateDailyQimen(
        date,
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hour
      );
      
      // 分析
      const analysis = generateQimenAnalysis(plate);
      
      // 增強分析
      const enhancedPalaces: Record<string, any> = {};
      for (let i = 1; i <= 9; i++) {
        const enhanced = analyzePalaceEnhanced(i, plate);
        enhancedPalaces[String(i)] = serializeEnhancedToProto(enhanced);
      }
      
      // 轉換為 proto 格式
      const plateProto = serializePlateToProto(serializePlate(plate));
      const analysisProto = serializeAnalysisToProto(serializeAnalysis(analysis));
      
      callback(null, {
        success: true,
        plate: plateProto,
        analysis: analysisProto,
        enhanced: {
          palaces: enhancedPalaces,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
          mode: 'enhanced',
        },
      });
    } catch (error) {
      console.error('[gRPC] AnalyzeEnhanced error:', error);
      const message = error instanceof Error ? error.message : '增強分析失敗';
      const isLunarError = message.includes('lunar') || message.includes('fetch');
      
      callback(null, {
        success: false,
        error: isLunarError ? '無法連接曆法服務' : message,
        error_code: isLunarError ? 'LUNAR_SERVICE_UNAVAILABLE' : 'ENHANCED_ANALYSIS_ERROR',
      });
    }
  },
  
  // 健康檢查
  Health(call: any, callback: any) {
    callback(null, {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  },
};

// 啟動 gRPC 服務器
export function startGrpcServer(port: number = 50051): grpc.Server {
  const server = new grpc.Server();
  server.addService(qimenProto.qimen.QimenService.service, qimenService);
  
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, boundPort: number) => {
      if (err) {
        console.error('[gRPC] Failed to start server:', err);
        return;
      }
      console.log(`[gRPC] Server running at 0.0.0.0:${boundPort}`);
    }
  );
  
  return server;
}

// 如果直接運行此文件
if (require.main === module) {
  const port = parseInt(process.env.GRPC_PORT || '50051', 10);
  startGrpcServer(port);
}
