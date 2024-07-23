import styles from "../styles/Notes_mobile.module.css";
import CustomCursor from "../components/CustomCursor";
const NotesMobile = ({ onMinimize }) => {
  return (
    <div className={styles.container}>
      <div className={styles.dragHandle}></div>
      <div className={styles.header}>
        <h2>Notes</h2>
        <button onClick={onMinimize} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
      </div>
      <textarea
        className={styles.textarea}
        placeholder="Type your notes here..."
      ></textarea>
    </div>
  );
};

export default NotesMobile;
