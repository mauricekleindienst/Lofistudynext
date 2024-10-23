// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    domains: ['i.ibb.co'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              img-src 'self' https://i.ibb.co;
              media-src 'self' https://i.ibb.co;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
            `,
          },
        ],
      },
    ];
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    // Add other environment variables you need here
  },
};

module.exports = nextConfig;
