import { useEffect, useRef, useMemo, useState } from "react";
import Head from "next/head";
import Typed from "typed.js";
import { useRouter } from "next/router";
import { motion, useScroll, useTransform } from "framer-motion";
import Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Landing() {
  const [imagesLoaded, setImagesLoaded] = useState([]);
  const featuresRef = useRef(null);
  const freeToolSectionRef = useRef(null);
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  // Update parallax effects to be more subtle and prevent disappearing
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const img = useMemo(() => [
    {
      src: "https://i.ibb.co/K0qdm4r/lgsarius-cyberpunk-night-study-girl-window-desklight-c1650ad7-776d-470a-a2e0-da9e78140212.webp",
      alt: "Cyberpunk night study scene",
      title: "Night Focus",
      description: "Perfect for late-night study sessions"
    },
    {
      src: "https://i.ibb.co/nC5NnTr/DALL-E-2025-09-22-13-11-47-A-serene-winter-landscape-during-the-blue-hour-featuring-a-small-cozy-cab.webp",
      alt: "Serene winter landscape with cozy cabin",
      title: "Winter Serenity",
      description: "Cozy and peaceful study environment"
    },
    {
      src: "https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp",
      alt: "Lo-fi study girl with plants and rain",
      title: "Rainy Vibes",
      description: "Calming rain ambiance for focus"
    },
    {
      src: "https://i.ibb.co/m9QYfwJ/lgsarius-Lofi-Trainstation-sunset-648859c2-8af6-4b30-b276-dca8f45ba231.webp",
      alt: "Lo-fi trainstation at sunset",
      title: "Journey Mode",
      description: "Travel-inspired concentration"
    },
  ], []);

  const ImageSlider = useMemo(() => {
    const MemoizedSlider = () => {
      const sliderRef = useRef(null);

      useEffect(() => {
        if (!sliderRef.current) return;

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
                  <li key={image.src} className={`glide__slide ${styles.sliderItem}`}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1000}
                      height={600}
                      objectFit="cover"
                      className={styles.sliderImage}
                      loading="lazy"
                      onLoad={() => {
                        setImagesLoaded(prev => {
                          const newImagesLoaded = [...prev];
                          newImagesLoaded[index] = true;
                          return newImagesLoaded;
                        });
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
  }, [img]);

  useEffect(() => {
    const typed = new Typed("#typedtext", {
      strings: ["Work", "Study", "Create", "Focus", "Code", "Learn"],
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

  const features = [
    {
      icon: "🎵",
      title: "Ambient Sounds",
      description: "Curated lo-fi beats and nature sounds to create your perfect study atmosphere",
      color: "#FF6B6B"
    },
    {
      icon: "⏱️",
      title: "Smart Timer",
      description: "Stay focused with our intelligent Pomodoro timer that adapts to your study patterns",
      color: "#4ECDC4"
    },
    {
      icon: "📝",
      title: "Note Taking",
      description: "Capture and organize your thoughts with our intuitive note-taking system",
      color: "#45B7D1"
    },
    {
      icon: "🎯",
      title: "Goal Tracking",
      description: "Set and achieve your study goals with our comprehensive tracking system",
      color: "#96CEB4"
    },
    {
      icon: "🏆",
      title: "Progress Stats",
      description: "Monitor your improvement with detailed statistics and insights",
      color: "#FFEEAD"
    },
    {
      icon: "🤝",
      title: "Community",
      description: "Join a community of focused learners and share your progress",
      color: "#D4A5A5"
    }
  ];



  const scrollToFeatures = () => {
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFreeToolSection = () => {
    if (freeToolSectionRef.current) {
      freeToolSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Lo-Fi.Study - Your Perfect Study Environment</title>
        <meta name="description" content="Create your ideal study atmosphere with Lo-Fi.Study. Featuring ambient sounds, productivity tools, and a beautiful environment designed for focus and success." />
        <meta name="keywords" content="study music, focus music, lo-fi, productivity, ambient sounds, Pomodoro timer, study tools, note-taking" />
        <meta property="og:title" content="Lo-Fi.Study - Your Perfect Study Environment" />
        <meta property="og:description" content="Create your ideal study atmosphere with Lo-Fi.Study. Ambient sounds, productivity tools, and a beautiful environment designed for focus." />
        <meta property="og:image" content="https://i.ibb.co/kG960G6/cover.webp" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <CookieBanner />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your
              <br />
              <span className={styles.gradientText}>Study Experience</span>
            </motion.h1>
            <motion.p 
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Create the perfect atmosphere to{" "}
              <span className={styles.typedTextWrapper}>
                <span id="typedtext" className={styles.typedText}></span>
              </span>
            </motion.p>
            <motion.div 
              className={styles.ctaContainer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => router.push("/auth/signin")}
                className={styles.ctaButton}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,123,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Free
              </motion.button>
              <motion.button
                onClick={scrollToFreeToolSection}
                className={`${styles.ctaButton} ${styles.secondaryButton}`}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,123,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div 
            className={styles.heroImage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="https://i.ibb.co/TxKz05g2/hero-image.png"
              alt="Lo-Fi Study Environment"
              width={1000}
              height={800}
              priority
              className={styles.mainImage}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg=="
            />
          </motion.div>
        </section>

  

        {/* Features Section */}
        <section ref={featuresRef} className={styles.featureSection}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Everything You Need to Excel
          </motion.h2>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ '--feature-color': feature.color }}
              >
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Showcase Section */}
        <section className={styles.showcaseSection}>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Beautiful Study Environments
          </motion.h2>
          <div className={styles.showcaseGrid}>
            {img.map((image, index) => (
              <motion.div
                key={image.src}
                className={styles.showcaseCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className={styles.showcaseImageWrapper}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={225}
                    className={styles.showcaseImage}
                    onLoad={() => {
                      setImagesLoaded(prev => {
                        const newImagesLoaded = [...prev];
                        newImagesLoaded[index] = true;
                        return newImagesLoaded;
                      });
                    }}
                  />
                </div>
                <div className={styles.showcaseContent}>
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Free Tools Section */}
        <section ref={freeToolSectionRef} className={styles.freeToolSection}>
          <motion.div 
            className={styles.freeToolContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Always Free, Always Growing</h2>
            <div className={styles.freeToolGrid}>
              <motion.div 
                className={styles.freeToolCard}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <span className={styles.freeToolIcon}>🎯</span>
                <h3>Student-Focused</h3>
                <p>Created by students, for students. We understand your needs.</p>
              </motion.div>
              <motion.div 
                className={styles.freeToolCard}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <span className={styles.freeToolIcon}>💯</span>
                <h3>No Hidden Costs</h3>
                <p>All features are completely free. No premium tier, no ads.</p>
              </motion.div>
              <motion.div 
                className={styles.freeToolCard}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <span className={styles.freeToolIcon}>🚀</span>
                <h3>Constant Updates</h3>
                <p>Regular updates based on your feedback and needs.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className={styles.ctaSection}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={styles.ctaContent}
          >
            <h2>Ready to Transform Your Study Sessions?</h2>
            <p>Join thousands of students already improving their focus with Lo-Fi.Study</p>
            <motion.button
              onClick={() => router.push("/auth/signin")}
              className={styles.ctaButton}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,123,0,0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
