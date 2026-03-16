/**
 * gRPC 服務實作
 * 使用 @grpc/grpc-js 與 @grpc/proto-loader
 */

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';
import { getLunarData } from '@/lib/lunar-api';
import { calculateDailyQimen, generateQimenAnalysis, analyzePalaceEnhanced } from '@/lib/qimen/core';
import { serializePlate, serializeAnalysis } from '@/lib/qimen/serialize';
import { calculateHourPillar, isEarlyZiHour } from '@/lib/qimen/hourPillar';
import { TEACHING_SECTIONS, getTeachingSection } from '@/lib/qimen/teaching';
import { CASE_STUDIES, getCaseStudyById } from '@/lib/qimen/caseStudies';
import { QIMEN_PATTERNS, getPatternById, PatternType as PatternTypeEnum } from '@/lib/qimen/patterns';

// 載入 protobuf
const PROTO_PATH = path.join(__dirname, '../../proto/qimen.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const proto = grpc.loadPackageDefinition(packageDefinition) as any;
const qimenPackage = proto.qimen;

// 輔助函數：轉換 MatterType
function toMatterTypeProto(type: string): number {
  const map: Record<string, number> = {
    general: 1, wealth: 2, career: 3, travel: 4, health: 5,
    relationship: 6, study: 7, lost: 8, legal: 9,
    property: 10, marriage: 11, business: 12, litigation: 13,
  };
  return map[type] || 1;
}

// 輔助函數：轉換 PatternType
function toPatternTypeProto(type: PatternTypeEnum): number {
  const map: Record<PatternTypeEnum, number> = {
    auspicious: 1, inauspicious: 2, special: 3, combination: 4,
  };
  return map[type] || 0;
}

// gRPC 服務實作
const qimenServiceImpl = {
  // 排盤計算
  CalculatePlate: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    try {
      const { date, hour } = call.request;
      const now = new Date();
      const dateStr = date || now.toISOString().split('T')[0];
      const hourNum = hour ?? now.getHours();

      // 處理早子時
      let queryDate = dateStr;
      if (isEarlyZiHour(hourNum)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }

      const lunarData = await getLunarData(queryDate);
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hourNum);

      const plate = calculateDailyQimen(
        new Date(queryDate),
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hourNum
      );

      const result = serializePlate(plate);

      callback(null, {
        success: true,
        plate: {
          date: result.date,
          year_gan_zhi: result.yearGanZhi,
          month_gan_zhi: result.monthGanZhi,
          day_gan_zhi: result.dayGanZhi,
          hour_gan_zhi: result.hourGanZhi,
          hour: result.hour,
          shichen: result.shichen,
          ju_number: result.juNumber,
          is_yang: result.isYang,
          yin_yang: result.yinYang,
          solar_term: result.solarTerm,
          earth_plate: result.earthPlate,
          heaven_plate: result.heavenPlate,
          human_plate: result.humanPlate,
          spirit_plate: result.spiritPlate,
          stars_plate: result.starsPlate,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '計算失敗';
      callback(null, { success: false, error: message, code: 'CALCULATION_ERROR' });
    }
  },

  // 分析
  AnalyzePlate: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    try {
      const { date, hour } = call.request;
      const now = new Date();
      const dateStr = date || now.toISOString().split('T')[0];
      const hourNum = hour ?? now.getHours();

      let queryDate = dateStr;
      if (isEarlyZiHour(hourNum)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }

      const lunarData = await getLunarData(queryDate);
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hourNum);

      const plate = calculateDailyQimen(
        new Date(queryDate),
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hourNum
      );

      const analysis = generateQimenAnalysis(plate);

      callback(null, {
        success: true,
        plate: { /* simplified */ },
        analysis: {
          overall_trend: analysis.overall.trend,
          overall_strategy: analysis.overall.strategy,
          overall_summary: analysis.overall.summary,
          best_direction: analysis.overall.bestDirection,
          palace_ratings: Object.fromEntries(
            Array.from(analysis.palaceRatings.entries()).map(([k, v]) => [
              String(k),
              { level: v.level, score: v.score, summary: v.summary },
            ])
          ),
          matters: analysis.matters,
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '分析失敗';
      callback(null, { success: false, error: message, code: 'ANALYSIS_ERROR' });
    }
  },

  // 增強分析
  AnalyzeEnhanced: async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    try {
      const { date, hour } = call.request;
      const now = new Date();
      const dateStr = date || now.toISOString().split('T')[0];
      const hourNum = hour ?? now.getHours();

      let queryDate = dateStr;
      if (isEarlyZiHour(hourNum)) {
        const nextDay = new Date(dateStr);
        nextDay.setDate(nextDay.getDate() + 1);
        queryDate = nextDay.toISOString().split('T')[0];
      }

      const lunarData = await getLunarData(queryDate);
      const dayStem = lunarData.pillars.day.charAt(0);
      const hourGanZhi = calculateHourPillar(dayStem, hourNum);

      const plate = calculateDailyQimen(
        new Date(queryDate),
        lunarData.pillars.year,
        lunarData.pillars.month,
        lunarData.pillars.day,
        hourGanZhi,
        lunarData.solar_term.name,
        lunarData.solar_term.index,
        hourNum
      );

      const analysis = generateQimenAnalysis(plate);

      const enhancedPalaces: Record<string, any> = {};
      for (let i = 1; i <= 9; i++) {
        const enhanced = analyzePalaceEnhanced(i, plate);
        enhancedPalaces[String(i)] = {
          qiyi_stem: enhanced.qiyiAnalysis?.stem || '',
          qiyi_is_oddity: enhanced.qiyiAnalysis?.isOddity || false,
          qiyi_combination: enhanced.qiyiAnalysis?.combination || '',
          qiyi_interpretation: enhanced.qiyiAnalysis?.interpretation || '',
          combination_interpretation: enhanced.combinationAnalysis?.interpretation || '',
          combination_advice: enhanced.combinationAnalysis?.advice || '',
        };
      }

      callback(null, {
        success: true,
        plate: {},
        analysis: {},
        enhanced: { palaces: enhancedPalaces },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '增強分析失敗';
      callback(null, { success: false, error: message, code: 'ENHANCED_ERROR' });
    }
  },

  // 教學內容
  GetTeachingSections: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    const { section_id } = call.request;

    if (section_id) {
      const section = getTeachingSection(section_id);
      if (!section) {
        callback(null, { success: false, error: '章節不存在', count: 0, sections: [] });
        return;
      }
      callback(null, {
        success: true,
        sections: [{
          id: section.id,
          title: section.title,
          description: section.description,
          order: section.order,
          contents: section.content.map((c: any) => ({
            type: c.type,
            content: c.content,
            highlight_type: c.type === 'highlight' ? 'info' : undefined,
            items: c.items || [],
            headers: c.tableData?.headers || [],
            rows: c.tableData?.rows?.map((r: string[]) => ({ cells: r })) || [],
          })),
        }],
        count: 1,
      });
    } else {
      const sections = TEACHING_SECTIONS.map((section) => ({
        id: section.id,
        title: section.title,
        description: section.description,
        order: section.order,
        contents: section.content.map((c: any) => ({
          type: c.type,
          content: c.content,
          highlight_type: c.type === 'highlight' ? 'info' : undefined,
          items: c.items || [],
          headers: c.tableData?.headers || [],
          rows: c.tableData?.rows?.map((r: string[]) => ({ cells: r })) || [],
        })),
      }));
      callback(null, { success: true, sections, count: sections.length });
    }
  },

  // 案例
  GetCases: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    const { case_id, tag, matter_type, search } = call.request;

    if (case_id) {
      const caseStudy = getCaseStudyById(case_id);
      if (!caseStudy) {
        callback(null, { success: false, error: '案例不存在', count: 0, total: 0, cases: [] });
        return;
      }
      callback(null, {
        success: true,
        cases: [{
          id: caseStudy.id,
          title: caseStudy.title,
          description: caseStudy.description,
          date: caseStudy.date,
          hour: caseStudy.hour,
          solar_term: caseStudy.solarTerm,
          ju_number: caseStudy.juNumber,
          yin_yang: caseStudy.yinYang,
          matter_type: toMatterTypeProto(caseStudy.matterType),
          question: caseStudy.question,
          background: caseStudy.background,
          conclusion: caseStudy.conclusion,
          lessons: caseStudy.lessons,
          tags: caseStudy.tags,
        }],
        count: 1,
        total: 1,
      });
      return;
    }

    let results = [...CASE_STUDIES];

    if (tag) {
      results = results.filter((c) => c.tags.includes(tag));
    }

    if (matter_type && matter_type !== 'MATTER_TYPE_UNSPECIFIED') {
      // 需要反向映射
      const matterTypeMap: Record<number, string> = {
        1: 'general', 2: 'wealth', 3: 'career', 4: 'travel',
        5: 'health', 6: 'relationship', 7: 'study', 8: 'lost',
        9: 'legal', 10: 'property', 11: 'marriage', 12: 'business',
      };
      const typeKey = matterTypeMap[matter_type];
      if (typeKey) {
        results = results.filter((c) => c.matterType === typeKey);
      }
    }

    if (search) {
      results = results.filter(
        (c) =>
          c.title.includes(search) ||
          c.description.includes(search) ||
          c.question.includes(search)
      );
    }

    const cases = results.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      date: c.date,
      hour: c.hour,
      solar_term: c.solarTerm,
      ju_number: c.juNumber,
      yin_yang: c.yinYang,
      matter_type: toMatterTypeProto(c.matterType),
      question: c.question,
      background: c.background,
      conclusion: c.conclusion,
      lessons: c.lessons,
      tags: c.tags,
    }));

    callback(null, {
      success: true,
      cases,
      count: cases.length,
      total: CASE_STUDIES.length,
    });
  },

  // 格局
  GetPatterns: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    const { pattern_id, type, search } = call.request;

    if (pattern_id) {
      const pattern = getPatternById(pattern_id);
      if (!pattern) {
        callback(null, { success: false, error: '格局不存在', count: 0, total: 0, patterns: [] });
        return;
      }
      callback(null, {
        success: true,
        patterns: [{
          id: pattern.id,
          name: pattern.name,
          type: toPatternTypeProto(pattern.type),
          description: pattern.description,
          conditions: pattern.conditions,
          interpretation: pattern.interpretation,
          applicable_matters: pattern.applicableMatters,
          remedies: pattern.remedies || '',
          examples: pattern.examples || [],
        }],
        count: 1,
        total: 1,
      });
      return;
    }

    let results = [...QIMEN_PATTERNS];

    if (type && type !== 'PATTERN_TYPE_UNSPECIFIED') {
      const typeMap: Record<number, PatternTypeEnum> = {
        1: 'auspicious', 2: 'inauspicious', 3: 'special', 4: 'combination',
      };
      const patternType = typeMap[type];
      if (patternType) {
        results = results.filter((p) => p.type === patternType);
      }
    }

    if (search) {
      results = results.filter(
        (p) =>
          p.name.includes(search) ||
          p.description.includes(search) ||
          p.interpretation.includes(search)
      );
    }

    const patterns = results.map((p) => ({
      id: p.id,
      name: p.name,
      type: toPatternTypeProto(p.type),
      description: p.description,
      conditions: p.conditions,
      interpretation: p.interpretation,
      applicable_matters: p.applicableMatters,
      remedies: p.remedies || '',
      examples: p.examples || [],
    }));

    callback(null, {
      success: true,
      patterns,
      count: patterns.length,
      total: QIMEN_PATTERNS.length,
    });
  },

  // 健康檢查
  Health: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
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
  server.addService(qimenPackage.QimenService.service, qimenServiceImpl);
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err: Error | null, boundPort: number) => {
    if (err) {
      console.error('[gRPC] 啟動失敗:', err);
      return;
    }
    console.log(`[gRPC] 服務啟動於 port ${boundPort}`);
  });
  return server;
}

// 若直接執行此檔案則啟動服務
if (require.main === module) {
  startGrpcServer();
}
