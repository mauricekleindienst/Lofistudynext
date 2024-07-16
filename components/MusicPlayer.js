import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import styles from '../styles/MusicPlayer.module.css';

const tracks = [
  { id: 1, title: 'Wave Music', videoId: 'S_MOd40zlYU' },
  { id: 2, title: 'Deep Ambience Music', videoId: '4xDzrJKXOOY' },
  { id: 3, title: 'Classic Chill', videoId: '4oStw0r33so' },
  { id: 4, title: 'Lofi', videoId: 'jfKfPfyJRdk' },
  { id: 5, title: 'Jazz', videoId: 'xVSlZWkjI94' },
  { id: 6, title: 'Skyrim', videoId: '_Z1VzsE1GVg' },
  { id: 7, title: 'Medieval lofi', videoId: '_uMuuHk_KkQ' }
];

export default function MusicPlayer({ onMinimize }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const playerRef = useRef(null);

  const playPause = () => {
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
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

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event) => {
    if (event.data === 0) { // Video ended
      nextTrack();
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.loadVideoById(tracks[currentTrackIndex].videoId);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentTrackIndex]);

  const skipNextTrack = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    if (isPlaying) {
      setTimeout(() => {
        playerRef.current.playVideo();
      }, 100);
    }
  };

  const skipPrevTrack = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    if (isPlaying) {
      setTimeout(() => {
        playerRef.current.playVideo();
      }, 100);
    }
  };

  const selectTrack = (index) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setTimeout(() => {
      playerRef.current.playVideo();
    }, 100);
  };

  return (
    <div className={styles.musicPlayer}>
      <div className={styles.header}>
        <h2>Music Player</h2>
      </div>
      <div className={styles.trackInfo}>
        <h3>{tracks[currentTrackIndex].title}</h3>
      </div>
      <YouTube
        videoId={tracks[currentTrackIndex].videoId}
        opts={{
          height: '0',
          width: '0',
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            rel: 0,
            showinfo: 0
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
      />
      <div className={styles.controls}>
        <button onClick={skipPrevTrack} className={styles.controlButton}>
          <span className="material-icons">skip_previous</span>
        </button>
        <button onClick={playPause} className={styles.controlButton}>
          <span className="material-icons">{isPlaying ? 'pause' : 'play_arrow'}</span>
        </button>
        <button onClick={skipNextTrack} className={styles.controlButton}>
          <span className="material-icons">skip_next</span>
        </button>
      </div>
      <div className={styles.volumeControl}>
        <span className="material-icons">volume_up</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className={styles.slider}
        />
      </div>
      <div className={styles.trackSelection}>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={`${styles.trackItem} ${index === currentTrackIndex ? styles.active : ''}`}
            onClick={() => selectTrack(index)}
          >
            {track.title}
          </div>
        ))}
      </div>
    </div>
  );
}