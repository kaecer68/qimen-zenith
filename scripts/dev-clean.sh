#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORTS_FILE="$REPO_ROOT/.env.ports"

if [[ ! -f "$PORTS_FILE" ]]; then
  echo "[dev-clean] 缺少 $PORTS_FILE，請先執行 scripts/sync-contracts.sh" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$PORTS_FILE"

if [[ -z "${QIMEN_GRPC_PORT:-}" || -z "${QIMEN_WEB_PORT:-}" ]]; then
  echo "[dev-clean] .env.ports 缺少 QIMEN_GRPC_PORT 或 QIMEN_WEB_PORT" >&2
  exit 1
fi

ports=("$QIMEN_GRPC_PORT" "$QIMEN_WEB_PORT")
for port in "${ports[@]}"; do
  pids="$(lsof -tiTCP:"$port" -sTCP:LISTEN || true)"
  if [[ -n "$pids" ]]; then
    echo "[dev-clean] 清理 port $port: $pids"
    kill $pids 2>/dev/null || true
  fi
done
