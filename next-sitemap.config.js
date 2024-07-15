/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.lo-fi.study',
  generateRobotsTxt: true, // Generate robots.txt file
  changefreq: 'daily', // How frequently the page is likely to change
  priority: 1.0, // Priority of the main page
  sitemapSize: 5000, // Maximum entries per sitemap file
  additionalPaths: async (config) => [
    {
      loc: '/', // This will be https://www.lo-fi.study/
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: '/login', // This will be https://www.lo-fi.study/login
      changefreq: 'daily',
      priority: 0.8,
    },
    {
      loc: '/study', // This will be https://www.lo-fi.study/study
      changefreq: 'daily',
      priority: 0.8,
    },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
