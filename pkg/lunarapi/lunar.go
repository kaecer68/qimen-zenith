package lunarapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

var stems = []string{"甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"}
var branches = []string{"子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"}

type pillarRaw struct {
	StemIndex   int `json:"StemIndex"`
	BranchIndex int `json:"BranchIndex"`
}

type lunarDataRaw struct {
	GregorianDate string  `json:"gregorian_date"`
	JulianDay     float64 `json:"julian_day"`
	DeltaT        float64 `json:"delta_t"`
	Lunar         struct {
		Year   int  `json:"Year"`
		Month  int  `json:"Month"`
		Day    int  `json:"Day"`
		IsLeap bool `json:"IsLeap"`
	} `json:"lunar"`
	Buddhist string `json:"buddhist"`
	Taoist   string `json:"taoist"`
	Pillars  struct {
		Year  pillarRaw `json:"Year"`
		Month pillarRaw `json:"Month"`
		Day   pillarRaw `json:"Day"`
		Hour  pillarRaw `json:"Hour"`
	} `json:"pillars"`
	SolarTerm struct {
		Index     int     `json:"Index"`
		Name      string  `json:"Name"`
		Longitude float64 `json:"Longitude"`
	} `json:"solar_term"`
	TwelveOfficer string `json:"twelve_officer"`
	ShenSha       []struct {
		Name        string `json:"Name"`
		Description string `json:"Description"`
	} `json:"shen_sha"`
	HolidayInfo struct {
		IsHoliday bool   `json:"is_holiday"`
		Name      string `json:"name"`
	} `json:"holiday_info"`
}

// ShenShaItem is a Chinese almanac spirit/deity item.
type ShenShaItem struct {
	Name        string
	Description string
}

// LunarInfo holds the Chinese lunar date components.
type LunarInfo struct {
	Year   int
	Month  int
	Day    int
	IsLeap bool
}

// Pillars holds the four pillars (四柱) as GanZhi strings.
type Pillars struct {
	Year  string
	Month string
	Day   string
	Hour  string
}

// SolarTermInfo holds solar term data.
type SolarTermInfo struct {
	Index     int
	Name      string
	Longitude float64
}

// HolidayInfo holds holiday data.
type HolidayInfo struct {
	IsHoliday bool
	Name      string
}

// LunarData is the normalized calendar data returned to callers.
type LunarData struct {
	GregorianDate string
	JulianDay     float64
	DeltaT        float64
	Lunar         LunarInfo
	Buddhist      string
	Taoist        string
	Pillars       Pillars
	SolarTerm     SolarTermInfo
	TwelveOfficer string
	ShenSha       []ShenShaItem
	HolidayInfo   HolidayInfo
}

var httpClient = &http.Client{Timeout: 10 * time.Second}

func pillarToGanZhi(p pillarRaw) string {
	stem := "?"
	branch := "?"
	if p.StemIndex >= 0 && p.StemIndex < len(stems) {
		stem = stems[p.StemIndex]
	}
	if p.BranchIndex >= 0 && p.BranchIndex < len(branches) {
		branch = branches[p.BranchIndex]
	}
	return stem + branch
}

// GetLunarData fetches calendar data for a date string "YYYY-MM-DD".
func GetLunarData(date string) (*LunarData, error) {
	base := os.Getenv("LUNAR_API_URL")
	if base == "" {
		base = "http://localhost:8080"
	}
	url := fmt.Sprintf("%s/v1/calendar?date=%s", base, date)

	resp, err := httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("lunar api request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("lunar api returned status %d", resp.StatusCode)
	}

	var raw lunarDataRaw
	if err := json.NewDecoder(resp.Body).Decode(&raw); err != nil {
		return nil, fmt.Errorf("decode lunar response: %w", err)
	}

	data := &LunarData{
		GregorianDate: raw.GregorianDate,
		JulianDay:     raw.JulianDay,
		DeltaT:        raw.DeltaT,
		Buddhist:      raw.Buddhist,
		Taoist:        raw.Taoist,
		TwelveOfficer: raw.TwelveOfficer,
		Lunar: LunarInfo{
			Year:   raw.Lunar.Year,
			Month:  raw.Lunar.Month,
			Day:    raw.Lunar.Day,
			IsLeap: raw.Lunar.IsLeap,
		},
		Pillars: Pillars{
			Year:  pillarToGanZhi(raw.Pillars.Year),
			Month: pillarToGanZhi(raw.Pillars.Month),
			Day:   pillarToGanZhi(raw.Pillars.Day),
			Hour:  pillarToGanZhi(raw.Pillars.Hour),
		},
		SolarTerm: SolarTermInfo{
			Index:     raw.SolarTerm.Index,
			Name:      raw.SolarTerm.Name,
			Longitude: raw.SolarTerm.Longitude,
		},
		HolidayInfo: HolidayInfo{
			IsHoliday: raw.HolidayInfo.IsHoliday,
			Name:      raw.HolidayInfo.Name,
		},
	}
	for _, s := range raw.ShenSha {
		data.ShenSha = append(data.ShenSha, ShenShaItem{Name: s.Name, Description: s.Description})
	}
	return data, nil
}
