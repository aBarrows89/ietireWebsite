import type { NextConfig } from "next";
// Trigger redeploy - 2023-12-23

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
