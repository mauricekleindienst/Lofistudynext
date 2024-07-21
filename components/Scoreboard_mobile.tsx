import styles from '../styles/Scoreboard_mobile.module.css';

const ScoreboardMobile = ({ onMinimize }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dragHandle}></div>
      <div className={styles.header}>
        <h2>Scoreboard</h2>
        <button onClick={onMinimize} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className={styles.scoreboard}>
        <div className={styles.user}>
          <span>User1</span>
          <span className={styles.firstPlace}>100</span>
        </div>
        <div className={styles.user}>
          <span>User2</span>
          <span>80</span>
        </div>
        <div className={styles.user}>
          <span>User3</span>
          <span>60</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardMobile;
