/**
 * Helpers to convert gRPC proto responses (snake_case) into the camelCase
 * shape that existing Next.js API routes and frontend components expect.
 */

// ──────────────────────────────────────────────────────────────────────────────
// Plate
// ──────────────────────────────────────────────────────────────────────────────

export function normalizePlate(p: any) {
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

function normalizePalaceRating(r: any) {
  if (!r) return null;
  return { level: r.level, score: r.score, summary: r.summary };
}

export function normalizeAnalysis(a: any) {
  if (!a) return null;
  const ratings: Record<string, any> = {};
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

function normalizePalaceEnhanced(pe: any) {
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

export function normalizeEnhanced(e: any) {
  if (!e) return null;
  const palaces: Record<string, any> = {};
  for (const [k, v] of Object.entries(e.palaces ?? {})) {
    palaces[k] = normalizePalaceEnhanced(v);
  }
  return { palaces };
}

// ──────────────────────────────────────────────────────────────────────────────
// Teaching
// ──────────────────────────────────────────────────────────────────────────────

function normalizeContent(c: any) {
  return {
    type: c.type,
    content: c.content,
    highlightType: c.highlight_type,
    items: c.items ?? [],
    headers: c.headers ?? [],
    rows: (c.rows ?? []).map((r: any) => r.cells ?? []),
  };
}

export function normalizeSection(s: any) {
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

export function normalizeCase(c: any) {
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

export function normalizePattern(p: any) {
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
