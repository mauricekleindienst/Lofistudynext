import Draggable from 'react-draggable';
import styles from '../styles/MovableModal.module.css';

export default function MovableModal({ children, onClose }) {
  return (
    <div className={styles.overlay}>
      <Draggable handle=".handle">
        <div className={styles.modal}>
          <div className={`handle ${styles.header}`}>
            <button onClick={onClose} className={styles.closeButton}>
              <span className="material-icons">close</span>
            </button>
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </Draggable>
    </div>
  );
}
