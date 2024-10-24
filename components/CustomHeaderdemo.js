// CustomHeader.jsx
import { signOut } from "next-auth/react";
import styles from "../styles/CustomHeader.module.css";
import { useState, useCallback, useReducer, useEffect } from "react";
import { useRouter } from "next/router";
import MovableModal from "./MovableModal";

// Action types for useReducer
const TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN";

// Reducer to manage the state of the component
const headerReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_FULLSCREEN:
      return { ...state, isFullscreen: !state.isFullscreen };
    default:
      return state;
  }
};

export default function CustomHeader() {
  const [state, dispatch] = useReducer(headerReducer, {
    isFullscreen: false,
  });

  const toggleFullscreen = useCallback(() => {
    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    dispatch({ type: TOGGLE_FULLSCREEN });
  }, [state.isFullscreen]);

  return (
    <div className={styles.header}>
      <HeaderButton
        onClick={toggleFullscreen}
        icon={state.isFullscreen ? "fullscreen_exit" : "fullscreen"}
        tooltip={state.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      />
    </div>
  );
}

// Reusable Header Button component with tooltip
function HeaderButton({ onClick, icon, tooltip }) {
  return (
    <div className={styles.tooltip}>
      <button className={styles.iconButton} onClick={onClick}>
        <span className="material-icons">{icon}</span>
      </button>
      <span className={styles.tooltiptext}>{tooltip}</span>
    </div>
  );
}
