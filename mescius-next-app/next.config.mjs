// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // This first one is for your header logo
      {
        protocol: 'https',
        hostname: 'cdn.mescius.io',
      },
      // Add a new entry for each logo domain
      {
        protocol: 'https',
        hostname: 'classmethod.de',
      },
      {
        protocol: 'https',
        hostname: 'www.calsoft.com',
      },
      {
        protocol: 'https',
        hostname: 'uhf.microsoft.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
      },
    ],
  },
};

export default nextConfig;