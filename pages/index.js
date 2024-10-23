import { useEffect, useRef, useMemo, useState } from "react";
import Head from "next/head";
import Typed from "typed.js";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Landing() {
  const [imagesLoaded, setImagesLoaded] = useState(Array(img.length).fill(false));

  const img = [
    {
      src: "https://i.ibb.co/K0qdm4r/lgsarius-cyberpunk-night-study-girl-window-desklight-c1650ad7-776d-470a-a2e0-da9e78140212.webp",
      alt: "Cyberpunk night study scene",
    },
    {
      src: "https://i.ibb.co/nC5NnTr/DALL-E-2024-09-22-13-11-47-A-serene-winter-landscape-during-the-blue-hour-featuring-a-small-cozy-cab.webp",
      alt: "Serene winter landscape with cozy cabin",
    },
    {
      src: "https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp",
      alt: "Lo-fi study girl with plants and rain",
    },
    {
      src: "https://i.ibb.co/m9QYfwJ/lgsarius-Lofi-Trainstation-sunset-648859c2-8af6-4b30-b276-dca8f45ba231.webp",
      alt: "Lo-fi trainstation at sunset",
    },
  ];

  const ImageSlider = useMemo(() => {
    const MemoizedSlider = () => {
      const sliderRef = useRef(null);

      useEffect(() => {
        const glide = new Glide(sliderRef.current, {
          type: 'carousel',
          perView: 1,
          autoplay: 3000,
          hoverpause: true,
          animationDuration: 1000,
        });

        glide.mount();

        return () => {
          glide.destroy();
        };
      }, []);

      return (
        <section className={styles.overviewSection}>
          <h2 className={styles.sectionTitle}>
            Beautiful Background Selection
          </h2>
          <div className={styles.sliderWrapper} ref={sliderRef}>
            <div className="glide__track" data-glide-el="track">
              <ul className="glide__slides">
                {img.map((image, index) => (
                  <li key={index} className={`glide__slide ${styles.sliderItem}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1000}
                      height={600}
                      objectFit="cover"
                      className={styles.sliderImage}
                      loading="lazy"
                      onLoad={() => {
                        const newImagesLoaded = [...imagesLoaded];
                        newImagesLoaded[index] = true;
                        setImagesLoaded(newImagesLoaded);
                      }}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="glide__bullets" data-glide-el="controls[nav]">
              {img.map((_, index) => (
                <button 
                  key={index} 
                  className="glide__bullet" 
                  data-glide-dir={`=${index}`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </section>
      );
    };
    MemoizedSlider.displayName = 'ImageSlider';
    return MemoizedSlider;
  }, [imagesLoaded]);

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
              <h1 className={styles.title}>
                Welcome to <span className={styles.gradientText}>Lo-Fi.Study</span>
              </h1>
              <p className={styles.description}>
                With Lo-Fi.Study, you can create the perfect atmosphere to{" "}
                <span className={styles.typedTextWrapper}>
                  <span id="typedtext" className={styles.typedText}></span>
                </span>
              </p>
              <motion.button
                onClick={() => router.push("/auth/signin")}
                className={styles.ctaButton}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,123,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
            <div className={styles.backgroundAnimation}></div>
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
  Immerse yourself in a world of focus and productivity. Create your perfect study atmosphere with curated lo-fi beats, ambient sounds, and powerful productivity tools. Whether you&apos;re tackling a challenging project or diving deep into your studies, our immersive soundscapes and intuitive features are designed to help you maintain concentration, reduce distractions, and boost your workflow. Discover the ultimate blend of relaxation and productivity, tailor-made for your daily routine. Let the ambient vibes guide you toward accomplishing your goals, one task at a time.
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
                src="https://i.ibb.co/kG960G6/cover.webp"
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
          <ImageSlider />
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
