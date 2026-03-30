# Qimen-Zenith AGENTS.md

**Generated:** 2026-03-18 | **Commit:** 9d88d9b | **Branch:** main

## OVERVIEW

Professional Qimen Dunjia (奇門遁甲) plate calculation and analysis system.
Dual-stack: **Next.js 16 + React 19** frontend proxying to **Go 1.22 gRPC** backend, with external **lunar-zenith** calendar service.

## STRUCTURE

```
qimen-zenith/
├── cmd/server/main.go          # Go gRPC entry (port 50055)
├── internal/handler/handler.go # gRPC service impl (7 RPCs)
├── pkg/
│   ├── qimen/                  # Go core algorithm (see pkg/qimen/AGENTS.md)
│   └── lunarapi/lunar.go       # Lunar-Zenith HTTP client
├── proto/
│   ├── qimen.proto             # Service definition (SOURCE OF TRUTH for gRPC)
│   ├── qimen.pb.go             # GENERATED - do not edit
│   └── qimen_grpc.pb.go        # GENERATED - do not edit
├── src/
│   ├── app/                    # Next.js App Router
│   │   └── api/                # REST endpoints (thin gRPC proxies)
│   ├── components/
│   │   ├── qimen/              # Domain components (see src/components/qimen/AGENTS.md)
│   │   └── ui/                 # shadcn/ui primitives - do not hand-edit
│   ├── lib/
│   │   ├── qimen/              # TS algorithm library (see src/lib/qimen/AGENTS.md)
│   │   ├── grpc-client.ts      # gRPC client setup
│   │   ├── grpc-normalize.ts   # Response normalization layer
│   │   └── lunar-api.ts        # Lunar API HTTP client
│   └── server/                 # TS gRPC server (legacy, superseded by Go)
├── contracts/                  # Symlink → ../destiny-contracts
└── Makefile                    # Go build targets only
```

## SERVICE ARCHITECTURE

```
Browser (3000) → Next.js REST API → Go gRPC (50055) → Lunar-Zenith (8080)
```

- REST routes in `src/app/api/` are stateless proxies: parse query → call gRPC → normalize → respond
- All computation happens in Go backend (`pkg/qimen/`)
- `src/server/` contains a legacy TS gRPC server — **do not use or extend**

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/modify API fields | `contracts/openapi/qimen-zenith.yaml` FIRST | Contract-first (see below) |
| Add gRPC RPC method | `proto/qimen.proto` → `make proto` → `internal/handler/` | Proto-first for Go |
| Modify calculation logic | `pkg/qimen/core.go` | Go backend is canonical |
| Add REST endpoint | `src/app/api/{name}/route.ts` | Thin proxy to gRPC |
| Modify UI component | `src/components/qimen/` | React 19 + shadcn/ui |
| Add UI primitive | `npx shadcn add <component>` | Never hand-write ui/ |
| Teaching/case/pattern data | `pkg/qimen/staticdata.go` | Hardcoded Go data |
| Domain knowledge (三奇六儀) | `pkg/qimen/knowledge.go` | Chinese metaphysics rules |

## CONTRACT-FIRST RULE (CRITICAL)

**All API changes MUST follow this order:**

1. Update contract → `contracts/openapi/qimen-zenith.yaml`
2. Generate code → `make generate` (if applicable)
3. Update proto → `proto/qimen.proto` → `make proto`
4. Implement handler → `internal/handler/`
5. Validate → `openapi-generator validate -i contracts/openapi/qimen-zenith.yaml`
6. Fill handoff → `contracts/HANDOFF.md`

**NEVER:**
- Add fields not defined in contract
- Modify contract-defined types without updating contract first
- Edit `proto/*.pb.go` files (GENERATED)

## CONVENTIONS

- **Error handling**: `fmt.Errorf("context: %w", err)` with Chinese validation messages
- **Go naming**: PascalCase exports, UPPER_SNAKE_CASE constants
- **Comments**: English for code structure, Chinese (繁體) for domain concepts
- **Config**: Environment variables only (`GRPC_PORT`, `LUNAR_API_URL`), no config files
- **No linting config**: Rely on `go fmt` and ESLint defaults
- **Proto convention**: PascalCase messages, `Request`/`Response` suffixes, `_UNSPECIFIED` enum defaults

## ANTI-PATTERNS

- Editing `proto/*.pb.go` or `src/components/ui/*.tsx` (generated/managed files)
- Adding API fields without contract update
- Implementing computation in TypeScript (Go backend is canonical)
- Using `src/server/grpc-server.ts` or `src/server/grpc.ts` (legacy)
- Direct HTTP calls to lunar-zenith from frontend (must go through Go backend)

## COMMANDS

```bash
# Go backend
make proto              # Regenerate from qimen.proto
make build              # Compile to bin/server
make run                # go run ./cmd/server/
make tidy               # go mod tidy

# Next.js frontend
npm run dev             # Dev server (port 3000)
npm run build           # Production build
npm run lint            # ESLint

# Contract validation
openapi-generator validate -i contracts/openapi/qimen-zenith.yaml
```

## DEPENDENCIES

| Service | Port | Purpose |
|---------|------|---------|
| Next.js | 3000 | Frontend + REST API proxy |
| Go gRPC | 50055 | Core computation backend |
| lunar-zenith | 8080 | External lunar calendar API |

## RELATED DOCS

- `contracts/openapi/qimen-zenith.yaml` — API contract (single source of truth)
- `contracts/TASK-BOARD.md` — Cross-service task tracking
- `contracts/HANDOFF.md` — AI handoff report
- `PRD.md` — Product requirements
- `API.md` — REST API documentation
