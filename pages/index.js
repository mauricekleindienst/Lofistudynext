import { useEffect, useRef } from "react";
import Head from "next/head";
import Typed from "typed.js";
import { motion } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

import Image from "next/image";

export default function Landing() {
  const images = [
    {
      src: "https://i.ibb.co/K0qdm4r/lgsarius-cyberpunk-night-study-girl-window-desklight-c1650ad7-776d-470a-a2e0-da9e78140212.webp" ,
      alt: "First slide",
    },
    {
      src: "https://i.ibb.co/fGQQfWr/lgsarius-Lofi-study-girl-on-desk-cybperunk-like-coffee-rain-82a5d58d-44f1-4b9a-ae8f-1f82844543a6.webp",
      alt: "Second slide",
    },
    {
      src: "https://i.ibb.co/pdsgshq/lgsarius-Lofi-girl-and-cat-studying-in-a-field-sunset-3d94459d-fd73-43ee-8c1f-c4547239bb7a.webp",
      alt: "Third slide",
    },
    {
      src: "https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp",
      alt: "Fourth slide",
    },
    {
      src: "https://i.ibb.co/m9QYfwJ/lgsarius-Lofi-Trainstation-sunset-648859c2-8af6-4b30-b276-dca8f45ba231.webp",
      alt: "Fifth slide",
    },
  ];

  const ImageCarousel = () => {
    return (
      <section className={styles.overviewSection}>
        <h2 className={styles.sectionTitle}>
          Beautiful Changing Background Selection
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
            {images.map((image, index) => (
              <div key={index} className={styles.carouselItem}>
                <Image
                  className={styles.carouselImage}
                  src={image.src}
                  alt={image.alt}
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
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Lo-Fi.Study - Enhance Your Study Sessions</title>
        <meta
          name="description"
          content="Enhance your study sessions with our Lo-Fi.Study Lofi styled learning platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.main}>
        <motion.div
          className={styles.welcomeWrapper}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <section className={styles.welcomeSection}>
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
          </section>
        </motion.div>

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
              <span className={styles.icon}>👥</span>
              <h3>Collaborative Rooms</h3>
              <p>Study with friends in virtual Chatrooms</p>
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
