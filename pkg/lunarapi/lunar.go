package lunarapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"
)

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
		Year  string `json:"year"`
		Month string `json:"month"`
		Day   string `json:"day"`
		Hour  string `json:"hour"`
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

// GetLunarData fetches calendar data for a date string "YYYY-MM-DD".
func GetLunarData(date string) (*LunarData, error) {
	base := strings.TrimRight(os.Getenv("LUNAR_API_URL"), "/")
	if base == "" {
		return nil, fmt.Errorf("LUNAR_API_URL environment variable not set")
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
			Year:  raw.Pillars.Year,
			Month: raw.Pillars.Month,
			Day:   raw.Pillars.Day,
			Hour:  raw.Pillars.Hour,
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
