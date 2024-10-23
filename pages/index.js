import { useEffect, useRef } from "react";
import Head from "next/head";
import Typed from "typed.js";
import { router } from "next/router";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Landing() {
  const featuresRef = useRef(null);

  const img = [
    {
      src:
        "https://i.ibb.co/K0qdm4r/lgsarius-cyberpunk-night-study-girl-window-desklight-c1650ad7-776d-470a-a2e0-da9e78140212.webp",
      alt: "First slide",
    },
    {
      src:
        "https://i.ibb.co/nC5NnTr/DALL-E-2024-09-22-13-11-47-A-serene-winter-landscape-during-the-blue-hour-featuring-a-small-cozy-cab.webp",
      alt: "Second slide",
    },
    {
      src:
        "https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp",
      alt: "Fourth slide",
    },
    {
      src:
        "https://i.ibb.co/m9QYfwJ/lgsarius-Lofi-Trainstation-sunset-648859c2-8af6-4b30-b276-dca8f45ba231.webp",
      alt: "Fifth slide",
    },
  ];

  const ImageCarousel = () => {
    return (
      <section className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>
          Beautiful Background Selection
        </h2>
        <div className={styles.overviewGrid}>
          <Carousel
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={2000}
          >
            {img.map((img, index) => (
              <div key={index} className={styles.carouselItem}>
                <img
                  className={styles.carouselImage}
                  src={img.src}
                  alt={img.alt}
                />
              </div>
            ))}
          </Carousel>
        </div>
      </section>
    );
  };

  useEffect(() => {
    const typed = new Typed("#typedtext", {
      strings: ["Work", "Study", "Chill", "Code"],
      typeSpeed: 120,
      backSpeed: 120,
      backDelay: 500,
      smartBackspace: true,
      loop: true,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          featuresRef.current.style.animation = 'none';
          featuresRef.current.offsetHeight; // Trigger reflow
          featuresRef.current.style.animation = null;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lo-Fi.Study - Enhance Your Study Sessions</title>
        <meta
          name="description"
          content="Enhance your study sessions with Lo-Fi.Study, a platform that offers ambient music, Pomodoro timers, and tools to help you stay focused and productive."
        />
        <meta name="keywords" content="study music, focus music, lo-fi, productivity, ambient music, Pomodoro timer, study tools, note-taking, study atmosphere" />
        <meta property="og:title" content="Lo-Fi.Study - Enhance Your Study Sessions" />
        <meta property="og:description" content="Discover a platform designed to help you stay focused with ambient sounds, productivity tools, and customizable study environments." />
        <meta property="og:image" content="/path-to-your-og-image.jpg" />  {/* Update the OG image */}
      </Head>
      <Header />
      <CookieBanner />
      <main className={styles.main}>
        <motion.div
          className={styles.welcomeWrapper}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <section className={styles.welcomeSection}>
            <div className={styles.cartoonLeft}>
              <Image
                src="/character_notebook.svg"
                alt="Study illustration left"
                width={200}
                height={200}
                priority
              />
            </div>
            <div className={styles.welcomeContent}>
              <h1 className={styles.title}>Welcome to Lo-Fi.Study</h1>
              <p className={styles.description}>
                With Lo-Fi.Study, you can create the perfect atmosphere to{" "}
                <span id="typedtext"></span>.
              </p>
              <motion.button
                onClick={() => router.push("/auth/signin")}
                className={styles.ctaButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </section>
        </motion.div>
        <motion.section
          className={styles.coverSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.coverWrapper}>
            <div className={styles.coverContent}>
              <h2 className={styles.sectionTitle}>The Lo-Fi.Study App</h2>
              <p className={styles.coverDescription}>
                Immerse yourself in a world of focus and productivity. Create your perfect study atmosphere with curated lo-fi beats, ambient sounds, and powerful productivity tools.
              </p>
              <motion.button
                className={styles.ctaButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToFeatures}
              >
                Explore Features
              </motion.button>
            </div>
            <div className={styles.coverImageWrapper}>
              <Image
                src="/cover.png"
                alt="Lo-Fi Study Cover"
                width={2000}
                height={1200}
                className={styles.coverImage}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.overviewSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>Why Choose Lo-Fi.Study?</h2>
          <div className={styles.overviewGrid}>
            <div className={styles.overviewItem}>
              <span className={styles.icon}>🎵</span>
              <h3>Ambient Sounds</h3>
              <p>Create your perfect study atmosphere</p>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.icon}>⏱️</span>
              <h3>Pomodoro Timer</h3>
              <p>Stay focused and manage your time effectively</p>
            </div>
            <div className={styles.overviewItem}>
              <span className={styles.icon}>📊</span>
              <h3>Data Tracking</h3>
              <p>Track your Pomodoro Sessions</p>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ImageCarousel />
        </motion.div>

        <motion.section
          ref={featuresRef}
          className={styles.featureSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureItem}>
              <h3>Ambient Sounds</h3>
              <p>
                Choose from a variety of lo-fi beats and nature sounds to create
                your perfect study atmosphere.
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3>Pomodoro Timer</h3>
              <p>
                Stay focused with our customizable Pomodoro timer. Break your
                study sessions into manageable chunks.
              </p>
            </div>

            <div className={styles.featureItem}>
              <h3>Note Taking</h3>
              <p>
                Capture your thoughts and organize your study materials with our
                built-in note-taking tool.
              </p>
            </div>
            <div className={styles.featureItem}>
              <h3>Scoreboard</h3>
              <p>
                Get motivated by tracking your study progress and competing with
                friends on the leaderboard.
              </p>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
