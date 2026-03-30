/**
 * Helpers to convert gRPC proto responses (snake_case) into the camelCase
 * shape that existing Next.js API routes and frontend components expect.
 */

type ProtoScalar = string | number | boolean | null | undefined;
type ProtoValue = ProtoScalar | ProtoRecord | ProtoValue[];
type ProtoRecord = Record<string, ProtoValue>;

type ProtoPlate = ProtoRecord & {
  date?: string;
  year_gan_zhi?: string;
  month_gan_zhi?: string;
  day_gan_zhi?: string;
  hour_gan_zhi?: string;
  hour?: number;
  shichen?: string;
  ju_number?: number;
  is_yang?: boolean;
  yin_yang?: string;
  solar_term?: string;
  earth_plate?: Record<string, string>;
  heaven_plate?: Record<string, string>;
  human_plate?: Record<string, string>;
  spirit_plate?: Record<string, string>;
  stars_plate?: Record<string, string>;
};

type ProtoPalaceRating = ProtoRecord & {
  level?: string;
  score?: number;
  summary?: string;
};

type ProtoAnalysis = ProtoRecord & {
  overall_level?: string;
  overall_score?: number;
  recommendations?: string[];
  palace_ratings?: Record<string, ProtoPalaceRating>;
  qiyi_analysis?: string[];
  door_star_highlights?: string[];
};

type ProtoEnhancedPalace = ProtoRecord & {
  qiyi_meanings?: string[];
  door_star_combinations?: string[];
  door_spirit_combinations?: string[];
  star_spirit_combinations?: string[];
  special_patterns?: string[];
  detailed_advice?: string[];
};

type ProtoEnhanced = ProtoRecord & {
  palaces?: Record<string, ProtoEnhancedPalace>;
};

type ProtoTableRow = ProtoRecord & {
  cells?: string[];
};

type ProtoTeachingContent = ProtoRecord & {
  type?: string;
  content?: string;
  highlight_type?: string;
  items?: string[];
  headers?: string[];
  rows?: ProtoTableRow[];
};

type ProtoTeachingSection = ProtoRecord & {
  id?: string;
  title?: string;
  description?: string;
  order?: number;
  contents?: ProtoTeachingContent[];
};

type ProtoCase = ProtoRecord & {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  hour?: number;
  solar_term?: string;
  ju_number?: number;
  yin_yang?: string;
  matter_type?: string;
  question?: string;
  background?: string;
  plate_snapshot?: ProtoRecord & {
    heaven_plate?: Record<string, string>;
    human_plate?: Record<string, string>;
    spirit_plate?: Record<string, string>;
    stars_plate?: Record<string, string>;
    earth_plate?: Record<string, string>;
  };
  analysis?: ProtoRecord & {
    god_palace?: string;
    palace_analysis?: string;
    element_analysis?: string;
    timing_analysis?: string;
    direction_analysis?: string;
  };
  conclusion?: string;
  lessons?: string[];
  tags?: string[];
};

type ProtoPattern = ProtoRecord & {
  id?: string;
  name?: string;
  type?: string;
  description?: string;
  conditions?: string[];
  interpretation?: string;
  applicable_matters?: string[];
  remedies?: string;
  examples?: string[];
};

// ──────────────────────────────────────────────────────────────────────────────
// Plate
// ──────────────────────────────────────────────────────────────────────────────

export function normalizePlate(p: ProtoPlate | null | undefined) {
  if (!p) return null;
  return {
    date: p.date,
    yearGanZhi: p.year_gan_zhi,
    monthGanZhi: p.month_gan_zhi,
    dayGanZhi: p.day_gan_zhi,
    hourGanZhi: p.hour_gan_zhi,
    hour: p.hour ?? 0,
    shichen: p.shichen ?? '',
    juNumber: p.ju_number,
    isYang: p.is_yang,
    yinYang: p.yin_yang,
    solarTerm: p.solar_term,
    earthPlate: p.earth_plate ?? {},
    heavenPlate: p.heaven_plate ?? {},
    humanPlate: p.human_plate ?? {},
    spiritPlate: p.spirit_plate ?? {},
    starsPlate: p.stars_plate ?? {},
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Analysis
// ──────────────────────────────────────────────────────────────────────────────

function normalizePalaceRating(r: ProtoPalaceRating | null | undefined) {
  if (!r) return null;
  return { level: r.level, score: r.score, summary: r.summary };
}

export function normalizeAnalysis(a: ProtoAnalysis | null | undefined) {
  if (!a) return null;
  const ratings: Record<string, ReturnType<typeof normalizePalaceRating>> = {};
  for (const [k, v] of Object.entries(a.palace_ratings ?? {})) {
    ratings[k] = normalizePalaceRating(v);
  }
  return {
    overallLevel: a.overall_level,
    overallScore: a.overall_score,
    recommendations: a.recommendations ?? [],
    palaceRatings: ratings,
    qiyiAnalysis: a.qiyi_analysis ?? [],
    doorStarHighlights: a.door_star_highlights ?? [],
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Enhanced analysis
// ──────────────────────────────────────────────────────────────────────────────

function normalizePalaceEnhanced(pe: ProtoEnhancedPalace | null | undefined) {
  if (!pe) return null;
  return {
    qiyiMeanings: pe.qiyi_meanings ?? [],
    doorStarCombinations: pe.door_star_combinations ?? [],
    doorSpiritCombinations: pe.door_spirit_combinations ?? [],
    starSpiritCombinations: pe.star_spirit_combinations ?? [],
    specialPatterns: pe.special_patterns ?? [],
    detailedAdvice: pe.detailed_advice ?? [],
  };
}

export function normalizeEnhanced(e: ProtoEnhanced | null | undefined) {
  if (!e) return null;
  const palaces: Record<string, ReturnType<typeof normalizePalaceEnhanced>> = {};
  for (const [k, v] of Object.entries(e.palaces ?? {})) {
    palaces[k] = normalizePalaceEnhanced(v);
  }
  return { palaces };
}

// ──────────────────────────────────────────────────────────────────────────────
// Teaching
// ──────────────────────────────────────────────────────────────────────────────

function normalizeContent(c: ProtoTeachingContent) {
  return {
    type: c.type,
    content: c.content,
    highlightType: c.highlight_type,
    items: c.items ?? [],
    headers: c.headers ?? [],
    rows: (c.rows ?? []).map((r) => r.cells ?? []),
  };
}

export function normalizeSection(s: ProtoTeachingSection) {
  return {
    id: s.id,
    title: s.title,
    description: s.description,
    order: s.order,
    contents: (s.contents ?? []).map(normalizeContent),
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Cases
// ──────────────────────────────────────────────────────────────────────────────

export function normalizeCase(c: ProtoCase) {
  const snap = c.plate_snapshot ?? {};
  const ana = c.analysis ?? {};
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    date: c.date,
    hour: c.hour,
    solarTerm: c.solar_term,
    juNumber: c.ju_number,
    yinYang: c.yin_yang,
    matterType: c.matter_type,
    question: c.question,
    background: c.background,
    plateSnapshot: {
      heavenPlate: snap.heaven_plate ?? {},
      humanPlate: snap.human_plate ?? {},
      spiritPlate: snap.spirit_plate ?? {},
      starsPlate: snap.stars_plate ?? {},
      earthPlate: snap.earth_plate ?? {},
    },
    analysis: {
      godPalace: ana.god_palace,
      palaceAnalysis: ana.palace_analysis,
      elementAnalysis: ana.element_analysis,
      timingAnalysis: ana.timing_analysis,
      directionAnalysis: ana.direction_analysis,
    },
    conclusion: c.conclusion,
    lessons: c.lessons ?? [],
    tags: c.tags ?? [],
  };
}

// ──────────────────────────────────────────────────────────────────────────────
// Patterns
// ──────────────────────────────────────────────────────────────────────────────

export function normalizePattern(p: ProtoPattern) {
  return {
    id: p.id,
    name: p.name,
    type: p.type,
    description: p.description,
    conditions: p.conditions ?? [],
    interpretation: p.interpretation,
    applicableMatters: p.applicable_matters ?? [],
    remedies: p.remedies,
    examples: p.examples ?? [],
  };
}
