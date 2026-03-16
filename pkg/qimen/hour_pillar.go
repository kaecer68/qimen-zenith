package qimen

// Shichen represents a Chinese double-hour (時辰).
type Shichen struct {
	Branch string
	Name   string
	Start  int
	End    int
	Label  string
}

// SHICHEN is the twelve double-hours ordered from 子時 (index 0).
var SHICHEN = []Shichen{
	{Branch: "子", Name: "子時", Start: 23, End: 1, Label: "子時 (23:00-00:59)"},
	{Branch: "丑", Name: "丑時", Start: 1, End: 3, Label: "丑時 (01:00-02:59)"},
	{Branch: "寅", Name: "寅時", Start: 3, End: 5, Label: "寅時 (03:00-04:59)"},
	{Branch: "卯", Name: "卯時", Start: 5, End: 7, Label: "卯時 (05:00-06:59)"},
	{Branch: "辰", Name: "辰時", Start: 7, End: 9, Label: "辰時 (07:00-08:59)"},
	{Branch: "巳", Name: "巳時", Start: 9, End: 11, Label: "巳時 (09:00-10:59)"},
	{Branch: "午", Name: "午時", Start: 11, End: 13, Label: "午時 (11:00-12:59)"},
	{Branch: "未", Name: "未時", Start: 13, End: 15, Label: "未時 (13:00-14:59)"},
	{Branch: "申", Name: "申時", Start: 15, End: 17, Label: "申時 (15:00-16:59)"},
	{Branch: "酉", Name: "酉時", Start: 17, End: 19, Label: "酉時 (17:00-18:59)"},
	{Branch: "戌", Name: "戌時", Start: 19, End: 21, Label: "戌時 (19:00-20:59)"},
	{Branch: "亥", Name: "亥時", Start: 21, End: 23, Label: "亥時 (21:00-22:59)"},
}

var tenStems = []string{"甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"}
var twelveBranches = []string{"子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"}

// GetShichenIndex returns the shichen index (0-11) for a given 24-hour value.
// 子時 straddles midnight: hour 23 or 0 → index 0.
func GetShichenIndex(hour int) int {
	if hour == 23 || hour == 0 {
		return 0
	}
	return (hour + 1) / 2
}

// ShichenInfo bundles the numeric index with the Shichen detail struct.
type ShichenInfo struct {
	Index   int
	Shichen Shichen
}

// GetShichenInfo returns the shichen metadata for a given hour (0-23).
func GetShichenInfo(hour int) ShichenInfo {
	idx := GetShichenIndex(hour)
	return ShichenInfo{Index: idx, Shichen: SHICHEN[idx]}
}

// getHourStartStem returns the starting stem index for 子時 based on the day stem.
// 五鼠遁元法: 甲己→甲(0), 乙庚→丙(2), 丙辛→戊(4), 丁壬→庚(6), 戊癸→壬(8)
func getHourStartStem(dayStem string) int {
	stemIdx := -1
	for i, s := range tenStems {
		if s == dayStem {
			stemIdx = i
			break
		}
	}
	if stemIdx < 0 {
		return 0
	}
	return (stemIdx % 5 * 2) % 10
}

// CalculateHourPillar returns the GanZhi (干支) string for the hour pillar.
func CalculateHourPillar(dayStem string, hour int) string {
	branchIdx := GetShichenIndex(hour)
	startStemIdx := getHourStartStem(dayStem)
	hourStemIdx := (startStemIdx + branchIdx) % 10
	return tenStems[hourStemIdx] + twelveBranches[branchIdx]
}

// IsEarlyZiHour returns true when hour == 23, which belongs to the next day's 子時.
func IsEarlyZiHour(hour int) bool {
	return hour == 23
}
