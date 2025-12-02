import withBundleAnalyzer from '@next/bundle-analyzer';

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com",
      "i.postimg.cc",
      "ibb.com",
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent firebase-admin from being bundled on the client
      config.externals.push('firebase-admin');
    }
    return config;
  },
};

export default analyzer(nextConfig);
