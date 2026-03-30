# src/lib/qimen — TypeScript Algorithm Library

**Client-side Qimen utilities.** Originally the full algorithm implementation, now partially superseded by Go backend. Still actively used for client-side formatting, export, records, and UI data mapping.

## STATUS

| File | Status | Purpose |
|------|--------|---------|
| `core.ts` | **Reference only** | Mirrors Go constants (PALACES, DOORS, STARS, SPIRITS). Used for client-side type definitions and lookups. Do NOT add computation here. |
| `hourPillar.ts` | **Active** | Client-side hour → 時辰 mapping, 五鼠遁元法 for display |
| `symbolism.ts` | **Active** | 用神 (yongshen) palace mapping, 六親 relations, matter type config |
| `godAnalysis.ts` | **Active** | 門星神 combination analysis text generation |
| `qiyiKnowledge.ts` | **Active** | 三奇六儀 knowledge base for UI display |
| `combinationKnowledge.ts` | **Active** | Door-Star-Spirit combination interpretations |
| `spacetimeAnalysis.ts` | **Active** | 空亡, 入墓, 擊刑, 馬星 analysis |
| `palaceRelation.ts` | **Active** | Palace 生剋 (shengke) relationship calculations |
| `export.ts` | **Active** | JSON/CSV export formatting |
| `records.ts` | **Active** | LocalStorage record CRUD |
| `serialize.ts` | **Active** | Plate serialization helpers |
| `caseStudies.ts` | **Deprecated** | Moved to Go `staticdata.go` |
| `patterns.ts` | **Deprecated** | Moved to Go `staticdata.go` |
| `teaching.ts` | **Deprecated** | Moved to Go `staticdata.go` |

## CONVENTIONS

- All domain constants match Go's canonical values exactly
- `as const` assertions on all static arrays for type narrowing
- Export everything — components cherry-pick imports
- Chinese domain terms in identifiers: `MatterType`, `getLiuqinDescription`

## ANTI-PATTERNS

- Adding new computation logic (belongs in Go `pkg/qimen/`)
- Modifying constant values without matching Go counterpart
- Using deprecated files (`caseStudies.ts`, `patterns.ts`, `teaching.ts`) — data now served via gRPC from Go
