import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.66"],
  async redirects() {
    return [
      // Accounts were removed in 0.38.2 - send old links home.
      { source: "/sign-in", destination: "/", permanent: true },
      { source: "/sign-up", destination: "/", permanent: true },
      { source: "/check-email", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
      // The provider directory was removed in 0.40.0 - send old links home.
      { source: "/tools/find-a-provider", destination: "/", permanent: true },
      { source: "/tools/find-support-coordinator", destination: "/", permanent: true },
      { source: "/tools/find-plan-manager", destination: "/", permanent: true },
      { source: "/tools/find-support-provider", destination: "/", permanent: true },
      { source: "/tools/find-allied-health", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
