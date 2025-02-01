import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["i.ytimg.com", "images.ctfassets.net/"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net"
      }
    ]
  }
};

export default nextConfig;
