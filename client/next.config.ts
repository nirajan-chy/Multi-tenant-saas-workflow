import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
  env: {
    API_URL: process.env.API_URL, // Example of using environment variables
  },
};

export default nextConfig;
