/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://lo-fi.study',
  generateRobotsTxt: true, // Generate robots.txt file
  sitemapSize: 5000, // Ensure a high value to avoid splitting
  additionalPaths: async (config) => {
    const date = new Date().toISOString();

    return [
      {
        loc: '/', // This will be https://www.lo-fi.study/
        changefreq: 'daily',
        priority: 1.0,
        lastmod: date,
      },
      {
        loc: '/login', // This will be https://www.lo-fi.study/login
        changefreq: 'daily',
        priority: 0.8,
        lastmod: date,
      },
      {
        loc: '/app', // This will be https://www.lo-fi.study/app
        changefreq: 'daily',
        priority: 0.8,
        lastmod: date,
      },
    ];
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
