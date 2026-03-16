/**
 * 奇門遁甲案例分析庫
 * 經典案例供學習參考
 */

import { MatterType } from './symbolism';

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  date: string;
  hour: string;
  solarTerm: string;
  juNumber: number;
  yinYang: string;
  matterType: MatterType;
  question: string;
  background: string;
  plateSnapshot: {
    heavenPlate: Record<number, string>;
    humanPlate: Record<number, string>;
    spiritPlate: Record<number, string>;
    starsPlate: Record<number, string>;
    earthPlate: Record<number, string>;
  };
  analysis: {
    godPalace: number;
    palaceAnalysis: string;
    elementAnalysis: string;
    timingAnalysis: string;
    directionAnalysis: string;
  };
  conclusion: string;
  lessons: string[];
  tags: string[];
}

/**
 * 經典案例分析
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-001',
    title: '求財案例：商業投資決策',
    description: '某商人欲投資新項目，求測財運吉凶',
    date: '2024-03-15',
    hour: '辰時',
    solarTerm: '驚蟄',
    juNumber: 3,
    yinYang: '陽遁',
    matterType: 'wealth',
    question: '此投資項目能否獲利？',
    background: '當事人擬投資房地產項目，資金規模約500萬，求測時值驚蟄後，陽遁三局。',
    plateSnapshot: {
      heavenPlate: { 1: '戊', 2: '己', 3: '庚', 4: '辛', 5: '', 6: '壬', 7: '癸', 8: '丁', 9: '丙' },
      humanPlate: { 1: '休門', 2: '生門', 3: '傷門', 4: '杜門', 5: '', 6: '景門', 7: '死門', 8: '驚門', 9: '開門' },
      spiritPlate: { 1: '值符', 2: '螣蛇', 3: '太陰', 4: '六合', 5: '', 6: '白虎', 7: '玄武', 8: '九地', 9: '九天' },
      starsPlate: { 1: '天蓬', 2: '天任', 3: '天沖', 4: '天輔', 5: '', 6: '天英', 7: '天芮', 8: '天柱', 9: '天心' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 2,
      palaceAnalysis: '生門落坤二宮，為財運主事之宮。天任星為吉星，值符為貴人相助之象，顯示項目本身具備良好基礎。',
      elementAnalysis: '生門屬土，與宮位五行比和，為旺相之地。戊土臨宮，財氣凝聚，主財源穩定。',
      timingAnalysis: '驚蟄後陽遁三局，木氣漸旺，土受木剋，雖有壓力但生門當令，財運尚可。',
      directionAnalysis: '坤宮對應西南方，宜往西南方向尋求合作或資源。',
    },
    conclusion: '此投資項目前景尚可，建議謹慎評估後可進行。生門得值符吉星，顯示有貴人相助；但木旺土衰，需注意資金周轉風險。',
    lessons: [
      '求財看生門，生門得吉星則財運順遂',
      '值符臨宮主有貴人相助',
      '五行旺衰需結合節氣判斷',
      '投資決策需綜合考量多方因素',
    ],
    tags: ['財運', '投資', '生門', '案例'],
  },
  {
    id: 'case-002',
    title: '事業案例：職場升遷機會',
    description: '某白領求測近期升遷運勢',
    date: '2024-06-20',
    hour: '午時',
    solarTerm: '夏至',
    juNumber: 9,
    yinYang: '陰遁',
    matterType: 'career',
    question: '今年是否有升遷機會？',
    background: '當事人在科技公司任職三年，近期有升遷傳聞，求測時值夏至，陰遁九局。',
    plateSnapshot: {
      heavenPlate: { 1: '乙', 2: '丙', 3: '丁', 4: '戊', 5: '', 6: '己', 7: '庚', 8: '辛', 9: '壬' },
      humanPlate: { 1: '開門', 2: '休門', 3: '生門', 4: '傷門', 5: '', 6: '杜門', 7: '景門', 8: '死門', 9: '驚門' },
      spiritPlate: { 1: '值符', 2: '九天', 3: '九地', 4: '玄武', 5: '', 6: '白虎', 7: '六合', 8: '太陰', 9: '螣蛇' },
      starsPlate: { 1: '天心', 2: '天蓬', 3: '天任', 4: '天沖', 5: '', 6: '天輔', 7: '天英', 8: '天芮', 9: '天柱' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 1,
      palaceAnalysis: '開門落坎一宮，開門主事業發展、升遷機會。天心星為領導星，值符為權威之象，顯示有升遷機會。',
      elementAnalysis: '開門屬金，坎宮屬水，金生水為洩氣之象，主需付出努力方能成事。',
      timingAnalysis: '夏至陰遁，火旺金衰，開門受制，升遷恐有阻礙，需待秋季金旺時機。',
      directionAnalysis: '坎宮對應北方，宜與北方人士或部門多溝通。',
    },
    conclusion: '今年有升遷機會但不順遂，需付出額外努力。開門雖得值符天心，但時令不利，建議韜光養晦，待秋季再行爭取。',
    lessons: [
      '求官運看開門，開門吉則升遷有望',
      '天心星主領導、管理，臨開門利仕途',
      '時令旺衰影響吉凶程度',
      '事業發展需把握時機',
    ],
    tags: ['事業', '升遷', '開門', '案例'],
  },
  {
    id: 'case-003',
    title: '感情案例：姻緣配對分析',
    description: '單身男女求測姻緣何時到來',
    date: '2024-08-08',
    hour: '酉時',
    solarTerm: '立秋',
    juNumber: 2,
    yinYang: '陰遁',
    matterType: 'marriage',
    question: '何時能遇到正緣？',
    background: '當事人單身多年，近期相親多次未果，求測時值立秋後，陰遁二局。',
    plateSnapshot: {
      heavenPlate: { 1: '丁', 2: '丙', 3: '乙', 4: '戊', 5: '', 6: '己', 7: '庚', 8: '辛', 9: '壬' },
      humanPlate: { 1: '景門', 2: '死門', 3: '驚門', 4: '開門', 5: '', 6: '休門', 7: '生門', 8: '傷門', 9: '杜門' },
      spiritPlate: { 1: '螣蛇', 2: '太陰', 3: '六合', 4: '白虎', 5: '', 6: '玄武', 7: '九地', 8: '九天', 9: '值符' },
      starsPlate: { 1: '天英', 2: '天芮', 3: '天柱', 4: '天心', 5: '', 6: '天蓬', 7: '天任', 8: '天沖', 9: '天輔' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 7,
      palaceAnalysis: '六合為媒妁、婚姻之神，落兌七宮與生門同宮，主有良緣機會。天任星為吉星，顯示對象條件尚可。',
      elementAnalysis: '兌宮屬金，生門屬土，土生金為相生之象，主感情發展順利，對方能帶來幫助。',
      timingAnalysis: '立秋金旺，兌宮當令，時機有利。但螣蛇臨宮，需防感情波折或虛假對象。',
      directionAnalysis: '兌宮對應西方，正緣可能來自西方或與西方有關之人。',
    },
    conclusion: '今秋至初冬有姻緣機會，對象條件尚可且能帶來助力。但需謹慎辨識，防範虛情假意之人。',
    lessons: [
      '求姻緣看六合，六合吉則婚緣有望',
      '生門臨六合，主婚後生活富足',
      '螣蛇臨宮需防感情欺騙',
      '時令當旺則姻緣易成',
    ],
    tags: ['感情', '姻緣', '六合', '案例'],
  },
  {
    id: 'case-004',
    title: '健康案例：疾病預防分析',
    description: '中老年人求測健康運勢',
    date: '2024-09-15',
    hour: '卯時',
    solarTerm: '白露',
    juNumber: 4,
    yinYang: '陽遁',
    matterType: 'health',
    question: '近期健康狀況如何？',
    background: '當事人近期身體不適，求測健康運勢，時值白露後，陽遁四局。',
    plateSnapshot: {
      heavenPlate: { 1: '辛', 2: '壬', 3: '癸', 4: '丁', 5: '', 6: '丙', 7: '乙', 8: '戊', 9: '己' },
      humanPlate: { 1: '驚門', 2: '開門', 3: '休門', 4: '生門', 5: '', 6: '傷門', 7: '杜門', 8: '景門', 9: '死門' },
      spiritPlate: { 1: '白虎', 2: '玄武', 3: '九地', 4: '九天', 5: '', 6: '值符', 7: '螣蛇', 8: '太陰', 9: '六合' },
      starsPlate: { 1: '天柱', 2: '天心', 3: '天蓬', 4: '天任', 5: '', 6: '天沖', 7: '天輔', 8: '天英', 9: '天芮' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 9,
      palaceAnalysis: '天芮星為病星，落離九宮與死門同宮，顯示健康確有問題。但天心星為醫藥星臨宮，主可治療。',
      elementAnalysis: '離宮屬火，辛屬金，火剋金主有炎症或呼吸系統問題。',
      timingAnalysis: '白露後金旺，火被剋制，病情可能反覆，需耐心調養。',
      directionAnalysis: '離宮對應南方，宜往南方尋醫或調養。',
    },
    conclusion: '健康確有隱憂，可能為呼吸系統或心血管問題，需及時就醫檢查。天心臨宮主有醫緣，治療可望收效。',
    lessons: [
      '求健康看天芮，天芮臨凶門則病情較重',
      '天心為醫藥星，臨宮主可治療',
      '死門臨天芮，需重視但非不治',
      '健康問題應及時就醫，不可僅賴占卜',
    ],
    tags: ['健康', '疾病', '天芮', '案例'],
  },
  {
    id: 'case-005',
    title: '出行案例：遠行吉凶判斷',
    description: '商務人士求測出差吉凶',
    date: '2024-05-10',
    hour: '申時',
    solarTerm: '立夏',
    juNumber: 4,
    yinYang: '陽遁',
    matterType: 'travel',
    question: '此次出差是否順利？',
    background: '當事人計劃前往外地洽談業務，求測出行吉凶，時值立夏後，陽遁四局。',
    plateSnapshot: {
      heavenPlate: { 1: '己', 2: '庚', 3: '辛', 4: '壬', 5: '', 6: '癸', 7: '丁', 8: '丙', 9: '乙' },
      humanPlate: { 1: '休門', 2: '生門', 3: '傷門', 4: '杜門', 5: '', 6: '景門', 7: '死門', 8: '驚門', 9: '開門' },
      spiritPlate: { 1: '九天', 2: '值符', 3: '螣蛇', 4: '太陰', 5: '', 6: '六合', 7: '白虎', 8: '玄武', 9: '九地' },
      starsPlate: { 1: '天蓬', 2: '天任', 3: '天沖', 4: '天輔', 5: '', 6: '天英', 7: '天芮', 8: '天柱', 9: '天心' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 1,
      palaceAnalysis: '休門落坎一宮，休門主休息、平安，九天主遠行、飛揚。天蓬星為水神，與坎宮比和，出行順利之象。',
      elementAnalysis: '坎宮屬水，休門亦屬水，比和之象主平安無事。',
      timingAnalysis: '立夏後火旺水衰，休門雖吉但氣勢不足，行程可能有拖延。',
      directionAnalysis: '坎宮對應北方，此次出差往北方最為有利。',
    },
    conclusion: '此次出行整體順利，但可能有行程延誤。休門九天臨坎宮，主旅途平安；惟時令不利，需預留彈性時間。',
    lessons: [
      '求出行看休門，休門吉則旅途平安',
      '九天臨宮主遠行順利',
      '出行宜選時令當旺之方向',
      '商務出差需預留彈性時間',
    ],
    tags: ['出行', '出差', '休門', '案例'],
  },
  {
    id: 'case-006',
    title: '訴訟案例：官司勝敗預測',
    description: '當事人涉及訴訟，求測勝敗',
    date: '2024-07-22',
    hour: '巳時',
    solarTerm: '小暑',
    juNumber: 1,
    yinYang: '陰遁',
    matterType: 'legal',
    question: '官司能否勝訴？',
    background: '當事人涉及合約糾紛訴訟，求測勝敗，時值小暑後，陰遁一局。',
    plateSnapshot: {
      heavenPlate: { 1: '戊', 2: '己', 3: '庚', 4: '辛', 5: '', 6: '壬', 7: '癸', 8: '丁', 9: '丙' },
      humanPlate: { 1: '驚門', 2: '開門', 3: '休門', 4: '生門', 5: '', 6: '傷門', 7: '杜門', 8: '景門', 9: '死門' },
      spiritPlate: { 1: '白虎', 2: '六合', 3: '太陰', 4: '螣蛇', 5: '', 6: '值符', 7: '九天', 8: '九地', 9: '玄武' },
      starsPlate: { 1: '天芮', 2: '天柱', 3: '天心', 4: '天蓬', 5: '', 6: '天任', 7: '天沖', 8: '天輔', 9: '天英' },
      earthPlate: { 1: '子', 2: '丑', 3: '寅', 4: '卯', 5: '辰', 6: '巳', 7: '午', 8: '未', 9: '申' },
    },
    analysis: {
      godPalace: 1,
      palaceAnalysis: '驚門落坎一宮，驚門主訴訟、口舌。白虎為刑殺之神臨宮，顯示訴訟過程激烈。天心星為法官星臨宮，主有公正裁決。',
      elementAnalysis: '坎宮屬水，驚門屬金，金生水為生我之象，主對當事人有利。',
      timingAnalysis: '小暑火旺，金水受制，訴訟過程可能較為艱辛。',
      directionAnalysis: '坎宮對應北方，北方人士或證人對案件有幫助。',
    },
    conclusion: '官司最終可望勝訴，但過程艱辛需付出努力。驚門白虎雖凶，但天心臨宮主法官公正；金生水之象顯示最終有利。',
    lessons: [
      '求訴訟看驚門，驚門吉則官司順利',
      '白虎臨宮主官司激烈',
      '天心為法官星，臨宮主裁決公正',
      '生剋關係決定勝敗傾向',
    ],
    tags: ['訴訟', '官司', '驚門', '案例'],
  },
];

/**
 * 根據 ID 獲取案例
 */
export function getCaseStudyById(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find(c => c.id === id);
}

/**
 * 根據標籤篩選案例
 */
export function getCaseStudiesByTag(tag: string): CaseStudy[] {
  return CASE_STUDIES.filter(c => c.tags.includes(tag));
}

/**
 * 根據問事類型篩選案例
 */
export function getCaseStudiesByMatterType(matterType: MatterType): CaseStudy[] {
  return CASE_STUDIES.filter(c => c.matterType === matterType);
}

/**
 * 獲取所有案例標籤
 */
export function getAllCaseTags(): string[] {
  const tagsSet = new Set<string>();
  CASE_STUDIES.forEach(c => c.tags.forEach(tag => tagsSet.add(tag)));
  return Array.from(tagsSet);
}
