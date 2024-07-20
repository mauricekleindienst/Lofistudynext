// pages/Study.js

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Study.module.css';
import MusicPlayer from '../components/MusicPlayer';
import CustomHeader from '../components/CustomHeader';
import PomodoroTimer from '../components/PomodoroTimer';
import SelectionBar from '../components/SelectionBar';
import Notes from '../components/Notes';
import Calendar from '../components/Calendar';
import LiveChat from '../components/LiveChat';
import DraggableIframe from '../components/DraggableIframe';

const backgrounds = [
  { id: 1, src: '/backgrounds/Night.mp4', alt: 'Night', note: 'Night' },
  { id: 2, src: '/backgrounds/Rain.mp4', alt: 'Rain', note: 'Rain' },
  { id: 3, src: '/backgrounds/Train.mp4', alt: 'Train', note: 'Train' },
  { id: 4, src: '/backgrounds/Classroom.mp4', alt: 'Classroom', note: 'Classroom' },
  { id: 5, src: '/backgrounds/Autumn.mp4', alt: 'Autumn', note: 'Autumn' },
  { id: 6, src: '/backgrounds/Couch.mp4', alt: 'Couch', note: 'Couch' },
  { id: 7, src: '/backgrounds/Skyrim.mp4', alt: 'Skyrim', note: 'Skyrim' },
  { id: 8, src: '/backgrounds/Train2.mp4', alt: 'Train2', note: 'Train2' },
  { id: 9, src: '/backgrounds/Chillroom.mp4', alt: 'Chillroom', note: 'Chillroom' },
];

export default function Study() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { roomUrl } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [selectedBackground, setSelectedBackground] = useState('');
  const [visibleComponents, setVisibleComponents] = useState({});
  const [videoRoomUrl, setVideoRoomUrl] = useState('');

  useEffect(() => {
    setSelectedBackground(backgrounds[Math.floor(Math.random() * backgrounds.length)].src);
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

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
     
      window.location.href = '/auth/signin';
    }
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

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  return (
    <>
      <CustomHeader />
     
      {visibleComponents.pomodoro && <PomodoroTimer onMinimize={() => handleIconClick('pomodoro')} />}
      {visibleComponents.note && <Notes onMinimize={() => handleIconClick('note')} />}
      {visibleComponents.calendar && <Calendar onMinimize={() => handleIconClick('calendar')} />}
      {visibleComponents.chat && (
        <LiveChat
          onMinimize={() => handleIconClick('chat')}
          userName={getFirstName(session.user.name)}
        />
      )}
      <SelectionBar onIconClick={handleIconClick} />
      <div className={styles.container}>
        <video className={styles.videoBackground} autoPlay loop muted src={selectedBackground}></video>
        <main className={styles.main}>
          <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
            <button className={styles.toggleButton} onClick={toggleSidebar}>
              {sidebarOpen ? <span className="material-icons">chevron_left</span> : <span className="material-icons">chevron_right</span>}
            </button>
            <h1>Welcome, {getFirstName(session.user.name)}! {currentTime}</h1>
            <div className={styles.backgroundSelector}>
              <h2>Backgrounds</h2>
              <div className={styles.backgroundGrid}>
                {backgrounds.map((background) => (
                  <div
                    key={background.id}
                    className={styles.backgroundOption}
                    title={background.note}
                    onClick={() => handleBackgroundSelection(background)}
                  >
                    <video src={background.src} alt={background.alt} muted loop></video>
                  </div>
                ))}
              </div>
            </div>
            <MusicPlayer />
            <div className={styles.sidebarFooter}>
              <button className={styles.sidebarButton} onClick={() => router.push('/FAQ')}>FAQ</button>
              <button className={styles.sidebarButton} onClick={() => router.push('/Feedback')}>Feedback</button>
              <button className={styles.sidebarButton} onClick={() => router.push('/contact')}>contact</button>
            </div>
          </aside>
          {videoRoomUrl && (
            <DraggableIframe
              src={videoRoomUrl}
              onClose={() => setVideoRoomUrl('')}
            />
          )}
        </main>
      </div>
    </>
  );
}
