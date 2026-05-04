import type { NextConfig } from "next";
import { getLunarApiUrl } from "./src/lib/runtime-contract";

const lunarApiUrl = getLunarApiUrl();

const nextConfig: NextConfig = {
  serverExternalPackages: ['@grpc/grpc-js', '@grpc/proto-loader'],
  async rewrites() {
    return [
      {
        source: '/api/lunar/v1/:path*',
        destination: `${lunarApiUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
