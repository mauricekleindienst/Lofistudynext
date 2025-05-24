import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/app.module.css";
import YouTubePlayer from "../components/YouTubePlayer";
import CustomHeader from "../components/CustomHeaderdemo";
import PomodoroTimer from "../components/PomodoroTimer";
import SelectionBar from "../components/SelectionBardemo";
import Notes from "../components/Notes";
import Calendar from "../components/Calendar";
import LiveChat from "../components/LiveChat";
import DraggableIframe from "../components/DraggableIframe";
import { ErrorBoundary } from "react-error-boundary";
const backgrounds = [
  { id: 1, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", createdby: "Lo-Fi.study" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train", note: "Train", createdby: "Lo-Fi.study" },
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn", createdby: "Lo-Fi.study" },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night", note: "Night", createdby: "Lo-Fi.study" },

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
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
  const [visibleComponents, setVisibleComponents] = useState({});
  const [showLoading, setShowLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const backgroundsPerPage = 6;
  const totalPages = Math.ceil(backgrounds.length / backgroundsPerPage);
  const scrollContainerRef = useRef(null);
  const videoRef = useRef(null);
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  const getCurrentPageBackgrounds = () => {
    const start = currentPage * backgroundsPerPage;
    const end =
      start + backgroundsPerPage > backgrounds.length
        ? backgrounds.length
        : start + backgroundsPerPage;
    return backgrounds.slice(start, end);
  };

  const memoizedBackgrounds = useMemo(() => getCurrentPageBackgrounds(), [currentPage, backgrounds]);

  const memoizedHandleBackgroundSelection = useCallback((background) => {
    setSelectedBackground(background);
  }, []);

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
    backgrounds.forEach((background) => {
      const video = document.createElement("video");
      video.src = background.src;
      video.preload = "auto";
    });
  }, []);

  useEffect(() => {
    const savedBackgroundId = localStorage.getItem('selectedBackgroundId');
    let initialBackground;

    if (savedBackgroundId) {
      const savedBackground = backgrounds.find(bg => bg.id === parseInt(savedBackgroundId));
      initialBackground = savedBackground || backgrounds[0]; // Use the first background as default
    } else {
      initialBackground = backgrounds[0]; // Use the first background as default
    }

    setSelectedBackground(initialBackground);
    setShowLoading(false);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (showLoading) {
      setTimeout(() => {
        setShowLoading(false);
      }, 6000);
    }
  }, [showLoading]);

  useEffect(() => {
    const preloadBackgrounds = async () => {
      const currentIndex = backgrounds.findIndex(bg => bg.id === selectedBackground.id);
      const preloadRange = 2; // Preload 2 backgrounds before and after the current one

      for (let i = currentIndex - preloadRange; i <= currentIndex + preloadRange; i++) {
        if (i >= 0 && i < backgrounds.length) {
          const video = document.createElement("video");
          video.src = backgrounds[i].src;
          video.preload = "auto";
        }
      }
    };

    preloadBackgrounds();
  }, [selectedBackground]);

  useEffect(() => {
    if (selectedBackground && videoRef.current) {
      setIsBackgroundLoading(true);
      videoRef.current.src = selectedBackground.src;
      videoRef.current.load();
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });

      const handleVideoLoaded = () => {
        setIsBackgroundLoading(false);
        clearTimeout(fallbackTimeout); // Clear the timeout if video loads successfully
      };

      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);

      // Set a timeout to switch to the fallback background after 3 seconds
      const fallbackTimeout = setTimeout(() => {
        if (isBackgroundLoading) {
          console.warn('Switching to fallback background due to loading timeout');
          const fallbackBackgroundUrl = "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4"; // Replace with your fallback URL
          videoRef.current.src = fallbackBackgroundUrl;
          videoRef.current.load();
          videoRef.current.play().catch(err => console.error('Error playing fallback video:', err));
        }
      }, 3000); // 3 seconds

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
        }
        clearTimeout(fallbackTimeout); // Clear the timeout on cleanup
      };
    }
  }, [selectedBackground]);

  useEffect(() => {
    if (!showLoading) {
      setShowBanner(true);
    }
  }, [showLoading]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleBackgroundSelection = useCallback((background) => {
    setIsBackgroundLoading(true);
    setSelectedBackground(background);
    localStorage.setItem('selectedBackgroundId', background.id.toString());
  }, []);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSignUpClick = () => {
    // Redirect to sign-up page or handle sign-up logic
    router.push('/signup');
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  if (showLoading) {
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

  return (
    <ErrorBoundary>
      <CustomHeader />
            <SelectionBar
        className={`${styles.selectionBar} ${zenMode ? styles.hidden : ''}`}
      />
      
      {visibleComponents.pomodoro && (
        <PomodoroTimer onMinimize={() => handleIconClick("pomodoro")} />
      )}
      {visibleComponents.note && (
        <Notes onMinimize={() => handleIconClick("note")} />
      )}
      {visibleComponents.calendar && (
        <Calendar onMinimize={() => handleIconClick("calendar")} />
      )}
      {visibleComponents.chat && (
        <LiveChat
          onMinimize={() => handleIconClick("chat")}
        />
      )}
      <div className={`${styles.container} ${zenMode ? styles.zenMode : ''}`}>
        {selectedBackground && (
          <video
            ref={videoRef}
            className={styles.videoBackground}
            autoPlay
            loop
            muted
            playsInline
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
            Welcome! {currentTime}
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
                    onClick={() => handleBackgroundSelection(background)}
                  >
                    <video src={background.src} muted loop />
                    <span className={styles.backgroundLabel}>{background.note}</span>
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

          <YouTubePlayer />
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
       
      </div>
      <div className={`${styles.createdByLabel} ${zenMode ? styles.hidden : ''}`}>
        Wallpaper by: {selectedBackground.createdby}
      </div>
     <button className={`${styles.zenModeButton} ${zenMode ? styles.active : ''}`} onClick={toggleZenMode} aria-label="Toggle Zen Mode" >
 <span className={styles.moonIcon}></span>
      </button>

      {showBanner && (
        <div className={styles.banner}>
          <button className={styles.closeButton} onClick={handleCloseBanner}>
            &times;
          </button>
          <p>This is a demo for simple features. Sign up for free to access all features!</p>
          <button className={styles.signUpButton} onClick={handleSignUpClick}>
            Sign Up for Free
          </button>
        </div>
      )}
    </ErrorBoundary>
  );
}
