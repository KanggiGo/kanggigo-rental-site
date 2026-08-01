import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // AVIF first (smallest), WebP fallback for browsers that don't support it.
    formats: ["image/avif", "image/webp"],
    // Safe to cache aggressively: /api/upload names every file with a
    // timestamp + random suffix, so a changed image always gets a new URL
    // rather than overwriting an old one — nothing to invalidate.
    minimumCacheTTL: 31536000,
  },
};

export default withNextIntl(nextConfig);
