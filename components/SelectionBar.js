import { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';
import Sounds from './Sounds';
import Notes from './Notes';
import Calendar from './Calendar';
import LiveChat from './LiveChat';
import Scoreboard from './Scoreboard';
import Settings from './Settings';
import styles from '../styles/SelectionBar.module.css';

export default function SelectionBar() {
  const [visibleComponents, setVisibleComponents] = useState({
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
    setVisibleComponents({
      ...visibleComponents,
      [component]: !visibleComponents[component]
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
      <div className={`${visibleComponents.pomodoro ? '' : styles.hidden}`}>
        <PomodoroTimer onMinimize={() => handleIconClick('pomodoro')} />
      </div>
      <div className={`${visibleComponents.sounds ? '' : styles.hidden}`}>
        <Sounds onMinimize={() => handleIconClick('sounds')} />
      </div>
      <div className={`${visibleComponents.note ? '' : styles.hidden}`}>
        <Notes onMinimize={() => handleIconClick('note')} />
      </div>
      <div className={`${visibleComponents.calendar ? '' : styles.hidden}`}>
        <Calendar onMinimize={() => handleIconClick('calendar')} />
      </div>
      <div className={`${visibleComponents.chat ? '' : styles.hidden}`}>
        <LiveChat onMinimize={() => handleIconClick('chat')} />
      </div>
      <div className={`${visibleComponents.scoreboard ? '' : styles.hidden}`}>
        <Scoreboard onMinimize={() => handleIconClick('scoreboard')} />
      </div>
      <div className={`${visibleComponents.settings ? '' : styles.hidden}`}>
        <Settings onMinimize={() => handleIconClick('settings')} />
      </div>
      
     
    </div>
  );
}
