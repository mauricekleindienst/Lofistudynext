// /pages/_document.js
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
      url: "https://www.lo-fi.study/",
    },
    description:
      "Lo-Fi.Study is a website that helps you study by providing a distraction-free environment. Enjoy ambient music and focus better.",
    publisher: {
      "@type": "Organization",
      name: "Lo-Fi.Study",
      url: "https://www.lo-fi.study/",
    },
    keywords:
      "study, focus, productivity, ambient music, lo-fi, lofi, music, study music, focus music, productivity music, study music playlist, focus while studying, music for deep work, improve concentration, increase focus, background music for studying, concentration music, improve productivity, productivity tools for students, ADHD study music, brain boosting music, mental clarity music, stress relief music, lo-fi chill beats, lo-fi hip hop, chillwave music, lo-fi beats to relax/study to, lo-fi instrumental music, lofi productivity music, relaxing lo-fi music, lo-fi study beats, calming lo-fi beats, sleep music lo-fi, ambient lo-fi music, chilled lo-fi music, pomodoro music, music for work sessions, music for coding, productive workspace, ambient sounds for focus, improve efficiency, work from home productivity, music for remote work, focus music for writing, music for reading, deep work playlist, instrumental focus music, ambient electronic music, minimalistic study music, classical music for concentration, binaural beats, alpha wave music, study soundscapes, meditation music, nature sounds for focus, piano music for studying, relaxing instrumental music, music to reduce anxiety, relaxation music for exams, mindfulness music, meditation and focus, mental health music, study hacks, study habits, improve memory, mental clarity techniques, Lo-Fi.Study music, lo-fi study beats online, productivity music website, study music with no distractions, study music platform, website for lo-fi focus music, online focus music tool, study and focus environment, distraction-free study website, web app for productivity, music streaming for focus, productivity music web app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.lo-fi.study/?q={search_term}",
      "query-input": "required name=search_term",
    },
  };

  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon-iphone-60x60.png"/>
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png"/>
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-iphone-retina-120x120.png"/>
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png"/>

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        
        {/* Meta Tags */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta
          name="description"
          content="Lo-Fi.Study is a website that helps you study by providing a distraction-free environment. Enjoy ambient music and focus better."
        />
        <meta 
          name="keywords" 
          content="study music, focus music, lo-fi beats, chill beats, improve productivity, work music, music for studying, concentration music, ADHD study music, relaxing lo-fi music, calming lo-fi beats, focus tools, music for deep work, increase focus, brain boosting music, lo-fi hip hop, study environment, pomodoro music, music for coding, ambient sounds, improve memory, productivity music website, study music playlist, focus while studying, improve concentration, background music, mental clarity, stress relief, classical music, meditation music, nature sounds, binaural beats, piano music, music for exams, music to reduce anxiety, mental clarity techniques, productivity hacks"
        />
        <meta name="author" content="Lo-Fi.Study" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.lo-fi.study/" />
 

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lo-Fi.Study - Improve Your Focus and Productivity" />
        <meta name="twitter:description" content="Lo-Fi.Study is a website that helps you study by providing a distraction-free environment. Enjoy ambient music and focus better." />
        <meta name="twitter:url" content="https://www.lo-fi.study/" />
        <meta name="twitter:image" content="https://lo-fi.study/lo-fi.study.svg" />
        <meta name="twitter:image:alt" content="Lo-Fi.Study - Ambient Music for Studying" />

        {/* Open Graph meta tags */}
        <meta property="og:title" content="Lo-Fi.Study - Improve Your Focus and Productivity" />
        <meta property="og:description" content="Lo-Fi.Study is a website that helps you study by providing a distraction-free environment. Enjoy ambient music and focus better." />
        <meta property="og:url" content="https://www.lo-fi.study/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://lo-fi.study/lo-fi.study.svg" />
        <meta property="og:image:alt" content="Lo-Fi.Study - Ambient Music for Studying and Productivity" />

        {/* Structured Data */}
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
