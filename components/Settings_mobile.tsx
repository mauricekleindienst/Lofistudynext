import styles from '../styles/Settings_mobile.module.css';

const SettingsMobile = ({ onMinimize }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dragHandle}></div>
      <div className={styles.header}>
        <h2>Settings</h2>
        <button onClick={onMinimize} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <div className={styles.content}>
        <p>Settings content goes here.</p>
      </div>
    </div>
  );
};

export default SettingsMobile;
