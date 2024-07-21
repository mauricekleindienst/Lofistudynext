import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useTimer } from 'react-timer-hook';
import Draggable from 'react-draggable';
import styles from '../styles/PomodoroTimer.module.css';

const getExpiryTimestamp = (duration) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + duration);
  return time;
};

export default function PomodoroTimer({ onMinimize }) {
  const { data: session } = useSession();
  const [currentMode, setCurrentMode] = useState('pomodoro');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [category, setCategory] = useState('Other');
  const [pomodoroDurations, setPomodoroDurations] = useState({
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });

  const categories = ['Studying', 'Coding', 'Writing', 'Working', 'Other'];

  const pomodoroStartSound = useRef(new Audio('/sounds/alert-work.mp3'));
  const pomodoroEndSound = useRef(new Audio('/sounds/alert-short-break.mp3'));
  const longPauseSound = useRef(new Audio('/sounds/alert-long-break.mp3'));

  const requestNotificationPermission = useCallback(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title, message) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const handleTimerEnd = useCallback(async () => {
    if (currentMode === 'pomodoro') {
      pomodoroEndSound.current.play();
      const newPomodoroCount = pomodoroCount + 1;
      setPomodoroCount(newPomodoroCount);

      if (session?.user?.email) {
        try {
          await fetch('/api/updatePomodoroCount', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: session.user.email,
              firstname: session.user.name.split(' ')[0],
              increment: 1,
              category: category || 'Other',
            }),
          });
        } catch (error) {
          console.error('Failed to update Pomodoro count:', error);
        }
      }

      if (newPomodoroCount % 4 === 0) {
        showNotification('Pomodoro Timer', 'Pomodoro session ended. Time for a long break! ☕️');
        setCurrentMode('longBreak');
        restart(getExpiryTimestamp(pomodoroDurations.longBreak), false);
      } else {
        showNotification('Pomodoro Timer', 'Pomodoro session ended. Take a short break! ☕️');
        setCurrentMode('shortBreak');
        restart(getExpiryTimestamp(pomodoroDurations.shortBreak), false);
      }
    } else {
      showNotification('Pomodoro Timer', 'Break ended. Get back to work! 🚀');
      setCurrentMode('pomodoro');
      restart(getExpiryTimestamp(pomodoroDurations.pomodoro), false);
    }
    setIsTimerRunning(false);
  }, [currentMode, pomodoroCount, session, showNotification, category, restart, pomodoroDurations]);

  const { seconds, minutes, isRunning, start, pause, restart } = useTimer({
    expiryTimestamp: getExpiryTimestamp(pomodoroDurations[currentMode]),
    autoStart: false,
    onExpire: handleTimerEnd,
  });

  useEffect(() => {
    const newExpiryTimestamp = getExpiryTimestamp(pomodoroDurations[currentMode]);
    restart(newExpiryTimestamp, false);
    setIsTimerRunning(false);
  }, [currentMode, pomodoroDurations, restart]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pause();
      setIsTimerRunning(false);
    } else {
      start();
      setIsTimerRunning(true);
      if (currentMode === 'pomodoro') {
        pomodoroStartSound.current.play();
        showNotification('Pomodoro Timer', 'Stay focused for the next 25 minutes! 🚀');
      }
    }
  }, [isRunning, pause, start, currentMode, showNotification]);

  const resetTimer = useCallback(() => {
    restart(getExpiryTimestamp(pomodoroDurations[currentMode]), false);
    setIsTimerRunning(false);
  }, [restart, pomodoroDurations, currentMode]);

  const changeMode = useCallback((mode) => {
    setCurrentMode(mode);
    if (mode === 'pomodoro') {
      setPomodoroCount(0);
    }
  }, []);

  const formatTime = (minutes, seconds) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSettingsChange = useCallback((e) => {
    const { name, value } = e.target;
    setPomodoroDurations((prev) => ({
      ...prev,
      [name]: parseInt(value) * 60,
    }));
  }, []);

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.timerContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Pomodoro Timer</h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>Set work/break timers.</span>
          </div>
          <button onClick={onMinimize} className="material-icons" aria-label="Minimize">
            remove
          </button>
        </div>
        <div className={styles.timerHeader}>
          <div
            className={`${styles.timerMode} ${currentMode === 'pomodoro' ? styles.active : ''}`}
            onClick={() => changeMode('pomodoro')}
            role="button"
            tabIndex={0}
            aria-pressed={currentMode === 'pomodoro'}
          >
            Pomodoro
          </div>
          <div
            className={`${styles.timerMode} ${currentMode === 'shortBreak' ? styles.active : ''}`}
            onClick={() => changeMode('shortBreak')}
            role="button"
            tabIndex={0}
            aria-pressed={currentMode === 'shortBreak'}
          >
            Short Break
          </div>
          <div
            className={`${styles.timerMode} ${currentMode === 'longBreak' ? styles.active : ''}`}
            onClick={() => changeMode('longBreak')}
            role="button"
            tabIndex={0}
            aria-pressed={currentMode === 'longBreak'}
          >
            Long Break
          </div>
        </div>
        <div className={styles.pomodoroinfo}>Category</div>
        <div className={styles.categorySelection}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.timerDisplay}>
          <h3>{formatTime(minutes, seconds)}</h3>
          <div className={styles.buttonContainer}>
            <button className={styles.startButton} onClick={toggleTimer}>
              {isRunning ? 'Stop' : 'Start'}
            </button>
            <button className={styles.resetButton} onClick={resetTimer} aria-label="Reset Timer">
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
        <div className={styles.pomodoroCount}>Pomodoros: {pomodoroCount}</div>
        <div className={styles.settingsWheel} onClick={() => setShowSettings(true)}>
          <span className="material-icons">settings</span>
        </div>
        {showSettings && (
          <div className={styles.settingsModal}>
            <h3>Settings</h3>
            <div className={styles.settingsInput}>
              <label htmlFor="pomodoro">Pomodoro (minutes):</label>
              <input
                type="number"
                id="pomodoro"
                name="pomodoro"
                value={pomodoroDurations.pomodoro / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <div className={styles.settingsInput}>
              <label htmlFor="shortBreak">Short Break (minutes):</label>
              <input
                type="number"
                id="shortBreak"
                name="shortBreak"
                value={pomodoroDurations.shortBreak / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <div className={styles.settingsInput}>
              <label htmlFor="longBreak">Long Break (minutes):</label>
              <input
                type="number"
                id="longBreak"
                name="longBreak"
                value={pomodoroDurations.longBreak / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <button
              onClick={() => {
                setShowSettings(false);
                resetTimer();
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
}
