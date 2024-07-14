// components/SelectionBar.js
import { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';
import Sounds from './Sounds';
import Notes from './Notes';
import Calendar from './Calendar';
import LiveChat from './LiveChat';
import MusicPlayer from './MusicPlayer';
import Scoreboard from './Scoreboard';
import styles from '../styles/SelectionBar.module.css';

export default function SelectionBar() {
  const [activeComponents, setActiveComponents] = useState({
    pomodoro: false,
    sounds: false,
    note: false,
    calendar: false,
    chat: false,
    settings: false,
    music: false,
    scoreboard: false
  });

  const handleIconClick = (component) => {
    setActiveComponents({
      ...activeComponents,
      [component]: !activeComponents[component]
    });
  };

  return (
    <div>
      <div className={styles.selectionBar}>
        <button className={styles.iconButton} onClick={() => handleIconClick('pomodoro')}>
          <span className="material-icons">alarm</span>
          <div className={styles.tooltip}>Pomodoro</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('sounds')}>
          <span className="material-icons">graphic_eq</span>
          <div className={styles.tooltip}>Sounds</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('note')}>
          <span className="material-icons">edit</span>
          <div className={styles.tooltip}>Note</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('calendar')}>
          <span className="material-icons">event</span>
          <div className={styles.tooltip}>Calendar</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('chat')}>
          <span className="material-icons">chat</span>
          <div className={styles.tooltip}>Chat</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('scoreboard')}>
          <span className="material-icons">stairs</span>
          <div className={styles.tooltip}>Scoreboard</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('settings')}>
          <span className="material-icons">settings</span>
          <div className={styles.tooltip}>Settings</div>
        </button>
      </div>
      {activeComponents.pomodoro && <PomodoroTimer onMinimize={() => handleIconClick('pomodoro')} />}
      {activeComponents.sounds && <Sounds onMinimize={() => handleIconClick('sounds')} />}
      {activeComponents.note && <Notes onMinimize={() => handleIconClick('note')} />}
      {activeComponents.calendar && <Calendar onMinimize={() => handleIconClick('calendar')} />}
      {activeComponents.chat && <LiveChat onMinimize={() => handleIconClick('chat')} />}
      {activeComponents.settings && <Settings onMinimize={() => handleIconClick('settings')} />}
      {activeComponents.music && <MusicPlayer onMinimize={() => handleIconClick('music')} />}
      {activeComponents.scoreboard && <Scoreboard onMinimize={() => handleIconClick('scoreboard')} />}
    </div>
  );
}
