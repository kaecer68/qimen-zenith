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

func readEnvFile(fileName string) (map[string]string, error) {
	envFile, err := os.Open(filepath.Clean(fileName))
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return map[string]string{}, nil
		}
		return nil, err
	}
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
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	return values, nil
}

func loadRuntimeEnv(fileName string) error {
	values, err := readEnvFile(fileName)
	if err != nil {
		return err
	}
	for key, value := range values {
		if strings.TrimSpace(os.Getenv(key)) != "" {
			continue
		}
		if err := os.Setenv(key, value); err != nil {
			return fmt.Errorf("set %s from %s: %w", key, fileName, err)
		}
	}
	return nil
}

func resolveRuntimeValue(keys ...string) (string, error) {
	for _, key := range keys {
		if value := strings.TrimSpace(os.Getenv(key)); value != "" {
			return value, nil
		}
	}
	return "", fmt.Errorf("missing runtime configuration for %s", strings.Join(keys, "/"))
}

func resolvePort(keys ...string) (string, error) {
	value, err := resolveRuntimeValue(keys...)
	if err != nil {
		return "", err
	}
	if !isDigitsOnly(value) {
		return "", fmt.Errorf("invalid port value for %s: %s", strings.Join(keys, "/"), value)
	}
	return value, nil
}

func isDigitsOnly(value string) bool {
	for _, char := range value {
		if char < '0' || char > '9' {
			return false
		}
	}
	return value != ""
}

func main() {
	if err := loadRuntimeEnv(".env.ports"); err != nil {
		log.Fatal(err)
	}

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
