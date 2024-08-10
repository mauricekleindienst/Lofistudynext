import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://www.lo-fi.study/",
    name: "Lo-Fi.Study - Improve Your Focus and Productivity",
    author: {
      "@type": "Organization",
      name: "Lo-Fi.Study",
    },
    description:
      "Lo-Fi.Study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better.",
    publisher: {
      "@type": "Organization",
      name: "Lo-Fi.Study",
    },
    keywords:
      "study, focus, productivity, ambient music, lo-fi, lofi, music, study music, focus music, productivity music",
  };

  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        
        {/* Additional Apple Touch Icons for different sizes */}
        <link rel="apple-touch-icon" href="/apple-touch-icon-iphone-60x60.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-iphone-retina-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png"/>
      
        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="description"
          content="Lo-Fi.Study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
        />
        <meta
          name="keywords"
          content="study, focus, productivity, ambient music, lo-fi"
        />
        <meta name="author" content="Lo-Fi.Study" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph meta tags */}
        <meta
          property="og:title"
          content="Lo-Fi.Study - Improve Your Focus and Productivity"
        />
        <meta
          property="og:description"
          content="Lo-Fi.Study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
        />
        <meta property="og:url" content="https://www.lo-fi.study/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://lo-fi.study/lo-fi.study.svg"
        />

        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Lo-Fi.Study - Improve Your Focus and Productivity"
        />
        <meta
          name="twitter:description"
          content="Lo-Fi.Study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
        />
        <meta name="twitter:url" content="https://www.lo-fi.study/" />
        <meta
          name="twitter:image"
          content="https://lo-fi.study/lo-fi.study.svg"
        />

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