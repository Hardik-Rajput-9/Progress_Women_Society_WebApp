import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pws/shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
