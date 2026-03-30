package handler

import (
	"context"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/kaecer68/qimen-zenith/v2/pkg/lunarapi"
	"github.com/kaecer68/qimen-zenith/v2/pkg/qimen"
	pb "github.com/kaecer68/qimen-zenith/v2/proto"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// QimenHandler implements pb.QimenServiceServer.
type QimenHandler struct {
	pb.UnimplementedQimenServiceServer
}

// New returns a new QimenHandler.
func New() *QimenHandler {
	return &QimenHandler{}
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

var dateRegex = regexp.MustCompile(`^\d{4}-\d{2}-\d{2}$`)

func validateDate(s string) (time.Time, error) {
	if !dateRegex.MatchString(s) {
		return time.Time{}, fmt.Errorf("日期格式錯誤，請使用 YYYY-MM-DD 格式")
	}
	t, err := time.Parse("2006-01-02", s)
	if err != nil {
		return time.Time{}, fmt.Errorf("無效的日期")
	}
	return t, nil
}

func validateHour(h int32) error {
	if h < 0 || h > 23 {
		return fmt.Errorf("hour 參數無效，請使用 0-23")
	}
	return nil
}

// buildPlate fetches lunar data and calculates the QimenPlate.
func buildPlate(dateStr string, hour int32) (*qimen.QimenPlate, error) {
	queryDate := dateStr
	if qimen.IsEarlyZiHour(int(hour)) {
		t, _ := time.Parse("2006-01-02", dateStr)
		queryDate = t.AddDate(0, 0, 1).Format("2006-01-02")
	}

	lunarData, err := lunarapi.GetLunarData(queryDate)
	if err != nil {
		return nil, fmt.Errorf("lunar_service: %w", err)
	}

	dayStem := ""
	if len(lunarData.Pillars.Day) > 0 {
		// Pillars.Day is a two-rune GanZhi string; first rune is the stem.
		for _, r := range lunarData.Pillars.Day {
			dayStem = string(r)
			break
		}
	}
	hourGanZhi := qimen.CalculateHourPillar(dayStem, int(hour))

	date, _ := time.Parse("2006-01-02", dateStr)
	plate := qimen.CalculateDailyQimen(
		date,
		lunarData.Pillars.Year,
		lunarData.Pillars.Month,
		lunarData.Pillars.Day,
		hourGanZhi,
		lunarData.SolarTerm.Name,
		lunarData.SolarTerm.Index,
		int(hour),
	)
	return plate, nil
}

func plateToProto(p *qimen.QimenPlate) *pb.QimenPlate {
	toStrMap := func(m map[int]string) map[string]string {
		out := make(map[string]string, len(m))
		for k, v := range m {
			out[fmt.Sprintf("%d", k)] = v
		}
		return out
	}
	return &pb.QimenPlate{
		Date:        p.Date,
		YearGanZhi:  p.YearGanZhi,
		MonthGanZhi: p.MonthGanZhi,
		DayGanZhi:   p.DayGanZhi,
		HourGanZhi:  p.HourGanZhi,
		Hour:        int32(p.Hour),
		Shichen:     p.Shichen,
		JuNumber:    int32(p.JuNumber),
		IsYang:      p.IsYang,
		YinYang:     p.YinYang,
		SolarTerm:   p.SolarTerm,
		EarthPlate:  toStrMap(p.EarthPlate),
		HeavenPlate: toStrMap(p.HeavenPlate),
		HumanPlate:  toStrMap(p.HumanPlate),
		SpiritPlate: toStrMap(p.SpiritPlate),
		StarsPlate:  toStrMap(p.StarsPlate),
	}
}

func analysisToProto(a *qimen.QimenAnalysisResult) *pb.QimenAnalysis {
	ratings := make(map[string]*pb.PalaceRating, len(a.PalaceRatings))
	var overallScore int32
	var overallLevel string
	for k, v := range a.PalaceRatings {
		ratings[fmt.Sprintf("%d", k)] = &pb.PalaceRating{
			Level:   v.Level,
			Score:   int32(v.Score),
			Summary: v.Summary,
		}
		overallScore += int32(v.Score)
	}
	if len(a.PalaceRatings) > 0 {
		overallScore /= int32(len(a.PalaceRatings))
	}
	switch {
	case overallScore >= 80:
		overallLevel = "大吉"
	case overallScore >= 60:
		overallLevel = "吉"
	case overallScore >= 40:
		overallLevel = "平"
	case overallScore >= 20:
		overallLevel = "凶"
	default:
		overallLevel = "大凶"
	}
	recs := []string{a.Overall.Strategy, a.Overall.Summary}
	return &pb.QimenAnalysis{
		OverallLevel:    overallLevel,
		OverallScore:    overallScore,
		Recommendations: recs,
		PalaceRatings:   ratings,
	}
}

func palaceInfoToProto(info qimen.PalaceInfoSummary) *pb.PalaceInfo {
	return &pb.PalaceInfo{
		CurrentHourPalace:     int32(info.CurrentHourPalace),
		CurrentHourPalaceName: info.CurrentHourPalaceName,
		WealthPalace:          int32(info.WealthPalace),
		WealthPalaceName:      info.WealthPalaceName,
		CareerPalace:          int32(info.CareerPalace),
		CareerPalaceName:      info.CareerPalaceName,
	}
}

func palaceEnhancedScoresToProto(scores []qimen.PalaceEnhancedScore) []*pb.PalaceRatingEnhanced {
	out := make([]*pb.PalaceRatingEnhanced, 0, len(scores))
	for _, score := range scores {
		out = append(out, &pb.PalaceRatingEnhanced{
			PalaceIndex:       int32(score.PalaceIndex),
			PalaceName:        score.PalaceName,
			OverallScore:      int32(score.OverallScore),
			WealthScore:       int32(score.WealthScore),
			CareerScore:       int32(score.CareerScore),
			HealthScore:       int32(score.HealthScore),
			RelationshipScore: int32(score.RelationshipScore),
			StudyScore:        int32(score.StudyScore),
		})
	}
	return out
}

func enhancedToProto(plate *qimen.QimenPlate) *pb.EnhancedAnalysis {
	palaces := make(map[string]*pb.PalaceEnhanced)
	for i := 1; i <= 9; i++ {
		e := qimen.AnalyzePalaceEnhanced(i, plate)
		pe := &pb.PalaceEnhanced{}
		if e.QiyiAnalysis != nil {
			qa := e.QiyiAnalysis
			label := qa.Stem
			if qa.IsOddity {
				label = "【三奇】" + label
			}
			pe.QiyiMeanings = append(pe.QiyiMeanings, label+": "+qa.Interpretation)
			pe.DetailedAdvice = append(pe.DetailedAdvice, qa.Advice)
		}
		if e.CombinationAnalysis != nil {
			ca := e.CombinationAnalysis
			pe.DoorStarCombinations = append(pe.DoorStarCombinations,
				ca.DoorInterp+"; "+ca.StarInterp)
			pe.DoorSpiritCombinations = append(pe.DoorSpiritCombinations, ca.SpiritInterp)
			pe.DetailedAdvice = append(pe.DetailedAdvice, ca.Advice)
		}
		palaces[fmt.Sprintf("%d", i)] = pe
	}
	return &pb.EnhancedAnalysis{Palaces: palaces}
}

func meta(mode string) *pb.MetaInfo {
	return &pb.MetaInfo{
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Version:   "1.0.0",
		Mode:      mode,
	}
}

func isLunarError(err error) bool {
	return strings.Contains(err.Error(), "lunar")
}

// ──────────────────────────────────────────────────────────────────────────────
// RPC implementations
// ──────────────────────────────────────────────────────────────────────────────

// CalculatePlate computes and returns the Qimen plate.
func (h *QimenHandler) CalculatePlate(ctx context.Context, req *pb.CalculatePlateRequest) (*pb.CalculatePlateResponse, error) {
	now := time.Now()
	dateStr := req.Date
	if dateStr == "" {
		dateStr = now.Format("2006-01-02")
	}
	hour := req.Hour
	if hour == 0 {
		hour = int32(now.Hour())
	}

	if err := validateHour(hour); err != nil {
		return &pb.CalculatePlateResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_HOUR"}, nil
	}
	if _, err := validateDate(dateStr); err != nil {
		return &pb.CalculatePlateResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_DATE"}, nil
	}

	plate, err := buildPlate(dateStr, hour)
	if err != nil {
		code := "CALCULATION_ERROR"
		msg := err.Error()
		if isLunarError(err) {
			code = "LUNAR_SERVICE_UNAVAILABLE"
			msg = "無法連接曆法服務"
		}
		return &pb.CalculatePlateResponse{Success: false, Error: msg, ErrorCode: code}, nil
	}

	matters := qimen.AnalyzeMatters(plate)
	info := palaceInfoToProto(qimen.GetPalaceInfoSummary(plate, matters))
	scores := palaceEnhancedScoresToProto(qimen.GeneratePalaceEnhancedScores(plate))

	return &pb.CalculatePlateResponse{
		Success:               true,
		Plate:                 plateToProto(plate),
		Meta:                  meta(""),
		PalaceInfo:            info,
		PalaceRatingsEnhanced: scores,
	}, nil
}

// AnalyzePlate computes the plate and returns a basic analysis.
func (h *QimenHandler) AnalyzePlate(ctx context.Context, req *pb.AnalyzePlateRequest) (*pb.AnalyzePlateResponse, error) {
	now := time.Now()
	dateStr := req.Date
	if dateStr == "" {
		dateStr = now.Format("2006-01-02")
	}
	hour := req.Hour
	if hour == 0 {
		hour = int32(now.Hour())
	}

	if err := validateHour(hour); err != nil {
		return &pb.AnalyzePlateResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_HOUR"}, nil
	}
	if _, err := validateDate(dateStr); err != nil {
		return &pb.AnalyzePlateResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_DATE"}, nil
	}

	plate, err := buildPlate(dateStr, hour)
	if err != nil {
		code := "ANALYSIS_ERROR"
		msg := err.Error()
		if isLunarError(err) {
			code = "LUNAR_SERVICE_UNAVAILABLE"
			msg = "無法連接曆法服務"
		}
		return &pb.AnalyzePlateResponse{Success: false, Error: msg, ErrorCode: code}, nil
	}

	analysis := qimen.GenerateQimenAnalysis(plate)
	info := palaceInfoToProto(qimen.GetPalaceInfoSummary(plate, analysis.Matters))
	scores := palaceEnhancedScoresToProto(qimen.GeneratePalaceEnhancedScores(plate))

	return &pb.AnalyzePlateResponse{
		Success:               true,
		Plate:                 plateToProto(plate),
		Analysis:              analysisToProto(analysis),
		Meta:                  meta("basic"),
		PalaceInfo:            info,
		PalaceRatingsEnhanced: scores,
	}, nil
}

// AnalyzeEnhanced computes the plate and returns an enhanced analysis.
func (h *QimenHandler) AnalyzeEnhanced(ctx context.Context, req *pb.AnalyzeEnhancedRequest) (*pb.AnalyzeEnhancedResponse, error) {
	now := time.Now()
	dateStr := req.Date
	if dateStr == "" {
		dateStr = now.Format("2006-01-02")
	}
	hour := req.Hour
	if hour == 0 {
		hour = int32(now.Hour())
	}

	if err := validateHour(hour); err != nil {
		return &pb.AnalyzeEnhancedResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_HOUR"}, nil
	}
	if _, err := validateDate(dateStr); err != nil {
		return &pb.AnalyzeEnhancedResponse{Success: false, Error: err.Error(), ErrorCode: "INVALID_DATE"}, nil
	}

	plate, err := buildPlate(dateStr, hour)
	if err != nil {
		code := "ENHANCED_ANALYSIS_ERROR"
		msg := err.Error()
		if isLunarError(err) {
			code = "LUNAR_SERVICE_UNAVAILABLE"
			msg = "無法連接曆法服務"
		}
		return &pb.AnalyzeEnhancedResponse{Success: false, Error: msg, ErrorCode: code}, nil
	}

	analysis := qimen.GenerateQimenAnalysis(plate)
	info := palaceInfoToProto(qimen.GetPalaceInfoSummary(plate, analysis.Matters))
	scores := palaceEnhancedScoresToProto(qimen.GeneratePalaceEnhancedScores(plate))

	return &pb.AnalyzeEnhancedResponse{
		Success:               true,
		Plate:                 plateToProto(plate),
		Analysis:              analysisToProto(analysis),
		Enhanced:              enhancedToProto(plate),
		Meta:                  meta("enhanced"),
		PalaceInfo:            info,
		PalaceRatingsEnhanced: scores,
	}, nil
}

// GetTeachingSections returns teaching content.
func (h *QimenHandler) GetTeachingSections(ctx context.Context, req *pb.TeachingRequest) (*pb.TeachingResponse, error) {
	var sections []*pb.TeachingSection

	buildContents := func(ts qimen.TeachingSection) []*pb.TeachingContent {
		var out []*pb.TeachingContent
		for _, c := range ts.Contents {
			tc := &pb.TeachingContent{
				Type:    c.Type,
				Content: c.Content,
				Items:   c.Items,
				Headers: c.Headers,
			}
			for _, row := range c.TableRows {
				tc.Rows = append(tc.Rows, &pb.TableRow{Cells: row})
			}
			out = append(out, tc)
		}
		return out
	}

	if req.SectionId != "" {
		ts := qimen.GetTeachingSection(req.SectionId)
		if ts == nil {
			return &pb.TeachingResponse{Success: false, Error: "找不到教學章節"}, nil
		}
		sections = append(sections, &pb.TeachingSection{
			Id:          ts.ID,
			Title:       ts.Title,
			Description: ts.Description,
			Order:       int32(ts.Order),
			Contents:    buildContents(*ts),
		})
	} else {
		for _, ts := range qimen.TEACHING_SECTIONS {
			sections = append(sections, &pb.TeachingSection{
				Id:          ts.ID,
				Title:       ts.Title,
				Description: ts.Description,
				Order:       int32(ts.Order),
				Contents:    buildContents(ts),
			})
		}
	}

	return &pb.TeachingResponse{
		Success:  true,
		Sections: sections,
		Count:    int32(len(sections)),
	}, nil
}

// GetCases returns case studies filtered by the request parameters.
func (h *QimenHandler) GetCases(ctx context.Context, req *pb.CasesRequest) (*pb.CasesResponse, error) {
	var cases []qimen.CaseStudy

	switch {
	case req.CaseId != "":
		c := qimen.GetCaseStudyByID(req.CaseId)
		if c == nil {
			return &pb.CasesResponse{Success: false, Error: "找不到案例"}, nil
		}
		cases = []qimen.CaseStudy{*c}
	case req.Tag != "":
		cases = qimen.GetCaseStudiesByTag(req.Tag)
	case req.MatterType != pb.MatterType_MATTER_TYPE_UNSPECIFIED:
		mt := protoMatterTypeToString(req.MatterType)
		cases = qimen.GetCaseStudiesByMatterType(mt)
	default:
		cases = qimen.CASE_STUDIES
	}

	toStrMap := func(m map[int]string) map[string]string {
		out := make(map[string]string, len(m))
		for k, v := range m {
			out[fmt.Sprintf("%d", k)] = v
		}
		return out
	}

	var pbCases []*pb.CaseStudy
	for _, c := range cases {
		pbCases = append(pbCases, &pb.CaseStudy{
			Id:          c.ID,
			Title:       c.Title,
			Description: c.Description,
			Date:        c.Date,
			Hour:        c.Hour,
			SolarTerm:   c.SolarTerm,
			JuNumber:    int32(c.JuNumber),
			YinYang:     c.YinYang,
			MatterType:  stringToProtoMatterType(c.MatterType),
			Question:    c.Question,
			Background:  c.Background,
			PlateSnapshot: &pb.PlateSnapshot{
				HeavenPlate: toStrMap(c.PlateSnapshot.HeavenPlate),
				HumanPlate:  toStrMap(c.PlateSnapshot.HumanPlate),
				SpiritPlate: toStrMap(c.PlateSnapshot.SpiritPlate),
				StarsPlate:  toStrMap(c.PlateSnapshot.StarsPlate),
				EarthPlate:  toStrMap(c.PlateSnapshot.EarthPlate),
			},
			Analysis: &pb.CaseAnalysis{
				GodPalace:         int32(c.Analysis.GodPalace),
				PalaceAnalysis:    c.Analysis.PalaceAnalysis,
				ElementAnalysis:   c.Analysis.ElementAnalysis,
				TimingAnalysis:    c.Analysis.TimingAnalysis,
				DirectionAnalysis: c.Analysis.DirectionAnalysis,
			},
			Conclusion: c.Conclusion,
			Lessons:    c.Lessons,
			Tags:       c.Tags,
		})
	}

	return &pb.CasesResponse{
		Success: true,
		Cases:   pbCases,
		Count:   int32(len(pbCases)),
		Total:   int32(len(qimen.CASE_STUDIES)),
	}, nil
}

// GetPatterns returns Qimen patterns filtered by the request parameters.
func (h *QimenHandler) GetPatterns(ctx context.Context, req *pb.PatternsRequest) (*pb.PatternsResponse, error) {
	var patterns []qimen.QimenPattern

	switch {
	case req.PatternId != "":
		p := qimen.GetPatternByID(req.PatternId)
		if p == nil {
			return &pb.PatternsResponse{Success: false, Error: "找不到格局"}, nil
		}
		patterns = []qimen.QimenPattern{*p}
	case req.Search != "":
		patterns = qimen.SearchPatterns(req.Search)
	case req.Type != pb.PatternType_PATTERN_TYPE_UNSPECIFIED:
		pt := protoPatternTypeToString(req.Type)
		patterns = qimen.GetPatternsByType(pt)
	default:
		patterns = qimen.QIMEN_PATTERNS
	}

	var pbPatterns []*pb.QimenPattern
	for _, p := range patterns {
		pbPatterns = append(pbPatterns, &pb.QimenPattern{
			Id:                p.ID,
			Name:              p.Name,
			Type:              stringToProtoPatternType(p.Type),
			Description:       p.Description,
			Conditions:        p.Conditions,
			Interpretation:    p.Interpretation,
			ApplicableMatters: p.ApplicableMatters,
			Remedies:          p.Remedies,
			Examples:          p.Examples,
		})
	}

	return &pb.PatternsResponse{
		Success:  true,
		Patterns: pbPatterns,
		Count:    int32(len(pbPatterns)),
		Total:    int32(len(qimen.QIMEN_PATTERNS)),
	}, nil
}

// Health returns the service health status.
func (h *QimenHandler) Health(ctx context.Context, req *pb.HealthRequest) (*pb.HealthResponse, error) {
	return &pb.HealthResponse{
		Status:    "healthy",
		Version:   "1.0.0",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}, nil
}

// ──────────────────────────────────────────────────────────────────────────────
// Enum conversion helpers
// ──────────────────────────────────────────────────────────────────────────────

func protoMatterTypeToString(t pb.MatterType) string {
	m := map[pb.MatterType]string{
		pb.MatterType_MATTER_TYPE_GENERAL:      "general",
		pb.MatterType_MATTER_TYPE_WEALTH:       "wealth",
		pb.MatterType_MATTER_TYPE_CAREER:       "career",
		pb.MatterType_MATTER_TYPE_TRAVEL:       "travel",
		pb.MatterType_MATTER_TYPE_HEALTH:       "health",
		pb.MatterType_MATTER_TYPE_RELATIONSHIP: "relationship",
		pb.MatterType_MATTER_TYPE_STUDY:        "study",
		pb.MatterType_MATTER_TYPE_LOST:         "lost",
		pb.MatterType_MATTER_TYPE_LEGAL:        "legal",
		pb.MatterType_MATTER_TYPE_PROPERTY:     "property",
		pb.MatterType_MATTER_TYPE_MARRIAGE:     "marriage",
		pb.MatterType_MATTER_TYPE_BUSINESS:     "business",
		pb.MatterType_MATTER_TYPE_LITIGATION:   "litigation",
	}
	if s, ok := m[t]; ok {
		return s
	}
	return "general"
}

func stringToProtoMatterType(s string) pb.MatterType {
	m := map[string]pb.MatterType{
		"general":      pb.MatterType_MATTER_TYPE_GENERAL,
		"wealth":       pb.MatterType_MATTER_TYPE_WEALTH,
		"career":       pb.MatterType_MATTER_TYPE_CAREER,
		"travel":       pb.MatterType_MATTER_TYPE_TRAVEL,
		"health":       pb.MatterType_MATTER_TYPE_HEALTH,
		"relationship": pb.MatterType_MATTER_TYPE_RELATIONSHIP,
		"study":        pb.MatterType_MATTER_TYPE_STUDY,
		"lost":         pb.MatterType_MATTER_TYPE_LOST,
		"legal":        pb.MatterType_MATTER_TYPE_LEGAL,
		"property":     pb.MatterType_MATTER_TYPE_PROPERTY,
		"marriage":     pb.MatterType_MATTER_TYPE_MARRIAGE,
		"business":     pb.MatterType_MATTER_TYPE_BUSINESS,
		"litigation":   pb.MatterType_MATTER_TYPE_LITIGATION,
	}
	if t, ok := m[s]; ok {
		return t
	}
	return pb.MatterType_MATTER_TYPE_GENERAL
}

func protoPatternTypeToString(t pb.PatternType) string {
	m := map[pb.PatternType]string{
		pb.PatternType_PATTERN_TYPE_AUSPICIOUS:   "auspicious",
		pb.PatternType_PATTERN_TYPE_INAUSPICIOUS: "inauspicious",
		pb.PatternType_PATTERN_TYPE_SPECIAL:      "special",
		pb.PatternType_PATTERN_TYPE_COMBINATION:  "combination",
	}
	if s, ok := m[t]; ok {
		return s
	}
	return ""
}

func stringToProtoPatternType(s string) pb.PatternType {
	m := map[string]pb.PatternType{
		"auspicious":   pb.PatternType_PATTERN_TYPE_AUSPICIOUS,
		"inauspicious": pb.PatternType_PATTERN_TYPE_INAUSPICIOUS,
		"special":      pb.PatternType_PATTERN_TYPE_SPECIAL,
		"combination":  pb.PatternType_PATTERN_TYPE_COMBINATION,
	}
	if t, ok := m[s]; ok {
		return t
	}
	return pb.PatternType_PATTERN_TYPE_UNSPECIFIED
}

// Ensure compile-time interface satisfaction.
var _ pb.QimenServiceServer = (*QimenHandler)(nil)

// suppress unused import
var _ = status.Errorf(codes.OK, "")
