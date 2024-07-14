import styles from '../styles/SelectionBar.module.css';

export default function SelectionBar({ onIconClick }) {
  return (
    <div className={styles.selectionBar}>
      <button className={styles.iconButton} onClick={() => onIconClick('pomodoro')}>
        <span className="material-icons">alarm</span>
        <div className={styles.tooltip}>Pomodoro</div>
      </button>
      <button className={styles.iconButton} onClick={() => onIconClick('sounds')}>
        <span className="material-icons">graphic_eq</span>
        <div className={styles.tooltip}>Sounds</div>
      </button>
      <button className={styles.iconButton} onClick={() => onIconClick('note')}>
        <span className="material-icons">edit</span>
        <div className={styles.tooltip}>Note</div>
      </button>
      <button className={styles.iconButton} onClick={() => onIconClick('calendar')}>
        <span className="material-icons">event</span>
        <div className={styles.tooltip}>Calendar</div>
      </button>
      <button className={styles.iconButton} onClick={() => onIconClick('chat')}>
        <span className="material-icons">chat</span>
        <div className={styles.tooltip}>Chat</div>
      </button>
      <button className={styles.iconButton} onClick={() => onIconClick('settings')}>
        <span className="material-icons">settings</span>
        <div className={styles.tooltip}>Settings</div>
      </button>
    </div>
  );
}
