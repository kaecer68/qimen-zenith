package qimen

// ──────────────────────────────────────────────────────────────────────────────
// Teaching content (教學系統)
// ──────────────────────────────────────────────────────────────────────────────

// TeachingContent is one block of content inside a teaching section.
type TeachingContent struct {
	Type      string
	Content   string
	Items     []string
	Headers   []string
	TableRows [][]string
}

// TeachingSection is a complete teaching chapter.
type TeachingSection struct {
	ID          string
	Title       string
	Description string
	Order       int
	Contents    []TeachingContent
}

// TEACHING_SECTIONS holds the static teaching content.
var TEACHING_SECTIONS = []TeachingSection{
	{
		ID: "intro", Title: "奇門遁甲簡介", Order: 1,
		Description: "了解奇門遁甲的起源與基本架構",
		Contents: []TeachingContent{
			{Type: "text", Content: "奇門遁甲是中國古代術數三大絕學之一（太乙、六壬、奇門遁甲），被譽為「帝王之學」。其以天干地支、八卦九宮為基礎，結合時間與空間因素，用於預測吉凶、趨吉避凶。"},
			{Type: "highlight", Content: "「奇門」指乙、丙、丁三奇與休、生、傷、杜、景、死、驚、開八門；「遁甲」指甲（十天干之首）隱遁於六儀（戊己庚辛壬癸）之中。"},
			{Type: "list", Content: "奇門遁甲的組成要素：", Items: []string{
				"地盤：九宮八卦，固定不變，代表方位",
				"天盤：三奇六儀，隨局數變化，代表天干力量",
				"人盤：八門，代表人事活動與吉凶",
				"神盤：八神，代表神秘力量與影響因素",
				"星盤：九星，代表天象與時運",
			}},
		},
	},
	{
		ID: "jiugong", Title: "九宮八卦", Order: 2,
		Description: "認識九宮格與八卦方位的對應關係",
		Contents: []TeachingContent{
			{Type: "text", Content: "九宮格是奇門遁甲的基礎框架，源自於《易經》的洛書數理。九宮分別對應八卦方位與五行屬性，中五宮為中央土。"},
			{Type: "table", Content: "九宮八卦對照表",
				Headers: []string{"宮位", "卦名", "方位", "五行", "洛書數", "代表"},
				TableRows: [][]string{
					{"坎一宮", "坎卦", "北", "水", "1", "智慧、事業"},
					{"坤二宮", "坤卦", "西南", "土", "2", "母親、包容"},
					{"震三宮", "震卦", "東", "木", "3", "長男、行動"},
					{"巽四宮", "巽卦", "東南", "木", "4", "長女、靈活"},
					{"中五宮", "中宮", "中央", "土", "5", "帝王、權威"},
					{"乾六宮", "乾卦", "西北", "金", "6", "父親、領導"},
					{"兌七宮", "兌卦", "西", "金", "7", "少女、口舌"},
					{"艮八宮", "艮卦", "東北", "土", "8", "少男、靜止"},
					{"離九宮", "離卦", "南", "火", "9", "中女、光明"},
				},
			},
			{Type: "highlight", Content: "中五宮為皇極之位，在奇門遁甲中通常寄於坤二宮，稱為「中五寄坤」。"},
		},
	},
	{
		ID: "sanci", Title: "三奇六儀", Order: 3,
		Description: "學習三奇六儀的排列與意義",
		Contents: []TeachingContent{
			{Type: "text", Content: "三奇六儀是奇門遁甲的核心元素，組成天盤。十天干中，甲為首領隱遁於六儀之中，乙丙丁則為三奇。"},
			{Type: "highlight", Content: "三奇：乙為日奇（太陰之精），丙為月奇（太陽之精），丁為星奇（星宿之精）。三奇出現主吉慶。"},
			{Type: "list", Content: "三奇的吉象：", Items: []string{
				"乙奇（日奇）：主文書、和合、姻緣，宜求婚、求財",
				"丙奇（月奇）：主威權、光明、昇遷，宜謀事、訴訟",
				"丁奇（星奇）：主智慧、靈感、希望，宜祭祀、求謀",
			}},
		},
	},
	{
		ID: "bamen", Title: "八門詳解", Order: 4,
		Description: "深入了解八門的吉凶屬性與應用",
		Contents: []TeachingContent{
			{Type: "text", Content: "八門是奇門遁甲中代表人事活動的核心要素，分為三吉門、三凶門、二中平門。"},
			{Type: "list", Content: "八門吉凶口訣：", Items: []string{
				"三吉門：休、生、開，百事順遂可安排",
				"三凶門：死、驚、傷，諸事不宜要提防",
				"二中平：杜、景，平常無大吉凶象",
			}},
		},
	},
	{
		ID: "jiuxing", Title: "九星系統", Order: 5,
		Description: "認識天蓬、天任等九星的特性",
		Contents: []TeachingContent{
			{Type: "text", Content: "九星代表天象與宇宙能量，對應北斗七星及輔弼二星。九星的旺衰會影響整體局勢的吉凶。"},
			{Type: "highlight", Content: "天禽星寄於中五宮，一般不單獨使用，多隨天芮星運行。"},
		},
	},
	{
		ID: "bashen", Title: "八神系統", Order: 6,
		Description: "了解值符、螣蛇等八神的意義",
		Contents: []TeachingContent{
			{Type: "text", Content: "八神代表神秘力量與無形影響，是奇門遁甲中最高層次的參考因素。"},
			{Type: "list", Content: "八神排列順序：", Items: []string{
				"陽遁：值符 → 螣蛇 → 太陰 → 六合 → 白虎 → 玄武 → 九地 → 九天（順行）",
				"陰遁：值符 → 九天 → 九地 → 玄武 → 白虎 → 六合 → 太陰 → 螣蛇（逆行）",
			}},
		},
	},
	{
		ID: "wuxing", Title: "五行生剋", Order: 7,
		Description: "掌握五行相生相剋的基本原理",
		Contents: []TeachingContent{
			{Type: "text", Content: "五行（金、木、水、火、土）是奇門遁甲判斷吉凶的核心依據。"},
			{Type: "highlight", Content: "相生：木生火 → 火生土 → 土生金 → 金生水 → 水生木"},
			{Type: "highlight", Content: "相剋：木剋土 → 土剋水 → 水剋火 → 火剋金 → 金剋木"},
		},
	},
}

// GetTeachingSection returns the section with the given ID, or nil.
func GetTeachingSection(id string) *TeachingSection {
	for i := range TEACHING_SECTIONS {
		if TEACHING_SECTIONS[i].ID == id {
			return &TEACHING_SECTIONS[i]
		}
	}
	return nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Case studies (案例分析庫)
// ──────────────────────────────────────────────────────────────────────────────

// PlateSnapshot captures a moment-in-time plate for a case study.
type PlateSnapshot struct {
	HeavenPlate map[int]string
	HumanPlate  map[int]string
	SpiritPlate map[int]string
	StarsPlate  map[int]string
	EarthPlate  map[int]string
}

// CaseAnalysis holds the analysis fields for a case study.
type CaseAnalysis struct {
	GodPalace         int
	PalaceAnalysis    string
	ElementAnalysis   string
	TimingAnalysis    string
	DirectionAnalysis string
}

// CaseStudy is one classic Qimen case example.
type CaseStudy struct {
	ID            string
	Title         string
	Description   string
	Date          string
	Hour          string
	SolarTerm     string
	JuNumber      int
	YinYang       string
	MatterType    string
	Question      string
	Background    string
	PlateSnapshot PlateSnapshot
	Analysis      CaseAnalysis
	Conclusion    string
	Lessons       []string
	Tags          []string
}

// CASE_STUDIES holds the static case study library.
var CASE_STUDIES = []CaseStudy{
	{
		ID: "case-001", Title: "求財案例：商業投資決策",
		Description: "某商人欲投資新項目，求測財運吉凶",
		Date: "2024-03-15", Hour: "辰時", SolarTerm: "驚蟄",
		JuNumber: 3, YinYang: "陽遁", MatterType: "wealth",
		Question:   "此投資項目能否獲利？",
		Background: "當事人擬投資房地產項目，資金規模約500萬，求測時值驚蟄後，陽遁三局。",
		PlateSnapshot: PlateSnapshot{
			HeavenPlate: map[int]string{1: "戊", 2: "己", 3: "庚", 4: "辛", 6: "壬", 7: "癸", 8: "丁", 9: "丙"},
			HumanPlate:  map[int]string{1: "休門", 2: "生門", 3: "傷門", 4: "杜門", 6: "景門", 7: "死門", 8: "驚門", 9: "開門"},
			SpiritPlate: map[int]string{1: "值符", 2: "螣蛇", 3: "太陰", 4: "六合", 6: "白虎", 7: "玄武", 8: "九地", 9: "九天"},
			StarsPlate:  map[int]string{1: "天蓬", 2: "天任", 3: "天沖", 4: "天輔", 6: "天英", 7: "天芮", 8: "天柱", 9: "天心"},
		},
		Analysis: CaseAnalysis{
			GodPalace:         2,
			PalaceAnalysis:    "生門落坤二宮，為財運主事之宮。天任星為吉星，值符為貴人相助之象。",
			ElementAnalysis:   "生門屬土，與宮位五行比和，財氣凝聚。",
			TimingAnalysis:    "驚蟄後陽遁三局，木氣漸旺，土受木剋，財運尚可。",
			DirectionAnalysis: "坤宮對應西南方，宜往西南方向尋求合作。",
		},
		Conclusion: "此投資項目前景尚可，建議謹慎評估後可進行。",
		Lessons:    []string{"求財看生門，生門得吉星則財運順遂", "值符臨宮主有貴人相助", "五行旺衰需結合節氣判斷"},
		Tags:       []string{"財運", "投資", "生門", "案例"},
	},
	{
		ID: "case-002", Title: "事業案例：職場升遷機會",
		Description: "某白領求測近期升遷運勢",
		Date: "2024-06-20", Hour: "午時", SolarTerm: "夏至",
		JuNumber: 9, YinYang: "陰遁", MatterType: "career",
		Question:   "今年是否有升遷機會？",
		Background: "當事人在科技公司任職三年，近期有升遷傳聞，求測時值夏至，陰遁九局。",
		PlateSnapshot: PlateSnapshot{
			HeavenPlate: map[int]string{1: "乙", 2: "丙", 3: "丁", 4: "戊", 6: "己", 7: "庚", 8: "辛", 9: "壬"},
			HumanPlate:  map[int]string{1: "開門", 2: "休門", 3: "生門", 4: "傷門", 6: "杜門", 7: "景門", 8: "死門", 9: "驚門"},
			SpiritPlate: map[int]string{1: "值符", 2: "九天", 3: "九地", 4: "玄武", 6: "白虎", 7: "六合", 8: "太陰", 9: "螣蛇"},
			StarsPlate:  map[int]string{1: "天心", 2: "天蓬", 3: "天任", 4: "天沖", 6: "天輔", 7: "天英", 8: "天芮", 9: "天柱"},
		},
		Analysis: CaseAnalysis{
			GodPalace:         1,
			PalaceAnalysis:    "開門落坎一宮，天心星為領導星，值符為權威之象，顯示有升遷機會。",
			ElementAnalysis:   "開門屬金，坎宮屬水，金生水為洩氣之象，需付出努力。",
			TimingAnalysis:    "夏至陰遁，火旺金衰，開門受制，升遷恐有阻礙。",
			DirectionAnalysis: "坎宮對應北方，宜與北方人士多溝通。",
		},
		Conclusion: "今年有升遷機會但不順遂，需付出額外努力，待秋季再行爭取。",
		Lessons:    []string{"求官運看開門，開門吉則升遷有望", "天心星主領導、管理，臨開門利仕途", "時令旺衰影響吉凶程度"},
		Tags:       []string{"事業", "升遷", "開門", "案例"},
	},
	{
		ID: "case-003", Title: "感情案例：姻緣配對分析",
		Description: "單身男女求測姻緣何時到來",
		Date: "2024-08-08", Hour: "酉時", SolarTerm: "立秋",
		JuNumber: 2, YinYang: "陰遁", MatterType: "marriage",
		Question:   "何時能遇到正緣？",
		Background: "當事人單身多年，近期相親多次未果，求測時值立秋後，陰遁二局。",
		PlateSnapshot: PlateSnapshot{
			HeavenPlate: map[int]string{1: "丁", 2: "丙", 3: "乙", 4: "戊", 6: "己", 7: "庚", 8: "辛", 9: "壬"},
			HumanPlate:  map[int]string{1: "景門", 2: "死門", 3: "驚門", 4: "開門", 6: "休門", 7: "生門", 8: "傷門", 9: "杜門"},
			SpiritPlate: map[int]string{1: "螣蛇", 2: "太陰", 3: "六合", 4: "白虎", 6: "玄武", 7: "九地", 8: "九天", 9: "值符"},
			StarsPlate:  map[int]string{1: "天英", 2: "天芮", 3: "天柱", 4: "天心", 6: "天蓬", 7: "天任", 8: "天沖", 9: "天輔"},
		},
		Analysis: CaseAnalysis{
			GodPalace:         7,
			PalaceAnalysis:    "六合為媒妁之神，落兌七宮與生門同宮，主有良緣機會。",
			ElementAnalysis:   "兌宮屬金，生門屬土，土生金為相生之象，感情發展順利。",
			TimingAnalysis:    "立秋金旺，兌宮當令，時機有利。",
			DirectionAnalysis: "兌宮對應西方，正緣可能來自西方。",
		},
		Conclusion: "今秋至初冬有姻緣機會，對象條件尚可。",
		Lessons:    []string{"求姻緣看六合，六合吉則婚緣有望", "生門臨六合，主婚後生活富足"},
		Tags:       []string{"感情", "姻緣", "六合", "案例"},
	},
}

// GetCaseStudyByID returns the case study with the given ID, or nil.
func GetCaseStudyByID(id string) *CaseStudy {
	for i := range CASE_STUDIES {
		if CASE_STUDIES[i].ID == id {
			return &CASE_STUDIES[i]
		}
	}
	return nil
}

// GetCaseStudiesByTag filters case studies by tag.
func GetCaseStudiesByTag(tag string) []CaseStudy {
	var result []CaseStudy
	for _, c := range CASE_STUDIES {
		for _, t := range c.Tags {
			if t == tag {
				result = append(result, c)
				break
			}
		}
	}
	return result
}

// GetCaseStudiesByMatterType filters case studies by matter type string.
func GetCaseStudiesByMatterType(matterType string) []CaseStudy {
	var result []CaseStudy
	for _, c := range CASE_STUDIES {
		if c.MatterType == matterType {
			result = append(result, c)
		}
	}
	return result
}

// ──────────────────────────────────────────────────────────────────────────────
// Qimen patterns (格局查詢手冊)
// ──────────────────────────────────────────────────────────────────────────────

// QimenPattern describes one Qimen Dunjia formation.
type QimenPattern struct {
	ID                 string
	Name               string
	Type               string // auspicious / inauspicious / special / combination
	Description        string
	Conditions         []string
	Interpretation     string
	ApplicableMatters  []string
	Remedies           string
	Examples           []string
}

// QIMEN_PATTERNS is the static pattern library.
var QIMEN_PATTERNS = []QimenPattern{
	{
		ID: "pattern-001", Name: "三奇得使", Type: "auspicious",
		Description: "三奇（乙丙丁）臨吉門吉星，且得值符使護佑",
		Conditions: []string{"乙丙丁三奇之一臨宮", "臨休、生、開三吉門", "得天輔、天心等吉星", "值符臨宮或相生"},
		Interpretation: "此格為大吉之兆，主所謀之事順遂，求財得財，求官得官。",
		ApplicableMatters: []string{"求財", "求官", "出行", "謀事", "婚嫁"},
		Examples: []string{"乙奇臨生門天輔", "丙奇臨開門天心"},
	},
	{
		ID: "pattern-002", Name: "玉女守門", Type: "auspicious",
		Description: "丁奇（玉女）臨開門，主婚姻和合、求財順遂",
		Conditions:  []string{"丁奇臨開門", "天星不凶"},
		Interpretation: "丁奇為星奇，象徵希望與機遇。臨開門主開創、發展，尤利婚姻、合作。",
		ApplicableMatters: []string{"婚嫁", "合作", "開業", "謀事"},
		Remedies: "若天星稍弱，可選吉時加強",
	},
	{
		ID: "pattern-003", Name: "青龍回首", Type: "auspicious",
		Description: "戊（青龍）臨丙（回首），主反敗為勝、轉危為安",
		Conditions:  []string{"戊加丙於同一宮", "宮位不凶"},
		Interpretation: "戊土為青龍，丙火為光明。青龍回首象徵失而復得、轉敗為勝。",
		ApplicableMatters: []string{"訴訟", "追債", "尋物", "商業"},
	},
	{
		ID: "pattern-004", Name: "飛鳥跌穴", Type: "auspicious",
		Description: "丙（飛鳥）臨戊（跌穴），主主動出擊、大展宏圖",
		Conditions:  []string{"丙加戊於同一宮", "宮位不凶"},
		Interpretation: "飛鳥跌穴象徵主動進取、大展鴻圖。利開創、進取。",
		ApplicableMatters: []string{"開業", "進修", "競選", "主動出擊"},
	},
	{
		ID: "pattern-101", Name: "五不遇時", Type: "inauspicious",
		Description: "時干剋日干，主事多阻礙、謀事不順",
		Conditions:  []string{"時干五行剋日干五行", "且陰陽同性"},
		Interpretation: "五不遇時為奇門凶格之首，主事多阻滯，謀為難成。",
		ApplicableMatters: []string{"所有事項"},
		Remedies: "可選擇其他時辰再行謀事",
		Examples: []string{"甲日遇庚時", "乙日遇辛時"},
	},
	{
		ID: "pattern-102", Name: "六儀擊刑", Type: "inauspicious",
		Description: "六儀（戊己庚辛壬癸）受地支刑剋",
		Conditions: []string{"戊臨震宮（子卯刑）", "己臨坤宮（丑戌刑）", "庚臨艮宮（寅巳刑）"},
		Interpretation: "六儀擊刑主災禍、損傷、官非。所謀之事多生波折。",
		ApplicableMatters: []string{"出行", "投資", "訴訟", "醫療"},
		Remedies: "宜靜不宜動，待時而動",
	},
	{
		ID: "pattern-103", Name: "三奇入墓", Type: "inauspicious",
		Description: "三奇（乙丙丁）入其墓庫之宮",
		Conditions:  []string{"乙奇入坤宮（木墓在未）", "丙丁入乾宮（火墓在戌）"},
		Interpretation: "三奇入墓主才華被埋、機遇錯失。",
		ApplicableMatters: []string{"求官", "謀事", "考試"},
		Remedies: "待沖墓之時，或選擇其他方位",
	},
	{
		ID: "pattern-201", Name: "天乙伏宮", Type: "special",
		Description: "值符下臨本宮，主貴人相助、權威護佑",
		Conditions:  []string{"值符所在宮位為其本宮", "星神門搭配得宜"},
		Interpretation: "值符為八神之首，伏宮主得貴人相助，凡事有靠山。",
		ApplicableMatters: []string{"求官", "見貴", "謀事", "訴訟"},
	},
	{
		ID: "pattern-202", Name: "朱雀投江", Type: "inauspicious",
		Description: "丙奇（朱雀）臨坎宮（江），主文書失效、訴訟敗北",
		Conditions:  []string{"丙奇臨坎一宮"},
		Interpretation: "朱雀投江象徵文書沈沒、訴訟敗訴。不利文書、合約。",
		ApplicableMatters: []string{"文書", "合約", "訴訟", "考試"},
		Remedies: "文書需備份，合約需謹慎",
	},
	{
		ID: "pattern-301", Name: "龍返首", Type: "combination",
		Description: "戊加丙，青龍返首，主失而復得",
		Conditions:  []string{"戊加丙於同一宮"},
		Interpretation: "戊為青龍，丙為光明。返首之象，主失而復得。",
		ApplicableMatters: []string{"追債", "尋物", "復合", "翻案"},
	},
	{
		ID: "pattern-302", Name: "鳥跌穴", Type: "combination",
		Description: "丙加戊，飛鳥跌穴，主大展鴻圖",
		Conditions:  []string{"丙加戊於同一宮"},
		Interpretation: "丙為飛鳥，戊為高丘。跌穴之象，主大展鴻圖。",
		ApplicableMatters: []string{"開業", "競選", "進修"},
	},
	{
		ID: "pattern-303", Name: "白虎猖狂", Type: "combination",
		Description: "辛加乙，白虎猖狂，主刑傷災禍",
		Conditions:  []string{"辛加乙於同一宮"},
		Interpretation: "辛金為白虎，乙木為仁柔。猖狂之象，主刑傷、災禍。",
		ApplicableMatters: []string{"所有事項"},
		Remedies: "宜靜守，避開此時",
	},
}

// GetPatternByID returns the pattern with the given ID, or nil.
func GetPatternByID(id string) *QimenPattern {
	for i := range QIMEN_PATTERNS {
		if QIMEN_PATTERNS[i].ID == id {
			return &QIMEN_PATTERNS[i]
		}
	}
	return nil
}

// GetPatternsByType filters patterns by type string.
func GetPatternsByType(patternType string) []QimenPattern {
	var result []QimenPattern
	for _, p := range QIMEN_PATTERNS {
		if p.Type == patternType {
			result = append(result, p)
		}
	}
	return result
}

// SearchPatterns finds patterns whose name, description, or interpretation contains query.
func SearchPatterns(query string) []QimenPattern {
	var result []QimenPattern
	for _, p := range QIMEN_PATTERNS {
		if contains(p.Name, query) || contains(p.Description, query) || contains(p.Interpretation, query) {
			result = append(result, p)
		}
	}
	return result
}

func contains(s, substr string) bool {
	return len(substr) > 0 && len(s) >= len(substr) &&
		func() bool {
			for i := 0; i <= len(s)-len(substr); i++ {
				if s[i:i+len(substr)] == substr {
					return true
				}
			}
			return false
		}()
}
