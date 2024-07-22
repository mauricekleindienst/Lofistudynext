// components/DraggableIframe.js
import { useRef, useState } from 'react';
import styles from '../styles/DraggableIframe.module.css';
import CustomCursor from '../components/CustomCursor';

export default function DraggableIframe({ src, onClose }) {
  const iframeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={styles.draggable}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
      </div>
      <iframe
        ref={iframeRef}
        src={src}
        allow="camera; microphone; fullscreen; speaker"
        className={styles.iframe}
      ></iframe>
    </div>
  );
}
