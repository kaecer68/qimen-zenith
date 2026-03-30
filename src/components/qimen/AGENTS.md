# src/components/qimen — Domain UI Components

**All Qimen Dunjia UI components.** React 19 + shadcn/ui primitives. All are `'use client'` components.

## COMPONENT HIERARCHY

```
QimenCalculator          ← Page-level orchestrator (date/hour input, API calls, state)
├── QimenBoard           ← Nine-palace grid renderer
├── QimenAnalysis        ← Analysis results display (basic + enhanced modes)
├── RecordsManager       ← LocalStorage record CRUD with dialog
├── ExportPanel          ← JSON/CSV export UI
└── TeachingSystem       ← Teaching tab container
    ├── TeachingPanel    ← Section-based teaching content
    ├── CaseStudyPanel   ← Case study browser with filters
    └── PatternLookupPanel ← Pattern reference with search
```

## DATA FLOW

1. `QimenCalculator` holds all state (`plate`, `date`, `hour`, `matterType`)
2. Calls `/api/qimen/plate` and `/api/qimen/analysis` REST endpoints
3. Passes data down as props — no shared context/store
4. `RecordsManager` and `ExportPanel` operate on `plate` prop directly

## KEY FILES

| Component | LOC | Notes |
|-----------|-----|-------|
| `QimenCalculator.tsx` | 250 | Main orchestrator — imports from `src/lib/qimen/*` heavily |
| `QimenAnalysis.tsx` | 987 | Largest component — renders basic + enhanced analysis views |
| `RecordsManager.tsx` | 429 | Uses shadcn Dialog, manages localStorage records |
| `QimenBoard.tsx` | ~200 | 3x3 grid with palace details (stem, door, star, spirit) |

## CONVENTIONS

- All components: `'use client'` directive (no RSC in domain components)
- Imports: `@/components/ui/*` for primitives, `@/lib/qimen/*` for domain logic
- No direct API calls except in `QimenCalculator` (single data-fetching point)
- Chinese text hardcoded in JSX for domain labels (not i18n'd)

## ANTI-PATTERNS

- Adding API fetch calls outside `QimenCalculator`
- Direct shadcn/ui component modification (use `npx shadcn add` instead)
- Creating new state management (useState in orchestrator is intentional, no Redux/Zustand)
