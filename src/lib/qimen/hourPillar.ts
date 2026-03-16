/**
 * 時柱本地計算模組
 * 
 * 時辰（時柱）在奇門遁甲中至關重要：
 * - 每個時辰（2小時）對應一個奇門格局
 * - 時柱決定「刻家奇門」的輪轉，影響八門九星位置
 * 
 * 計算方式：
 * 1. 根據實際時間 → 確定地支（十二時辰）
 * 2. 根據日干 → 五鼠遁元法確定時干
 * 3. 時干 + 時支 = 時柱（如「甲子」時）
 */

// 十天干
const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;

// 十二地支
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

// 十二時辰對照表
export const SHICHEN = [
  { branch: '子', name: '子時', start: 23, end: 1,  label: '子時 (23:00-00:59)' },
  { branch: '丑', name: '丑時', start: 1,  end: 3,  label: '丑時 (01:00-02:59)' },
  { branch: '寅', name: '寅時', start: 3,  end: 5,  label: '寅時 (03:00-04:59)' },
  { branch: '卯', name: '卯時', start: 5,  end: 7,  label: '卯時 (05:00-06:59)' },
  { branch: '辰', name: '辰時', start: 7,  end: 9,  label: '辰時 (07:00-08:59)' },
  { branch: '巳', name: '巳時', start: 9,  end: 11, label: '巳時 (09:00-10:59)' },
  { branch: '午', name: '午時', start: 11, end: 13, label: '午時 (11:00-12:59)' },
  { branch: '未', name: '未時', start: 13, end: 15, label: '未時 (13:00-14:59)' },
  { branch: '申', name: '申時', start: 15, end: 17, label: '申時 (15:00-16:59)' },
  { branch: '酉', name: '酉時', start: 17, end: 19, label: '酉時 (17:00-18:59)' },
  { branch: '戌', name: '戌時', start: 19, end: 21, label: '戌時 (19:00-20:59)' },
  { branch: '亥', name: '亥時', start: 21, end: 23, label: '亥時 (21:00-22:59)' },
] as const;

/**
 * 根據小時數（0-23）取得時辰索引（0-11）
 * 
 * 注意：子時跨越午夜
 * - 23:00-23:59 → 子時（屬於下一日）
 * - 00:00-00:59 → 子時
 */
export function getShichenIndex(hour: number): number {
  if (hour === 23 || hour === 0) return 0;  // 子時
  return Math.floor((hour + 1) / 2);
}

/**
 * 根據小時數取得時辰資訊
 */
export function getShichenInfo(hour: number) {
  const index = getShichenIndex(hour);
  return {
    index,
    ...SHICHEN[index],
  };
}

/**
 * 五鼠遁元法 - 根據日干確定子時的起始天干
 * 
 * 甲己之日起甲子
 * 乙庚之日起丙子
 * 丙辛之日起戊子
 * 丁壬之日起庚子
 * 戊癸之日起壬子
 */
function getHourStartStem(dayStem: string): number {
  const stemIndex = STEMS.indexOf(dayStem as typeof STEMS[number]);
  if (stemIndex === -1) return 0;

  // 日干 % 5 決定起始時干
  const group = stemIndex % 5;
  // 甲己→甲(0), 乙庚→丙(2), 丙辛→戊(4), 丁壬→庚(6), 戊癸→壬(8)
  return (group * 2) % 10;
}

/**
 * 計算時柱（時干支）
 * 
 * @param dayStem 日干（如「甲」「乙」...）
 * @param hour 小時數（0-23）
 * @returns 時柱干支（如「甲子」）
 */
export function calculateHourPillar(dayStem: string, hour: number): string {
  const branchIndex = getShichenIndex(hour);
  const startStemIndex = getHourStartStem(dayStem);

  // 時干 = 起始天干 + 時辰偏移
  const hourStemIndex = (startStemIndex + branchIndex) % 10;

  return `${STEMS[hourStemIndex]}${BRANCHES[branchIndex]}`;
}

/**
 * 判斷是否為早子時（23:00-23:59）
 * 早子時屬於下一天的子時，日干需使用下一天
 */
export function isEarlyZiHour(hour: number): boolean {
  return hour === 23;
}

/**
 * 取得當前時辰的時柱
 */
export function getCurrentHourPillar(dayStem: string): string {
  const now = new Date();
  return calculateHourPillar(dayStem, now.getHours());
}

/**
 * 取得時辰序號（用於奇門局數計算）
 * 子時 = 1, 丑時 = 2, ... 亥時 = 12
 */
export function getShichenNumber(hour: number): number {
  return getShichenIndex(hour) + 1;
}

/**
 * 格式化時間為時辰顯示
 */
export function formatHourToShichen(hour: number): string {
  const info = getShichenInfo(hour);
  return `${info.label}`;
}
