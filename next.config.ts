import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.66"],
  async redirects() {
    // The 4 separate "find a provider" tools were merged into one tool
    // with a category switcher - send old links/bookmarks to the right
    // starting category instead of 404ing.
    return [
      // Accounts were removed in 0.38.2 - send old links home.
      { source: "/sign-in", destination: "/", permanent: true },
      { source: "/sign-up", destination: "/", permanent: true },
      { source: "/check-email", destination: "/", permanent: true },
      { source: "/account/:path*", destination: "/", permanent: true },
      {
        source: "/tools/find-support-coordinator",
        destination: "/tools/find-a-provider?category=support-coordinator",
        permanent: false,
      },
      {
        source: "/tools/find-plan-manager",
        destination: "/tools/find-a-provider?category=plan-manager",
        permanent: false,
      },
      {
        source: "/tools/find-support-provider",
        destination: "/tools/find-a-provider?category=support-provider",
        permanent: false,
      },
      {
        source: "/tools/find-allied-health",
        destination: "/tools/find-a-provider?category=allied-health",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
