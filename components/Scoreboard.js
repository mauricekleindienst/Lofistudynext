// Scoreboard.jsx
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Scoreboard.module.css";

export default function Scoreboard({ onMinimize }) {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await fetch("/api/getScoreboard");
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        setScoreboard(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
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
          <h2>Weekly Pomo Scoreboard</h2>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>
        <div className={styles.scoreboard}>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : scoreboard.length === 0 ? (
            <div>No data available</div>
          ) : (
            scoreboard.map((user, index) => (
              <div
                key={user.email}
                className={`${styles.user} ${
                  index === 0 ? styles.firstPlace : ""
                }`}
              >
                <span>{user.firstname || 'Anonymous'}</span>
                <span>{user.pomodoro_count_weekly} Pomodoros</span>
                {index === 0 && <span className={styles.crown}>👑</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </Draggable>
  );
}