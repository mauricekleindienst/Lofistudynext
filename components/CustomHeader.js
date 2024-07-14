// components/CustomHeader.js
import { signOut } from 'next-auth/react';
import styles from '../styles/CustomHeader.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const shareVideoRoom = async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.url) {
        router.push({
          pathname: '/study',
          query: { roomUrl: data.url }
        });
      } else {
        console.error('Error creating video room:', data.error);
      }
    } catch (error) {
      console.error('Error creating video room:', error);
    }
  };

  return (
    <div className={styles.header}>
      <button className={styles.iconButton} onClick={shareVideoRoom}>
        <span className="material-icons">videocam</span>
      </button>
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
