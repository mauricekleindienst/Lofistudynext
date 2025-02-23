/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.cache = false;
    // Add rule for pdf.worker.js
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource',
      generator: {
        filename: 'static/worker/[hash][ext][query]'
      }
    });
    return config;
  },
  images: {
    domains: ['i.ibb.co'],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    // Add other environment variables you need here
  },
};

module.exports = nextConfig;