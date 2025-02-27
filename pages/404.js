import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from '../styles/404.module.css';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect after 10 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>404 - Page Not Found | Lo-Fi.Study</title>
        <meta name="description" content="Oops! Looks like you're lost in the lo-fi universe." />
      </Head>

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className={styles.imageWrapper}
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <Image
            src="https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp"
            alt="Lost in Lo-Fi"
            width={400}
            height={300}
            className={styles.image}
            priority
          />
        </motion.div>

        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          404 - Lost in the <span className={styles.gradientText}>Lo-Fi</span> Universe
        </motion.h1>

        <motion.p 
          className={styles.description}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Looks like you've wandered into an unexplored dimension. Let's get you back to your study session.
        </motion.p>

        <motion.div 
          className={styles.buttonContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={() => router.push('/')}
            className={styles.button}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,123,0,0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Return Home
          </motion.button>
          <motion.button
            onClick={() => router.back()}
            className={`${styles.button} ${styles.secondaryButton}`}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,123,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back
          </motion.button>
        </motion.div>

        <motion.div 
          className={styles.redirectMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Redirecting to home in <span className={styles.countdown}>10</span> seconds...
        </motion.div>
      </motion.div>

      <div className={styles.musicNotes}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={styles.note}
            animate={{
              y: [-20, -120],
              x: [0, i % 2 === 0 ? 20 : -20],
              opacity: [0, 1, 0],
              rotate: [0, i % 2 === 0 ? 45 : -45]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeOut"
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>
    </div>
  );
}
