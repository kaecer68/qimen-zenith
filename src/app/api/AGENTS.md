# src/app/api — REST API Proxy Layer

**Thin REST proxy** — Next.js App Router API routes that proxy to Go gRPC backend. No computation, no business logic.

## STRUCTURE

```
src/app/api/
├── qimen/
│   ├── plate/route.ts      # GET /api/qimen/plate?date=&hour=
│   ├── analysis/route.ts   # GET /api/qimen/analysis?date=&hour=&mode=
│   └── health/route.ts     # GET /api/qimen/health
├── teaching/
│   └── sections/route.ts   # GET /api/teaching/sections?id=
├── cases/route.ts          # GET /api/cases?id=&tag=&type=&search=
└── patterns/route.ts       # GET /api/patterns?id=&type=&search=
```

## DATA FLOW

```
Browser → Next.js REST API (port 3000) → Go gRPC (port 50055) → lunar-zenith (port 8080)
```

1. Parse query parameters from `NextRequest`
2. Validate input (date format, hour range)
3. Call gRPC client (`@/lib/grpc-client`)
4. Normalize response (`@/lib/grpc-normalize`)
5. Return `NextResponse.json()` with error handling

## ENDPOINT MAPPING

| REST Endpoint | gRPC Method | Purpose |
|---------------|-------------|---------|
| `GET /api/qimen/plate` | `CalculatePlate` | Full plate calculation |
| `GET /api/qimen/analysis` | `AnalyzePlate` / `AnalyzeEnhanced` | Basic or enhanced analysis |
| `GET /api/qimen/health` | `Health` | Service health check |
| `GET /api/teaching/sections` | `GetTeachingSections` | Teaching content |
| `GET /api/cases` | `GetCases` | Case study browser |
| `GET /api/patterns` | `GetPatterns` | Pattern reference |

## CONVENTIONS

- **Query params**: `date` (YYYY-MM-DD), `hour` (0-23), optional params per endpoint
- **Error responses**: `{ error: string, code: string }` with HTTP 4xx/5xx
- **Success responses**: `{ success: true, data: ..., meta: ... }`
- **Error codes**: `INVALID_DATE`, `INVALID_HOUR`, `CALCULATION_ERROR`, `LUNAR_SERVICE_UNAVAILABLE`, `BACKEND_UNAVAILABLE`
- **Lunar error detection**: Check if error message contains "lunar" → return 503

## KEY FILES

| File | LOC | Notes |
|------|-----|-------|
| `qimen/plate/route.ts` | ~75 | Template for all endpoints — date/hour validation, gRPC call, error handling |
| `qimen/analysis/route.ts` | ~100 | Supports `mode=basic|enhanced` parameter |
| `qimen/health/route.ts` | ~20 | Simple health check proxy |

## ERROR HANDLING PATTERN

```typescript
try {
  // Validate params
  if (invalid) {
    return NextResponse.json({ error: '...', code: 'INVALID_XXX' }, { status: 400 })
  }

  // Call gRPC
  const res = await qimenClient.xxx(params)
  if (!res.success) {
    const isLunar = (res.error_code || '').includes('LUNAR')
    return NextResponse.json({ error: res.error, code: res.error_code }, { status: isLunar ? 503 : 500 })
  }

  return NextResponse.json({ success: true, data: normalize(res.data) })
} catch (error) {
  const message = error instanceof Error ? error.message : '...'
  const isLunar = message.includes('lunar') || message.includes('connect')
  return NextResponse.json({ error: message, code: isLunar ? 'BACKEND_UNAVAILABLE' : 'XXX_ERROR' }, { status: isLunar ? 503 : 500 })
}
```

## ANTI-PATTERNS

- Adding business logic or computation (belongs in Go `pkg/qimen/`)
- Direct HTTP calls to lunar-zenith (must go through Go gRPC)
- Skipping parameter validation
- Not detecting lunar errors (should return 503, not 500)
- Modifying gRPC response structure without updating `grpc-normalize.ts`

## TESTING

```bash
# Health check
curl http://localhost:3000/api/qimen/health

# Plate calculation
curl "http://localhost:3000/api/qimen/plate?date=2026-03-18&hour=9"

# Enhanced analysis
curl "http://localhost:3000/api/qimen/analysis?date=2026-03-18&hour=9&mode=enhanced"
```

## RELATED

- `@/lib/grpc-client.ts` — gRPC client singleton
- `@/lib/grpc-normalize.ts` — Response normalization (proto → JSON)
- `internal/handler/handler.go` — Go gRPC handler (actual computation)
- `contracts/openapi/qimen-zenith.yaml` — API contract (source of truth)
