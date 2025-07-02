// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this images block
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.mescius.io',
      },
    ],
  },
};

export default nextConfig;