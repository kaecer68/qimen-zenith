/**
 * 三奇六儀詳解知識庫
 * 基於古典奇門遁甲理論，提供專業級分析資料
 */

// 三奇定義
export const THREE_ODDITIES = {
  '乙': {
    name: '乙奇',
    title: '日奇',
    element: '陰木',
    nature: '柔順、曲折、生長',
    characteristics: ['適合求財', '利於嫁娶', '出行順利', '文書和合'],
    auspicious: true,
    palaceFavor: [4, 3, 1], // 東南、東、北
    palaceAvoid: [7, 6],   // 西、西北
  },
  '丙': {
    name: '丙奇',
    title: '月奇',
    element: '陽火',
    nature: '威嚴、光明、剛烈',
    characteristics: ['適合謁貴', '利於訴訟', '破敵除邪', '文書印信'],
    auspicious: true,
    palaceFavor: [9, 3, 4], // 南、東、東南
    palaceAvoid: [1, 6],   // 北、西北
  },
  '丁': {
    name: '丁奇',
    title: '星奇',
    element: '陰火',
    nature: '文明、秀麗、希望',
    characteristics: ['適合求財', '利於讀書', '考試順遂', '燈燭光明'],
    auspicious: true,
    palaceFavor: [9, 2, 4], // 南、西南、東南
    palaceAvoid: [1, 7],   // 北、西
  },
} as const;

// 六儀定義
export const SIX_YI = {
  '戊': {
    name: '戊儀',
    element: '陽土',
    nature: '厚重、穩固、財富',
    characteristics: ['適合求財', '利於置產', '資本累積', '穩健經營'],
    auspicious: true,
    warning: '忌訴訟、出行',
    interpretation: '戊土為陽，象徵大地、資本、財富。臨宮則財運亨通，適合投資置業，但不宜訴訟爭競。',
  },
  '己': {
    name: '己儀',
    element: '陰土',
    nature: '隱藏、謀略、田園',
    characteristics: ['適合策劃', '利於隱蔽', '田園規劃', '內部整理'],
    auspicious: false,
    warning: '忌公開、急進',
    interpretation: '己土為陰，象徵田園、謀略、隱蔽。宜暗中籌劃，不宜公開行事，適合策劃階段。',
  },
  '庚': {
    name: '庚儀',
    element: '陽金',
    nature: '剛強、刑殺、變革',
    characteristics: ['適合捕獵', '利於破壞', '執法除惡', '改革創新'],
    auspicious: false,
    warning: '忌嫁娶、合作',
    interpretation: '庚金為陽，象徵刀劍、刑殺、變革。主阻隔、困難，百事不宜，唯利於執法、捕獵、破除。',
  },
  '辛': {
    name: '辛儀',
    element: '陰金',
    nature: '變革、辛苦、細緻',
    characteristics: ['適合改過', '利於學習', '精細工作', '反思調整'],
    auspicious: false,
    warning: '忌開業、投資',
    interpretation: '辛金為陰，象徵首飾、辛苦、變革。主辛勞、變動，不宜開創，適合修正錯誤、精進學習。',
  },
  '壬': {
    name: '壬儀',
    element: '陽水',
    nature: '流動、困難、奔放',
    characteristics: ['適合行船', '利於運輸', '流動生財', '冒險嘗試'],
    auspicious: false,
    warning: '忌固守、婚嫁',
    interpretation: '壬水為陽，象徵江河、困難、流動。主變動、不穩，不宜固守，適合流通、運輸、冒險。',
  },
  '癸': {
    name: '癸儀',
    element: '陰水',
    nature: '閉塞、隱秘、柔弱',
    characteristics: ['適合隱蔽', '利於修煉', '暗中籌謀', '保存實力'],
    auspicious: false,
    warning: '忌開張、遠行',
    interpretation: '癸水為陰，象徵雨露、閉塞、隱秘。主閉塞、困頓，百事不宜，適合修煉、隱蔽、等待。',
  },
} as const;

// 三奇六儀組合解釋（十天干克應）
export const QIYI_COMBINATIONS: Record<string, Record<string, {
  name: string;
  interpretation: string;
  auspicious: '大吉' | '吉' | '平' | '凶' | '大凶';
  advice: string;
  classical: string;
}>> = {
  // 乙奇組合
  '乙': {
    '戊': {
      name: '陰害陽門',
      interpretation: '乙木克戊土，為陰害陽門。主先吉後凶，財利可求但需防損耗。',
      auspicious: '平',
      advice: '求財有利，但需防範損耗，不宜長期投資',
      classical: '乙木克戊土，名曰陰害陽門，利於陰人陰事，不利陽事',
    },
    '己': {
      name: '日奇入墓',
      interpretation: '乙木入己土墓庫，日奇入墓。主晦澀不明，事多阻隔。',
      auspicious: '凶',
      advice: '事業受阻，宜守不宜攻，等待時機',
      classical: '日奇入霧，凶門者必凶，吉門者亦不利',
    },
    '庚': {
      name: '日奇被刑',
      interpretation: '乙木被庚金所克，日奇被刑。主刑傷、官非、疾病。',
      auspicious: '大凶',
      advice: '百事忌用，遠行不利，當避其鋒',
      classical: '庚金克乙木，日奇受刑，百事凶',
    },
    '辛': {
      name: '龍逃走',
      interpretation: '乙木被辛金所克，為龍逃走。主變動、逃亡、失去。',
      auspicious: '凶',
      advice: '事業變動，人事分離，宜靜守',
      classical: '辛為虎，乙為龍，虎來傷龍，故為龍逃走',
    },
    '壬': {
      name: '日奇入地',
      interpretation: '乙木生壬水，日奇入地。主沉淪、退縮、暗中進行。',
      auspicious: '平',
      advice: '宜暗中行事，不宜張揚，適合謀劃',
      classical: '日奇入地，利於陰私，不利陽事',
    },
    '癸': {
      name: '華蓋逢星',
      interpretation: '乙木生癸水，華蓋逢星。主文書、印信、宗教、學術。',
      auspicious: '吉',
      advice: '利於讀書、考試、宗教活動、文書處理',
      classical: '華蓋逢星，主文章、技藝、學問',
    },
  },
  // 丙奇組合
  '丙': {
    '戊': {
      name: '飛鳥跌穴',
      interpretation: '丙火生戊土，飛鳥跌穴。主貴人提攜，百事順遂。',
      auspicious: '大吉',
      advice: '諸事皆宜，貴人相助，可大展鴻圖',
      classical: '飛鳥跌穴，諸事吉，謀事易成',
    },
    '己': {
      name: '火悖地戶',
      interpretation: '丙火入己土，火悖地戶。主內亂、家庭不和、私下爭競。',
      auspicious: '凶',
      advice: '家宅不寧，內部有爭，宜調和',
      classical: '火悖地戶，主淫佚、內亂',
    },
    '庚': {
      name: '熒惑白',
      interpretation: '丙火克庚金，熒惑白。主贼來刑殺，雙方受損。',
      auspicious: '凶',
      advice: '爭鬥相傷，兩敗俱傷，當避之',
      classical: '熒惑白，贼來刑殺，客主俱傷',
    },
    '辛': {
      name: '謀事就成',
      interpretation: '丙火克辛金，謀事就成。主陰私合和，謀事可成。',
      auspicious: '吉',
      advice: '私事可成，合作順利，但不宜公開',
      classical: '丙辛合，謀事就成，利於陰私',
    },
    '壬': {
      name: '火入天羅',
      interpretation: '丙火被壬水克，火入天羅。主阻礙、困難、防不勝防。',
      auspicious: '凶',
      advice: '事多阻礙，防不勝防，宜守不宜進',
      classical: '火入天羅，凶，百事不利',
    },
    '癸': {
      name: '華蓋悖師',
      interpretation: '丙火受癸水克，華蓋悖師。主文書、印信不利，貴人缺席。',
      auspicious: '凶',
      advice: '文書不利，貴人無力，當自求多福',
      classical: '華蓋悖師，貴人缺席，文書不利',
    },
  },
  // 丁奇組合
  '丁': {
    '戊': {
      name: '青龍轉光',
      interpretation: '丁火生戊土，青龍轉光。主貴人提攜，文書顯達。',
      auspicious: '大吉',
      advice: '求財可獲，謁貴可見，考試有望',
      classical: '青龍轉光，貴人提攜，百事吉',
    },
    '己': {
      name: '火入勾陳',
      interpretation: '丁火入己土，火入勾陳。主內亂、猜疑、官非纏身。',
      auspicious: '凶',
      advice: '官非纏身，內部猜疑，宜清白行事',
      classical: '火入勾陳，主內亂、官非',
    },
    '庚': {
      name: '年月阻隔',
      interpretation: '丁火克庚金，年月阻隔。主長期阻隔，事難速成。',
      auspicious: '凶',
      advice: '事多阻隔，需耐心等待，不宜急進',
      classical: '年月阻隔，事多反覆，久而不決',
    },
    '辛': {
      name: '朱雀入狱',
      interpretation: '丁火克辛金，朱雀入狱。主囚獄、官非、錯誤。',
      auspicious: '大凶',
      advice: '官非囚獄，錯誤難免，當謹言慎行',
      classical: '朱雀入狱，主囚獄、官非、錯誤',
    },
    '壬': {
      name: '五神互合',
      interpretation: '丁火合壬水，五神互合。主陰私和合，感情事宜。',
      auspicious: '吉',
      advice: '感情和合，私事可成，但不宜公開',
      classical: '五神互合，主陰私和合',
    },
    '癸': {
      name: '朱雀投江',
      interpretation: '丁火被癸水克，朱雀投江。主文書、印信沉淪，口舌是非。',
      auspicious: '大凶',
      advice: '文書沉淪，口舌是非，當避其鋒',
      classical: '朱雀投江，主文書沉淪、口舌',
    },
  },
  // 戊儀組合
  '戊': {
    '乙': {
      name: '青龍和會',
      interpretation: '戊土被乙木克，青龍和會。主和睦、合作、財利。',
      auspicious: '吉',
      advice: '合作順利，財利可求，人和事順',
      classical: '青龍和會，主和睦、合作',
    },
    '丙': {
      name: '青龍返首',
      interpretation: '丙火生戊土，青龍返首。主貴人提攜，事業高升。',
      auspicious: '大吉',
      advice: '事業高升，貴人相助，可大展宏圖',
      classical: '青龍返首，大吉，貴人提攜',
    },
    '丁': {
      name: '青龍華蓋',
      interpretation: '丁火生戊土，青龍華蓋。主文書、印信、宗教事宜。',
      auspicious: '吉',
      advice: '利於文書、印信、宗教活動',
      classical: '青龍華蓋，主文章、技藝',
    },
  },
  // 己儀組合
  '己': {
    '乙': {
      name: '日奇入霧',
      interpretation: '己土為乙木之墓，日奇入霧。主晦澀不明，事多阻隔。',
      auspicious: '凶',
      advice: '事業受阻，宜守不宜攻',
      classical: '日奇入霧，凶門必凶',
    },
    '丙': {
      name: '火悖地戶',
      interpretation: '丙火入己土，火悖地戶。主內亂、家庭不和。',
      auspicious: '凶',
      advice: '家宅不寧，宜調和',
      classical: '火悖地戶，主淫佚、內亂',
    },
    '丁': {
      name: '朱雀入墓',
      interpretation: '丁火入己土，朱雀入墓。主文書不利，官非纏身。',
      auspicious: '凶',
      advice: '文書不利，官非纏身',
      classical: '朱雀入墓，主文書不利',
    },
  },
  // 庚儀組合
  '庚': {
    '乙': {
      name: '日奇受刑',
      interpretation: '庚金克乙木，日奇受刑。主刑傷、官非、疾病。',
      auspicious: '大凶',
      advice: '百事忌用，遠行不利',
      classical: '日奇受刑，百事凶',
    },
    '丙': {
      name: '熒惑白',
      interpretation: '丙火克庚金，熒惑白。主贼來刑殺，雙方受損。',
      auspicious: '凶',
      advice: '爭鬥相傷，兩敗俱傷',
      classical: '熒惑白，客主俱傷',
    },
    '丁': {
      name: '年月阻隔',
      interpretation: '丁火克庚金，年月阻隔。主長期阻隔，事難速成。',
      auspicious: '凶',
      advice: '事多阻隔，需耐心等待',
      classical: '年月阻隔，久而不決',
    },
  },
  // 辛儀組合
  '辛': {
    '乙': {
      name: '白虎猖狂',
      interpretation: '辛金克乙木，白虎猖狂。主刑傷、損失、變動。',
      auspicious: '大凶',
      advice: '損失難免，宜守財物',
      classical: '白虎猖狂，主刑傷、損失',
    },
    '丙': {
      name: '乾合悖師',
      interpretation: '辛金被丙火克，乾合悖師。主陰私合和，文書印信。',
      auspicious: '平',
      advice: '私事可成，文書順利',
      classical: '乾合悖師，主陰私',
    },
    '丁': {
      name: '獄神得奇',
      interpretation: '辛金被丁火克，獄神得奇。主囚獄、官非、錯誤。',
      auspicious: '大凶',
      advice: '官非囚獄，當謹言慎行',
      classical: '獄神得奇，主囚獄',
    },
  },
  // 壬儀組合
  '壬': {
    '乙': {
      name: '蛇夭矯',
      interpretation: '壬水生乙木，蛇夭矯。主虛驚、變動、不利。',
      auspicious: '凶',
      advice: '虛驚一場，宜靜守',
      classical: '蛇夭矯，主虛驚',
    },
    '丙': {
      name: '火入天羅',
      interpretation: '壬水克丙火，火入天羅。主阻礙、困難。',
      auspicious: '凶',
      advice: '事多阻礙，防不勝防',
      classical: '火入天羅，凶',
    },
    '丁': {
      name: '五神互合',
      interpretation: '壬水合丁火，五神互合。主陰私和合。',
      auspicious: '吉',
      advice: '感情和合，私事可成',
      classical: '五神互合，主陰私',
    },
  },
  // 癸儀組合
  '癸': {
    '乙': {
      name: '華蓋逢星',
      interpretation: '癸水生乙木，華蓋逢星。主文章、技藝、學問。',
      auspicious: '吉',
      advice: '利於讀書、考試、學習',
      classical: '華蓋逢星，主文章',
    },
    '丙': {
      name: '悖師',
      interpretation: '癸水克丙火，悖師。主貴人缺席，文書不利。',
      auspicious: '凶',
      advice: '貴人無力，當自求多福',
      classical: '悖師，貴人缺席',
    },
    '丁': {
      name: '朱雀投江',
      interpretation: '癸水克丁火，朱雀投江。主口舌是非，文書沉淪。',
      auspicious: '大凶',
      advice: '口舌是非，當避其鋒',
      classical: '朱雀投江，主口舌',
    },
  },
};

// 取得天干組合解釋
export function getQiyiCombination(stem1: string, stem2: string): {
  name: string;
  interpretation: string;
  auspicious: '大吉' | '吉' | '平' | '凶' | '大凶';
  advice: string;
  classical: string;
} | null {
  // 嘗試兩種順序
  const forward = QIYI_COMBINATIONS[stem1]?.[stem2];
  if (forward) return forward;
  
  const backward = QIYI_COMBINATIONS[stem2]?.[stem1];
  if (backward) return backward;
  
  return null;
}

// 判斷是否為三奇
export function isOddity(stem: string): boolean {
  return stem === '乙' || stem === '丙' || stem === '丁';
}

// 取得天干詳細資料
export function getStemInfo(stem: string): {
  name: string;
  title?: string;
  element: string;
  nature: string;
  auspicious: boolean;
  interpretation: string;
} | null {
  if (THREE_ODDITIES[stem as keyof typeof THREE_ODDITIES]) {
    const info = THREE_ODDITIES[stem as keyof typeof THREE_ODDITIES];
    return {
      name: info.name,
      title: info.title,
      element: info.element,
      nature: info.nature,
      auspicious: info.auspicious,
      interpretation: `${info.name}屬${info.element}，${info.nature}。${info.characteristics.join('、')}。`,
    };
  }
  
  if (SIX_YI[stem as keyof typeof SIX_YI]) {
    const info = SIX_YI[stem as keyof typeof SIX_YI];
    return {
      name: info.name,
      element: info.element,
      nature: info.nature,
      auspicious: info.auspicious,
      interpretation: info.interpretation,
    };
  }
  
  return null;
}
