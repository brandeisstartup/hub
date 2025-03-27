import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Option 1: Using domains array
    domains: ["i.ytimg.com", "images.ctfassets.net", "images.clerk.dev"],

    // Option 2: Using remotePatterns with separate objects:
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net"
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev"
      }
    ]
  }
};

export default nextConfig;
