// pages/study.js
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import styles from '../styles/Study.module.css';

export default function Study() {
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/lo-fi.study.svg" alt="lo-fi.study" />
        </div>
        <nav className={styles.nav}>
          <button onClick={() => signOut()} className={styles.logoutButton}>Logout</button>
        </nav>
      </header>
      <main className={styles.main}>
        <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            {sidebarOpen ? '<<' : '>>'}
          </button>
          <div className={styles.backgroundSelector}>
            <h2>Backgrounds</h2>
            {/* Add background selection here */}
          </div>
          <div className={styles.currentTime}>
            <h2>12:39 PM</h2>
          </div>
          <div className={styles.musicPlayer}>
            <h2>Music Player</h2>
            {/* Add music player here */}
          </div>
          <div className={styles.timer}>
            <h3>25:00</h3>
            <button className={styles.startButton}>Start</button>
            <div className={styles.controls}>
              <button>Short Break</button>
              <button>Long Break</button>
            </div>
          </div>
        </aside>
        <div className={styles.content}>
          <h1>Welcome to your Study Space, {session.user.name}!</h1>
          <p>Start studying with focus and calm.</p>
          {/* Add additional content or components here */}
        </div>
      </main>
    </div>
  );
}
