import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/app.module.css";
import CustomHeader from "../components/CustomHeader";
import PomodoroTimer from "../components/PomodoroTimer";
import SelectionBar from "../components/SelectionBar";
import Notes from "../components/Notes";
import Calendar from "../components/Calendar";
import LiveChat from "../components/LiveChat";
import DraggableIframe from "../components/DraggableIframe";
import { ErrorBoundary } from "react-error-boundary";
import BackgroundPrompt from '../components/BackgroundPrompt';
import BackgroundModal from '../components/BackgroundModal';
import Sidebar from '../components/Sidebar';
import { backgrounds, DEFAULT_BACKGROUND } from '../data/backgrounds';

// Define the admin emails for access control
const ADMIN_EMAILS = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];

const messages = [
  "Pouring Coffee",
  "Grabbing Your Notes",
  "Setting Up Your Desk",
  "Fetching Resources",
  "Sharpening Your Pencils",
  "Organizing Your Thoughts",
  "Clearing Distractions",
  "Boosting Your Focus"
];
export default function Study() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { roomUrl } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState(DEFAULT_BACKGROUND);
  const [visibleComponents, setVisibleComponents] = useState({
    pomodoro: false,
    note: false,
    calendar: false,
    chat: false
  });
  const [videoRoomUrl, setVideoRoomUrl] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const videoRef = useRef(null);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const preloadCacheRef = useRef(new Map());

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
useEffect(() => {
    // Disable scrolling when the component mounts
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  useEffect(() => {
    // Only preload the initial background and maybe 1-2 others
    if (videoRef.current) {
      const initialBackground = backgrounds.find(bg => bg.priority) || backgrounds[0];
      videoRef.current.src = initialBackground.src;
      videoRef.current.load();
    }

    // Only preload priority backgrounds initially
    backgrounds
      .filter(bg => bg.priority)
      .forEach((background) => {
        const video = document.createElement("video");
        video.src = background.src;
        video.preload = "auto";
      });
  }, []);

  useEffect(() => {
    if (roomUrl) {
      setVideoRoomUrl(roomUrl);
    }
  }, [roomUrl]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loading || !user) {
      setShowLoading(true);
      return;
    }

    const minLoadTime = 2000; // Minimum time to show loading screen
    const loadingTimeout = setTimeout(() => {
      if (!isBackgroundLoading) {
        setShowLoading(false);
      }
    }, minLoadTime);

    // If background is still loading after min time, wait for it
    if (isBackgroundLoading) {
      const checkInterval = setInterval(() => {
        if (!isBackgroundLoading) {
          setShowLoading(false);
          clearInterval(checkInterval);
        }
      }, 500);

      // Failsafe: don't wait longer than 5 seconds total
      const failsafe = setTimeout(() => {
        clearInterval(checkInterval);
        setShowLoading(false);
      }, 5000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(failsafe);
      };
    }

    return () => clearTimeout(loadingTimeout);
  }, [loading, user, isBackgroundLoading]);

  useEffect(() => {
    const preloadCache = new Map();

    const preloadBackground = (src) => {
      if (preloadCache.has(src)) return;

      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = src;
      preloadCache.set(src, video);
    };

    // Preload priority backgrounds
    backgrounds
      .filter(bg => bg.priority)
      .forEach(bg => preloadBackground(bg.src));

    return () => {
      preloadCache.clear();
    };
  }, []);

  // Preload priority backgrounds on mount
  useEffect(() => {
    const preloadPriorityBackgrounds = async () => {
      const priorityBackgrounds = backgrounds.filter(bg => bg.priority);
      
      for (const bg of priorityBackgrounds) {
        if (!preloadCacheRef.current.has(bg.src)) {
          const video = document.createElement('video');
          video.preload = 'auto';
          video.src = bg.src;
          
          // Create a promise that resolves when the video is loaded
          const loadPromise = new Promise((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject();
          });
          
          preloadCacheRef.current.set(bg.src, { video, loadPromise });
          
          try {
            await loadPromise;
          } catch (error) {
            console.error(`Failed to preload background: ${bg.src}`, error);
          }
        }
      }
    };

    preloadPriorityBackgrounds();

    return () => {
      preloadCacheRef.current.clear();
    };
  }, []);

  // Handle background selection and loading
  useEffect(() => {
    if (!selectedBackground || !videoRef.current) return;

    const video = videoRef.current;
    let isMounted = true;
    setIsBackgroundLoading(true);

    const loadBackground = async () => {
      try {
        // Check if the background is preloaded
        const preloadedData = preloadCacheRef.current.get(selectedBackground.src);
        
        if (preloadedData) {
          // Use the preloaded video's src
          video.src = preloadedData.video.src;
        } else {
          // Load the video normally
          video.src = selectedBackground.src;
        }

        video.load();
        await video.play();
        
        if (isMounted) {
          setIsBackgroundLoading(false);
        }
      } catch (error) {
        console.error('Error loading background:', error);
        
        if (isMounted) {
          // Try fallback background
          video.src = DEFAULT_BACKGROUND.src;
          video.load();
          await video.play();
          setIsBackgroundLoading(false);
        }
      }
    };

    loadBackground();

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedBackground]);

  const handleBackgroundSelection = (background) => {
    setSelectedBackground(background);
    setIsBackgroundLoading(true);
    setShowBackgroundModal(false); // Close the modal if it's open
  };

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading || showLoading) {
    return (
      <div className={styles["loader-container"]}>
        <div className={styles.loader}>
          <div>
            <ul>
              {[...Array(6)].map((_, i) => (
                <li key={i}>
                  <svg viewBox="0 0 90 120" fill="currentColor">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775 4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <span>{messages[messageIndex]}</span> {/* Dynamic line below */}
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleIconClick = (component) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [component]: !prevState[component],
    }));
  };

  const getFirstName = (fullName) => {
    return fullName.split(" ")[0];
  };

  const toggleZenMode = () => {
    setZenMode(!zenMode);
    const createdByLabel = document.querySelector(`.${styles.createdByLabel}`);
    if (createdByLabel) {
      createdByLabel.style.opacity = zenMode ? "1" : "0"; // Hide in Zen Mode
      createdByLabel.style.pointerEvents = zenMode ? "auto" : "none"; // Disable interaction
    }
    const selectionBar = document.querySelector(`.${styles.selectionBar}`);
    if (selectionBar) {
      selectionBar.style.opacity = zenMode ? "1" : "0";
      selectionBar.style.pointerEvents = zenMode ? "auto" : "none";
    }
  };

  const renderComponent = (componentName) => {
    if (!visibleComponents[componentName]) return null;

    switch (componentName) {
      case "pomodoro":
        return <PomodoroTimer onMinimize={() => handleIconClick("pomodoro")} />;
      case "note":
        return <Notes onMinimize={() => handleIconClick("note")} />;
      case "calendar":
        return <Calendar onMinimize={() => handleIconClick("calendar")} />;
      case "chat":
        return <LiveChat
          onMinimize={() => handleIconClick("chat")}
          userName={getFirstName(user.user_metadata?.name || user.email)}
        />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <CustomHeader />
      <SelectionBar
        className={`${styles.selectionBar} ${zenMode ? styles.hidden : ''}`}
        userEmail={user.email}
        userName={getFirstName(user.user_metadata?.name || user.email)}
        onIconClick={handleIconClick}
      />
      
      {!selectedBackground && !showLoading && user && !zenMode && (
        <BackgroundPrompt />
      )}
      
      {renderComponent("pomodoro")}
      {renderComponent("note")}
      {renderComponent("calendar")}
      {renderComponent("chat")}
      <div className={`${styles.container} ${zenMode ? styles.zenMode : ''}`}>
        {selectedBackground && (
          <>
            <video
              ref={videoRef}
              className={`${styles.videoBackground} ${isBackgroundLoading ? styles.loading : ''}`}
              autoPlay
              loop
              muted
              playsInline
            />
            {isBackgroundLoading && (
              <div className={styles.videoLoadingIndicator}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading your study space...</p>
                <p className={styles.loadingHint}>If this takes too long, please choose a different background.</p>
              </div>
            )}
          </>
        )}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          selectedBackground={selectedBackground}
          onBackgroundSelect={handleBackgroundSelection}
          onShowBackgroundModal={() => setShowBackgroundModal(true)}
          zenMode={zenMode}
          onZenModeToggle={toggleZenMode}
          userName={getFirstName(user.user_metadata?.name || user.email)}
          currentTime={currentTime}
        />
        <main className={styles.main}>
          {videoRoomUrl && (
            <DraggableIframe
              src={videoRoomUrl}
              onClose={() => setVideoRoomUrl("")}
            />
          )}
        </main>
   
      </div>
      <div className={`${styles.createdByLabel} ${zenMode ? styles.hidden : ''}`}>
        Wallpaper by: {selectedBackground.createdby}
      </div>
      <button className={`${styles.zenModeButton} ${zenMode ? styles.active : ''}`} onClick={toggleZenMode} aria-label="Toggle Zen Mode">
        <span className={styles.moonIcon}></span>
      </button>

      {showBackgroundModal && (
        <BackgroundModal
          backgrounds={backgrounds}
          selectedBackground={selectedBackground}
          onSelect={(bg) => {
            handleBackgroundSelection(bg);
            setShowBackgroundModal(false);
          }}
          onClose={() => setShowBackgroundModal(false)}
        />
      )}
    </ErrorBoundary>
  );
}
