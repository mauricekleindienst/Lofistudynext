import styles from '../styles/PomodoroTimer_mobile.module.css';

const PomodoroTimerMobile = ({ onMinimize }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dragHandle}></div>
      <div className={styles.header}>
        <h2>Pomodoro Timer</h2>
        <button onClick={onMinimize} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className={styles.timer}>25:00</div>
    </div>
  );
};

export default PomodoroTimerMobile;
