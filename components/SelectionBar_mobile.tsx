import styles from '../styles/SelectionBar_mobile.module.css';

const SelectionBar_mobile = ({ onIconClick }) => {
  return (
    <div className={styles.selectionBar}>
      <button onClick={() => onIconClick('pomodoro')} className={styles.iconButton}>
        <span className="material-icons">timer</span>
      </button>
      <button onClick={() => onIconClick('notes')} className={styles.iconButton}>
        <span className="material-icons">note</span>
      </button>
      <button onClick={() => onIconClick('scoreboard')} className={styles.iconButton}>
        <span className="material-icons">emoji_events</span>
      </button>
      <button onClick={() => onIconClick('settings')} className={styles.iconButton}>
        <span className="material-icons">settings</span>
      </button>
    </div>
  );
};

export default SelectionBar_mobile;
