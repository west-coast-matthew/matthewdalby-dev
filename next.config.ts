import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/project-delivery",
        destination: "/services/project-delivery",
        permanent: true,
      },
      {
        source: "/technical-architecture",
        destination: "/leadership/technical-architecture",
        permanent: true,
      },
      {
        source: "/marketing-velocity",
        destination: "/services/marketing-velocity",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
