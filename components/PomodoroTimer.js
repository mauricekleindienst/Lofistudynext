import React, { useState, useEffect, useRef, useCallback, useReducer, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import CustomCursor from '../components/CustomCursor';
import Draggable from 'react-draggable';
import styles from '../styles/PomodoroTimer.module.css';

const categories = ['Studying', 'Coding', 'Writing', 'Working', 'Other'];

const initialState = {
  currentMode: 'pomodoro',
  isTimerRunning: false,
  pomodoroCount: 0,
  showSettings: false,
  category: 'Other',
  pomodoroDurations: {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  },
  timeLeft: 25 * 60,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, currentMode: action.payload, timeLeft: state.pomodoroDurations[action.payload] };
    case 'TOGGLE_TIMER':
      return { ...state, isTimerRunning: !state.isTimerRunning };
    case 'RESET_TIMER':
      return { ...state, timeLeft: state.pomodoroDurations[state.currentMode], isTimerRunning: false };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'INCREMENT_POMODORO':
      return { ...state, pomodoroCount: state.pomodoroCount + 1 };
    case 'TOGGLE_SETTINGS':
      return { ...state, showSettings: !state.showSettings };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'UPDATE_DURATIONS':
      return { ...state, pomodoroDurations: { ...state.pomodoroDurations, ...action.payload } };
    default:
      return state;
  }
}

export default function PomodoroTimer({ onMinimize }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data: session } = useSession();
  const timerRef = useRef(null);

  const soundRefs = {
    pomodoroStart: useRef(null),
    pomodoroEnd: useRef(null),
    longPause: useRef(null),
  };

  const playSound = useCallback((soundRef) => {
    if (soundRef.current) {
      soundRef.current.play().catch(error => console.error('Error playing sound:', error));
    }
  }, []);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = useCallback((title, message) => {
    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    if (typeof window !== 'undefined') {
      soundRefs.pomodoroStart.current = new Audio('/sounds/alert-work.mp3');
      soundRefs.pomodoroEnd.current = new Audio('/sounds/alert-short-break.mp3');
      soundRefs.longPause.current = new Audio('/sounds/alert-long-break.mp3');
    }
  }, [requestNotificationPermission]);

  useEffect(() => {
    if (state.isTimerRunning) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [state.isTimerRunning]);

  useEffect(() => {
    if (state.timeLeft === 0) {
      handleTimerEnd();
    }
  }, [state.timeLeft]);

  useEffect(() => {
    if (state.isTimerRunning) {
      document.title = `${formatTime} - ${state.currentMode === 'pomodoro' ? 'Focus Time' : 'Break Time'}`;
    } else {
      document.title = 'Pomodoro Timer';
    }
  }, [state.timeLeft, state.currentMode, state.isTimerRunning]);

  const handleTimerEnd = useCallback(() => {
    console.log('Timer ended');
    dispatch({ type: 'TOGGLE_TIMER' });

    if (state.currentMode === 'pomodoro') {
      playSound(soundRefs.pomodoroEnd);

      const newPomodoroCount = state.pomodoroCount + 1;
      console.log('New Pomodoro Count:', newPomodoroCount);
      dispatch({ type: 'INCREMENT_POMODORO' });

      if (session?.user?.email) {
        fetch('/api/updatePomodoroCount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: session.user.email,
            firstname: session.user.name.split(' ')[0],
            increment: 1,
            category: state.category,
          }),
        }).catch(error => console.error('Failed to update Pomodoro count:', error));
      }

      if (newPomodoroCount % 4 === 0) {
        showNotification('Pomodoro Timer', 'Pomodoro session ended. Time for a long break! ☕️');
        dispatch({ type: 'SET_MODE', payload: 'longBreak' });
      } else {
        showNotification('Pomodoro Timer', 'Pomodoro session ended. Take a short break! ☕️');
        dispatch({ type: 'SET_MODE', payload: 'shortBreak' });
      }
    } else {
      showNotification('Pomodoro Timer', 'Break ended. Get back to work! 🚀');
      dispatch({ type: 'SET_MODE', payload: 'pomodoro' });
    }

    // Automatically start the timer for the new mode
    dispatch({ type: 'TOGGLE_TIMER' });
  }, [state.currentMode, state.pomodoroCount, state.category, session, showNotification, playSound, soundRefs]);

  const toggleTimer = useCallback(() => {
    dispatch({ type: 'TOGGLE_TIMER' });
    if (!state.isTimerRunning && state.currentMode === 'pomodoro') {
      playSound(soundRefs.pomodoroStart);
      showNotification('Pomodoro Timer', 'Stay focused for the next 25 minutes! 🚀');
    }
  }, [state.isTimerRunning, state.currentMode, playSound, soundRefs, showNotification]);

  const resetTimer = useCallback(() => {
    dispatch({ type: 'RESET_TIMER' });
  }, []);

  const changeMode = useCallback((mode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
    if (mode === 'pomodoro') {
      dispatch({ type: 'INCREMENT_POMODORO', payload: 0 });
    }
  }, []);

  const formatTime = useMemo(() => {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [state.timeLeft]);

  const handleSettingsChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_DURATIONS', payload: { [name]: parseInt(value) * 60 } });
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
            className={`${styles.timerMode} ${state.currentMode === 'pomodoro' ? styles.active : ''}`}
            onClick={() => changeMode('pomodoro')}
            role="button"
            tabIndex={0}
            aria-pressed={state.currentMode === 'pomodoro'}
          >
            Pomodoro
          </div>
          <div
            className={`${styles.timerMode} ${state.currentMode === 'shortBreak' ? styles.active : ''}`}
            onClick={() => changeMode('shortBreak')}
            role="button"
            tabIndex={0}
            aria-pressed={state.currentMode === 'shortBreak'}
          >
            Short Break
          </div>
          <div
            className={`${styles.timerMode} ${state.currentMode === 'longBreak' ? styles.active : ''}`}
            onClick={() => changeMode('longBreak')}
            role="button"
            tabIndex={0}
            aria-pressed={state.currentMode === 'longBreak'}
          >
            Long Break
          </div>
        </div>
        <div className={styles.pomodoroinfo}>Category</div>
        <div className={styles.categorySelection}>
          <select
            value={state.category}
            onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
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
          <h3>{formatTime}</h3>
          <div className={styles.buttonContainer}>
            <button className={styles.startButton} onClick={toggleTimer}>
              {state.isTimerRunning ?  <span className="material-icons">pause</span> :  <span className="material-icons">play_arrow</span>}
            </button>
            <button className={styles.resetButton} onClick={resetTimer} aria-label="Reset Timer">
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
        <div className={styles.pomodoroCount}>Pomodoros: {state.pomodoroCount}</div>
        <div className={styles.settingsWheel} onClick={() => dispatch({ type: 'TOGGLE_SETTINGS' })}>
          <span className="material-icons">settings</span>
        </div>
        {state.showSettings && (
          <div className={styles.settingsModal}>
            <h3>Settings</h3>
            <div className={styles.settingsInput}>
              <label htmlFor="pomodoro">Pomodoro (minutes):</label>
              <input
                type="number"
                id="pomodoro"
                name="pomodoro"
                value={state.pomodoroDurations.pomodoro / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <div className={styles.settingsInput}>
              <label htmlFor="shortBreak">Short Break (minutes):</label>
              <input
                type="number"
                id="shortBreak"
                name="shortBreak"
                value={state.pomodoroDurations.shortBreak / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <div className={styles.settingsInput}>
              <label htmlFor="longBreak">Long Break (minutes):</label>
              <input
                type="number"
                id="longBreak"
                name="longBreak"
                value={state.pomodoroDurations.longBreak / 60}
                onChange={handleSettingsChange}
              />
            </div>
            <button
              onClick={() => {
                dispatch({ type: 'TOGGLE_SETTINGS' });
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
