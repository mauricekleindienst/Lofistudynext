import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/app.module.css";
import MusicPlayer from "../components/MusicPlayer";
import CustomHeader from "../components/CustomHeader";
import PomodoroTimer from "../components/PomodoroTimer";
import SelectionBar from "../components/SelectionBar";
import Notes from "../components/Notes";
import Calendar from "../components/Calendar";
import LiveChat from "../components/LiveChat";
import DraggableIframe from "../components/DraggableIframe";
import CookieBanner from "../components/CookieBanner";
import { ErrorBoundary } from "react-error-boundary";

// Define the default background
const DEFAULT_BACKGROUND = {
  id: 11,
  src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/winter.mp4",
  alt: "Winter",
  note: "Winter",
  createdby: "Lo-Fi.study",
  priority: true
};

const backgrounds = [
  { id: 1, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch", note: "Couch", createdby: "Lo-Fi.study", mood: "Cozy", timeOfDay: "Any", recommended: "Reading, Light Study", priority: true },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", note: "Rain", createdby: "Lo-Fi.study", mood: "Calm", timeOfDay: "Any", recommended: "Deep Focus, Writing", priority: true },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train", note: "Train", createdby: "Lo-Fi.study", mood: "Contemplative", timeOfDay: "Day", recommended: "Reading, Problem Solving", priority: false },
  { id: 4, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom", createdby: "Lo-Fi.study", mood: "Focused", timeOfDay: "Day", recommended: "Academic Study, Note-taking", priority: false },
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn", createdby: "Lo-Fi.study", mood: "Peaceful", timeOfDay: "Day", recommended: "Creative Work, Reading", priority: false },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night", note: "Night", createdby: "Lo-Fi.study", mood: "Serene", timeOfDay: "Night", recommended: "Late Night Study, Programming", priority: false },
  { id: 7, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim", createdby: "Skyrim", mood: "Adventurous", timeOfDay: "Any", recommended: "Creative Writing, Gaming Breaks", priority: false },
  { id: 8, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4", alt: "Train2", note: "Train2", createdby: "Lo-Fi.study", mood: "Relaxed", timeOfDay: "Day", recommended: "Light Reading, Planning", priority: false },
  { id: 9, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom", createdby: "Lo-Fi.study", mood: "Chill", timeOfDay: "Any", recommended: "Casual Study, Brainstorming", priority: false },
  { id: 10, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/cables.mp4", alt: "Cables", note: "Cables", createdby: "Lo-Fi.study", mood: "Tech", timeOfDay: "Any", recommended: "Programming, Technical Study", priority: false },
  { id: 11, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/winter.mp4", alt: "Winter", note: "Winter", createdby: "Lo-Fi.study", mood: "Cozy", timeOfDay: "Day", recommended: "Focused Study, Research", priority: false },
  { id: 12, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/study_girl.mp4", alt: "StudyGirl", note: "StudyGirl", createdby: "Lo-Fi.study", mood: "Focused", timeOfDay: "Day", recommended: "Long Study Sessions, Note-taking", priority: false },
  { id: 13, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/coffee.mp4", alt: "Coffee", note: "Coffee", createdby: "Lo-Fi.study", mood: "Energetic", timeOfDay: "Morning", recommended: "Morning Study, Quick Reviews", priority: false },
  { id: 14, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Minecraft.mp4", alt: "Minecraft", note: "Minecraft", createdby: "Mojang", mood: "Playful", timeOfDay: "Any", recommended: "Casual Learning, Creative Tasks", priority: false },
  { id: 15, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Darkroom.mp4", alt: "Darkroom", note: "Darkroom", createdby: "Lo-Fi.study", mood: "Dark", timeOfDay: "Night", recommended: "Late Night Focus, Programming", priority: false },
  { id: 16, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Snowtrain.mp4", alt: "Snowtrain", note: "Snowtrain", createdby: "Lo-Fi.study", mood: "Peaceful", timeOfDay: "Day", recommended: "Reading, Meditation", priority: false },
  { id: 17, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Garden.mp4", alt: "Garden", note: "Garden", createdby: "Lo-Fi.study", mood: "Fresh", timeOfDay: "Day", recommended: "Creative Work, Light Study", priority: false },
  { id: 18, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/japannight.mp4", alt: "japannight", note: "japannight", createdby: "Lo-Fi.study", mood: "Atmospheric", timeOfDay: "Night", recommended: "Night Study, Programming", priority: false },
];
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
  const { data: session, status } = useSession();
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
  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
useEffect(() => {
    // Disable scrolling and set background color when the component mounts
    document.body.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#1a1a1a';

    // Re-enable scrolling and reset background color when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.backgroundColor = '';
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
    if (status === "loading" || status === "unauthenticated") {
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
  }, [status, isBackgroundLoading]);

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

  useEffect(() => {
    if (!selectedBackground || !videoRef.current) return;

    setIsBackgroundLoading(true);
    const video = videoRef.current;
    
    // Keep track of mounting state
    let isMounted = true;

    const handleVideoLoaded = () => {
      if (!isMounted) return;
      setIsBackgroundLoading(false);
      
      // Ensure video is playing and loops properly
      const ensurePlayback = async () => {
        try {
          await video.play();
          // Check periodically if video is still playing
          const playbackCheck = setInterval(() => {
            if (video.paused && !video.ended) {
              video.play().catch(console.error);
            }
          }, 1000);
          
          return () => clearInterval(playbackCheck);
        } catch (error) {
          console.error('Error playing video:', error);
          handleVideoError();
        }
      };
      
      ensurePlayback();
    };

    const handleVideoError = () => {
      if (!isMounted) return;
      console.error('Video loading failed, switching to fallback');
      
      // Try to recover by reloading current video first
      try {
        video.load();
        video.play().catch(() => {
          // If reload fails, switch to fallback
          video.src = DEFAULT_BACKGROUND.src;
          video.load();
          video.play().catch(err => console.error('Error playing fallback video:', err));
        });
      } catch (err) {
        console.error('Recovery failed:', err);
      }
      
      setIsBackgroundLoading(false);
    };

    const handleVideoStall = () => {
      if (!isMounted) return;
      console.log('Video stalled, attempting recovery');
      video.load();
      video.play().catch(handleVideoError);
    };

    // Set up video properties
    video.src = selectedBackground.src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.load();

    // Add all relevant event listeners
    video.addEventListener('loadeddata', handleVideoLoaded);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('stalled', handleVideoStall);
    video.addEventListener('pause', () => {
      if (!video.ended) video.play().catch(console.error);
    });

    // Failsafe timeout
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isBackgroundLoading) {
        handleVideoError();
      }
    }, 5000);

    return () => {
      isMounted = false;
      video.removeEventListener('loadeddata', handleVideoLoaded);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('stalled', handleVideoStall);
      clearTimeout(loadingTimeout);
    };
  }, [selectedBackground]);

  // Add this new effect to handle visibility changes
  useEffect(() => {
    if (!videoRef.current) return;

    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBackgroundSelection = useCallback((background) => {
    setIsBackgroundLoading(true);
    setSelectedBackground(background);
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (status === "loading" || showLoading) {
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

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/signin";
    }
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    const main = document.querySelector(`.${styles.main}`);
    if (main) {
      main.style.marginLeft = sidebarOpen ? "0" : "300px";
    }
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
          userName={getFirstName(session.user.name)}
        />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <CustomHeader />
      <CookieBanner />
      <SelectionBar
        className={`${styles.selectionBar} ${zenMode ? styles.hidden : ''}`}
        userEmail={session.user.email}
        userName={getFirstName(session.user.name)}
        onIconClick={handleIconClick}
      />
      
      {renderComponent("pomodoro")}
      {renderComponent("note")}
      {renderComponent("calendar")}
      {renderComponent("chat")}
      <div className={`${styles.container} ${zenMode ? styles.zenMode : ''}`}>
        {selectedBackground && (
          <video
            ref={videoRef}
            className={styles.videoBackground}
            autoPlay
            loop
            muted
            playsInline
            src={selectedBackground.src}
          />
        )}
        {isBackgroundLoading && (
          <div className={styles.backgroundLoader}>
            <div className={styles.backgroundLoaderSpinner}></div>
          </div>
        )}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.open : styles.closed
          } ${zenMode ? styles.hidden : ''}`}
        >
          
          <h1>
            Welcome, {getFirstName(session.user.name)}! {currentTime}
          </h1>
       
       
          <div className={styles.backgroundSelector}>
            <h2>Backgrounds</h2>
            <div className={styles.backgroundScrollContainer}>
              <button 
                className={`${styles.scrollButton} ${styles.scrollLeft}`} 
                onClick={() => handleScroll('left')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <div className={styles.backgroundOptions} ref={scrollContainerRef}>
                {backgrounds.map((background) => (
                  <div
                    key={background.id}
                    className={`${styles.backgroundOption} ${
                      selectedBackground?.id === background.id ? styles.selected : ''
                    }`}
                    onClick={() => handleBackgroundSelect(background)}
                  >
                    <div className={styles.backgroundInfo}>
                      <span className={styles.backgroundLabel}>{background.note}</span>
                      <div className={styles.backgroundTooltip}>
                        <p><strong>Mood:</strong> {background.mood}</p>
                        <p><strong>Best Time:</strong> {background.timeOfDay}</p>
                        <p><strong>Recommended for:</strong> {background.recommended}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className={`${styles.scrollButton} ${styles.scrollRight}`} 
                onClick={() => handleScroll('right')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </div>
          </div>

          <MusicPlayer />
        </aside>
        <button
          className={`${styles.toggleButton} ${
            sidebarOpen ? styles.buttonOpen : styles.buttonClosed
          } ${zenMode ? styles.hidden : ''}`}
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <span className="material-icons">chevron_left</span>
          ) : (
            <span className="material-icons">chevron_right</span>
          )}
        </button>
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
     <button className={`${styles.zenModeButton} ${zenMode ? styles.active : ''}`} onClick={toggleZenMode} aria-label="Toggle Zen Mode" >
 <span className={styles.moonIcon}></span>
      </button>
    </ErrorBoundary>
  );
}
