import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export default function AboutUs() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const router = useRouter();

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
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About <span className={styles.gradientText}>Lo-Fi.Study</span>
          </motion.h1>
          <motion.p 
            className={styles.aboutDescription}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Lo-Fi.Study was born from a simple idea: to create the perfect study environment for students worldwide. Our platform combines soothing lo-fi beats, ambient sounds, and effective study tools to enhance your learning experience.
          </motion.p>
        </motion.section>

        <motion.section
          className={styles.missionSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Mission
          </motion.h2>
          <motion.p 
            className={styles.missionDescription}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            We believe that every student deserves access to tools that can boost their productivity and create a calming study atmosphere. That&apos;s why we&apos;ve made Lo-Fi.Study completely free and accessible to everyone. Our mission is to empower students worldwide by providing a platform that combines music, ambiance, and productivity - all in one place.
          </motion.p>
        </motion.section>

        <motion.section
          className={styles.valuesSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>
          <div className={styles.valuesGrid}>
            {[
              {
                icon: "🌟",
                title: "Accessibility",
                description: "We believe in making productivity tools available to all students, regardless of their financial situation."
              },
              {
                icon: "💡",
                title: "Innovation",
                description: "We continuously strive to improve our platform and introduce new features based on user feedback."
              },
              {
                icon: "🤝",
                title: "Community",
                description: "We foster a supportive environment where students can connect, share experiences, and motivate each other."
              },
              {
                icon: "🎯",
                title: "Well-being",
                description: "We prioritize the mental health and overall well-being of our users in everything we do."
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                className={styles.valueCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <span className={styles.valueIcon}>{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className={styles.joinSection}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Join Our Community
          </motion.h2>
          <motion.p 
            className={styles.joinDescription}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            We&apos;re always looking for ways to improve and expand our platform. Your feedback and suggestions are invaluable to us. Join our community of students and lifelong learners, and be a part of shaping the future of Lo-Fi.Study!
          </motion.p>
          <motion.button
            className={styles.ctaButton}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,123,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/auth/signin")}
          >
            Get Started Free
          </motion.button>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
