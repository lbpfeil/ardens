import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/app/obras/:id/agrupamentos',
        destination: '/app/obras/:id/unidades',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
