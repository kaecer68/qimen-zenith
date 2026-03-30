.PHONY: help proto build run tidy clean sync-contracts verify-contracts prepare-contract-ports dev-clean

help:
	@echo "Available targets:"
	@echo "  make help                   Show this help"
	@echo "  make proto                  Generate Go gRPC code from proto/qimen.proto"
	@echo "  make build                  Build Go server binary"
	@echo "  make run                    Sync+verify contract ports, then run Go server"
	@echo "  make sync-contracts         Sync .env.ports from contracts runtime ports"
	@echo "  make verify-contracts       Verify .env.ports matches contract ports"
	@echo "  make prepare-contract-ports Run sync-contracts + verify-contracts"
	@echo "  make dev-clean              Clean processes on contract-defined ports"
	@echo "  make tidy                   Run go mod tidy"
	@echo "  make clean                  Remove build artifacts and generated proto files"

SYNC_CONTRACTS_SCRIPT := scripts/sync-contracts.sh

proto:
	PATH="$$PATH:$$(go env GOPATH)/bin" protoc \
	       --go_out=. --go_opt=paths=source_relative \
	       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	       proto/qimen.proto

build: proto
	go build -o bin/server ./cmd/server/

run: prepare-contract-ports
	bash -c 'set -a; . ./.env.ports; set +a; go run ./cmd/server/'

sync-contracts:
	@chmod +x $(SYNC_CONTRACTS_SCRIPT)
	bash $(SYNC_CONTRACTS_SCRIPT)

verify-contracts:
	@chmod +x $(SYNC_CONTRACTS_SCRIPT)
	bash $(SYNC_CONTRACTS_SCRIPT) --check

prepare-contract-ports: sync-contracts verify-contracts

dev-clean: prepare-contract-ports
	@chmod +x scripts/dev-clean.sh
	bash scripts/dev-clean.sh

tidy:
	go mod tidy

clean:
	rm -rf bin/ proto/*.pb.go
