// components/MusicPlayer.js
import { useState, useRef } from 'react';
import styles from '../styles/MusicPlayer.module.css';

const tracks = [
  { id: 1, title: 'Track 1', src: '/music/track1.mp3' },
  { id: 2, title: 'Track 2', src: '/music/track2.mp3' },
  { id: 3, title: 'Track 3', src: '/music/track3.mp3' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  return (
    <div className={styles.musicPlayer}>
      <h2>Music Player</h2>
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} onEnded={nextTrack}></audio>
      <div className={styles.trackInfo}>
        <h3>{tracks[currentTrackIndex].title}</h3>
      </div>
      <div className={styles.controls}>
        <button onClick={prevTrack} className={styles.controlButton}>
          <span className="material-icons">skip_previous</span>
        </button>
        <button onClick={playPause} className={styles.controlButton}>
          <span className="material-icons">{isPlaying ? 'pause' : 'play_arrow'}</span>
        </button>
        <button onClick={nextTrack} className={styles.controlButton}>
          <span className="material-icons">skip_next</span>
        </button>
      </div>
    </div>
  );
}
