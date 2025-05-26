import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '/aboutus' },
    { label: 'FAQ', href: '/FAQ' },
    { label: 'Contact', href: '/Contact' },
    { label: 'API Test', href: '/api-test' },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/logo.svg"
            alt="Lo-Fi Study Logo"
            width={40}
            height={40}
            className={styles.logo}
            style={{ filter: 'invert(56%) sepia(93%) saturate(1771%) hue-rotate(360deg) brightness(103%) contrast(106%)' }}
          />
          <span className={styles.logoText}>Lo-Fi.Study</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${router.pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className={styles.authButtons}>
          {user ? (
            <motion.button
              className={styles.appButton}
              onClick={() => router.push('/app')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Open App
            </motion.button>
          ) : (
            <>
              <motion.button
                className={styles.signInButton}
                onClick={() => router.push('/auth/signin')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button
                className={styles.signUpButton}
                onClick={() => router.push('/auth/register')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className={styles.mobileNav}
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
            >
              {navItems.map((item) => (
                <motion.div key={item.label} variants={itemVariants}>
                  <Link
                    href={item.href}
                    className={`${styles.mobileNavLink} ${router.pathname === item.href ? styles.active : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {!user && (
                <motion.div className={styles.mobileAuthButtons} variants={itemVariants}>
                  <button
                    className={styles.mobileSignInButton}
                    onClick={() => router.push('/auth/signin')}
                  >
                    Sign In
                  </button>
                  <button
                    className={styles.mobileSignUpButton}
                    onClick={() => router.push('/auth/register')}
                  >
                    Get Started
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
