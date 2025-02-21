/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.cache = false;
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