import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";

export default function AboutUs() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>About Us - Lo-Fi.Study</title>
        <meta name="description" content="Learn more about Lo-Fi.Study and our mission to enhance your study experience." />
      </Head>

      <Header />

      <main className={styles.main}>
        <motion.section
          className={styles.aboutSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5 }}
        >
          <h1 className={styles.title}>About Lo-Fi.Study</h1>
          <p className={styles.aboutDescription}>
            Lo-Fi.Study was born from a simple idea: to create the perfect study environment for students worldwide. Our platform combines soothing lo-fi beats, ambient sounds, and effective study tools to enhance your learning experience.
          </p>
        </motion.section>

        <motion.section
          className={styles.missionSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionDescription}>
            We believe that every student deserves access to tools that can boost their productivity and create a calming study atmosphere. That&apos;s why we&apos;ve made Lo-Fi.Study completely free and accessible to everyone. Our mission is to empower students worldwide by providing a platform that combines music, ambiance, and productivity - all in one place.
          </p>
        </motion.section>

        <motion.section
          className={styles.valuesSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className={styles.sectionTitle}>Our Values</h2>
          <ul className={styles.valuesList}>
            <li>
              <h3>Accessibility</h3>
              <p>We believe in making productivity tools available to all students, regardless of their financial situation.</p>
            </li>
            <li>
              <h3>Innovation</h3>
              <p>We continuously strive to improve our platform and introduce new features based on user feedback.</p>
            </li>
            <li>
              <h3>Community</h3>
              <p>We foster a supportive environment where students can connect, share experiences, and motivate each other.</p>
            </li>
            <li>
              <h3>Well-being</h3>
              <p>We prioritize the mental health and overall well-being of our users in everything we do.</p>
            </li>
          </ul>
        </motion.section>

        <motion.section
          className={styles.joinSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Join Our Community</h2>
          <p className={styles.joinDescription}>
            We&apos;re always looking for ways to improve and expand our platform. Your feedback and suggestions are invaluable to us. Join our community of students and lifelong learners, and be a part of shaping the future of Lo-Fi.Study!
          </p>
          <motion.a
            href="/auth/signin"
            className={styles.ctaButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.a>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
