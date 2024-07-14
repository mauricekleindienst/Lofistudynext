import React from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Calendar.module.css';

export default function Calendar({ onMinimize }) {
  return (
    <Draggable>
      <div className={styles.calendarContainer}>
        <div className={styles.header}>
          <h2>Calendar</h2>
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.calendarContent}>
          {/* Calendar content goes here */}
        </div>
      </div>
    </Draggable>
  );
}
