import { useState } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Settings.module.css";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings({ onMinimize }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Draggable handle=".draggable-header">
      <div className={styles.settingsContainer}>
        <div className={`${styles.header} draggable-header`}>
          <h2>Settings</h2>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>

        <div className={styles.settingsList}>
          {/* Theme Setting */}
          <div className={styles.setting}>
            <span className={styles.icon}>
              {theme === 'dark' ? <FaMoon /> : <FaSun />}
            </span>
            <span className={styles.settingName}>Theme</span>
            <div className={styles.settingControl}>
              <button 
                className={`${styles.themeToggle} ${theme === 'dark' ? styles.active : ''}`}
                onClick={toggleTheme}
              >
                {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
            {theme === 'light' && (
              <div className={styles.betaNotice}>
                ⚠️ Light Mode is currently in early development and some elements may not display correctly
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
