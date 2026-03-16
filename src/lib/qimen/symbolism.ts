/**
 * 九宮象徵系統模組
 * 
 * 提供九宮的多維象徵意義：
 * - 方位（空間）
 * - 人事（六親關係）
 * - 身體（病候）
 * - 事務（分類占斷）
 * - 五行屬性
 */

import { PALACES } from './core';

/** 問事類型 */
export type MatterType = 
  | 'general'      // 一般綜合
  | 'wealth'       // 財運
  | 'career'       // 官運/事業
  | 'travel'       // 出行
  | 'health'       // 健康/疾病
  | 'relationship' // 人際/感情
  | 'study'        // 學業/考試
  | 'lost'         // 尋人/失物
  | 'legal'        // 訴訟/官非
  | 'property'     // 田宅/房產
  | 'marriage'     // 婚姻
  | 'business'     // 生意/投資
  | 'litigation';  // 爭訟

/** 問事類型配置 */
export const MATTER_CONFIG: Record<MatterType, {
  name: string;
  description: string;
  primaryDoor: string | null;
  primaryStar: string | null;
  secondaryDoor: string | null;
  liuqinRelevant: boolean;
}> = {
  general: {
    name: '一般綜合',
    description: '整體運勢評估，不特指特定事項',
    primaryDoor: null,
    primaryStar: null,
    secondaryDoor: null,
    liuqinRelevant: false,
  },
  wealth: {
    name: '財運求財',
    description: '投資、生意、薪資、意外之財',
    primaryDoor: '生門',
    primaryStar: '天任',
    secondaryDoor: null,
    liuqinRelevant: false,
  },
  career: {
    name: '官運事業',
    description: '升遷、轉職、面試、工作發展',
    primaryDoor: '開門',
    primaryStar: '天心',
    secondaryDoor: null,
    liuqinRelevant: true,
  },
  travel: {
    name: '出行遠行',
    description: '出差、旅遊、搬遷、方向選擇',
    primaryDoor: '景門',
    primaryStar: null,
    secondaryDoor: '開門',
    liuqinRelevant: false,
  },
  health: {
    name: '健康疾病',
    description: '身體狀況、治病、療效',
    primaryDoor: '死門',
    primaryStar: '天芮',
    secondaryDoor: null,
    liuqinRelevant: false,
  },
  relationship: {
    name: '人際感情',
    description: '人緣、貴人、感情、合作',
    primaryDoor: '休門',
    primaryStar: null,
    secondaryDoor: '六合',
    liuqinRelevant: true,
  },
  study: {
    name: '學業考試',
    description: '考試、學習、進修、文書',
    primaryDoor: '景門',
    primaryStar: '天輔',
    secondaryDoor: null,
    liuqinRelevant: true,
  },
  lost: {
    name: '尋人失物',
    description: '尋找人物、失物、走失',
    primaryDoor: '杜門',
    primaryStar: null,
    secondaryDoor: null,
    liuqinRelevant: true,
  },
  legal: {
    name: '訴訟官非',
    description: '官司、是非、糾紛、調解',
    primaryDoor: '驚門',
    primaryStar: null,
    secondaryDoor: '開門',
    liuqinRelevant: false,
  },
  property: {
    name: '田宅房產',
    description: '買房、租房、裝修、地產',
    primaryDoor: '死門',
    primaryStar: null,
    secondaryDoor: '生門',
    liuqinRelevant: false,
  },
  marriage: {
    name: '婚姻感情',
    description: '婚嫁、姻緣、配偶、感情發展',
    primaryDoor: '休門',
    primaryStar: null,
    secondaryDoor: null,
    liuqinRelevant: true,
  },
  business: {
    name: '生意投資',
    description: '創業、合夥、股權、商業決策',
    primaryDoor: '生門',
    primaryStar: '天任',
    secondaryDoor: '開門',
    liuqinRelevant: true,
  },
  litigation: {
    name: '爭訟糾紛',
    description: '談判、競爭、合約糾紛',
    primaryDoor: '驚門',
    primaryStar: '天沖',
    secondaryDoor: '傷門',
    liuqinRelevant: false,
  },
};

/** 六親關係對應宮位與描述 */
export const LIUQIN_RELATIONS = [
  {
    key: 'father',
    name: '父親',
    palace: 6, // 乾六宮
    palaceName: '乾六宮',
    description: '父親、男性長輩、領導上司、權威人士、政府官員',
    trigram: '乾',
    applicableMatters: ['career', 'relationship', 'lost', 'marriage', 'business'] as MatterType[],
  },
  {
    key: 'mother',
    name: '母親',
    palace: 2, // 坤二宮
    palaceName: '坤二宮',
    description: '母親、女性長輩、群眾、下屬、合作夥伴、土地相關',
    trigram: '坤',
    applicableMatters: ['career', 'relationship', 'lost', 'marriage', 'business'] as MatterType[],
  },
  {
    key: 'elder_brother',
    name: '兄長',
    palace: 3, // 震三宮
    palaceName: '震三宮',
    description: '兄長、男性同輩、競爭對手、急進之人、雷厲風行者',
    trigram: '震',
    applicableMatters: ['career', 'relationship', 'lost', 'marriage', 'business'] as MatterType[],
  },
  {
    key: 'elder_sister',
    name: '姊姊',
    palace: 4, // 巽四宮
    palaceName: '巽四宮',
    description: '姊姊、長女、文人、僧道、寡婦、技藝人、進退不定者',
    trigram: '巽',
    applicableMatters: ['career', 'relationship', 'lost', 'marriage', 'business', 'study'] as MatterType[],
  },
  {
    key: 'self',
    name: '自己',
    palace: 5, // 中五寄坤二，但自為中心
    palaceName: '中五宮',
    description: '自己、中心人物、當事人、問測者本人',
    trigram: '中',
    applicableMatters: [] as MatterType[], // 所有都適用
  },
  {
    key: 'younger_sister',
    name: '妹妹',
    palace: 7, // 兌七宮
    palaceName: '兌七宮',
    description: '妹妹、少女、巫師、說客、口齒伶俐者、享樂之人',
    trigram: '兌',
    applicableMatters: ['relationship', 'marriage'] as MatterType[],
  },
  {
    key: 'younger_brother',
    name: '弟弟',
    palace: 8, // 艮八宮
    palaceName: '艮八宮',
    description: '弟弟、少男、僧道、閽寺（守門人）、靜止之人',
    trigram: '艮',
    applicableMatters: ['relationship', 'lost'] as MatterType[],
  },
  {
    key: 'spouse',
    name: '配偶',
    palace: 1, // 坎一宮（也可看對應宮位）
    palaceName: '坎一宮',
    description: '配偶、中男、盜賊、險狡之人、智慧之人',
    trigram: '坎',
    applicableMatters: ['relationship', 'marriage', 'lost'] as MatterType[],
  },
  {
    key: 'child',
    name: '子女',
    palace: 9, // 離九宮
    palaceName: '離九宮',
    description: '子女、中女、文人、甲胄之人、眼目明亮者',
    trigram: '離',
    applicableMatters: ['relationship', 'marriage', 'lost', 'study'] as MatterType[],
  },
] as const;

/** 九宮多維象徵 */
export const PALACE_SYMBOLISM: Record<number, {
  // 基本資訊
  name: string;
  trigram: string;
  direction: string;
  element: string;
  luoshu: number;
  
  // 人事象徵（六親）
  person: string;
  personality: string;
  role: string[];
  
  // 身體象徵
  bodyPart: string;
  organ: string;
  diseaseType: string;
  
  // 事務象徵
  matters: string[];
  suitable: string[];
  unsuitable: string[];
  
  // 時間象徵
  time: string;
  season: string;
}> = {
  1: {
    name: '坎一宮',
    trigram: '坎',
    direction: '北',
    element: '水',
    luoshu: 1,
    person: '中男、盜賊、漁夫、水手、智慧之人',
    personality: '聰明多謀、善變、陰險、外柔內剛',
    role: ['中男', '次子', '北方人士'],
    bodyPart: '耳、腎、膀胱、泌尿系統、血液',
    organ: '腎、膀胱',
    diseaseType: '腎病、泌尿系統疾病、耳疾、寒濕症',
    matters: ['訴訟', '出行', '潛藏', '間諜', '險事'],
    suitable: ['暗中行事', '調查偵察', '避難', '休養'],
    unsuitable: ['公開競標', '主動出擊', '正面衝突'],
    time: '冬至至大寒',
    season: '冬季',
  },
  2: {
    name: '坤二宮',
    trigram: '坤',
    direction: '西南',
    element: '土',
    luoshu: 2,
    person: '母親、女性長輩、農夫、大眾、群眾',
    personality: '溫厚包容、順從、保守、勤勉、多疑',
    role: ['母親', '女主人', '長輩', '農民'],
    bodyPart: '腹、脾、胃、消化系統、肌肉',
    organ: '脾、胃',
    diseaseType: '脾胃病、消化系統疾病、婦科病、濕症',
    matters: ['田宅', '農業', '母親', '群眾', '收藏'],
    suitable: ['收藏儲蓄', '靜待時機', '順應環境', '虛心學習'],
    unsuitable: ['獨斷專行', '冒險創新', '急於求成'],
    time: '立秋至秋分',
    season: '夏秋之交',
  },
  3: {
    name: '震三宮',
    trigram: '震',
    direction: '東',
    element: '木',
    luoshu: 3,
    person: '長男、兄長、軍人、警察、運動員、創業者',
    personality: '積極進取、果斷、急進、易怒、好動',
    role: ['長男', '長子', '兄長', '軍人'],
    bodyPart: '足、肝、膽、神經系統、筋',
    organ: '肝、膽',
    diseaseType: '肝病、足疾、神經疾病、震傷、精神亢奮',
    matters: ['競爭', '創業', '變動', '軍事', '運動'],
    suitable: ['開創新局', '競爭求勝', '迅速行動', '體育鍛煉'],
    unsuitable: ['守成不變', '猶豫不決', '靜坐冥想'],
    time: '春分至立夏',
    season: '春季',
  },
  4: {
    name: '巽四宮',
    trigram: '巽',
    direction: '東南',
    element: '木',
    luoshu: 4,
    person: '長女、姊姊、文人、僧道、寡婦、技藝人、商人',
    personality: '進退不果、柔和隨順、善變、工於心計',
    role: ['長女', '長姊', '文人', '商人', '僧道'],
    bodyPart: '股（大腿）、膽、氣管、神經、呼吸道',
    organ: '膽、氣管',
    diseaseType: '股疾、氣管疾病、神經衰弱、感冒、風邪',
    matters: ['婚姻', '名利', '文書', '技藝', '陰私'],
    suitable: ['謀劃策劃', '技藝學習', '滲透經營', '文書往來'],
    unsuitable: ['果斷決策', '正面強攻', '一成不變'],
    time: '立夏至夏至',
    season: '春夏之交',
  },
  5: {
    name: '中五宮',
    trigram: '中',
    direction: '中央',
    element: '土',
    luoshu: 5,
    person: '自己、當事人、領導者、中心人物',
    personality: '統攝四方、穩重、權威、中性',
    role: ['自己', '當事人', '中心人物'],
    bodyPart: '心臟、脾胃、核心系統',
    organ: '心、脾胃',
    diseaseType: '心臟病、脾胃重症、全身性疾病',
    matters: ['統攝', '決策', '核心事務', '關鍵轉折'],
    suitable: ['居中調停', '把握核心', '重大決策'],
    unsuitable: ['邊緣化', '委過他人', '逃避責任'],
    time: '四季之交',
    season: '四季',
  },
  6: {
    name: '乾六宮',
    trigram: '乾',
    direction: '西北',
    element: '金',
    luoshu: 6,
    person: '父親、男性長輩、領導、權威、高官、名流',
    personality: '剛健中正、領導力強、果斷、威嚴、高傲',
    role: ['父親', '領導', '長官', '權威人士'],
    bodyPart: '首（頭）、肺、大腸、骨骼、皮毛',
    organ: '肺、大腸',
    diseaseType: '頭疾、肺病、骨骼疾病、老人病、寒症',
    matters: ['開創', '公職', '權力', '事業', '高層'],
    suitable: ['開創事業', '爭取高位', '領導統御', '重大決策'],
    unsuitable: ['屈居人下', '委曲求全', '卑躬屈膝'],
    time: '立冬至冬至',
    season: '冬季',
  },
  7: {
    name: '兌七宮',
    trigram: '兌',
    direction: '西',
    element: '金',
    luoshu: 7,
    person: '少女、妹妹、巫師、說客、藝人、享樂者',
    personality: '喜悅和藹、能言善道、享受、善辯、輕薄',
    role: ['少女', '妹妹', '藝人', '說客'],
    bodyPart: '口、舌、肺、牙齒、呼吸系統',
    organ: '肺、口',
    diseaseType: '口舌疾病、肺病、牙疾、呼吸系統疾病',
    matters: ['口舌', '爭訟', '宴會', '娛樂', '說服'],
    suitable: ['溝通協調', '演講說服', '社交宴會', '藝術表演'],
    unsuitable: ['獨斷專行', '閉口不言', '嚴肅刻板'],
    time: '秋分至立冬',
    season: '秋季',
  },
  8: {
    name: '艮八宮',
    trigram: '艮',
    direction: '東北',
    element: '土',
    luoshu: 8,
    person: '少男、弟弟、僧道、閽寺（守門人）、靜止者',
    personality: '靜止沉穩、守成、固執、保守、篤實',
    role: ['少男', '幼子', '弟弟', '守門人'],
    bodyPart: '手、脾、鼻、背、骨',
    organ: '脾、胃',
    diseaseType: '手疾、脾胃病、鼻疾、背部疾病、關節炎',
    matters: ['止息', '阻擋', '保護', '學習', '轉折'],
    suitable: ['止息休整', '學習進修', '守成保泰', '等待時機'],
    unsuitable: ['急進躁動', '變動遷移', '冒險犯難'],
    time: '立春至春分',
    season: '冬春之交',
  },
  9: {
    name: '離九宮',
    trigram: '離',
    direction: '南',
    element: '火',
    luoshu: 9,
    person: '中女、次女、文人、軍人、甲胄者、眼目明亮者',
    personality: '文明美麗、熱情、依附、聰明、性急',
    role: ['中女', '次女', '文人', '軍人'],
    bodyPart: '目、心、小腸、血液、面部',
    organ: '心、小腸',
    diseaseType: '眼疾、心臟病、血液疾病、面部疾病、發熱症',
    matters: ['文書', '考試', '消息', '虛華', '戰爭'],
    suitable: ['文書寫作', '考試進修', '宣傳曝光', '虛心學習'],
    unsuitable: ['實務操作', '隱藏潛伏', '獨立自主'],
    time: '夏至至立秋',
    season: '夏季',
  },
};

/** 獲取用神宮位 */
export function getMatterPalace(matterType: MatterType, plate?: {
  humanPlate: Record<number, string>;
  starsPlate: Record<number, string>;
}): { palace: number; description: string } {
  const config = MATTER_CONFIG[matterType];
  
  if (!plate) {
    // 無排盤數據時，返回預設說明
    if (config.primaryDoor) {
      return { palace: 0, description: `${config.name}以【${config.primaryDoor}】為用神` };
    }
    return { palace: 0, description: config.description };
  }
  
  // 有排盤數據時，尋找用神所在宮位
  const { humanPlate, starsPlate } = plate;
  
  // 優先找門
  if (config.primaryDoor) {
    for (let i = 1; i <= 9; i++) {
      if (humanPlate[i] === config.primaryDoor) {
        return { palace: i, description: `${config.primaryDoor}在${PALACE_SYMBOLISM[i].name}` };
      }
    }
  }
  
  // 其次找星
  if (config.primaryStar) {
    for (let i = 1; i <= 9; i++) {
      if (starsPlate[i] === config.primaryStar) {
        return { palace: i, description: `${config.primaryStar}在${PALACE_SYMBOLISM[i].name}` };
      }
    }
  }
  
  // 找次要門
  if (config.secondaryDoor) {
    for (let i = 1; i <= 9; i++) {
      if (humanPlate[i] === config.secondaryDoor) {
        return { palace: i, description: `${config.secondaryDoor}在${PALACE_SYMBOLISM[i].name}（次要用神）` };
      }
    }
  }
  
  return { palace: 5, description: '用神不明，以中五宮為主' };
}

/** 獲取六親描述 */
export function getLiuqinDescription(key: string): string {
  const relation = LIUQIN_RELATIONS.find(r => r.key === key);
  if (!relation) return '';
  return `${relation.name}（${relation.palaceName}）：${relation.description}`;
}

/** 檢查問事類型是否需要六親 */
export function needsLiuqin(matterType: MatterType): boolean {
  return MATTER_CONFIG[matterType].liuqinRelevant;
}

/** 獲取適用於該問事類型的六親選項 */
export function getApplicableLiuqin(matterType: MatterType): typeof LIUQIN_RELATIONS[number][] {
  if (!needsLiuqin(matterType)) return [];
  
  return LIUQIN_RELATIONS.filter(r => 
    r.applicableMatters.length === 0 || // 適用於所有
    r.applicableMatters.includes(matterType)
  );
}
