package qimen

import (
	"fmt"
	"math/rand"
	"time"
)

// Palace holds the metadata for one of the nine Qimen palaces.
type Palace struct {
	Index     int
	Name      string
	Trigram   string
	Direction string
	Element   string
}

// PALACES lists all nine palaces. Index 5 (中五宮) is included but typically
// resolves to palace 2 (坤二宮) during plate construction.
var PALACES = []Palace{
	{Index: 4, Name: "巽四宮", Trigram: "巽", Direction: "東南", Element: "木"},
	{Index: 9, Name: "離九宮", Trigram: "離", Direction: "南", Element: "火"},
	{Index: 2, Name: "坤二宮", Trigram: "坤", Direction: "西南", Element: "土"},
	{Index: 3, Name: "震三宮", Trigram: "震", Direction: "東", Element: "木"},
	{Index: 5, Name: "中五宮", Trigram: "中", Direction: "中央", Element: "土"},
	{Index: 7, Name: "兌七宮", Trigram: "兌", Direction: "西", Element: "金"},
	{Index: 8, Name: "艮八宮", Trigram: "艮", Direction: "東北", Element: "土"},
	{Index: 1, Name: "坎一宮", Trigram: "坎", Direction: "北", Element: "水"},
	{Index: 6, Name: "乾六宮", Trigram: "乾", Direction: "西北", Element: "金"},
}

// PalaceMap is a lookup from palace index to Palace struct, built at init.
var PalaceMap map[int]Palace

// QIYI_SEQUENCE is the canonical order: Six Yi then Three Oddities.
var QIYI_SEQUENCE = []string{"戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"}

// Door represents an Eight-Door entry.
type Door struct {
	Name       string
	Element    string
	Auspicious string
	Direction  string
}

// DOORS lists the eight doors.
var DOORS = []Door{
	{Name: "休門", Element: "水", Auspicious: "大吉", Direction: "北"},
	{Name: "生門", Element: "土", Auspicious: "大吉", Direction: "東北"},
	{Name: "傷門", Element: "木", Auspicious: "凶", Direction: "東"},
	{Name: "杜門", Element: "木", Auspicious: "平", Direction: "東南"},
	{Name: "景門", Element: "火", Auspicious: "中平", Direction: "南"},
	{Name: "死門", Element: "土", Auspicious: "大凶", Direction: "西南"},
	{Name: "驚門", Element: "金", Auspicious: "凶", Direction: "西"},
	{Name: "開門", Element: "金", Auspicious: "吉", Direction: "西北"},
}

// SPIRITS_YANG is the eight spirits in yang-dun (陽遁) order.
var SPIRITS_YANG = []string{"值符", "螣蛇", "太陰", "六合", "白虎", "玄武", "九地", "九天"}

// SPIRITS_YIN is the eight spirits in yin-dun (陰遁) order.
var SPIRITS_YIN = []string{"值符", "九天", "九地", "玄武", "白虎", "六合", "太陰", "螣蛇"}

// Star represents a Nine-Star entry.
type Star struct {
	Name       string
	Element    string
	Auspicious string
	Number     int
}

// STARS lists the nine stars (天禽 is omitted as it resides in 中五 with 天芮).
var STARS = []Star{
	{Name: "天蓬", Element: "水", Auspicious: "凶", Number: 1},
	{Name: "天任", Element: "土", Auspicious: "吉", Number: 8},
	{Name: "天沖", Element: "木", Auspicious: "吉", Number: 3},
	{Name: "天輔", Element: "木", Auspicious: "大吉", Number: 4},
	{Name: "天英", Element: "火", Auspicious: "中平", Number: 9},
	{Name: "天芮", Element: "土", Auspicious: "凶", Number: 2},
	{Name: "天柱", Element: "金", Auspicious: "凶", Number: 6},
	{Name: "天心", Element: "金", Auspicious: "大吉", Number: 7},
}

// EARTH_PLATE maps each heaven-stem to its fixed palace position.
var EARTH_PLATE = map[string]int{
	"戊": 5, "己": 6, "庚": 7, "辛": 8, "壬": 9,
	"癸": 1, "丁": 2, "丙": 3, "乙": 4,
}

func init() {
	PalaceMap = make(map[int]Palace, len(PALACES))
	for _, p := range PALACES {
		PalaceMap[p.Index] = p
	}
	rand.Seed(time.Now().UnixNano())
}

// ──────────────────────────────────────────────────────────────────────────────
// Plate
// ──────────────────────────────────────────────────────────────────────────────

// QimenPlate is the complete Qimen Dunjia plate for a given date/hour.
type QimenPlate struct {
	Date        string
	YearGanZhi  string
	MonthGanZhi string
	DayGanZhi   string
	HourGanZhi  string
	Hour        int
	Shichen     string
	JuNumber    int
	IsYang      bool
	YinYang     string
	SolarTerm   string
	EarthPlate  map[int]string
	HeavenPlate map[int]string
	HumanPlate  map[int]string
	SpiritPlate map[int]string
	StarsPlate  map[int]string
}

// GetDailyQimenJuNumber derives the ju-number (1–9) and yin/yang flag.
func GetDailyQimenJuNumber(date time.Time, solarTermIndex int) (juNumber int, isYang bool) {
	// 冬至(0)→夏至(11) = 陽遁; 夏至(12)→冬至(23) = 陰遁
	isYang = solarTermIndex >= 0 && solarTermIndex < 12

	dayOfYear := dayOfYear(date)
	juNumber = dayOfYear % 9
	if juNumber == 0 {
		juNumber = 9
	}
	return
}

func dayOfYear(t time.Time) int {
	start := time.Date(t.Year(), 1, 1, 0, 0, 0, 0, t.Location())
	return int(t.Sub(start).Hours()/24) + 1
}

// CalculateHeavenPlate arranges the Nine Stems (QIYI_SEQUENCE) across palaces.
func CalculateHeavenPlate(juNumber int, isYang bool) map[int]string {
	plate := make(map[int]string)
	startIdx := juNumber - 1
	for i := 0; i < 9; i++ {
		var p int
		if isYang {
			p = (startIdx+i)%9 + 1
		} else {
			p = (startIdx-i+9)%9 + 1
		}
		if p == 5 {
			p = 2
		}
		plate[p] = QIYI_SEQUENCE[i]
	}
	return plate
}

// CalculateHumanPlate arranges the eight doors across eight palaces.
func CalculateHumanPlate(juNumber int, isYang bool) map[int]string {
	plate := make(map[int]string)
	doorNames := make([]string, len(DOORS))
	for i, d := range DOORS {
		doorNames[i] = d.Name
	}
	startDoor := (juNumber - 1) % 8
	for i := 0; i < 8; i++ {
		var p int
		if isYang {
			p = (juNumber+i-1)%8 + 1
		} else {
			p = (juNumber-i+7)%8 + 1
		}
		if p >= 5 {
			p++
		}
		plate[p] = doorNames[(startDoor+i)%8]
	}
	return plate
}

// CalculateSpiritPlate assigns the eight spirits to the eight outer palaces.
func CalculateSpiritPlate(isYang bool) map[int]string {
	plate := make(map[int]string)
	spirits := SPIRITS_YIN
	if isYang {
		spirits = SPIRITS_YANG
	}
	palaceOrder := []int{1, 8, 3, 4, 9, 2, 7, 6}
	for i, p := range palaceOrder {
		plate[p] = spirits[i]
	}
	return plate
}

// CalculateStarsPlate distributes the nine stars across palaces.
func CalculateStarsPlate(juNumber int, isYang bool) map[int]string {
	plate := make(map[int]string)
	starNames := make([]string, len(STARS))
	for i, s := range STARS {
		starNames[i] = s.Name
	}
	startIdx := (juNumber - 1) % 9
	for i := 0; i < 9; i++ {
		var p int
		if isYang {
			p = (startIdx+i)%9 + 1
		} else {
			p = (startIdx-i+9)%9 + 1
		}
		if p == 5 {
			p = 2
		}
		plate[p] = starNames[i%8]
	}
	return plate
}

func buildEarthPlate() map[int]string {
	ep := make(map[int]string)
	for stem, palace := range EARTH_PLATE {
		ep[palace] = stem
	}
	return ep
}

// CalculateDailyQimen builds the complete plate from calendar inputs.
func CalculateDailyQimen(
	date time.Time,
	yearGanZhi, monthGanZhi, dayGanZhi, hourGanZhi,
	solarTerm string,
	solarTermIndex, hour int,
) *QimenPlate {
	juNumber, isYang := GetDailyQimenJuNumber(date, solarTermIndex)
	shichen := ""
	if hour >= 0 {
		shichen = GetShichenInfo(hour).Shichen.Name
	}
	yinYang := "陰遁"
	if isYang {
		yinYang = "陽遁"
	}
	return &QimenPlate{
		Date:        date.Format("2006-01-02"),
		YearGanZhi:  yearGanZhi,
		MonthGanZhi: monthGanZhi,
		DayGanZhi:   dayGanZhi,
		HourGanZhi:  hourGanZhi,
		Hour:        hour,
		Shichen:     shichen,
		JuNumber:    juNumber,
		IsYang:      isYang,
		YinYang:     yinYang,
		SolarTerm:   solarTerm,
		EarthPlate:  buildEarthPlate(),
		HeavenPlate: CalculateHeavenPlate(juNumber, isYang),
		HumanPlate:  CalculateHumanPlate(juNumber, isYang),
		SpiritPlate: CalculateSpiritPlate(isYang),
		StarsPlate:  CalculateStarsPlate(juNumber, isYang),
	}
}

// ──────────────────────────────────────────────────────────────────────────────
// Palace rating
// ──────────────────────────────────────────────────────────────────────────────

// PalaceRating holds the computed auspiciousness rating for one palace.
type PalaceRating struct {
	Level   string
	Score   int
	Summary string
	Detail  string
}

var starWeight = map[string]int{
	"天蓬": -20, "天任": 15, "天沖": 15, "天輔": 25,
	"天英": 5, "天芮": -20, "天柱": -20, "天心": 25,
}
var doorWeight = map[string]int{
	"休門": 25, "生門": 25, "傷門": -20, "杜門": 0,
	"景門": 5, "死門": -30, "驚門": -20, "開門": 20,
}
var spiritWeight = map[string]int{
	"值符": 20, "螣蛇": -10, "太陰": 15, "六合": 15,
	"白虎": -20, "玄武": -15, "九地": 10, "九天": 15,
}

var palaceSummaries = map[string][]string{
	"大吉": {"吉星高照，諸事皆宜", "貴人相助，機緣絕佳", "氣運亨通，百事順遂"},
	"吉":  {"吉神護佑，謀事可成", "氣場平和，穩步前進", "機遇可期，謹慎把握"},
	"平":  {"吉凶參半，靜觀其變", "勢均力敵，宜守不宜攻", "平淡無奇，韜光養晦"},
	"凶":  {"凶煞臨宮，諸事謹慎", "阻礙重重，宜退不宜進", "時運不濟，靜待時機"},
	"大凶": {"凶星聚集，百事忌用", "禍福難測，宜靜不宜動", "氣場低迷，當避其鋒"},
}

func generatePalaceSummary(level string) string {
	opts := palaceSummaries[level]
	if len(opts) == 0 {
		return level
	}
	return opts[rand.Intn(len(opts))]
}

// CalculatePalaceRating scores one palace from its four plate elements.
func CalculatePalaceRating(palaceIndex int, star, door, spirit, heavenStem string) PalaceRating {
	score := 50
	if w, ok := starWeight[star]; ok {
		score += w
	}
	if w, ok := doorWeight[door]; ok {
		score += w
	}
	if w, ok := spiritWeight[spirit]; ok {
		score += w
	}
	if heavenStem == "乙" || heavenStem == "丙" || heavenStem == "丁" {
		score += 15
	} else if heavenStem == "戊" || heavenStem == "己" {
		score += 5
	}
	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}
	var level string
	switch {
	case score >= 80:
		level = "大吉"
	case score >= 60:
		level = "吉"
	case score >= 40:
		level = "平"
	case score >= 20:
		level = "凶"
	default:
		level = "大凶"
	}
	return PalaceRating{Level: level, Score: score, Summary: generatePalaceSummary(level)}
}

// ──────────────────────────────────────────────────────────────────────────────
// Matter & overall analysis
// ──────────────────────────────────────────────────────────────────────────────

// MatterRating holds the analysis for one specific inquiry type.
type MatterRating struct {
	Level     string
	Palace    int
	Summary   string
	Advice    string
	Direction string
}

// OverallAnalysis summarises the entire plate.
type OverallAnalysis struct {
	Trend         string
	Strategy      string
	BestDirection string
	Summary       string
}

// QimenAnalysisResult is the complete analysis output.
type QimenAnalysisResult struct {
	PalaceRatings map[int]PalaceRating
	Matters       map[string]MatterRating
	Overall       OverallAnalysis
}

// PalaceInfoSummary summarizes the key palace indices for current hour and major matters.
type PalaceInfoSummary struct {
	CurrentHourPalace     int
	CurrentHourPalaceName string
	WealthPalace          int
	WealthPalaceName      string
	CareerPalace          int
	CareerPalaceName      string
}

// PalaceEnhancedScore captures multi-dimensional scores per palace.
type PalaceEnhancedScore struct {
	PalaceIndex       int
	PalaceName        string
	OverallScore      int
	WealthScore       int
	CareerScore       int
	HealthScore       int
	RelationshipScore int
	StudyScore        int
}

var matterAdvice = map[string]map[string]string{
	"wealth": {
		"大吉": "財運亨通，宜投資理財、拓展業務",
		"吉":  "財路順遂，可穩步求財",
		"平":  "財運平平，保守理財為宜",
		"凶":  "財運受阻，不宜大額投資",
		"大凶": "破財之兆，當守不宜攻",
	},
	"career": {
		"大吉": "官運亨通，升遷有望",
		"吉":  "事業順遂，謀事可成",
		"平":  "事業平穩，宜守成",
		"凶":  "仕途受阻，宜低調",
		"大凶": "官非纏身，謹言慎行",
	},
	"travel": {
		"大吉": "出行大吉，一路順風",
		"吉":  "旅途平安，諸事順遂",
		"平":  "出行平平，無大礙",
		"凶":  "出行有阻，宜改期",
		"大凶": "遠行不利，當避之",
	},
	"health": {
		"大吉": "身強體健，百病不侵",
		"吉":  "健康良好，注意保養",
		"平":  "身體無恙，宜調養",
		"凶":  "小病纏身，當心調養",
		"大凶": "病厄臨身，速就醫",
	},
	"relationship": {
		"大吉": "人緣極佳，貴人相助",
		"吉":  "人和事順，交遊廣闊",
		"平":  "人際平和，無大喜憂",
		"凶":  "口舌是非，謹言慎行",
		"大凶": "人際緊張，宜獨處",
	},
	"study": {
		"大吉": "學業精進，金榜題名",
		"吉":  "學習順利，事半功倍",
		"平":  "學業平平，宜勤勉",
		"凶":  "學習受阻，需加把勁",
		"大凶": "考運不佳，當調整",
	},
}

func findPalaceByDoor(humanPlate map[int]string, door string) int {
	for i := 1; i <= 9; i++ {
		if humanPlate[i] == door {
			return i
		}
	}
	return 0
}

func findPalaceByStar(starsPlate map[int]string, star string) int {
	for i := 1; i <= 9; i++ {
		if starsPlate[i] == star {
			return i
		}
	}
	return 0
}

func analyzeMatter(plate *QimenPlate, palaceIndex int, matterType string) MatterRating {
	if palaceIndex == 0 {
		palaceIndex = 1
	}
	door := plate.HumanPlate[palaceIndex]
	star := plate.StarsPlate[palaceIndex]
	spirit := plate.SpiritPlate[palaceIndex]
	rating := CalculatePalaceRating(palaceIndex, star, door, spirit, "")
	advice := ""
	if am, ok := matterAdvice[matterType]; ok {
		advice = am[rating.Level]
	}
	p := PalaceMap[palaceIndex]
	return MatterRating{
		Level:     rating.Level,
		Palace:    palaceIndex,
		Summary:   fmt.Sprintf("%s：%s、%s", p.Name, door, star),
		Advice:    advice,
		Direction: p.Direction,
	}
}

func determineMatterPalaces(plate *QimenPlate) map[string]int {
	wealthP := findPalaceByDoor(plate.HumanPlate, "生門")
	if wealthP == 0 {
		wealthP = findPalaceByStar(plate.StarsPlate, "天任")
	}
	if wealthP == 0 {
		wealthP = 8
	}
	careerP := findPalaceByDoor(plate.HumanPlate, "開門")
	if careerP == 0 {
		careerP = findPalaceByStar(plate.StarsPlate, "天心")
	}
	if careerP == 0 {
		careerP = 6
	}
	travelP := findPalaceByDoor(plate.HumanPlate, "景門")
	if travelP == 0 {
		travelP = findPalaceByDoor(plate.HumanPlate, "開門")
	}
	if travelP == 0 {
		travelP = 9
	}
	healthP := findPalaceByStar(plate.StarsPlate, "天芮")
	if healthP == 0 {
		healthP = findPalaceByDoor(plate.HumanPlate, "死門")
	}
	if healthP == 0 {
		healthP = 2
	}
	relP := findPalaceByDoor(plate.HumanPlate, "休門")
	if relP == 0 {
		relP = 1
	}
	studyP := findPalaceByDoor(plate.HumanPlate, "景門")
	if studyP == 0 {
		studyP = findPalaceByStar(plate.StarsPlate, "天輔")
	}
	if studyP == 0 {
		studyP = 4
	}
	return map[string]int{
		"wealth":       wealthP,
		"career":       careerP,
		"travel":       travelP,
		"health":       healthP,
		"relationship": relP,
		"study":        studyP,
	}
}

// AnalyzeMatters produces ratings for all six standard inquiry types.
func AnalyzeMatters(plate *QimenPlate) map[string]MatterRating {
	palaces := determineMatterPalaces(plate)
	return map[string]MatterRating{
		"wealth":       analyzeMatter(plate, palaces["wealth"], "wealth"),
		"career":       analyzeMatter(plate, palaces["career"], "career"),
		"travel":       analyzeMatter(plate, palaces["travel"], "travel"),
		"health":       analyzeMatter(plate, palaces["health"], "health"),
		"relationship": analyzeMatter(plate, palaces["relationship"], "relationship"),
		"study":        analyzeMatter(plate, palaces["study"], "study"),
	}
}

// GetPalaceInfoSummary derives key palace indices for hour, wealth, career.
func GetPalaceInfoSummary(plate *QimenPlate, matters map[string]MatterRating) PalaceInfoSummary {
	currentHourPalace := GetShichenInfo(plate.Hour).Index + 1
	if currentHourPalace >= 5 {
		currentHourPalace++
	}
	palace := PalaceMap[currentHourPalace]
	wealth := matters["wealth"].Palace
	if wealth == 0 {
		wealth = findPalaceForMatter(plate, "wealth")
	}
	career := matters["career"].Palace
	if career == 0 {
		career = findPalaceForMatter(plate, "career")
	}
	return PalaceInfoSummary{
		CurrentHourPalace:     currentHourPalace,
		CurrentHourPalaceName: palace.Name,
		WealthPalace:          wealth,
		WealthPalaceName:      PalaceMap[wealth].Name,
		CareerPalace:          career,
		CareerPalaceName:      PalaceMap[career].Name,
	}
}

// GeneratePalaceEnhancedScores builds multi-dimensional rating per palace.
func GeneratePalaceEnhancedScores(plate *QimenPlate) []PalaceEnhancedScore {
	scores := make([]PalaceEnhancedScore, 0, 9)
	for i := 1; i <= 9; i++ {
		p := PalaceMap[i]
		base := CalculatePalaceRating(i, plate.StarsPlate[i], plate.HumanPlate[i], plate.SpiritPlate[i], plate.HeavenPlate[i])
		score := PalaceEnhancedScore{
			PalaceIndex:  i,
			PalaceName:   p.Name,
			OverallScore: base.Score,
		}
		matterScores := map[string]*int{
			"wealth":       &score.WealthScore,
			"career":       &score.CareerScore,
			"health":       &score.HealthScore,
			"relationship": &score.RelationshipScore,
			"study":        &score.StudyScore,
		}
		for matter, ptr := range matterScores {
			idx := findPalaceForMatter(plate, matter)
			if idx == i {
				*ptr = base.Score
			}
		}
		scores = append(scores, score)
	}
	return scores
}

func findPalaceForMatter(plate *QimenPlate, matter string) int {
	switch matter {
	case "wealth":
		return findPalaceByDoor(plate.HumanPlate, "生門")
	case "career":
		return findPalaceByDoor(plate.HumanPlate, "開門")
	case "health":
		return findPalaceByStar(plate.StarsPlate, "天芮")
	case "relationship":
		return findPalaceByDoor(plate.HumanPlate, "休門")
	case "study":
		return findPalaceByDoor(plate.HumanPlate, "景門")
	default:
		return 0
	}
}

// AnalyzeOverall produces the macro-level analysis of the plate.
func AnalyzeOverall(plate *QimenPlate) OverallAnalysis {
	total := float64(50)
	for i := 1; i <= 9; i++ {
		r := CalculatePalaceRating(i, plate.StarsPlate[i], plate.HumanPlate[i], plate.SpiritPlate[i], "")
		total += float64(r.Score-50) / 9.0
	}
	var trend string
	switch {
	case total >= 55:
		trend = "上升"
	case total >= 45:
		trend = "平穩"
	default:
		trend = "下降"
	}
	bestP, bestScore := 1, 0
	for i := 1; i <= 9; i++ {
		r := CalculatePalaceRating(i, plate.StarsPlate[i], plate.HumanPlate[i], plate.SpiritPlate[i], "")
		if r.Score > bestScore {
			bestScore = r.Score
			bestP = i
		}
	}
	bp := PalaceMap[bestP]
	strategies := map[string]string{
		"上升": "今日氣運上升，宜進取開創，主動出擊",
		"平穩": "今日氣場平和，宜守成待機，穩紮穩打",
		"下降": "今日運勢下行，宜韜光養晦，保守為上",
	}
	trendDesc := map[string]string{"上升": "氣運向好", "平穩": "氣場平和", "下降": "運勢低迷"}
	yinYangDesc := "陰遁主收斂，以靜制動"
	if plate.IsYang {
		yinYangDesc = "陽遁主生發，萬物向上"
	}
	return OverallAnalysis{
		Trend:         trend,
		Strategy:      strategies[trend],
		BestDirection: fmt.Sprintf("%s（%s）", bp.Direction, bp.Name),
		Summary: fmt.Sprintf("%s%d局，%s。今日整體%s，%s。",
			plate.YinYang, plate.JuNumber, yinYangDesc, trendDesc[trend], strategies[trend]),
	}
}

// GenerateQimenAnalysis builds the full analysis from a computed plate.
func GenerateQimenAnalysis(plate *QimenPlate) *QimenAnalysisResult {
	ratings := make(map[int]PalaceRating)
	for i := 1; i <= 9; i++ {
		ratings[i] = CalculatePalaceRating(i,
			plate.StarsPlate[i], plate.HumanPlate[i],
			plate.SpiritPlate[i], plate.HeavenPlate[i])
	}
	return &QimenAnalysisResult{
		PalaceRatings: ratings,
		Matters:       AnalyzeMatters(plate),
		Overall:       AnalyzeOverall(plate),
	}
}

// ──────────────────────────────────────────────────────────────────────────────
// Enhanced palace analysis
// ──────────────────────────────────────────────────────────────────────────────

// CombinationAnalysis holds the door-star-spirit combination result.
type CombinationAnalysis struct {
	Level          string
	Interpretation string
	Advice         string
	DoorInterp     string
	StarInterp     string
	SpiritInterp   string
}

// QiyiAnalysis holds the Three-Oddities/Six-Yi analysis for a stem.
type QiyiAnalysis struct {
	Stem           string
	IsOddity       bool
	Combination    string
	Interpretation string
	Advice         string
}

// EnhancedPalaceRating extends PalaceRating with deeper combination analysis.
type EnhancedPalaceRating struct {
	PalaceRating
	CombinationAnalysis *CombinationAnalysis
	QiyiAnalysis        *QiyiAnalysis
}

// AnalyzePalaceEnhanced performs the full enhanced analysis for a single palace.
func AnalyzePalaceEnhanced(palaceIndex int, plate *QimenPlate) EnhancedPalaceRating {
	door := plate.HumanPlate[palaceIndex]
	star := plate.StarsPlate[palaceIndex]
	spirit := plate.SpiritPlate[palaceIndex]
	heavenStem := plate.HeavenPlate[palaceIndex]
	earthStem := plate.EarthPlate[palaceIndex]

	base := CalculatePalaceRating(palaceIndex, star, door, spirit, heavenStem)

	var comboAnalysis *CombinationAnalysis
	if door != "" && star != "" && spirit != "" {
		combo := AnalyzeCombination(door, star, spirit)
		comboAnalysis = &CombinationAnalysis{
			Level:          combo.Level,
			Interpretation: combo.Interpretation,
			Advice:         combo.Advice,
			DoorInterp:     combo.DoorInterp,
			StarInterp:     combo.StarInterp,
			SpiritInterp:   combo.SpiritInterp,
		}
	}

	var qiyi *QiyiAnalysis
	if heavenStem != "" {
		info := GetStemInfo(heavenStem)
		isOdd := IsOddity(heavenStem)
		combo := GetQiyiCombination(heavenStem, earthStem)
		qa := &QiyiAnalysis{
			Stem:     heavenStem,
			IsOddity: isOdd,
			Advice:   "謹慎行事",
		}
		if isOdd {
			qa.Advice = "三奇臨宮，諸事皆宜"
		}
		if combo != nil {
			qa.Combination = combo.Name
			qa.Interpretation = combo.Interpretation
			qa.Advice = combo.Advice
		} else if info != nil {
			qa.Interpretation = info.Interpretation
		}
		qiyi = qa
	}

	return EnhancedPalaceRating{
		PalaceRating:        base,
		CombinationAnalysis: comboAnalysis,
		QiyiAnalysis:        qiyi,
	}
}
