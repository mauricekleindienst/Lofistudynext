import { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Settings.module.css';
import { FaCog, FaBell, FaMoon, FaSun, FaLanguage } from 'react-icons/fa';

const settings = [
  { name: 'General', icon: <FaCog /> },
  { name: 'Notifications', icon: <FaBell /> },
  { name: 'Dark Mode', icon: <FaMoon /> },
  { name: 'Light Mode', icon: <FaSun /> },
  { name: 'Language', icon: <FaLanguage /> },
];

export default function Settings({ onClose }) {
  return (
    <Draggable handle=".draggable-header">
      <div className={styles.settingsContainer}>
        <div className={`${styles.header} draggable-header`}>
          <h2>Settings</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className={styles.settingsList}>
          {settings.map((setting, index) => (
            <div key={setting.name} className={styles.setting}>
              <span className={styles.icon}>{setting.icon}</span>
              <span className={styles.settingName}>{setting.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
