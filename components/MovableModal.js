import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import styles from '../styles/MovableModal.module.css';
import 'react-resizable/css/styles.css'; // Import resizable styles
import CustomCursor from '../components/CustomCursor';

export default function MovableModal({ children, onClose }) {
  return (
    <div className={styles.overlay}>
      <Draggable handle=".handle">
        <ResizableBox
          width={600}
          height={400}
          minConstraints={[300, 200]}
          maxConstraints={[window.innerWidth - 50, window.innerHeight - 50]}
          resizeHandles={['se']}
        >
          <div className={styles.modal}>
            <div className={`handle ${styles.header}`}>
              <button onClick={onClose} className={styles.closeButton}>
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className={styles.content}>{children}</div>
          </div>
        </ResizableBox>
      </Draggable>
    </div>
  );
}
