import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://www.lo-fi.study/",
    "name": "lo-fi.study - Improve Your Focus and Productivity",
    "author": {
      "@type": "Organization",
      "name": "lo-fi.study"
    },
    "description": "lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better.",
    "publisher": {
      "@type": "Organization",
      "name": "lo-fi.study"
    },
    "keywords": "study, focus, productivity, ambient music, lo-fi, lofi, music, study music, focus music, productivity music"
  };

  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta name="description" content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better." />
        <meta name="keywords" content="study, focus, productivity, ambient music, lo-fi" />
        <meta name="author" content="lo-fi.study" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content="lo-fi.study - Improve Your Focus and Productivity" />
        <meta property="og:description" content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better." />
        <meta property="og:url" content="https://www.lo-fi.study/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lo-fi.study/lo-fi.study.svg" />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="lo-fi.study - Improve Your Focus and Productivity" />
        <meta name="twitter:description" content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better." />
        <meta name="twitter:url" content="https://www.lo-fi.study/" />
        <meta name="twitter:image" content="https://lo-fi.study/lo-fi.study.svg" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
