# pkg/qimen — Go Core Algorithm

**Canonical computation engine.** All Qimen Dunjia logic lives here. TypeScript in `src/lib/qimen/` is a legacy mirror — Go is authoritative.

## FILES

| File | LOC | Purpose |
|------|-----|---------|
| `core.go` | 752 | Plate calculation, palace rating, analysis orchestration |
| `hour_pillar.go` | ~80 | Hour pillar via 五鼠遁元法 (Five-Rat method) |
| `knowledge.go` | 317 | Three Oddities + Six Instruments analysis rules (三奇六儀) |
| `staticdata.go` | 437 | Teaching sections, case studies, pattern reference data |

## KEY DATA STRUCTURES (core.go)

- `Palace` — Nine palaces with index, trigram, direction, element
- `Door` — Eight doors (八門) with auspicious rating
- `Star` — Nine stars (九星) with element
- `QIYI_SEQUENCE` — Canonical 三奇六儀 order: 戊己庚辛壬癸丁丙乙
- `SPIRITS_YANG` / `SPIRITS_YIN` — Eight spirits ordered by 陽遁/陰遁
- `EARTH_PLATE` — Fixed heavenly stem → palace mapping

## KEY FUNCTIONS

- `CalculatePlate(lunarData, hour)` → Full plate with all four layers
- `RatePalaces(plate)` → Auspicious scoring per palace
- `AnalyzePlate(plate)` → Basic text analysis
- `AnalyzeEnhanced(plate)` → Full 三奇六儀 + 門星神 analysis

## CONVENTIONS

- Constants: UPPER_SNAKE_CASE (`PALACES`, `DOORS`, `SPIRITS_YANG`)
- Domain comments: 繁體中文 inline (`// 陽遁順飛`, `// 值符隨時干`)
- Error wrapping: `fmt.Errorf("context: %w", err)`
- Palace index 5 (中五宮) resolves to palace 2 (坤二宮) during construction
- `init()` builds `PalaceMap` lookup at package load

## ANTI-PATTERNS

- Adding calculation logic elsewhere (this is the ONLY computation package)
- Returning raw palace index 5 without resolution to 2
- Modifying `QIYI_SEQUENCE` order (canonical, must not change)
- Importing from `src/lib/qimen/` (TS) — data flows Go → gRPC → TS
