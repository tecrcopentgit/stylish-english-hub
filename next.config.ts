import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gen-z-uv-offical.vercel.app',
        pathname: '/**',
      },
    ],
},
};

export default nextConfig;
