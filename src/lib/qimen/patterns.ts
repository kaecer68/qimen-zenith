/**
 * 奇門遁甲格局查詢手冊
 * 常用吉凶格局快速查詢
 */

export type PatternType = 'auspicious' | 'inauspicious' | 'special' | 'combination';

export interface QimenPattern {
  id: string;
  name: string;
  type: PatternType;
  description: string;
  conditions: string[];
  interpretation: string;
  applicableMatters: string[];
  remedies?: string;
  examples?: string[];
}

/**
 * 常用吉凶格局
 */
export const QIMEN_PATTERNS: QimenPattern[] = [
  // 大吉格局
  {
    id: 'pattern-001',
    name: '三奇得使',
    type: 'auspicious',
    description: '三奇（乙丙丁）臨吉門吉星，且得值符使護佑',
    conditions: [
      '乙丙丁三奇之一臨宮',
      '臨休、生、開三吉門',
      '得天輔、天心等吉星',
      '值符臨宮或相生',
    ],
    interpretation: '此格為大吉之兆，主所謀之事順遂，求財得財，求官得官。三奇為奇門精粹，得吉門吉星相扶，萬事亨通。',
    applicableMatters: ['求財', '求官', '出行', '謀事', '婚嫁'],
    examples: ['乙奇臨生門天輔', '丙奇臨開門天心', '丁奇臨休門天蓬'],
  },
  {
    id: 'pattern-002',
    name: '玉女守門',
    type: 'auspicious',
    description: '丁奇（玉女）臨開門，主婚姻和合、求財順遂',
    conditions: [
      '丁奇臨開門',
      '開門為吉門',
      '天星不凶',
    ],
    interpretation: '丁奇為星奇，象徵希望與機遇。臨開門主開創、發展，尤利婚姻、合作、開業等事。',
    applicableMatters: ['婚嫁', '合作', '開業', '謀事'],
    remedies: '若天星稍弱，可選吉時加強',
  },
  {
    id: 'pattern-003',
    name: '九遁吉格',
    type: 'auspicious',
    description: '天、地、人、風、雲、龍、虎、神、鬼九遁之一',
    conditions: [
      '天遁：丙丁臨生門',
      '地遁：乙己臨開門',
      '人遁：丁壬臨休門',
      '其他遁格依此類推',
    ],
    interpretation: '九遁為奇門最高吉格，所求無不成，所謀無不就。各遁格有其專長，如天遁利求官，地遁利求財等。',
    applicableMatters: ['所有事項'],
    examples: ['丙奇丁奇臨生門為天遁', '乙奇己土臨開門為地遁'],
  },
  {
    id: 'pattern-004',
    name: '青龍回首',
    type: 'auspicious',
    description: '戊（青龍）臨丙（回首），主反敗為勝、轉危為安',
    conditions: [
      '戊加丙於同一宮',
      '宮位不凶',
    ],
    interpretation: '戊土為青龍，丙火為光明。青龍回首象徵失而復得、轉敗為勝。雖有波折，終能成功。',
    applicableMatters: ['訴訟', '追債', '尋物', '商業'],
  },
  {
    id: 'pattern-005',
    name: '飛鳥跌穴',
    type: 'auspicious',
    description: '丙（飛鳥）臨戊（跌穴），主主動出擊、大展宏圖',
    conditions: [
      '丙加戊於同一宮',
      '宮位不凶',
    ],
    interpretation: '丙火為飛鳥，戊土為高丘。飛鳥跌穴象徵主動進取、大展鴻圖。利開創、進取、主動求事。',
    applicableMatters: ['開業', '進修', '競選', '主動出擊'],
  },
  // 凶格
  {
    id: 'pattern-101',
    name: '五不遇時',
    type: 'inauspicious',
    description: '時干剋日干，主事多阻礙、謀事不順',
    conditions: [
      '時干五行剋日干五行',
      '且陰陽同性',
    ],
    interpretation: '五不遇時為奇門凶格之首，主事多阻滯，謀為難成。縱使格局再好，遇此亦需謹慎。',
    applicableMatters: ['所有事項'],
    remedies: '可選擇其他時辰再行謀事，或加強其他吉格化解',
    examples: ['甲日遇庚時', '乙日遇辛時'],
  },
  {
    id: 'pattern-102',
    name: '六儀擊刑',
    type: 'inauspicious',
    description: '六儀（戊己庚辛壬癸）受地支刑剋',
    conditions: [
      '戊臨震宮（子卯刑）',
      '己臨坤宮（丑戌刑）',
      '庚臨艮宮（寅巳刑）',
      '辛臨離宮（午午自刑）',
      '壬癸臨巽宮（巳申刑）',
    ],
    interpretation: '六儀擊刑主災禍、損傷、官非。所謀之事多生波折，須防小人暗害或意外災禍。',
    applicableMatters: ['出行', '投資', '訴訟', '醫療'],
    remedies: '宜靜不宜動，待時而動',
  },
  {
    id: 'pattern-103',
    name: '三奇入墓',
    type: 'inauspicious',
    description: '三奇（乙丙丁）入其墓庫之宮',
    conditions: [
      '乙奇入坤宮（木墓在未）',
      '丙丁入乾宮（火墓在戌）',
    ],
    interpretation: '三奇入墓主才華被埋、機遇錯失。縱有奇門吉格，亦難發揮。需待出墓之時。',
    applicableMatters: ['求官', '謀事', '考試', '創作'],
    remedies: '待沖墓之時，或選擇其他方位',
  },
  {
    id: 'pattern-104',
    name: '奇門悖格',
    type: 'inauspicious',
    description: '八門、九星、八神之間的凶性組合',
    conditions: [
      '凶門臨凶星',
      '凶神臨凶宮',
      '天地盤相剋',
    ],
    interpretation: '悖格主叛逆、反常、不順。所謀之事與常理相悖，難以成功。',
    applicableMatters: ['合作', '投資', '謀事'],
    remedies: '重新選擇時機，加強吉神化解',
  },
  // 特殊格局
  {
    id: 'pattern-201',
    name: '天乙伏宮',
    type: 'special',
    description: '值符下臨本宮，主貴人相助、權威護佑',
    conditions: [
      '值符所在宮位為其本宮',
      '星神門搭配得宜',
    ],
    interpretation: '值符為八神之首，代表權威、貴人。伏宮主得貴人相助，凡事有靠山。',
    applicableMatters: ['求官', '見貴', '謀事', '訴訟'],
  },
  {
    id: 'pattern-202',
    name: '三詐五假',
    type: 'special',
    description: '真詐假格，主虛實難辨、真偽莫分',
    conditions: [
      '九地、九天、玄武臨宮',
      '與三奇吉門組合',
    ],
    interpretation: '三詐五假為奇門中特殊格局，主事情虛實難辨。可用於設謀、隱蔽，但需防被人欺騙。',
    applicableMatters: ['隱蔽', '設謀', '偵探', '情報'],
    remedies: '需仔細辨識，不可輕信',
  },
  {
    id: 'pattern-203',
    name: '朱雀投江',
    type: 'inauspicious',
    description: '丙奇（朱雀）臨坎宮（江），主文書失效、訴訟敗北',
    conditions: [
      '丙奇臨坎一宮',
      '休門或天蓬臨宮',
    ],
    interpretation: '丙火為朱雀，坎宮為江。朱雀投江象徵文書沈沒、訴訟敗訴。不利文書、合約、訴訟等事。',
    applicableMatters: ['文書', '合約', '訴訟', '考試'],
    remedies: '文書需備份，合約需謹慎',
  },
  {
    id: 'pattern-204',
    name: '騰蛇夭矯',
    type: 'inauspicious',
    description: '螣蛇臨凶宮，主虛驚怪異、纏繞不休',
    conditions: [
      '螣蛇臨死門、驚門',
      '臨天芮、天柱凶星',
    ],
    interpretation: '螣蛇為虛驚之神，臨凶宮凶門主災禍纏身、虛驚怪異。須防詐騙、陷阱、意外之災。',
    applicableMatters: ['投資', '合作', '出行', '健康'],
    remedies: '宜靜不宜動，多求證',
  },
  // 組合格局
  {
    id: 'pattern-301',
    name: '龍返首',
    type: 'combination',
    description: '戊加丙，青龍返首，主失而復得',
    conditions: ['戊加丙於同一宮'],
    interpretation: '戊為青龍，丙為光明。返首之象，主失而復得、轉危為安。',
    applicableMatters: ['追債', '尋物', '復合', '翻案'],
  },
  {
    id: 'pattern-302',
    name: '鳥跌穴',
    type: 'combination',
    description: '丙加戊，飛鳥跌穴，主大展鴻圖',
    conditions: ['丙加戊於同一宮'],
    interpretation: '丙為飛鳥，戊為高丘。跌穴之象，主大展鴻圖、主動進取。',
    applicableMatters: ['開業', '競選', '進修', '主動出擊'],
  },
  {
    id: 'pattern-303',
    name: '青龍華蓋',
    type: 'combination',
    description: '戊加辛，青龍受困，主進退兩難',
    conditions: ['戊加辛於同一宮'],
    interpretation: '戊土為青龍，辛金為刑罰。華蓋之象，主受困、阻滯。',
    applicableMatters: ['謀事', '出行', '投資'],
    remedies: '宜守不宜攻',
  },
  {
    id: 'pattern-304',
    name: '白虎猖狂',
    type: 'combination',
    description: '辛加乙，白虎猖狂，主刑傷災禍',
    conditions: ['辛加乙於同一宮'],
    interpretation: '辛金為白虎，乙木為仁柔。猖狂之象，主刑傷、災禍、不測。',
    applicableMatters: ['所有事項'],
    remedies: '宜靜守，避開此時',
  },
];

/**
 * 根據 ID 獲取格局
 */
export function getPatternById(id: string): QimenPattern | undefined {
  return QIMEN_PATTERNS.find(p => p.id === id);
}

/**
 * 根據類型篩選格局
 */
export function getPatternsByType(type: PatternType): QimenPattern[] {
  return QIMEN_PATTERNS.filter(p => p.type === type);
}

/**
 * 根據名稱搜尋格局
 */
export function searchPatterns(query: string): QimenPattern[] {
  const lowerQuery = query.toLowerCase();
  return QIMEN_PATTERNS.filter(p => 
    p.name.includes(query) ||
    p.description.includes(query) ||
    p.interpretation.includes(query)
  );
}

/**
 * 獲取格局類型名稱
 */
export function getPatternTypeName(type: PatternType): string {
  const names: Record<PatternType, string> = {
    auspicious: '大吉格局',
    inauspicious: '凶格',
    special: '特殊格局',
    combination: '組合格局',
  };
  return names[type];
}

/**
 * 獲取格局類型顏色
 */
export function getPatternTypeColor(type: PatternType): string {
  const colors: Record<PatternType, string> = {
    auspicious: 'bg-green-100 text-green-800 border-green-200',
    inauspicious: 'bg-red-100 text-red-800 border-red-200',
    special: 'bg-purple-100 text-purple-800 border-purple-200',
    combination: 'bg-blue-100 text-blue-800 border-blue-200',
  };
  return colors[type];
}
