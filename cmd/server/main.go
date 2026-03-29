package main

import (
	"bufio"
	"errors"
	"fmt"
	"log"
	"net"
	"os"
	"path/filepath"
	"strings"

	"github.com/kaecer68/qimen-zenith/v2/internal/handler"
	pb "github.com/kaecer68/qimen-zenith/v2/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func resolvePort(keys ...string) (string, error) {
	for _, key := range keys {
		if value := strings.TrimSpace(os.Getenv(key)); value != "" {
			return value, nil
		}
	}

	envFile, err := os.Open(filepath.Clean(".env.ports"))
	if err == nil {
		defer envFile.Close()
		values := make(map[string]string)
		scanner := bufio.NewScanner(envFile)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") || !strings.Contains(line, "=") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			values[strings.TrimSpace(parts[0])] = strings.TrimSpace(parts[1])
		}
		if scanErr := scanner.Err(); scanErr != nil {
			return "", scanErr
		}
		for _, key := range keys {
			if value := values[key]; value != "" {
				return value, nil
			}
		}
	} else if !errors.Is(err, os.ErrNotExist) {
		return "", err
	}

	return "", fmt.Errorf("missing runtime port configuration for %s", strings.Join(keys, "/"))
}

func main() {
	port, err := resolvePort("QIMEN_GRPC_PORT", "GRPC_PORT")
	if err != nil {
		log.Fatal(err)
	}

	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%s", port))
	if err != nil {
		log.Fatalf("[gRPC] Failed to listen: %v", err)
	}

	srv := grpc.NewServer()
	pb.RegisterQimenServiceServer(srv, handler.New())
	reflection.Register(srv)

	log.Printf("[gRPC] Server listening at %s", lis.Addr())
	if err := srv.Serve(lis); err != nil {
		log.Fatalf("[gRPC] Failed to serve: %v", err)
	}
}
