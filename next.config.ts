import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Suppress webpack cache performance warnings
  // These are informational warnings about serializing large strings (locale files)
  // They don't affect functionality, but can be noisy in development
  webpack: (config) => {
    // Suppress the PackFileCacheStrategy warnings
    if (config.ignoreWarnings) {
      config.ignoreWarnings.push({
        module: /locales\/.*\.json$/,
        message: /Serializing big strings/,
      });
    } else {
      config.ignoreWarnings = [
        {
          module: /locales\/.*\.json$/,
          message: /Serializing big strings/,
        },
      ];
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
