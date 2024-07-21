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

    fetchScoreboard();
    const intervalId = setInterval(fetchScoreboard, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Draggable handle={`.${styles.dragHandle}`}>
      <div className={styles.scoreboardContainer}>
        <div className={styles.dragHandle}></div>
        <div className={styles.header}>
          <h2>Pomo Scoreboard</h2>
          <button onClick={onMinimize} className={styles.closeButton}>
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