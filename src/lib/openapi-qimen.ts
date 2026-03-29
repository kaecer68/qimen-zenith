const MatterTypeProto = {
  general: 1,
  wealth: 2,
  career: 3,
  travel: 4,
  health: 5,
  relationship: 6,
  study: 7,
} as const;

const PURPOSE_TO_MATTER: Record<string, number> = {
  '求財': MatterTypeProto.wealth,
  '事業': MatterTypeProto.career,
  '感情': MatterTypeProto.relationship,
  '健康': MatterTypeProto.health,
  '學業': MatterTypeProto.study,
  '出行': MatterTypeProto.travel,
  '其他': MatterTypeProto.general,
};

const PALACE_SEQUENCE = [
  { key: '1', name: '坎宮' },
  { key: '2', name: '坤宮' },
  { key: '3', name: '震宮' },
  { key: '4', name: '巽宮' },
  { key: '5', name: '中宮' },
  { key: '6', name: '乾宮' },
  { key: '7', name: '兌宮' },
  { key: '8', name: '艮宮' },
  { key: '9', name: '離宮' },
];

export function parseContractDatetime(datetime: string): { date: string; hour: number } {
  const match = datetime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):\d{2}/);
  if (!match) {
    throw new Error('datetime 格式錯誤，請使用 ISO 8601 date-time');
  }

  const parsed = new Date(datetime);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('datetime 格式錯誤，請使用 ISO 8601 date-time');
  }

  return {
    date: match[1],
    hour: Number.parseInt(match[2], 10),
  };
}

export function resolveMatterType(purpose?: string): number {
  if (!purpose) {
    return MatterTypeProto.general;
  }
  return PURPOSE_TO_MATTER[purpose] ?? MatterTypeProto.general;
}

export function toContractCalculateResponse(response: any) {
  const plate = response?.plate ?? {};

  return {
    chart_type: plate.yin_yang || '陽遁',
    plate: {
      palaces: PALACE_SEQUENCE.map(({ key, name }, index) => ({
        position: index,
        name,
        star: plate.stars_plate?.[key] ?? '',
        door: plate.human_plate?.[key] ?? '',
        deity: plate.spirit_plate?.[key] ?? '',
      })),
    },
    palace_ratings_enhanced: (response?.palace_ratings_enhanced ?? []).map((rating: any) => ({
      palace_index: rating.palace_index,
      palace_name: rating.palace_name,
      overall_score: rating.overall_score,
      wealth_score: rating.wealth_score,
      career_score: rating.career_score,
      health_score: rating.health_score,
      relationship_score: rating.relationship_score,
      study_score: rating.study_score,
    })),
    palace_info: response?.palace_info
      ? {
          current_hour_palace: response.palace_info.current_hour_palace,
          current_hour_palace_name: response.palace_info.current_hour_palace_name,
          wealth_palace: response.palace_info.wealth_palace,
          wealth_palace_name: response.palace_info.wealth_palace_name,
          career_palace: response.palace_info.career_palace,
          career_palace_name: response.palace_info.career_palace_name,
        }
      : undefined,
  };
}

export function toContractAnalyzeResponse(response: any) {
  const palaceRatings = Object.entries(response?.analysis?.palace_ratings ?? {}).map(([palaceIndex, rating]: [string, any]) => ({
    palace_index: Number.parseInt(palaceIndex, 10),
    level: rating?.level ?? '',
    direction: rating?.direction ?? '',
  }));

  return {
    overall: response?.analysis?.recommendations?.[0] ?? response?.analysis?.overall_level ?? '',
    palace_ratings: palaceRatings,
    specific_advice: (response?.analysis?.recommendations ?? []).join('；'),
    palace_ratings_enhanced: (response?.palace_ratings_enhanced ?? []).map((rating: any) => ({
      palace_index: rating.palace_index,
      palace_name: rating.palace_name,
      overall_score: rating.overall_score,
      wealth_score: rating.wealth_score,
      career_score: rating.career_score,
      health_score: rating.health_score,
      relationship_score: rating.relationship_score,
      study_score: rating.study_score,
    })),
  };
}
