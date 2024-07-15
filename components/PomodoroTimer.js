import { useState, useEffect, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/PomodoroTimer.module.css';

const pomodoroDurations = {
  pomodoro: 1500, // 25 minutes
  shortBreak: 300, // 5 minutes
  longBreak: 900 // 15 minutes
};

export default function PomodoroTimer({ onMinimize }) {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(pomodoroDurations.pomodoro);
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const timerRef = useRef(null);

  const pomodoroStartSound = useRef(new Audio('/sounds/alert-work.mp3'));
  const pomodoroEndSound = useRef(new Audio('/sounds/alert-short-break.mp3'));
  const longPauseSound = useRef(new Audio('/sounds/alert-long-break.mp3'));

  const requestNotificationPermission = () => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const showNotification = (title, message) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  };

  const handleTimerEnd = useCallback(() => {
    if (currentMode === 'pomodoro') {
      pomodoroEndSound.current.play();
      showNotification('Pomodoro Timer', 'Pomodoro session ended. Take a short break! ☕️');
      setCurrentMode('shortBreak');
      setTimeLeft(pomodoroDurations.shortBreak);
    } else if (currentMode === 'shortBreak') {
      setCurrentMode('pomodoro');
      setTimeLeft(pomodoroDurations.pomodoro);
      showNotification('Pomodoro Timer', 'Short break ended. Get back to work and stay focused! 🚀');
    } else if (currentMode === 'longBreak') {
      longPauseSound.current.play();
      setCurrentMode('pomodoro');
      setTimeLeft(pomodoroDurations.pomodoro);
      showNotification('Pomodoro Timer', 'Long break ended.  Get back to work and stay focused! 🚀');
    }
    setIsTimerRunning(false);
  }, [currentMode]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleTimerEnd();
            document.title = "Pomodoro Timer";
            return 0;
          }
          document.title = `Time Left: ${formatTime(prevTime - 1)}`;
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      document.title = "Pomodoro Timer";
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning, handleTimerEnd]);

  const toggleTimer = () => {
    if (!isTimerRunning && currentMode === 'pomodoro') {
      pomodoroStartSound.current.play();
      showNotification('Pomodoro Timer', 'Keep focused for the next 25 minutes! 🚀');
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[currentMode]);
    document.title = "Pomodoro Timer";
  };

  const changeMode = (mode) => {
    setCurrentMode(mode);
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[mode]);
    document.title = "Pomodoro Timer";
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Draggable>
      <div className={styles.timerContainer}>
        <div className={styles.header}>
          <h2>Pomodoro Timer</h2>
          <button onClick={onMinimize} className="material-icons" aria-label="Minimize">remove</button>
        </div>
        <div className={styles.timerHeader}>
          <div className={`${styles.timerMode} ${currentMode === 'pomodoro' ? styles.active : ''}`} onClick={() => changeMode('pomodoro')} role="button" tabIndex={0} aria-pressed={currentMode === 'pomodoro'}>Pomodoro</div>
          <div className={`${styles.timerMode} ${currentMode === 'shortBreak' ? styles.active : ''}`} onClick={() => changeMode('shortBreak')} role="button" tabIndex={0} aria-pressed={currentMode === 'shortBreak'}>Short Break</div>
          <div className={`${styles.timerMode} ${currentMode === 'longBreak' ? styles.active : ''}`} onClick={() => changeMode('longBreak')} role="button" tabIndex={0} aria-pressed={currentMode === 'longBreak'}>Long Break</div>
        </div>
        <div className={styles.timerDisplay}>
          <h3>{formatTime(timeLeft)}</h3>
          <div className={styles.buttonContainer}>
            <button className={styles.startButton} onClick={toggleTimer}>
              {isTimerRunning ? 'Stop' : 'Start'}
            </button>
            <button className={styles.resetButton} onClick={resetTimer} aria-label="Reset Timer">
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
