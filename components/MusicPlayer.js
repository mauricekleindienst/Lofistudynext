import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { debounce } from 'lodash';
import styles from '../styles/MusicPlayer.module.css';
import CustomCursor from '../components/CustomCursor';

const initialTracks = [
  { id: 1, title: 'LoFi', videoId: 'jfKfPfyJRdk' },
  { id: 2, title: 'Medieval LoFi', videoId: '_uMuuHk_KkQ' },
  { id: 3, title: 'Asian LoFi', videoId: 'Na0w3Mz46GA' },
  { id: 4, title: 'Classic Chill', videoId: '4oStw0r33so' },
  { id: 5, title: 'SynthWave', videoId: '4xDzrJKXOOY' },
  { id: 6, title: 'Deep Ambience', videoId: 'S_MOd40zlYU' },
  { id: 7, title: 'Jazz', videoId: 'xVSlZWkjI94' },
  { id: 8, title: 'Skyrim', videoId: '_Z1VzsE1GVg' },
];

export default function MusicPlayer({ onMinimize }) {
  const [tracks, setTracks] = useState(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [apiReady, setApiReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => setApiReady(true);

    return () => {
      document.body.removeChild(script);
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  const playPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    selectTrack((currentTrackIndex + 1) % tracks.length);
  };

  const prevTrack = () => {
    selectTrack((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event) => {
    if (event.data === YouTube.PlayerState.ENDED) {
      nextTrack();
    } else if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === YouTube.PlayerState.PAUSED) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    let isMounted = true;

    const loadVideo = async () => {
      if (playerRef.current && playerRef.current.loadVideoById) {
        try {
          await playerRef.current.loadVideoById(tracks[currentTrackIndex].videoId);
          if (isMounted) {
            if (isPlaying) {
              playerRef.current.playVideo();
            } else {
              playerRef.current.pauseVideo();
            }
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Error loading video:", error);
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    loadVideo();

    return () => {
      isMounted = false;
    };
  }, [currentTrackIndex, tracks, isPlaying]);

  const addNewTrack = (title, url) => {
    const videoId = url.split('v=')[1].split('&')[0];
    setTracks([...tracks, { id: tracks.length + 1, title, videoId }]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addNewTrack(newTrackTitle, newTrackUrl);
    setNewTrackTitle('');
    setNewTrackUrl('');
    setIsFormVisible(false);
  };

  const debouncedSelectTrack = debounce((index) => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  }, 300);

  const selectTrack = (index) => {
    debouncedSelectTrack(index);
  };

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className={styles.musicPlayerContainer}>
      {isFormVisible && (
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleFormSubmit}>
            <input
              type="text"
              placeholder="Track Title"
              value={newTrackTitle}
              onChange={(e) => setNewTrackTitle(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="YouTube URL"
              value={newTrackUrl}
              onChange={(e) => setNewTrackUrl(e.target.value)}
              required
            />
            <button type="submit">Add Track</button>
            <button type="button" onClick={() => setIsFormVisible(false)}>Cancel</button>
          </form>
        </div>
      )}
      <div className={styles.musicPlayer}>
        <div className={styles.header}>
          <h2>Lo-Fi.Study</h2>
        </div>
        <div className={styles.trackInfo}>
          <h3>{tracks[currentTrackIndex].title}</h3>
        </div>
        {apiReady && (
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
            onError={(error) => {
              console.error("YouTube player error:", error);
              setIsLoading(false);
            }}
          />
        )}
        <div className={styles.controls}>
          <button onClick={prevTrack} className={styles.controlButton} disabled={isLoading}>
            <span className="material-icons">skip_previous</span>
          </button>
          <button onClick={playPause} className={styles.controlButton} disabled={isLoading}>
            <span className="material-icons">{isPlaying ? 'pause' : 'play_arrow'}</span>
          </button>
          <button onClick={nextTrack} className={styles.controlButton} disabled={isLoading}>
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
        <button className={styles.addButton} onClick={() => setIsFormVisible(!isFormVisible)}>
          Add Music
        </button>
      </div>
    </div>
  );
}