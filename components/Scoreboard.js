// Scoreboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Scoreboard.module.css";

const formatStudyTime = (pomodoroCount) => {
  const totalMinutes = pomodoroCount * 25;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
};

export default function Scoreboard({ onMinimize }) {
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('weekly');

  const fetchScoreboard = useCallback(async () => {
    try {
      const response = await fetch(`/api/getScoreboard?type=${activeTab}`);
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
  }, [activeTab]);

  useEffect(() => {
    fetchScoreboard();
    const intervalId = setInterval(fetchScoreboard, 30000);
    return () => clearInterval(intervalId);
  }, [fetchScoreboard, activeTab]);

  return (
    <Draggable handle={`.${styles.dragHandle}`}>
      <div className={styles.scoreboardContainer}>
        <div className={styles.dragHandle}></div>
        <div className={styles.header}>
          <h2>Study Time Rankings</h2>
          <button
            onClick={onMinimize}
            className={styles.closeButton}
            aria-label="Minimize scoreboard"
          >
            <span className="material-icons">remove</span>
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'weekly' ? styles.active : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            This Week
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'alltime' ? styles.active : ''}`}
            onClick={() => setActiveTab('alltime')}
          >
            All Time
          </button>
        </div>

        <div className={styles.scoreboard}>
          {loading ? (
            <div className={styles.spinner}>Loading...</div>
          ) : error ? (
            <div className={styles.error}>
              <p>Error: {error}</p>
              <button onClick={fetchScoreboard} aria-label="Retry fetch scoreboard">Retry</button>
            </div>
          ) : scoreboard.length === 0 ? (
            <div className={styles.emptyState}>
              {activeTab === 'weekly' 
                ? "No study time recorded this week"
                : "No study time recorded yet"}
            </div>
          ) : (
            scoreboard.map((user, index) => (
              <div
                key={user.email || index}
                className={`${styles.user} ${index === 0 ? styles.firstPlace : ""}`}
              >
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.firstname || "Anonymous"}</span>
                  <span className={styles.studyTime}>
                    {formatStudyTime(user.pomodoro_count)}
                  </span>
                </div>
                {index === 0 && <span className={styles.crown}>👑</span>}
              </div>
            ))
          )}
        </div>
      </div>
    </Draggable>
  );
}
