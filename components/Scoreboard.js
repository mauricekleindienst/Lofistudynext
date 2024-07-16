import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Scoreboard.module.css';

export default function Scoreboard({ onMinimize }) {
  const [scoreboard, setScoreboard] = useState([]);

  useEffect(() => {
    const fetchScoreboard = async () => {
      const response = await fetch('/api/getScoreboard');
      const data = await response.json();
      setScoreboard(data);
    };

    // Initial fetch
    fetchScoreboard();

    // Polling every 30 seconds
    const intervalId = setInterval(fetchScoreboard, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.scoreboardContainer}>
        <div className={`${styles.header} drag-handle`}>
          <h2>Scoreboard</h2>
          <button onClick={onMinimize} className={styles.minimizeButton}>
  <span className="material-icons">remove</span>
</button>
        </div>
        <div className={styles.scoreboard}>
          {scoreboard.map((user, index) => (
            <div key={index} className={`${styles.user} ${index === 0 ? styles.firstPlace : ''}`}>
              <span>{user.firstname}</span>
              <span>{user.pomodoro_count} Pomodoros</span>
              {index === 0 && <span className={styles.crown}>👑</span>}
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
