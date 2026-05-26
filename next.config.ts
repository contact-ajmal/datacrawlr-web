import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The /collections feature is sunset. /models replaces it; we don't
      // try to map individual collection slugs (the relationship isn't
      // 1:1), so a slug fall-through lands on /explore where the catalog
      // itself is browseable.
      { source: "/collections", destination: "/models", permanent: true },
      { source: "/collections/:slug", destination: "/explore", permanent: true },
    ]
  },
}

export default nextConfig
