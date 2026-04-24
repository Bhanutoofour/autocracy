import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d3du1kxieyd1np.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
