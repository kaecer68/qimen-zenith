/**
 * 門星神組合詳解知識庫
 * 基於古典奇門遁甲理論，提供八門、九星、八神組合的專業級分析
 */

import { DOORS, STARS, SPIRITS_YANG, SPIRITS_YIN } from './core';

// 八門基本解釋
export const DOOR_INTERPRETATIONS: Record<string, {
  nature: string;
  summary: string;
  general: string;
  wealth: string;
  career: string;
  relationship: string;
  health: string;
  travel: string;
  study: string;
}> = {
  '休門': {
    nature: '水之象，主安寧、休養、和順',
    summary: '休門吉慶，萬事和順',
    general: '休門屬水，為吉門。主安寧、休養、和順。宜見貴人、調解、嫁娶、納采，不利爭競、訴訟。',
    wealth: '財運平穩，適合守成，不宜冒險投資',
    career: '職場和順，貴人相助，適合調解糾紛',
    relationship: '人際和諧，適合約會、見長輩',
    health: '身體安康，適合休養、調理',
    travel: '旅途平安，適合觀光、度假',
    study: '學習順利，適合靜心研讀',
  },
  '生門': {
    nature: '土之象，主生長、發展、財富',
    summary: '生門大吉，財運亨通',
    general: '生門屬土，為大吉之門。主生長、發展、財富。宜求財、開業、置產、謀事，百事皆吉。',
    wealth: '財運極佳，適合投資、創業、開張',
    career: '事業發展，升遷有望，宜主動出擊',
    relationship: '人緣極佳，適合拓展人脈',
    health: '身體康健，生機勃勃',
    travel: '出行大吉，一帆風順',
    study: '學業進步，知識增長',
  },
  '傷門': {
    nature: '木之象，主傷害、損失、變動',
    summary: '傷門不利，諸事謹慎',
    general: '傷門屬木，為凶門。主傷害、損失、變動。宜捕獵、追債、爭競，不利嫁娶、出行、營造。',
    wealth: '財運不佳，易有損耗，不宜投資',
    career: '職場多變，宜防小人，不宜跳槽',
    relationship: '人際易有摩擦，謹言慎行',
    health: '易有傷病，注意安全',
    travel: '出行不利，易有意外',
    study: '學習受阻，易有挫折',
  },
  '杜門': {
    nature: '木之象，主閉塞、隱蔽、技藝',
    summary: '杜門閉塞，宜技藝',
    general: '杜門屬木，為平門。主閉塞、隱蔽、技藝。宜潛藏、學習、技術工作，不利見貴人、謀事。',
    wealth: '財運閉塞，宜守不宜攻',
    career: '職場隱蔽，適合技術崗位',
    relationship: '人際閉塞，不宜社交',
    health: '宜靜養，適合調理',
    travel: '出行受阻，宜改期',
    study: '適合鑽研技術，獨自學習',
  },
  '景門': {
    nature: '火之象，主文書、文章、虛火',
    summary: '景門中平，文書事宜',
    general: '景門屬火，為中平之門。主文書、文章、虛火。宜文書、考試、訴訟，不利見貴人、謀大事。',
    wealth: '財運虛浮，不宜實業投資',
    career: '適合文職、文書工作',
    relationship: '表面和諧，實則虛浮',
    health: '防虛火上升，注意心肺',
    travel: '出行平平，無大礙',
    study: '利於考試、文書學習',
  },
  '死門': {
    nature: '土之象，主死亡、終結、安葬',
    summary: '死門大凶，百事忌用',
    general: '死門屬土，為大凶之門。主死亡、終結、安葬。宜安葬、捕獵，百事皆忌，諸事不利。',
    wealth: '財運死絕，大破財之象',
    career: '職場終結，升遷無望',
    relationship: '人際斷絕，孤獨之象',
    health: '病重危險，防不測',
    travel: '遠行大凶，當避之',
    study: '學業終結，考試不利',
  },
  '驚門': {
    nature: '金之象，主驚恐、是非、訴訟',
    summary: '驚門凶險，口舌是非',
    general: '驚門屬金，為凶門。主驚恐、是非、訴訟。宜訴訟、爭競，不利謀事、見貴人、出行。',
    wealth: '財運不穩，易有是非損財',
    career: '職場多是非，防官司',
    relationship: '口舌是非，易有爭執',
    health: '驚恐不安，神經衰弱',
    travel: '出行多驚，不宜遠行',
    study: '心神不寧，難以專注',
  },
  '開門': {
    nature: '金之象，主開創、公開、事業',
    summary: '開門吉祥，百事可成',
    general: '開門屬金，為吉門。主開創、公開、事業。宜開業、求財、見貴人、遠行，諸事皆吉。',
    wealth: '財運亨通，適合開創新業',
    career: '事業開創，升遷大吉',
    relationship: '人際開闊，貴人顯達',
    health: '身心開朗，健康良好',
    travel: '出行大吉，遠行有利',
    study: '學業開展，考試順利',
  },
};

// 九星基本解釋
export const STAR_INTERPRETATIONS: Record<string, {
  nature: string;
  summary: string;
  general: string;
  personality: string;
  matters: string;
}> = {
  '天蓬': {
    nature: '水之象，主大、主智、主險',
    summary: '天蓬智慧，但防破耗',
    general: '天蓬星屬水，為智慧之星。主大、主智、主險。聰明機智，善謀略，但易破耗，需防範。',
    personality: '聰明機智，善於謀略，有冒險精神',
    matters: '利於智謀、冒險，不利守成、穩健',
  },
  '天任': {
    nature: '土之象，主勤勞、主田產、主穩健',
    summary: '天任勤勞，穩健有守',
    general: '天任星屬土，為勤勞之星。主勤勞、田產、穩健。任勞任怨，腳踏實地，適合農業、建築。',
    personality: '任勞任怨，腳踏實地，勤奮努力',
    matters: '利於農業、建築、田產，適合長期經營',
  },
  '天沖': {
    nature: '木之象，主衝動、主雷厲、主變動',
    summary: '天沖雷厲，行動迅速',
    general: '天沖星屬木，為行動之星。主衝動、雷厲、變動。行動迅速，雷厲風行，適合軍警、武職。',
    personality: '行動迅速，雷厲風行，有衝勁',
    matters: '利於軍警、武職、競爭，適合快速行動',
  },
  '天輔': {
    nature: '木之象，主文教、主輔助、主智慧',
    summary: '天輔文昌，智慧超群',
    general: '天輔星屬木，為文昌之星。主文教、輔助、智慧。聰明好學，才華洋溢，適合文教、學術。',
    personality: '聰明好學，才華洋溢，有教養',
    matters: '利於文教、學術、考試，適合學習進修',
  },
  '天英': {
    nature: '火之象，主虛火、主文章、主急躁',
    summary: '天英文章，但防虛火',
    general: '天英星屬火，為文章之星。主虛火、文章、急躁。才華出眾，但易虛浮，需腳踏實地。',
    personality: '才華出眾，有表現欲，易急躁',
    matters: '利於文章、表演、文職，需防虛浮',
  },
  '天芮': {
    nature: '土之象，主疾病、主問題、主陰暗',
    summary: '天芮病星，諸事謹慎',
    general: '天芮星屬土，為病星。主疾病、問題、陰暗。易有疾病、問題，需防範，不利健康。',
    personality: '敏感多疑，易有問題，需關懷',
    matters: '不利健康、易有問題，需謹慎防範',
  },
  '天柱': {
    nature: '金之象，主破壞、主災難、主口舌',
    summary: '天柱破壞，口舌是非',
    general: '天柱星屬金，為破壞之星。主破壞、災難、口舌。易有破壞、災難，不利安穩。',
    personality: '直言不諱，易有口舌，剛強不屈',
    matters: '易有破壞、災難，不利和諧',
  },
  '天心': {
    nature: '金之象，主智慧、主醫藥、主管理',
    summary: '天心智慧，管理有方',
    general: '天心星屬金，為智慧之星。主智慧、醫藥、管理。聰明理智，善於管理，適合領導、醫藥。',
    personality: '聰明理智，善於管理，有領導力',
    matters: '利於管理、醫藥、領導，適合決策',
  },
};

// 八神基本解釋
export const SPIRIT_INTERPRETATIONS: Record<string, {
  nature: string;
  summary: string;
  general: string;
  auspicious: boolean;
  matters: string;
}> = {
  '值符': {
    nature: '諸神之首，主貴人、主吉慶',
    summary: '值符降臨，貴人相助',
    general: '值符為八神之首，諸神領袖。主貴人、吉慶、高貴。臨宮則貴人相助，諸事順遂，大吉。',
    auspicious: true,
    matters: '貴人提攜，諸事順遂，大吉大利',
  },
  '螣蛇': {
    nature: '虛詐之神，主虛驚、主怪異',
    summary: '螣蛇虛驚，怪異多端',
    general: '螣蛇為虛詐之神。主虛驚、怪異、纏繞。臨宮則易有虛驚、怪異之事，需防範。',
    auspicious: false,
    matters: '虛驚一場，怪異多端，謹防小人',
  },
  '太陰': {
    nature: '陰佑之神，主陰私、主密謀',
    summary: '太陰陰佑，密謀可成',
    general: '太陰為陰佑之神。主陰私、密謀、暗中相助。臨宮則宜暗中行事，密謀可成。',
    auspicious: true,
    matters: '暗中相助，密謀可成，適合私事',
  },
  '六合': {
    nature: '和合之神，主合作、主婚姻',
    summary: '六和合和，合作順利',
    general: '六合為和合之神。主合作、婚姻、和合。臨宮則人和事順，合作愉快，利於婚姻。',
    auspicious: true,
    matters: '合作順利，婚姻和合，人際圓融',
  },
  '白虎': {
    nature: '刑殺之神，主刑傷、主凶災',
    summary: '白虎凶煞，刑傷堪憂',
    general: '白虎為刑殺之神。主刑傷、凶災、疾病。臨宮則易有刑傷、凶災，需謹慎防範。',
    auspicious: false,
    matters: '刑傷凶災，疾病纏身，需謹慎防範',
  },
  '玄武': {
    nature: '陰私之神，主盜賊、主陰私',
    summary: '玄武陰私，防範盜賊',
    general: '玄武為陰私之神。主盜賊、陰私、暧昧。臨宮則需防盜賊、小人，不宜信任他人。',
    auspicious: false,
    matters: '防範盜賊，謹防小人，不宜信任',
  },
  '九地': {
    nature: '堅牢之神，主潛藏、主穩固',
    summary: '九地堅牢，潛藏為宜',
    general: '九地為堅牢之神。主潛藏、穩固、長久。臨宮則宜潛藏修養，穩固發展，不宜急進。',
    auspicious: true,
    matters: '潛藏修養，穩固發展，長久之事',
  },
  '九天': {
    nature: '威悍之神，主高遠、主進取',
    summary: '九天威悍，志向高遠',
    general: '九天為威悍之神。主高遠、進取、飛揚。臨宮則志向高遠，宜進取開創，但防好高騖遠。',
    auspicious: true,
    matters: '志向高遠，進取開創，但防好高騖遠',
  },
};

// 門星組合解釋（核心組合）
export const DOOR_STAR_COMBINATIONS: Record<string, Record<string, {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  interpretation: string;
  advice: string;
}>> = {
  '休門': {
    '天蓬': { level: '平', interpretation: '休閒享樂，不宜爭競', advice: '適合休閒，不宜重大決策' },
    '天任': { level: '吉', interpretation: '安穩守成，適合學習', advice: '穩步前進，適合累積實力' },
    '天沖': { level: '平', interpretation: '靜中有動，不宜遠行', advice: '適合本地活動，不宜遠行' },
    '天輔': { level: '吉', interpretation: '文昌入休，利於讀書', advice: '學習順利，適合進修' },
    '天英': { level: '平', interpretation: '火水未濟，事多反覆', advice: '事多反覆，需耐心等待' },
    '天芮': { level: '凶', interpretation: '病星入休，健康堪憂', advice: '注意健康，適合調養' },
    '天柱': { level: '平', interpretation: '驚門入休，口舌可免', advice: '避免爭執，保持平和' },
    '天心': { level: '大吉', interpretation: '貴人相助，謀事可成', advice: '貴人相助，可積極進取' },
  },
  '生門': {
    '天蓬': { level: '吉', interpretation: '財源廣進，但防破耗', advice: '財運良好，但需節制開支' },
    '天任': { level: '大吉', interpretation: '田產興旺，適合置業', advice: '適合置產、投資不動產' },
    '天沖': { level: '吉', interpretation: '動中生財，適合開拓', advice: '適合開拓新市場、新業務' },
    '天輔': { level: '吉', interpretation: '文教興盛，適合教學', advice: '文教事業興旺，適合教學' },
    '天英': { level: '吉', interpretation: '名利雙收，但防虛火', advice: '名利可期，但需腳踏實地' },
    '天芮': { level: '平', interpretation: '病中有生，轉危為安', advice: '逢凶化吉，轉危為安' },
    '天柱': { level: '平', interpretation: '驚中有生，險中求財', advice: '險中求財，需謹慎評估' },
    '天心': { level: '大吉', interpretation: '正道生財，誠信為本', advice: '正道經營，誠信立業' },
  },
  '傷門': {
    '天蓬': { level: '凶', interpretation: '傷上加傷，損失難免', advice: '損失難免，當守財物' },
    '天任': { level: '平', interpretation: '勤勞受傷，需防意外', advice: '工作需防意外，注意安全' },
    '天沖': { level: '凶', interpretation: '沖傷並至，變動劇烈', advice: '變動劇烈，需穩定情緒' },
    '天輔': { level: '凶', interpretation: '文教受傷，學業受阻', advice: '學業受阻，需加倍努力' },
    '天英': { level: '凶', interpretation: '火傷並發，虛火上攻', advice: '注意健康，防虛火' },
    '天芮': { level: '大凶', interpretation: '病傷交加，凶險異常', advice: '健康堪憂，速就醫調養' },
    '天柱': { level: '大凶', interpretation: '傷破並臨，破壞嚴重', advice: '破壞嚴重，需謹慎防範' },
    '天心': { level: '凶', interpretation: '智慧受傷，決策錯誤', advice: '決策需謹慎，避免錯誤' },
  },
  '杜門': {
    '天蓬': { level: '平', interpretation: '閉塞智慧，謀略難施', advice: '謀略暫緩，等待時機' },
    '天任': { level: '吉', interpretation: '勤勞閉塞，適合深耕', advice: '深耕內功，累積實力' },
    '天沖': { level: '凶', interpretation: '行動閉塞，進退兩難', advice: '進退兩難，需耐心等待' },
    '天輔': { level: '吉', interpretation: '文昌閉塞，獨自研讀', advice: '適合獨自學習，深入研究' },
    '天英': { level: '平', interpretation: '文章閉塞，虛火內藏', advice: '內修外斂，不宜表現' },
    '天芮': { level: '凶', interpretation: '病閉交加，問題隱藏', advice: '問題隱藏，需深入檢視' },
    '天柱': { level: '凶', interpretation: '破壞閉塞，口舌暗藏', advice: '口舌暗藏，需防範' },
    '天心': { level: '平', interpretation: '智慧閉塞，潛心修養', advice: '潛心修養，等待時機' },
  },
  '景門': {
    '天蓬': { level: '平', interpretation: '虛火智慧，謀略虛浮', advice: '謀略需務實，不宜虛浮' },
    '天任': { level: '吉', interpretation: '勤勞文章，文職有利', advice: '適合文職工作，穩健發展' },
    '天沖': { level: '平', interpretation: '行動文章，雷厲風行', advice: '行動有力，但需謀劃' },
    '天輔': { level: '大吉', interpretation: '文昌文章，才華洋溢', advice: '才華洋溢，適合表現' },
    '天英': { level: '吉', interpretation: '文章虛火，才華出眾', advice: '才華出眾，但需腳踏實地' },
    '天芮': { level: '凶', interpretation: '病虛交加，健康堪憂', advice: '健康堪憂，需注意調養' },
    '天柱': { level: '凶', interpretation: '口舌文章，是非難免', advice: '是非難免，謹言慎行' },
    '天心': { level: '吉', interpretation: '智慧文章，管理有方', advice: '管理有方，適合領導' },
  },
  '死門': {
    '天蓬': { level: '大凶', interpretation: '死絕智慧，謀略失敗', advice: '謀略失敗，當止則止' },
    '天任': { level: '凶', interpretation: '勤勞死絕，徒勞無功', advice: '徒勞無功，需改變方向' },
    '天沖': { level: '大凶', interpretation: '死絕行動，凶險異常', advice: '行動凶險，當靜守' },
    '天輔': { level: '凶', interpretation: '文昌死絕，學業終結', advice: '學業受阻，需調整方向' },
    '天英': { level: '凶', interpretation: '虛火死絕，才華埋沒', advice: '才華難展，需等待時機' },
    '天芮': { level: '大凶', interpretation: '病死並臨，凶險至極', advice: '凶險至極，當避其鋒' },
    '天柱': { level: '大凶', interpretation: '破壞死絕，災難難免', advice: '災難難免，當謹慎防範' },
    '天心': { level: '凶', interpretation: '智慧死絕，決策錯誤', advice: '決策錯誤，當重新評估' },
  },
  '驚門': {
    '天蓬': { level: '凶', interpretation: '驚恐智慧，謀略失算', advice: '謀略失算，需重新規劃' },
    '天任': { level: '平', interpretation: '勤勞驚恐，穩中有驚', advice: '穩中有驚，需防意外' },
    '天沖': { level: '凶', interpretation: '驚沖並臨，變動劇烈', advice: '變動劇烈，需穩定情緒' },
    '天輔': { level: '凶', interpretation: '文昌驚恐，學業受阻', advice: '學業受阻，需加倍努力' },
    '天英': { level: '凶', interpretation: '虛火驚恐，心神不寧', advice: '心神不寧，需靜心調養' },
    '天芮': { level: '大凶', interpretation: '病驚交加，健康堪憂', advice: '健康堪憂，速就醫調養' },
    '天柱': { level: '大凶', interpretation: '口舌驚恐，是非不斷', advice: '是非不斷，當避其鋒' },
    '天心': { level: '凶', interpretation: '智慧驚恐，決策困難', advice: '決策困難，需謹慎評估' },
  },
  '開門': {
    '天蓬': { level: '吉', interpretation: '開創智慧，謀略成功', advice: '謀略成功，可大展鴻圖' },
    '天任': { level: '大吉', interpretation: '勤勞開創，事業有成', advice: '事業有成，適合創業' },
    '天沖': { level: '吉', interpretation: '行動開創，雷厲風行', advice: '行動有力，適合開拓' },
    '天輔': { level: '大吉', interpretation: '文昌開創，文教興盛', advice: '文教興盛，適合教學' },
    '天英': { level: '吉', interpretation: '虛火開創，名利可期', advice: '名利可期，但需務實' },
    '天芮': { level: '平', interpretation: '病開並臨，轉危為安', advice: '逢凶化吉，轉危為安' },
    '天柱': { level: '平', interpretation: '口舌開創，是非難免', advice: '是非難免，但可化解' },
    '天心': { level: '大吉', interpretation: '智慧開創，管理有方', advice: '管理有方，適合領導' },
  },
};

// 門神組合解釋
export const DOOR_SPIRIT_COMBINATIONS: Record<string, Record<string, {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  interpretation: string;
  advice: string;
}>> = {
  '休門': {
    '值符': { level: '大吉', interpretation: '貴人垂青，機緣絕佳', advice: '貴人相助，諸事皆宜' },
    '螣蛇': { level: '平', interpretation: '虛驚一場，謹防小人', advice: '虛驚一場，宜靜守' },
    '太陰': { level: '吉', interpretation: '暗中得利，隱蔽為上', advice: '暗中行事，密謀可成' },
    '六合': { level: '大吉', interpretation: '和合順利，利於合作', advice: '合作順利，人際圓融' },
    '白虎': { level: '平', interpretation: '官非可免，但防意外', advice: '官非可免，但需謹慎' },
    '玄武': { level: '凶', interpretation: '防範小人，謹守財物', advice: '防範小人，謹守財物' },
    '九地': { level: '吉', interpretation: '潛藏修養，宜靜不宜動', advice: '潛藏修養，等待時機' },
    '九天': { level: '吉', interpretation: '志向高遠，但防好高騖遠', advice: '志向高遠，但需務實' },
  },
  '生門': {
    '值符': { level: '大吉', interpretation: '貴人提攜，財運亨通', advice: '貴人提攜，可大展鴻圖' },
    '螣蛇': { level: '平', interpretation: '財運虛浮，謹防詐騙', advice: '謹防詐騙，需核實' },
    '太陰': { level: '大吉', interpretation: '暗中生財，密謀可成', advice: '暗中生財，適合私事' },
    '六合': { level: '大吉', interpretation: '合作生財，人和事順', advice: '合作生財，適合合夥' },
    '白虎': { level: '凶', interpretation: '財來有險，需防破耗', advice: '財來有險，需謹慎' },
    '玄武': { level: '凶', interpretation: '財物防盜，謹防小人', advice: '謹防小人，守護財物' },
    '九地': { level: '吉', interpretation: '穩固生財，長久發展', advice: '穩固發展，適合長期' },
    '九天': { level: '大吉', interpretation: '高遠生財，開拓新業', advice: '開拓新業，志向高遠' },
  },
  '開門': {
    '值符': { level: '大吉', interpretation: '開創大吉，貴人相助', advice: '開創大吉，可積極進取' },
    '螣蛇': { level: '平', interpretation: '開創有驚，謹防虛詐', advice: '謹防虛詐，需核實' },
    '太陰': { level: '吉', interpretation: '暗中開創，密謀可成', advice: '暗中籌劃，適合私事' },
    '六合': { level: '大吉', interpretation: '合作開創，人和事順', advice: '合作開創，適合合夥' },
    '白虎': { level: '凶', interpretation: '開創有險，需防官非', advice: '需防官非，謹慎行事' },
    '玄武': { level: '凶', interpretation: '開創防盜，謹防小人', advice: '謹防小人，保護成果' },
    '九地': { level: '吉', interpretation: '穩固開創，腳踏實地', advice: '腳踏實地，穩步發展' },
    '九天': { level: '大吉', interpretation: '高遠開創，志向遠大', advice: '志向遠大，可大展鴻圖' },
  },
};

// 取得門星組合解釋
export function getDoorStarCombination(door: string, star: string): {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  interpretation: string;
  advice: string;
} | null {
  return DOOR_STAR_COMBINATIONS[door]?.[star] || null;
}

// 取得門神組合解釋
export function getDoorSpiritCombination(door: string, spirit: string): {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  interpretation: string;
  advice: string;
} | null {
  return DOOR_SPIRIT_COMBINATIONS[door]?.[spirit] || null;
}

// 分析完整組合（門+星+神）
export function analyzeCombination(
  door: string,
  star: string,
  spirit: string
): {
  level: '大吉' | '吉' | '平' | '凶' | '大凶';
  interpretation: string;
  advice: string;
  details: {
    doorInterp: string;
    starInterp: string;
    spiritInterp: string;
    doorStar: string | null;
    doorSpirit: string | null;
  };
} {
  const doorInfo = DOOR_INTERPRETATIONS[door];
  const starInfo = STAR_INTERPRETATIONS[star];
  const spiritInfo = SPIRIT_INTERPRETATIONS[spirit];
  
  const doorStar = getDoorStarCombination(door, star);
  const doorSpirit = getDoorSpiritCombination(door, spirit);
  
  // 計算綜合等級
  const levelScores: Record<string, number> = {
    '大吉': 5, '吉': 4, '平': 3, '凶': 2, '大凶': 1,
  };
  
  let totalScore = 0;
  let count = 0;
  
  if (doorStar) {
    totalScore += levelScores[doorStar.level];
    count++;
  }
  if (doorSpirit) {
    totalScore += levelScores[doorSpirit.level];
    count++;
  }
  
  // 根據神煞調整
  if (spiritInfo) {
    if (spirit === '值符') totalScore += 1;
    if (spirit === '白虎' || spirit === '玄武') totalScore -= 1;
  }
  
  const avgScore = count > 0 ? totalScore / count : 3;
  
  let level: '大吉' | '吉' | '平' | '凶' | '大凶';
  if (avgScore >= 4.5) level = '大吉';
  else if (avgScore >= 3.5) level = '吉';
  else if (avgScore >= 2.5) level = '平';
  else if (avgScore >= 1.5) level = '凶';
  else level = '大凶';
  
  // 生成綜合解釋
  const parts: string[] = [];
  if (doorStar) parts.push(doorStar.interpretation);
  if (doorSpirit) parts.push(doorSpirit.interpretation);
  if (parts.length === 0) {
    parts.push(`${door}臨${star}、${spirit}，${doorInfo?.general || ''}`);
  }
  
  // 生成建議
  const advices: string[] = [];
  if (doorStar) advices.push(doorStar.advice);
  if (doorSpirit) advices.push(doorSpirit.advice);
  if (advices.length === 0) {
    advices.push(doorInfo?.general || '謹慎行事');
  }
  
  return {
    level,
    interpretation: parts.join('；'),
    advice: advices.join('；'),
    details: {
      doorInterp: doorInfo?.general || '',
      starInterp: starInfo?.general || '',
      spiritInterp: spiritInfo?.general || '',
      doorStar: doorStar?.interpretation || null,
      doorSpirit: doorSpirit?.interpretation || null,
    },
  };
}
