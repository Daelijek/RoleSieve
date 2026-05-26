import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["26.116.138.92", "10.25.0.153", "localhost", "127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/summary",
        destination: "/analyze",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
