// pages/index.js
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/lo-fi.study.svg" alt="lo-fi.study" />
        </div>
        <nav className={styles.nav}>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <Link href="/login" passHref>
            <button className={styles.loginButton}>Login</button>
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>lo-fi.study</h1>
          <p>Your calm, digital space to</p>
          <h2>Work</h2>
          <Link href="/login" passHref>
            <button className={styles.registerButton}>Register now</button>
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 lo-fi.study</p>
      </footer>
    </div>
  );
}
