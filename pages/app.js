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
  { id: 1, src: "/backgrounds/Night.mp4", alt: "Night", note: "Night", createdby: "Lo-Fi.study" },
  { id: 2, src: "/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", createdby: "Lo-Fi.study" },
  { id: 3, src: "/backgrounds/Train.mp4", alt: "Train", note: "Train" ,createdby: "Lo-Fi.study" },
  { id: 4, src: "/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" , createdby: "Lo-Fi.study"  },
  { id: 5, src: "/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn" , createdby: "Lo-Fi.study" },
  { id: 6, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" , createdby: "Lo-Fi.study" },
  { id: 7, src: "/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" , createdby: "Skyrim" },
  { id: 8, src: "/backgrounds/Train2.mp4", alt: "Train2", note: "Train2" , createdby: "Lo-Fi.study" },
  { id: 9, src: "/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom" , createdby: "Lo-Fi.study" },
  { id: 10, src: "/backgrounds/Night.mp4", alt: "Night", note: "Night" , createdby: "Lo-Fi.study" },
  { id: 11, src: "/backgrounds/Rain.mp4", alt: "Rain", note: "Rain", createdby: "Lo-Fi.study"  },
  { id: 12, src: "/backgrounds/Train.mp4", alt: "Train", note: "Train" , createdby: "Lo-Fi.study" },
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

  const backgroundsPerPage = 6;
  const totalPages = Math.ceil(backgrounds.length / backgroundsPerPage);

  useEffect(() => {
    backgrounds.forEach((background) => {
      const video = document.createElement("video");
      video.src = background.src;
      video.preload = "auto";
    });
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
          {/* Loading Animation */}
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

  return (
    <>
      <CustomHeader />
      <CookieBanner />
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
      <SelectionBar
        userEmail={session.user.email}
        userName={getFirstName(session.user.name)}
        onIconClick={handleIconClick}
      />
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={selectedBackground.src}
      ></video>
      <div className={styles.container}>
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
                        title={background.note}
                        onClick={() => handleBackgroundSelection(background)}
                      >
                        <video
                          src={background.src}
                          alt={background.alt}
                          muted
                          loop
                          playsInline
                        ></video>
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
      {/* Only show the createdByLabel if the sidebar is open */}
      {sidebarOpen && (
        <div className={styles.createdByLabel}>
          Wallpaper by: {selectedBackground.createdby}
        </div>
      )}
    </>
  );
}