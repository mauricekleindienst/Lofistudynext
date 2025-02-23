import React, { useEffect } from 'react';
import styles from '../styles/app.module.css';

export default function BackgroundPrompt({ onClose }) {
  const handleClose = async () => {
    try {
      await fetch('/api/tutorials/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutorial: 'background_prompt',
          completed: true
        }),
      });
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to update tutorial state:', error);
    }
  };

  return (
    <div className={styles.backgroundPrompt}>
      <div className={styles.promptContent}>
        <button onClick={handleClose} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
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