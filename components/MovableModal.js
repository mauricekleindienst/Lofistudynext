import { useRef, useEffect } from 'react';
import styles from '../styles/MovableModal.module.css';

export default function MovableModal({ children, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    const handleMouseDown = (e) => {
      const rect = modal.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const handleMouseMove = (e) => {
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMouseMove);
      }, { once: true });
    };

    modal.addEventListener('mousedown', handleMouseDown);
    return () => {
      modal.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.closeButton}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
