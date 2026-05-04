# Qimen-Zenith AGENTS.md

**Generated:** 2026-05-03 | **Commit:** b71f6b2 | **Branch:** main

## OVERVIEW

Professional Qimen Dunjia (奇門遁甲) plate calculation and analysis system.
Dual-stack: **Next.js 16 + React 19** frontend proxying to **Go 1.22 gRPC** backend, with external **lunar-zenith** calendar service.

## SERVICE ARCHITECTURE

```
Browser (3000) → Next.js REST API → Go gRPC (50055) → Lunar-Zenith (8080)
```

- REST routes in `src/app/api/` are stateless proxies: parse query → call gRPC → normalize → respond
- All computation happens in Go backend (`pkg/qimen/`) — **Go is authoritative**
- `src/lib/qimen/` (TypeScript) is a legacy mirror — **do not add new logic here**
- `src/server/` contains a legacy TS gRPC server — **do not use or extend**

## CONTRACTS

This project uses **Contract-First Development** with a shared contracts layer.

- `contracts/` → symlink to `../destiny-cloud/contracts` (single source of truth)
- **API changes MUST follow**: Contract → `make proto` → Handler → Validate → Handoff
- Port config: `contracts/runtime/ports.env` → `.env.ports` via `make sync-contracts`
- **Never edit generated files**: `proto/*.pb.go`, `src/components/ui/*.tsx`

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/modify API fields | `contracts/openapi/qimen-zenith.yaml` FIRST | Contract-first (see above) |
| Add gRPC RPC method | `proto/qimen.proto` → `make proto` → `internal/handler/` | Proto-first for Go |
| Modify calculation logic | `pkg/qimen/core.go` | Go backend is canonical — TS is legacy |
| Add REST endpoint | `src/app/api/{name}/route.ts` | Thin proxy to gRPC |
| Modify UI component | `src/components/qimen/` | React 19 + shadcn/ui |
| Add UI primitive | `npx shadcn add <component>` | Never hand-write ui/ |
| Teaching/case/pattern data | `pkg/qimen/staticdata.go` | Hardcoded Go data |
| Domain knowledge (三奇六儀) | `pkg/qimen/knowledge.go` | Chinese metaphysics rules |

## PORT CONFIGURATION (CRITICAL)

**Port source of truth**: `contracts/runtime/ports.env`

| Service | gRPC Port | REST Port |
|---------|-----------|-----------|
| This service (Qimen) | **50055** | 3000 |
| lunar-zenith | 50051 | 8080 |

**Workflow for port changes:**
1. Edit `contracts/runtime/ports.env` (in destiny-cloud repo)
2. Run `make sync-contracts` to sync to `.env.ports`
3. Run `make verify-contracts` to validate
4. CI enforces this — manual `.env.ports` edits will fail

## STRUCTURE

```
qimen-zenith/
├── cmd/server/main.go          # Go gRPC entry (port 50055)
├── internal/handler/handler.go # gRPC service impl (7 RPCs)
├── pkg/
│   ├── qimen/                  # Go core algorithm (see pkg/qimen/AGENTS.md)
│   │   ├── core.go             # Plate calculation, scoring, analysis
│   │   ├── hour_pillar.go      # Hour pillar (五鼠遁元法)
│   │   ├── knowledge.go        # 三奇六儀 domain rules
│   │   └── staticdata.go       # Teaching/cases/patterns data
│   └── lunarapi/lunar.go       # Lunar-Zenith HTTP client
├── proto/
│   ├── qimen.proto             # Service definition (SOURCE OF TRUTH)
│   ├── qimen.pb.go             # GENERATED - do not edit
│   └── qimen_grpc.pb.go        # GENERATED - do not edit
├── src/
│   ├── app/api/                # REST endpoints (thin gRPC proxies)
│   ├── components/
│   │   ├── qimen/              # Domain components
│   │   └── ui/                 # shadcn/ui primitives - do not hand-edit
│   └── lib/
│       └── qimen/              # Legacy TS mirror — do not extend
├── contracts/                   # Symlink → destiny-cloud/contracts
├── .env.ports                  # Generated — do not edit manually
└── Makefile                    # Go build targets + contract sync
```

## CONVENTIONS

- **Error handling**: `fmt.Errorf("context: %w", err)` with Chinese validation messages
- **Go naming**: PascalCase exports, UPPER_SNAKE_CASE constants
- **Comments**: English for code structure, Chinese (繁體) for domain concepts
- **Config**: Environment variables only (`QIMEN_GRPC_PORT`, `LUNAR_API_URL`), no config files
- **No linting config**: Rely on `go fmt` and ESLint defaults
- **Proto convention**: PascalCase messages, `Request`/`Response` suffixes, `_UNSPECIFIED` enum defaults

## ANTI-PATTERNS

- Editing `proto/*.pb.go` or `src/components/ui/*.tsx` (generated/managed files)
- Adding API fields without contract update
- Implementing computation in TypeScript (Go backend is canonical)
- Using `src/server/grpc-server.ts` or `src/server/grpc.ts` (legacy)
- Direct HTTP calls to lunar-zenith from frontend (must go through Go backend)
- Adding logic to `src/lib/qimen/` (legacy mirror)

## COMMANDS

```bash
# Go backend
make proto              # Regenerate from qimen.proto
make build              # Compile to bin/server
make run                # Sync contracts, then run Go server
make tidy               # go mod tidy

# Contract management
make sync-contracts     # Sync .env.ports from contracts/runtime/ports.env
make verify-contracts   # Validate .env.ports matches contracts
make dev-clean          # Clean processes on contract ports, then sync

# Next.js frontend
npm run dev             # Dev server (port 3000)
npm run build           # Production build
npm run lint            # ESLint

# Contract validation (in contracts symlink dir)
openapi-generator validate -i contracts/openapi/qimen-zenith.yaml
```

## STARTUP ORDER

```bash
# Terminal 1: Go gRPC backend
make run

# Terminal 2: lunar-zenith (external service)
# See https://github.com/kaecer68/lunar-zenith

# Terminal 3: Next.js frontend
npm run dev
```

## graphify

This project has a graphify knowledge graph at `graphify-out/`.

Rules:
- Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md`
- If `graphify-out/wiki/index.md` exists, navigate it instead of reading raw files
- After modifying code files, run `graphify update .` to keep the graph current (AST-only, no API cost)

## RELATED DOCS

- `contracts/openapi/qimen-zenith.yaml` — API contract (single source of truth)
- `contracts/runtime/ports.env` — Port configuration (source of truth)
- `pkg/qimen/AGENTS.md` — Go algorithm details
- `contracts/TASK-BOARD.md` — Cross-service task tracking
- `contracts/HANDOFF.md` — AI handoff report
- `PRD.md` — Product requirements
