import React from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Scoreboard.module.css';

export default function Scoreboard({ onMinimize }) {
  return (
    <Draggable>
      <div className={styles.scoreboardContainer}>
        <div className={styles.header}>
          <h2>Scoreboard</h2>
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.scoreboardContent}>
          {/* Scoreboard content goes here */}
        </div>
      </div>
    </Draggable>
  );
}
