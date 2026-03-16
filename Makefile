.PHONY: proto build run tidy clean

proto:
	PATH="$$PATH:$$(go env GOPATH)/bin" protoc \
	       --go_out=. --go_opt=paths=source_relative \
	       --go-grpc_out=. --go-grpc_opt=paths=source_relative \
	       proto/qimen.proto

build: proto
	go build -o bin/server ./cmd/server/

run:
	go run ./cmd/server/

tidy:
	go mod tidy

clean:
	rm -rf bin/ proto/*.pb.go
