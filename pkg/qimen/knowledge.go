package qimen

// ──────────────────────────────────────────────────────────────────────────────
// Three Oddities & Six Yi (三奇六儀) knowledge
// ──────────────────────────────────────────────────────────────────────────────

// StemInfo describes a single heaven-stem entry from the qiyi knowledge base.
type StemInfo struct {
	Name           string
	Element        string
	Nature         string
	Interpretation string
	AuspiciousLevel string
	Advice         string
	Classical      string
}

// THREE_ODDITIES holds interpretations for 乙、丙、丁.
var THREE_ODDITIES = map[string]StemInfo{
	"乙": {
		Name: "乙奇（日奇）", Element: "木", Nature: "陰木",
		Interpretation: "乙為日奇，太陰之精，主文書、和合、姻緣，宜求婚、求財、文書事宜",
		AuspiciousLevel: "大吉",
		Advice:          "宜求婚、求財、文書往來、結盟合作",
		Classical:       "乙為日奇，諸事皆利，尤宜文書、婚姻",
	},
	"丙": {
		Name: "丙奇（月奇）", Element: "火", Nature: "陽火",
		Interpretation: "丙為月奇，太陽之精，主威權、光明、昇遷，宜謀事、見貴",
		AuspiciousLevel: "大吉",
		Advice:          "宜謀事、見貴、訴訟、競爭、升遷",
		Classical:       "丙為月奇，主光明威權，利見大人",
	},
	"丁": {
		Name: "丁奇（星奇）", Element: "火", Nature: "陰火",
		Interpretation: "丁為星奇，星宿之精，主智慧、靈感、希望，宜祭祀、求謀",
		AuspiciousLevel: "大吉",
		Advice:          "宜祭祀、求謀、靈感創作、祈福",
		Classical:       "丁為星奇，主智慧希望，宜謀算奇謀",
	},
}

// SIX_YI holds interpretations for 戊、己、庚、辛、壬、癸.
var SIX_YI = map[string]StemInfo{
	"戊": {
		Name: "戊（甲子元）", Element: "土", Nature: "陽土",
		Interpretation: "戊為大山、城牆，象徵厚重穩固。值符之首，主貴人、領導",
		AuspiciousLevel: "吉",
		Advice:          "宜守成、建設、謀求領導地位",
		Classical:       "戊為青龍，主威儀領導，守中待時",
	},
	"己": {
		Name: "己（甲戌元）", Element: "土", Nature: "陰土",
		Interpretation: "己為田園、平原，象徵包容謙遜。利農事、收藏、潛伏",
		AuspiciousLevel: "平",
		Advice:          "宜靜守、農事、收藏、隱居修行",
		Classical:       "己為陰土，主隱匿田園，謙退守本",
	},
	"庚": {
		Name: "庚（甲申元）", Element: "金", Nature: "陽金",
		Interpretation: "庚為刀劍，主變革、阻礙、刑罰，諸事多有阻礙",
		AuspiciousLevel: "凶",
		Advice:          "宜審慎、避免爭鬥，防阻礙橫生",
		Classical:       "庚為白虎，主凶煞阻礙，諸事不宜",
	},
	"辛": {
		Name: "辛（甲午元）", Element: "金", Nature: "陰金",
		Interpretation: "辛為珠寶，主細緻、刑罰，有官非口舌之憂",
		AuspiciousLevel: "凶",
		Advice:          "謹防口舌官非，低調行事",
		Classical:       "辛為刑罰之星，主口舌官非，宜靜守",
	},
	"壬": {
		Name: "壬（甲辰元）", Element: "水", Nature: "陽水",
		Interpretation: "壬為江河大海，主流動、謀略、奔波，利遠行、智謀",
		AuspiciousLevel: "平",
		Advice:          "宜遠行、謀略、流動變化",
		Classical:       "壬為大水，主流動奔波，利謀略遠行",
	},
	"癸": {
		Name: "癸（甲寅元）", Element: "水", Nature: "陰水",
		Interpretation: "癸為雨露泉水，主隱藏、細密、情報，利潛伏偵察",
		AuspiciousLevel: "平",
		Advice:          "宜隱藏、情報蒐集、潛伏觀察",
		Classical:       "癸為陰水，主隱匿細密，利潛伏偵察",
	},
}

// tenStemCombinations maps (天盤干+地盤干) pair names to interpretation info.
var tenStemCombinations = map[string]struct {
	Name           string
	Interpretation string
	Advice         string
}{
	"戊戊": {Name: "伏吟", Interpretation: "天地盤相同，氣場滯澀，主事重複，不易變動", Advice: "靜守為宜，不宜輕動"},
	"戊己": {Name: "天地相合", Interpretation: "戊己同宮，土氣相合，主穩定、積累", Advice: "宜穩定發展，積累資源"},
	"庚庚": {Name: "伏吟庚", Interpretation: "庚庚相疊，刑傷之象，主阻礙加倍", Advice: "謹防刑傷，宜靜不宜動"},
	"乙庚": {Name: "白虎猖狂", Interpretation: "乙木被庚金所剋，主刑傷災禍", Advice: "宜靜守，避開衝突"},
	"辛乙": {Name: "白虎猖狂", Interpretation: "辛金剋乙木，主刑傷", Advice: "謹防意外，靜守為宜"},
	"丙庚": {Name: "朱雀投江", Interpretation: "丙火被庚金剋制，文書失效", Advice: "文書需謹慎，避免官司"},
	"戊丙": {Name: "青龍返首", Interpretation: "戊土生丙火，主反敗為勝、失而復得", Advice: "逆境可望翻轉，積極面對"},
	"丙戊": {Name: "飛鳥跌穴", Interpretation: "丙火生戊土，主大展鴻圖、主動進取", Advice: "宜主動出擊，大展鴻圖"},
	"戊辛": {Name: "青龍華蓋", Interpretation: "戊土被辛金洩氣，主受困阻滯", Advice: "宜守不宜攻，靜待時機"},
	"壬戊": {Name: "天網四張", Interpretation: "壬水被戊土剋制，主困境難脫", Advice: "困境中謹慎行事"},
}

// GetStemInfo returns the StemInfo for the given heaven stem, or nil if not found.
func GetStemInfo(stem string) *StemInfo {
	if info, ok := THREE_ODDITIES[stem]; ok {
		return &info
	}
	if info, ok := SIX_YI[stem]; ok {
		return &info
	}
	return nil
}

// IsOddity returns true if the stem is one of the Three Oddities (乙、丙、丁).
func IsOddity(stem string) bool {
	return stem == "乙" || stem == "丙" || stem == "丁"
}

// QiyiCombination holds a named heaven/earth stem combination.
type QiyiCombination struct {
	Name           string
	Interpretation string
	Advice         string
}

// GetQiyiCombination looks up the named combination for a heaven+earth stem pair.
// Returns nil when no named combination exists for the pair.
func GetQiyiCombination(heavenStem, earthStem string) *QiyiCombination {
	key := heavenStem + earthStem
	if c, ok := tenStemCombinations[key]; ok {
		return &QiyiCombination{Name: c.Name, Interpretation: c.Interpretation, Advice: c.Advice}
	}
	return nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Door / Star / Spirit interpretation knowledge (門星神組合)
// ──────────────────────────────────────────────────────────────────────────────

// ElementInterpretation holds interpretation info for one element (door/star/spirit).
type ElementInterpretation struct {
	Name           string
	Element        string
	Auspicious     string
	Interpretation string
	Suitable       []string
	Unsuitable     []string
}

// DOOR_INTERPRETATIONS maps door names to their interpretations.
var DOOR_INTERPRETATIONS = map[string]ElementInterpretation{
	"休門": {Name: "休門", Element: "水", Auspicious: "大吉",
		Interpretation: "休門主休息、養生、求財，諸事順遂",
		Suitable:   []string{"休閒養生", "求財", "外交"},
		Unsuitable: []string{"爭鬥", "急事"}},
	"生門": {Name: "生門", Element: "土", Auspicious: "大吉",
		Interpretation: "生門主生機、財源、求生，宜經商置產",
		Suitable:   []string{"經商", "置產", "求財", "求生"},
		Unsuitable: []string{"喪葬", "捕獵"}},
	"傷門": {Name: "傷門", Element: "木", Auspicious: "凶",
		Interpretation: "傷門主傷害、競爭、衝突，宜競技、討債",
		Suitable:   []string{"競技", "捕獵", "討債"},
		Unsuitable: []string{"婚嫁", "安床", "謀事"}},
	"杜門": {Name: "杜門", Element: "木", Auspicious: "平",
		Interpretation: "杜門主閉塞、隱蔽、技藝，宜潛伏學習",
		Suitable:   []string{"隱蔽", "技藝", "學習"},
		Unsuitable: []string{"見貴", "求財", "公開活動"}},
	"景門": {Name: "景門", Element: "火", Auspicious: "中平",
		Interpretation: "景門主文書、考試、宣傳，利文化藝術",
		Suitable:   []string{"文書", "考試", "宣傳"},
		Unsuitable: []string{"訴訟", "爭鬥"}},
	"死門": {Name: "死門", Element: "土", Auspicious: "大凶",
		Interpretation: "死門主死亡、疾病、阻礙，諸事不宜",
		Suitable:   []string{"喪葬", "刑罰"},
		Unsuitable: []string{"婚嫁", "營造", "謀事"}},
	"驚門": {Name: "驚門", Element: "金", Auspicious: "凶",
		Interpretation: "驚門主驚嚇、口舌、訴訟，宜揭露震動",
		Suitable:   []string{"訴訟", "揭露", "驚動"},
		Unsuitable: []string{"謀事", "安靜"}},
	"開門": {Name: "開門", Element: "金", Auspicious: "吉",
		Interpretation: "開門主開創、遠行、見貴，宜開業謀事",
		Suitable:   []string{"開業", "遠行", "見貴"},
		Unsuitable: []string{"埋葬", "捕獵"}},
}

// STAR_INTERPRETATIONS maps star names to their interpretations.
var STAR_INTERPRETATIONS = map[string]ElementInterpretation{
	"天蓬": {Name: "天蓬", Element: "水", Auspicious: "凶",
		Interpretation: "天蓬主盜賊、陰謀、災禍，臨宮主不祥",
		Suitable:   []string{"隱蔽", "偵察"},
		Unsuitable: []string{"謀事", "出行", "求財"}},
	"天任": {Name: "天任", Element: "土", Auspicious: "吉",
		Interpretation: "天任主任勞任怨、農事、求財，為吉星",
		Suitable:   []string{"農事", "勞動", "求財", "建設"},
		Unsuitable: []string{}},
	"天沖": {Name: "天沖", Element: "木", Auspicious: "吉",
		Interpretation: "天沖主衝動、行動、競爭，宜主動出擊",
		Suitable:   []string{"競爭", "行動", "開創"},
		Unsuitable: []string{"靜守", "保守行事"}},
	"天輔": {Name: "天輔", Element: "木", Auspicious: "大吉",
		Interpretation: "天輔主文教、君子、輔佐，為文昌吉星",
		Suitable:   []string{"考試", "文書", "輔助", "求學"},
		Unsuitable: []string{}},
	"天英": {Name: "天英", Element: "火", Auspicious: "中平",
		Interpretation: "天英主文章、虛火、躁動，吉凶參半",
		Suitable:   []string{"文章", "宣傳"},
		Unsuitable: []string{"實務", "穩健謀事"}},
	"天芮": {Name: "天芮", Element: "土", Auspicious: "凶",
		Interpretation: "天芮主疾病、問題、陰暗，為病符之星",
		Suitable:   []string{"醫療", "靜養"},
		Unsuitable: []string{"出行", "謀事", "求財"}},
	"天柱": {Name: "天柱", Element: "金", Auspicious: "凶",
		Interpretation: "天柱主口舌、破壞、災難，諸事不宜",
		Suitable:   []string{},
		Unsuitable: []string{"合作", "謀事", "出行"}},
	"天心": {Name: "天心", Element: "金", Auspicious: "大吉",
		Interpretation: "天心主領導、管理、醫藥，為大吉之星",
		Suitable:   []string{"求官", "謀事", "醫藥", "領導"},
		Unsuitable: []string{}},
}

// SPIRIT_INTERPRETATIONS maps spirit names to their interpretations.
var SPIRIT_INTERPRETATIONS = map[string]ElementInterpretation{
	"值符": {Name: "值符", Element: "土", Auspicious: "大吉",
		Interpretation: "值符為八神之首，主貴人、權威、護佑",
		Suitable:   []string{"求官", "見貴", "謀事", "訴訟"},
		Unsuitable: []string{}},
	"螣蛇": {Name: "螣蛇", Element: "火", Auspicious: "凶",
		Interpretation: "螣蛇主虛驚、怪異、纏繞，諸事多有波折",
		Suitable:   []string{},
		Unsuitable: []string{"投資", "合作", "出行"}},
	"太陰": {Name: "太陰", Element: "金", Auspicious: "吉",
		Interpretation: "太陰主陰私、密謀、智慧，宜隱秘謀劃",
		Suitable:   []string{"隱秘行事", "謀劃", "外交"},
		Unsuitable: []string{"公開活動"}},
	"六合": {Name: "六合", Element: "木", Auspicious: "吉",
		Interpretation: "六合主和合、媒妁、交易，宜婚嫁合作",
		Suitable:   []string{"婚嫁", "合作", "交易", "和解"},
		Unsuitable: []string{"爭訟"}},
	"白虎": {Name: "白虎", Element: "金", Auspicious: "凶",
		Interpretation: "白虎主刑殺、傷害、剛猛，諸事謹慎",
		Suitable:   []string{"軍事", "競爭"},
		Unsuitable: []string{"婚嫁", "謀事", "求財"}},
	"玄武": {Name: "玄武", Element: "水", Auspicious: "凶",
		Interpretation: "玄武主盜賊、陰私、虛假，防小人陷害",
		Suitable:   []string{"偵察", "隱蔽"},
		Unsuitable: []string{"合作", "信任他人"}},
	"九地": {Name: "九地", Element: "土", Auspicious: "平",
		Interpretation: "九地主潛藏、穩固、防守，利靜守待機",
		Suitable:   []string{"守成", "潛藏", "防守"},
		Unsuitable: []string{"主動出擊", "開創"}},
	"九天": {Name: "九天", Element: "金", Auspicious: "平",
		Interpretation: "九天主飛揚、進取、高遠，利遠行開創",
		Suitable:   []string{"遠行", "進取", "開創", "高遠謀事"},
		Unsuitable: []string{"靜守"}},
}

// CombinationResult is returned by AnalyzeCombination.
type CombinationResult struct {
	Level          string
	Interpretation string
	Advice         string
	DoorInterp     string
	StarInterp     string
	SpiritInterp   string
}

var levelScore = map[string]int{
	"大吉": 5, "吉": 4, "中平": 3, "平": 3, "凶": 2, "大凶": 1,
}

// AnalyzeCombination combines door, star, and spirit interpretations into a
// single weighted analysis result.
func AnalyzeCombination(door, star, spirit string) CombinationResult {
	doorI := DOOR_INTERPRETATIONS[door]
	starI := STAR_INTERPRETATIONS[star]
	spiritI := SPIRIT_INTERPRETATIONS[spirit]

	// Score-weighted aggregation
	total := levelScore[doorI.Auspicious]*2 + levelScore[starI.Auspicious] + levelScore[spiritI.Auspicious]
	avg := float64(total) / 4.0

	var level string
	switch {
	case avg >= 4.5:
		level = "大吉"
	case avg >= 3.5:
		level = "吉"
	case avg >= 2.5:
		level = "平"
	case avg >= 1.5:
		level = "凶"
	default:
		level = "大凶"
	}

	interp := door + "配" + star + "，" + spirit + "臨宮"
	advice := "綜合門星神組合，" + level + "之象"
	if level == "大吉" || level == "吉" {
		advice = "門星神組合吉利，諸事可謀"
	} else if level == "凶" || level == "大凶" {
		advice = "門星神組合不利，宜守不宜攻"
	}

	return CombinationResult{
		Level:          level,
		Interpretation: interp,
		Advice:         advice,
		DoorInterp:     doorI.Interpretation,
		StarInterp:     starI.Interpretation,
		SpiritInterp:   spiritI.Interpretation,
	}
}
