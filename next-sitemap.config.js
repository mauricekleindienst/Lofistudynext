/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://lo-fi.study',
  generateRobotsTxt: true, // Generate robots.txt file
  changefreq: 'daily', // How frequently the page is likely to change
  priority: 1.0, // Priority of the main page
  sitemapSize: 5000, // Maximum entries per sitemap file
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
        loc: '/study', // This will be https://www.lo-fi.study/study
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
