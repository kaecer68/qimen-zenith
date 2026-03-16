package main

import (
	"fmt"
	"log"
	"net"
	"os"

	"github.com/kaecer/qimen-zenith/internal/handler"
	pb "github.com/kaecer/qimen-zenith/proto"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	port := os.Getenv("GRPC_PORT")
	if port == "" {
		port = "50051"
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
