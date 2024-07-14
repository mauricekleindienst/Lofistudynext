// components/CustomHeader.js
import { signOut } from 'next-auth/react';
import styles from '../styles/CustomHeader.module.css';
import { useState } from 'react';

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={styles.header}>
      <button className={styles.iconButton} onClick={toggleFullscreen}>
        <span className="material-icons">fullscreen</span>
      </button>
      <div className={styles.accountMenu}>
        <button className={styles.iconButton}>
          <span className="material-icons">account_circle</span>
        </button>
        <div className={styles.dropdownContent}>
          <button onClick={() => signOut()} className={styles.logoutButton}>
            <span className="material-icons">logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
