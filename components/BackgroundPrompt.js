import React from 'react';
import styles from '../styles/app.module.css';

export default function BackgroundPrompt() {
  return (
    <div className={styles.backgroundPrompt}>
      <div className={styles.promptContent}>
        <div className={styles.iconWrapper}>
          <span className="material-icons">wallpaper</span>
        </div>
        <h2>Customize Your Study Space</h2>
        <p>Select a background from the sidebar to create your perfect study environment</p>
        <div className={styles.arrow}>
          <span className="material-icons">arrow_forward</span>
          <span className={styles.hint}>Click the waves icon</span>
        </div>
      </div>
    </div>
  );
} 