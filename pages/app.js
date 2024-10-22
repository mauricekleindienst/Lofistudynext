import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
const backgrounds = [
  { id: 1, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", createdby: "Lo-Fi.study" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train", note: "Train", createdby: "Lo-Fi.study" },
  { id: 4, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" , createdby: "Lo-Fi.study"},
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn", createdby: "Lo-Fi.study" },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night", note: "Night", createdby: "Lo-Fi.study" },
  { id: 7, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" , createdby: "Skyrim"},
  { id: 8, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4", alt: "Train2", note: "Train2", createdby: "Lo-Fi.study" },
  { id: 9, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom", createdby: "Lo-Fi.study" },
  { id: 10, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/cables.mp4", alt: "Cables", note: "Cables" , createdby: "Lo-Fi.study" },
  { id: 11, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/winter.mp4", alt: "Winter", note: "Winter", createdby: "Lo-Fi.study"  },
  { id: 12, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/study_girl.mp4", alt: "StudyGirl", note: "StudyGirl" , createdby: "Lo-Fi.study" },
  { id: 13, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/coffee.mp4", alt: "Coffee", note: "Coffee" , createdby: "Lo-Fi.study" },
  { id: 14, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Minecraft.mp4", alt: "Minecraft", note: "Minecraft" , createdby: "Mojang" },
  { id: 15, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Darkroom.mp4", alt: "Darkroom", note: "Darkroom" , createdby: "Lo-Fi.study" },
  { id: 16, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Snowtrain.mp4", alt: "Snowtrain", note: "Snowtrain" , createdby: "Lo-Fi.study" },
  { id: 17, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Garden.mp4", alt: "Garden", note: "Garden" , createdby: "Lo-Fi.study" },
  { id: 18, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/japannight.mp4", alt: "japannight", note: "japannight" , createdby: "Lo-Fi.study" },
];

export default function Study() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { roomUrl } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
  const [visibleComponents, setVisibleComponents] = useState({});
  const [videoRoomUrl, setVideoRoomUrl] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [zenMode, setZenMode] = useState(false);
  const Loader = ({ status, showLoading }) => {
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
  const backgroundsPerPage = 6;
  const totalPages = Math.ceil(backgrounds.length / backgroundsPerPage);
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
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval); // Cleanup the interval on unmount
  }, []);
  useEffect(() => {
    setSelectedBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
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
    if (status !== "loading") {
      setTimeout(() => {
        setShowLoading(false);
      }, 5000);
    }
  }, [status]);

  if (status === "loading" || showLoading) {
    return (
      <div className={styles["loader-container"]}>
        <div className={styles.loader}>
          <div>
            <ul>
              {[...Array(6)].map((_, i) => (
                <li key={i}>
                  <svg viewBox="0 0 90 120" fill="currentColor">
                    <path d="M90,0 L90,120 L11,120 C4.92486775,120 0,115.075132 0,109 L0,11 C0,4.92486775,0 11,0 L90,0 Z M71.5,81 L18.5,81 C17.1192881,81 16,82.1192881 16,83.5 C16,84.8254834 17.0315359,85.9100387 18.3356243,85.9946823 L18.5,86 L71.5,86 C72.8807119,86 74,84.8807119 74,83.5 C74,82.1745166 72.9684641,81.0899613 71.6643757,81.0053177 L71.5,81 Z M71.5,57 L18.5,57 C17.1192881,57 16,58.1192881 16,59.5 C16,60.8254834 17.0315359,61.9100387 18.3356243,61.9946823 L18.5,62 L71.5,62 C72.8807119,62 74,60.8807119 74,59.5 C74,58.1192881 72.8807119,57 71.5,57 Z M71.5,33 L18.5,33 C17.1192881,33 16,34.1192881 16,35.5 C16,36.8254834 17.0315359,37.9100387 18.3356243,37.9946823 L18.5,38 L71.5,38 C72.8807119,38 74,36.8807119 74,35.5 C74,34.1192881 72.8807119,33 71.5,33 Z" />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <span>Opening Your Study Session</span>
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

  const handleBackgroundSelection = (background) => {
    setSelectedBackground(background);
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

  const handlePageChange = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const getCurrentPageBackgrounds = () => {
    const start = currentPage * backgroundsPerPage;
    const end =
      start + backgroundsPerPage > backgrounds.length
        ? backgrounds.length
        : start + backgroundsPerPage;
    return backgrounds.slice(start, end);
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
    <>
      <CustomHeader />
      <CookieBanner />
       <SelectionBar
       className={styles.selectionBar}
          userEmail={session.user.email}
          userName={getFirstName(session.user.name)}
          onIconClick={handleIconClick}
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
          userName={getFirstName(session.user.name)}
        />
      )}
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={selectedBackground.src}
      ></video>
      <div className={`${styles.container} ${zenMode ? styles.zenMode : ''}`}>
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.open : styles.closed
          }`}
        >
          
          <h1>
            Welcome, {getFirstName(session.user.name)}! {currentTime}
          </h1>
       
       
          <div className={styles.backgroundSelector}>
  <h2>Backgrounds</h2>
  <div
    className={styles.backgroundPages}
    style={{ transform: `translateX(-${currentPage * 100}%)` }}
  >
    {[...Array(totalPages)].map((_, pageIndex) => (
      <div key={pageIndex} className={styles.backgroundPage}>
        {backgrounds
          .slice(
            pageIndex * backgroundsPerPage,
            (pageIndex + 1) * backgroundsPerPage
          )
          .map((background) => (
            <div
              key={background.id}
              className={styles.backgroundOption}
              onClick={() => handleBackgroundSelection(background)}
            >
              <div className={styles.tooltipWrapper}>
                <video
                  src={background.src}
                  alt={background.alt}
                  muted
                  loop
                  playsInline
                  className={styles.backgroundVideo}
                ></video>
                <span className={styles.tooltiptext}>{background.note}</span>
              </div>
            </div>
          ))}
      </div>
    ))}
  </div>
</div>

          <MusicPlayer />
        </aside>
        <button
          className={`${styles.toggleButton} ${
            sidebarOpen ? styles.buttonOpen : styles.buttonClosed
          }`}
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
      <div className={styles.createdByLabel}>
        Wallpaper by: {selectedBackground.createdby}
      </div>
     <button className={`${styles.zenModeButton} ${zenMode ? styles.active : ''}`} onClick={toggleZenMode} aria-label="Toggle Zen Mode" >
 <span className={styles.moonIcon}></span>
      </button>
    </>
  );
}
}