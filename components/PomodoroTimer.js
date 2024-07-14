// components/PomodoroTimer.js
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/PomodoroTimer.module.css';

const pomodoroDurations = {
  pomodoro: 1500, // 25 minutes
  shortBreak: 300, // 5 minutes
  longBreak: 900 // 15 minutes
};

export default function PomodoroTimer() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroDurations.pomodoro);
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[currentMode]);
  };

  const changeMode = (mode) => {
    setCurrentMode(mode);
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[mode]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        <div className={`${styles.timerMode} ${currentMode === 'pomodoro' ? styles.active : ''}`} onClick={() => changeMode('pomodoro')}>Pomodoro</div>
        <div className={`${styles.timerMode} ${currentMode === 'shortBreak' ? styles.active : ''}`} onClick={() => changeMode('shortBreak')}>Short Break</div>
        <div className={`${styles.timerMode} ${currentMode === 'longBreak' ? styles.active : ''}`} onClick={() => changeMode('longBreak')}>Long Break</div>
      </div>
      <div className={styles.timerDisplay}>
        <h3>{formatTime(timeLeft)}</h3>
        <div className={styles.buttonContainer}>
          <button className={styles.startButton} onClick={toggleTimer}>
            {isTimerRunning ? 'Stop' : 'Start'}
          </button>
          <button className={styles.resetButton} onClick={resetTimer}>
            <span className="material-icons">refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
}
