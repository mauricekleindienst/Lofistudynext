// CustomHeader.jsx
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/CustomHeader.module.css";
import { useState, useCallback, useReducer, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import MovableModal from "./MovableModal";
import FeedbackModal from "./FeedbackModal";
import BackgroundModal from "./BackgroundModal";
import { backgrounds } from "../data/backgrounds";

// Action types for useReducer
const TOGGLE_FULLSCREEN = "TOGGLE_FULLSCREEN";
const SHOW_TOAST = "SHOW_TOAST";
const HIDE_TOAST = "HIDE_TOAST";
const TOGGLE_DROPDOWN = "TOGGLE_DROPDOWN";

// Reducer to manage the state of the component
const headerReducer = (state, action) => {
  switch (action.type) {
    case TOGGLE_FULLSCREEN:
      return { ...state, isFullscreen: !state.isFullscreen };
    case SHOW_TOAST:
      return { ...state, toast: { show: true, message: action.message } };
    case HIDE_TOAST:
      return { ...state, toast: { show: false, message: "" } };
    case TOGGLE_DROPDOWN:
      return { ...state, dropdownVisible: !state.dropdownVisible };
    default:
      return state;
  }
};

export default function CustomHeader({ onBackgroundSelect, selectedBackground, userName }) {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [state, dispatch] = useReducer(headerReducer, {
    isFullscreen: false,
    toast: { show: false, message: "" },
    dropdownVisible: false,
  });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const dropdownRef = useRef(null);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setCurrentTime(timeStr);
    };

    updateTime(); // Initial call
    const timerId = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(timerId);
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (state.dropdownVisible) {
          dispatch({ type: TOGGLE_DROPDOWN });
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.dropdownVisible]);

  // Add periodic reminder
  useEffect(() => {
    const showReminder = () => {
      const messages = [
        "Enjoying Lo-fi.study? Share it with your friends! 🎵",
        "Study better together! Share Lo-fi.study with your study group 📚",
        "Help others discover Lo-fi.study - Share the productivity! ✨",
        "Spread the focus! Share Lo-fi.study with fellow students 🎯"
      ];
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      dispatch({ type: SHOW_TOAST, message: randomMessage });
      setTimeout(() => dispatch({ type: HIDE_TOAST }), 5000);
    };

    const reminderInterval = setInterval(showReminder, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(reminderInterval);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    dispatch({ type: TOGGLE_FULLSCREEN });
  }, [state.isFullscreen]);

  const shareVideoRoom = useCallback(async () => {
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.url) {
        const fullUrl = `${
          window.location.origin
        }/app?roomUrl=${encodeURIComponent(data.url)}`;
        await navigator.clipboard.writeText(fullUrl);
        dispatch({ type: SHOW_TOAST, message: "Room created! Link copied to clipboard." });
        setTimeout(() => dispatch({ type: HIDE_TOAST }), 3000);
        router.push({
          pathname: "/app",
          query: { roomUrl: data.url },
        });
      } else {
        dispatch({ type: SHOW_TOAST, message: "Error creating room. Please try again." });
      }
    } catch (error) {
      dispatch({ type: SHOW_TOAST, message: "Error creating room. Please try again." });
    }
  }, [router]);

  const shareWebsite = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      dispatch({ type: SHOW_TOAST, message: "Link copied to clipboard!" });
      setTimeout(() => dispatch({ type: HIDE_TOAST }), 3000);
    } catch (error) {
      dispatch({ type: SHOW_TOAST, message: "Failed to copy link" });
    }
  }, []);

  const openFeedbackModal = () => {
    setShowFeedbackModal(true);
  };

  const goToAdminFeedback = () => {
    router.push('/admin/feedback');
  };

  // List of admin emails
  const adminEmails = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <div className={styles.header}>
      <div className={styles.leftButtons}>
        <div className={styles.timeDisplay}>
          <span className={styles.currentTime}>{currentTime}</span>
          {userName && <span className={styles.greeting}>Welcome, {userName}</span>}
        </div>
        
        <HeaderButton 
          onClick={() => setShowBackgroundModal(true)}
          icon="wallpaper" 
          tooltip="Change Background" 
        />
        
        <HeaderButton 
          onClick={openFeedbackModal} 
          icon="rate_review" 
          tooltip="Send Feedback" 
        />
        {isAdmin && (
          <HeaderButton 
            onClick={goToAdminFeedback} 
            icon="admin_panel_settings" 
            tooltip="Admin Feedback" 
          />
        )}
      </div>
      
      <div className={styles.rightButtons}>
        <HeaderButton 
          onClick={() => setShowBackgroundModal(true)} 
          icon="wallpaper" 
          tooltip="Change Background" 
        />
        <HeaderButton onClick={shareVideoRoom} icon="videocam" tooltip="Share Room" />
        <HeaderButton onClick={shareWebsite} icon="share" tooltip="Share Lo-fi.study" />
        <HeaderButton
          onClick={toggleFullscreen}
          icon={state.isFullscreen ? "fullscreen_exit" : "fullscreen"}
          tooltip={state.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        />
        <HeaderButton
          onClick={() => setShowBackgroundModal(true)}
          icon="image"
          tooltip="Change Background"
        />
        
        {/* Profile Dropdown */}
        <div className={styles.profileDropdown}>
          <button 
            className={styles.profileButton} 
            onClick={() => dispatch({ type: TOGGLE_DROPDOWN })}
          >
            <div className={styles.avatar}>
              {user?.user_metadata?.full_name 
                ? user.user_metadata.full_name.charAt(0).toUpperCase() 
                : user?.email?.charAt(0).toUpperCase() || 'U'
              }
            </div>
          </button>
          
          {state.dropdownVisible && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <div className={styles.userInfo}>
                <div className={styles.userName}>
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
              <div className={styles.divider}></div>
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  router.push('/profile');
                  dispatch({ type: TOGGLE_DROPDOWN });
                }}
              >
                <span className="material-icons">person</span>
                Profile
              </button>
              <button 
                className={styles.dropdownItem}
                onClick={() => {
                  router.push('/auth/ChangePassword');
                  dispatch({ type: TOGGLE_DROPDOWN });
                }}
              >
                <span className="material-icons">lock</span>
                Change Password
              </button>
              <div className={styles.divider}></div>
              <button 
                className={`${styles.dropdownItem} ${styles.signOutItem}`}
                onClick={async (e) => {
                  e.preventDefault();
                  console.log('Sign out button clicked!')
                  try {
                    dispatch({ type: TOGGLE_DROPDOWN });
                    console.log('About to call signOut...')
                    await signOut();
                    console.log('signOut completed')
                  } catch (error) {
                    console.error('Error in sign out click handler:', error);
                    dispatch({ type: SHOW_TOAST, message: "Error signing out. Please try again." });
                    setTimeout(() => dispatch({ type: HIDE_TOAST }), 3000);
                  }
                }}
              >
                <span className="material-icons">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.timeDisplayContainer}>
        <div className={styles.timeDisplay}>
          <span className={styles.time}>{currentTime}</span>
          {userName && <span className={styles.greeting}>Welcome, {userName}</span>}
        </div>
      </div>

      {state.toast.show && <Toast message={state.toast.message} />}
      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
      <BackgroundModal 
        backgrounds={backgrounds}
        onSelect={onBackgroundSelect}
        selectedBackground={selectedBackground}
        onClose={() => setShowBackgroundModal(false)}
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

// Toast component
function Toast({ message }) {
  return (
    <div className={styles.toast}>
      <span className={styles.toastMessage}>{message}</span>
    </div>
  );
}
