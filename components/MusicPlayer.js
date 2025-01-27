import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { debounce } from 'lodash';
import styles from '../styles/MusicPlayer.module.css';

const initialTracks = [
  { id: 1, title: 'Lofi hip hop radio 📚', videoId: 'jfKfPfyJRdk' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 2, title: 'Medieval lofi radio 🏰', videoId: '_uMuuHk_KkQ' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 3, title: 'Asian lofi radio ⛩️', videoId: 'Na0w3Mz46GA' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 4, title: 'Peaceful piano radio 🎹', videoId: '4oStw0r33so' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 5, title: 'Synthwave radio 🌌', videoId: '4xDzrJKXOOY' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 6, title: 'Dark ambient radio 🌃', videoId: 'S_MOd40zlYU' , channelName: 'LofiGirl', channelUrl: 'https://www.youtube.com/@LofiGirl' },
  { id: 7, title: 'Dark academia 🌓', videoId: 'SllpB3W5f6s' , channelName: 'Toxic Drunker', channelUrl: 'https://www.youtube.com/@ToxicDrunker_' },
  { id: 8, title: 'Jazz music ☕', videoId: 'MYPVQccHhAQ' , channelName: 'Relaxing Jazz Piano', channelUrl: 'https://www.youtube.com/@relaxingjazzpiano6491' },
  { id: 9, title: 'Lofi Pokemon mix 🏝️', videoId: '6CjpgFOOtuI' , channelName: 'STUDIO MATCHA US', channelUrl: 'https://www.youtube.com/@LoFi_Pokemon_Matcha' },
  { id: 10, title: 'Skyrim soundtrack ❄️', videoId: '_Z1VzsE1GVg' , channelName: 'Aaronmn7', channelUrl: 'https://www.youtube.com/@AeronN7' },
  { id: 11, title: 'Animal crossing 🌳', videoId: 'V6GUhCxMDLg' , channelName: 'RemDaBom', channelUrl: 'https://www.youtube.com/@RemDaBom' },
  { id: 12, title: 'Harry Potter study musik 📚', videoId: 'pQdTu0IeVho' , channelName: 'AmbientWorlds', channelUrl: 'https://www.youtube.com/@AmbientWorlds' },
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
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef(null);
  const autoplayAttemptedRef = useRef(false);

  // Load YouTube iframe API script on mount
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

  // Persist volume, tracks, and current track index in localStorage
  useEffect(() => {
    const storedTracks = JSON.parse(localStorage.getItem('tracks'));
    const storedTrackIndex = localStorage.getItem('currentTrackIndex');
    const storedVolume = localStorage.getItem('volume');
    if (storedTracks) setTracks(storedTracks);
    if (storedTrackIndex) setCurrentTrackIndex(parseInt(storedTrackIndex));
    if (storedVolume) setVolume(parseInt(storedVolume));
  }, []);

  useEffect(() => {
    localStorage.setItem('tracks', JSON.stringify(tracks));
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
    localStorage.setItem('volume', volume);
  }, [tracks, currentTrackIndex, volume]);

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
    if (!autoplayAttemptedRef.current) {
      autoplayAttemptedRef.current = true;
      attemptAutoplay();
    }
  };

  const attemptAutoplay = async () => {
    try {
      await playerRef.current.playVideo();
      setIsPlaying(true);
    } catch (error) {
      console.log("Autoplay failed. User interaction required to play.");
      setIsPlaying(false);
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

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const debouncedSelectTrack = debounce((index) => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentTrackIndex(index);
    setIsLoading(false); // Stop the loading spinner after selecting a track
  }, 300);

  const selectTrack = (index) => {
    debouncedSelectTrack(index);
  };

  const addNewTrack = (title, url) => {
    try {
      const videoId = new URL(url).searchParams.get('v');
      if (!videoId) {
        alert('Invalid YouTube URL');
        return;
      }
      setTracks([...tracks, { id: tracks.length + 1, title, videoId }]);
    } catch (error) {
      alert('Invalid YouTube URL');
      console.error("Error parsing YouTube URL:", error);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    addNewTrack(newTrackTitle, newTrackUrl);
    setNewTrackTitle('');
    setNewTrackUrl('');
    setIsFormVisible(false);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const getThumbnailUrl = (videoId) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

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
          <h2>Music Player</h2>
        </div>
        <div className={styles.trackInfo}>
          <img 
            src={getThumbnailUrl(tracks[currentTrackIndex].videoId)} 
            alt="Track thumbnail" 
            className={styles.thumbnail} 
          />
          <div>
            <h3>{tracks[currentTrackIndex].title}</h3>
            <a 
              href={tracks[currentTrackIndex].channelUrl} 
              className={styles.channelName} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {tracks[currentTrackIndex].channelName}
            </a>
          </div>
        </div>
        {apiReady && (
          <YouTube
            videoId={tracks[currentTrackIndex].videoId}
            opts={{
              height: '0', // Keep player visually hidden
              width: '0',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                rel: 0,
                showinfo: 0,
                playsinline: 1,
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
            {isLoading ? (
              <div className={styles.loadingSpinner}></div> // Loading spinner
            ) : (
              <span className="material-icons">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            )}
          </button>
          <button onClick={nextTrack} className={styles.controlButton} disabled={isLoading}>
            <span className="material-icons">skip_next</span>
          </button>
        </div>
        <div className={styles.volumeControl}>
          <button onClick={toggleMute} className={styles.muteButton}>
            <span className="material-icons">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
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
