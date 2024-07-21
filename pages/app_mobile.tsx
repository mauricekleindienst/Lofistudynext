import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/app_mobile.module.css';
import CustomHeader from '../components/CustomHeader';
import SelectionBar from '../components/SelectionBar';
import PomodoroTimerMobile from '../components/PomodoroTimer_mobile';
import NotesMobile from '../components/Notes_mobile';
import ScoreboardMobile from '../components/Scoreboard_mobile';
import SettingsMobile from '../components/Settings_mobile';
import ComingSoon from '../components/ComingSoon';

const backgrounds = [
  { id: 1, src: '/backgrounds/Night.mp4', alt: 'Night' },
  { id: 2, src: '/backgrounds/Rain.mp4', alt: 'Rain' },
  { id: 3, src: '/backgrounds/Train.mp4', alt: 'Train' },
  { id: 4, src: '/backgrounds/Classroom.mp4', alt: 'Classroom' },
  { id: 5, src: '/backgrounds/Autumn.mp4', alt: 'Autumn' },
  { id: 6, src: '/backgrounds/Couch.mp4', alt: 'Couch' },
  { id: 7, src: '/backgrounds/Skyrim.mp4', alt: 'Skyrim' },
  { id: 8, src: '/backgrounds/Train2.mp4', alt: 'Train2' },
  { id: 9, src: '/backgrounds/Chillroom.mp4', alt: 'Chillroom' },
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].src);
  const [visibleComponents, setVisibleComponents] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBackgroundSelection = (background) => {
    setSelectedBackground(background.src);
  };

  const handleIconClick = (component) => {
    setVisibleComponents((prevState) => ({
      ...prevState,
      [component]: !prevState[component],
    }));
  };

  return (
    <div className={styles.container}>
      <video className={styles.videoBackground} autoPlay loop muted src={selectedBackground}></video>
      <CustomHeader
        userName={session.user.name}
        currentTime={currentTime}
        onToggleSidebar={toggleSidebar}
      />
      <main className={styles.main}>
        {sidebarOpen && (
          <aside className={styles.sidebar}>
            <h2>Backgrounds</h2>
            <div className={styles.backgroundGrid}>
              {backgrounds.map((background) => (
                <div
                  key={background.id}
                  className={styles.backgroundOption}
                  onClick={() => handleBackgroundSelection(background)}
                >
                  <video src={background.src} alt={background.alt} muted loop></video>
                </div>
              ))}
            </div>
          </aside>
        )}

        {visibleComponents.pomodoro && <PomodoroTimerMobile onMinimize={() => handleIconClick('pomodoro')} />}
        {visibleComponents.notes && <NotesMobile onMinimize={() => handleIconClick('notes')} />}
        {visibleComponents.scoreboard && <ScoreboardMobile onMinimize={() => handleIconClick('scoreboard')} />}
        {visibleComponents.settings && <SettingsMobile onMinimize={() => handleIconClick('settings')} />}

        <SelectionBar onIconClick={handleIconClick} />
      </main>
      <ComingSoon />
    </div>
  );
}
