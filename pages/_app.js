import { SessionProvider } from "next-auth/react";
import { UserProvider } from "../context/UserContext";
import "../styles/globals.css";

import Head from "next/head";
<<<<<<< HEAD

=======
<<<<<<< HEAD
=======
import "../public/pdfjs-worker.js";
>>>>>>> 7202a25e9a83ceca2ec10519aa69857a3010feba
import CookieBanner from "../components/CookieBanner";
>>>>>>> 8e610122c8b3099e26f6855dcf414a70ee252114

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <CookieBanner />
        <Head>
          <title>Lo-Fi.Study</title>
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="color-scheme" content="light dark" />
          <meta
            name="description"
            content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
          />
          <meta
            name="keywords"
            content="study, focus, productivity, ambient music, lo-fi"
          />
          <meta name="author" content="lo-fi.study" />
          <meta name="robots" content="index, follow" />

          {/* Open Graph meta tags */}
          <meta
            property="og:title"
            content="lo-fi.study - Improve Your Focus and Productivity"
          />
          <meta
            property="og:description"
            content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
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
            content="lo-fi.study - Improve Your Focus and Productivity"
          />
          <meta
            name="twitter:description"
            content="lo-fi.study is a website that helps you to study by giving you a distraction free environment. Enjoy ambient music and focus better."
          />
          <meta name="twitter:url" content="https://www.lo-fi.study/" />
          <meta
            name="twitter:image"
            content="https://lo-fi.study/lo-fi.study.svg"
          />
        </Head>
        <Component {...pageProps} />
      </UserProvider>
    </SessionProvider>
  );
}

export default MyApp;
