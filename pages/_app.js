import { AuthProvider } from "../contexts/AuthContext";
import { UserProvider } from "../context/UserContext";
import "../styles/globals.css";
import Head from "next/head";
import CookieBanner from "../components/CookieBanner";
import 'bootstrap/dist/css/bootstrap.css';
import { ChakraProvider } from '@chakra-ui/react'
import { ThemeProvider } from "../contexts/ThemeContext";

// Set initial theme class on HTML element
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ChakraProvider>
          <UserProvider>
            <CookieBanner />
            <Head>
              <title>Lo-Fi.Study</title>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="theme-color" content="#ffffff" />
              <meta name="color-scheme" content="light dark" />
             
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
        </ChakraProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
