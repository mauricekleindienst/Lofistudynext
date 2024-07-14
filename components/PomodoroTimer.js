import { useState, useEffect, useRef } from 'react';
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
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const timerRef = useRef(null);
  const workAudioRef = useRef(null);
  const shortBreakAudioRef = useRef(null);
  const longBreakAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            handleTimerEnd();
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

  useEffect(() => {
    document.title = `${formatTime(timeLeft)} - ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`;
  }, [timeLeft, currentMode]);

  const handleTimerEnd = () => {
    if (currentMode === 'pomodoro') {
      setPomodoroCount(prevCount => prevCount + 1);
      showNotification('Pomodoro finished! Time for a break.');
    } else {
      showNotification('Break time over! Back to work.');
    }

    if (currentMode === 'pomodoro' && pomodoroCount === 3) {
      setCurrentMode('longBreak');
      setTimeLeft(pomodoroDurations.longBreak);
      if (longBreakAudioRef.current) {
        longBreakAudioRef.current.play();
      }
    } else {
      switch (currentMode) {
        case 'pomodoro':
          setCurrentMode('shortBreak');
          setTimeLeft(pomodoroDurations.shortBreak);
          if (shortBreakAudioRef.current) {
            shortBreakAudioRef.current.play();
          }
          break;
        case 'shortBreak':
          setCurrentMode('pomodoro');
          setTimeLeft(pomodoroDurations.pomodoro);
          if (workAudioRef.current) {
            workAudioRef.current.play();
          }
          break;
        case 'longBreak':
          setCurrentMode('pomodoro');
          setTimeLeft(pomodoroDurations.pomodoro);
          if (workAudioRef.current) {
            workAudioRef.current.play();
          }
          setPomodoroCount(0);
          break;
        default:
          break;
      }
    }
  };

  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(message);
        }
      });
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
    if (clickAudioRef.current) {
      clickAudioRef.current.play();
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[currentMode]);
    if (clickAudioRef.current) {
      clickAudioRef.current.play();
    }
  };

  const changeMode = (mode) => {
    setCurrentMode(mode);
    setIsTimerRunning(false);
    setTimeLeft(pomodoroDurations[mode]);
    if (clickAudioRef.current) {
      clickAudioRef.current.play();
    }
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
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.timerHeader}>
          <div
            className={`${styles.timerMode} ${currentMode === 'pomodoro' ? styles.active : ''}`}
            onClick={() => changeMode('pomodoro')}
          >
            Pomodoro
          </div>
          <div
            className={`${styles.timerMode} ${currentMode === 'shortBreak' ? styles.active : ''}`}
            onClick={() => changeMode('shortBreak')}
          >
            Short Break
          </div>
          <div
            className={`${styles.timerMode} ${currentMode === 'longBreak' ? styles.active : ''}`}
            onClick={() => changeMode('longBreak')}
          >
            Long Break
          </div>
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
        <audio ref={workAudioRef} src="/sounds/alert-work.mp3" preload="auto"></audio>
        <audio ref={shortBreakAudioRef} src="/sounds/alert-short-break.mp3" preload="auto"></audio>
        <audio ref={longBreakAudioRef} src="/sounds/alert-long-break.mp3" preload="auto"></audio>
        <audio ref={clickAudioRef} src="/sounds/static_audio_tick.mp3" preload="auto"></audio>
      </div>
    </Draggable>
  );
}
