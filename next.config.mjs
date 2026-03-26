import withBundleAnalyzer from "@next/bundle-analyzer";

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const isProduction = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isProduction ? "export" : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default analyzer(nextConfig);
