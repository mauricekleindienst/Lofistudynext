import styles from '../styles/CustomHeader_mobile.module.css';

const CustomHeader_mobile = ({ userName, currentTime, onToggleSidebar }) => {
  const getFirstName = (fullName) => fullName.split(' ')[0];

  return (
    <header className={styles.header}>
      <button className={styles.toggleButton} onClick={onToggleSidebar}>
        <span className="material-icons">menu</span>
      </button>
      <div className={styles.userInfo}>
        <h1>Welcome, {getFirstName(userName)}!</h1>
        <span>{currentTime}</span>
      </div>
    </header>
  );
};

export default CustomHeader_mobile;
