// components/SelectionBar.js
import styles from '../styles/SelectionBar.module.css';

export default function SelectionBar() {
  return (
    <div className={styles.selectionBar}>
      <button className={styles.iconButton}>
        <span className="material-icons">photo_library</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">alarm</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">edit</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">event</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">chat</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">play_circle_outline</span>
      </button>
      <button className={styles.iconButton}>
        <span className="material-icons">settings</span>
      </button>
    </div>
  );
}
