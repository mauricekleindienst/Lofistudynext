import { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';
import Sounds from './Sounds';
import Notes from './Notes';
import Calendar from './Calendar';
import LiveChat from './LiveChat';
import Scoreboard from './Scoreboard';
import Settings from './Settings';
import Todo from './Todo';
import Stats from './Stats';  // Import the new Stats component
import styles from '../styles/SelectionBar.module.css';

export default function SelectionBar({ userEmail, userName }) {
  const [visibleComponents, setVisibleComponents] = useState({
    pomodoro: false,
    sounds: false,
    note: false,
    calendar: false,
    chat: false,
    settings: false,
    music: false,
    scoreboard: false,
    todo: false,
    stats: false  // Add stats to the state
  });

  const [newChatMessage, setNewChatMessage] = useState(false);

  const handleIconClick = (component) => {
    console.log(`Toggling component: ${component}`);
    setVisibleComponents({
      ...visibleComponents,
      [component]: !visibleComponents[component]
    });
    if (component === 'chat') {
      setNewChatMessage(false);
    }
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
          {newChatMessage && <span className={styles.notificationDot}></span>}
          <div className={styles.tooltip}>Chat</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('scoreboard')}>
          <span className="material-icons">stairs</span>
          <div className={styles.tooltip}>Scoreboard</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('todo')}>
          <span className="material-icons">checklist</span>
          <div className={styles.tooltip}>Todo</div>
        </button>
        <button className={styles.iconButton} onClick={() => handleIconClick('stats')}>
          <span className="material-icons">bar_chart</span>
          <div className={styles.tooltip}>Stats</div>
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
        <Notes onMinimize={() => handleIconClick('note')} userEmail={userEmail} />
      </div>
      <div className={`${visibleComponents.calendar ? '' : styles.hidden}`}>
        <Calendar onMinimize={() => handleIconClick('calendar')} />
      </div>
      <div className={`${visibleComponents.chat ? '' : styles.hidden}`}>
        <LiveChat onMinimize={() => handleIconClick('chat')} userName={userName} onNewMessage={() => setNewChatMessage(true)} />
      </div>
      <div className={`${visibleComponents.scoreboard ? '' : styles.hidden}`}>
        <Scoreboard onMinimize={() => handleIconClick('scoreboard')} />
      </div>
      <div className={`${visibleComponents.settings ? '' : styles.hidden}`}>
        <Settings onMinimize={() => handleIconClick('settings')} />
      </div>
      <div className={`${visibleComponents.todo ? '' : styles.hidden}`}>
        <Todo onMinimize={() => handleIconClick('todo')} userEmail={userEmail} />
      </div>
      <div className={`${visibleComponents.stats ? '' : styles.hidden}`}>
        <Stats onMinimize={() => handleIconClick('stats')} userEmail={userEmail} />
      </div>
    </div>
  );
}