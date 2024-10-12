import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import YouTube from 'react-youtube';
import styles from "../../styles/W2g.module.css";

let socket;

export default function Room() {
  const router = useRouter();
  const { roomId } = router.query;
  const [videoId, setVideoId] = useState('RAjgZAEQ9nM'); // Default video ID
  const [watchlist, setWatchlist] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]); // Empty array to initialize connected users
  const [isPlaying, setIsPlaying] = useState(false); // Track whether video is playing
  const [currentTime, setCurrentTime] = useState(0); // Track current video time
  const playerRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      initializeSocket(roomId);
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [roomId]);

  const initializeSocket = async (roomId) => {
    await fetch('/api/socket');
    socket = io();

    socket.emit('join-room', roomId);

    // Sync video for the newly connected user
    socket.on('sync-video', ({ videoId, currentTime, isPlaying }) => {
      setVideoId(videoId);
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      }
    });

    // Update video when play is triggered by another user
    socket.on('play-video', ({ videoId, currentTime }) => {
      setVideoId(videoId);
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
        playerRef.current.playVideo();
      }
    });

    // Update video when pause is triggered by another user
    socket.on('pause-video', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
        playerRef.current.pauseVideo();
      }
    });

    // Sync time when a user scrubs the video
    socket.on('sync-time', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
      }
    });

    // Update user list for connected users
    socket.on('user-list-update', (users) => {
      setConnectedUsers(users);
    });
  };

  const handlePlay = () => {
    const currentTime = playerRef.current.getCurrentTime();
    socket.emit('play-video', { videoId, currentTime });
    setIsPlaying(true);
  };

  const handlePause = () => {
    const currentTime = playerRef.current.getCurrentTime();
    socket.emit('pause-video', currentTime);
    setIsPlaying(false);
  };

  const handleSeek = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
      socket.emit('sync-time', time);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    // Implement YouTube search API call here
    // For now, we'll use dummy data
    const dummyResults = [
      { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
      { id: 'L_jWHffIx5E', title: 'Smash Mouth - All Star' },
    ];
    setSearchResults(dummyResults);
  };

  const addToWatchlist = (video) => {
    setWatchlist((prevList) => [...prevList, video]);
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prevList) => prevList.filter((video) => video.id !== id));
  };

  return (
    <div className={styles.roomContainer}>
      <header className={styles.header}>
        <h1>Room: {roomId}</h1>
        <div className={styles.connectedUsers}>
          {connectedUsers.map((user, index) => (
            <span key={index} className={styles.userBadge}>{user}</span>
          ))}
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.searchBar}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search videos"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className={styles.videoContainer}>
          <YouTube
            videoId={videoId}
            opts={{ height: '500', width: '100%', playerVars: { autoplay: 1 } }}
            onReady={(e) => playerRef.current = e.target}
            onPlay={handlePlay}
            onPause={handlePause}
            onStateChange={(e) => {
              if (e.data === 1) handlePlay(); // Trigger play
              if (e.data === 2) handlePause(); // Trigger pause
            }}
          />
          <div>
            <button onClick={() => handleSeek(currentTime - 10)}>-10s</button>
            <button onClick={() => handleSeek(currentTime + 10)}>+10s</button>
            <p>Current Time: {currentTime.toFixed(2)}s</p>
          </div>
        </div>

        <div className={styles.searchResults}>
          {searchResults.map(video => (
            <div key={video.id} className={styles.searchResult} onClick={() => addToWatchlist(video)}>
              <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} />
              <p>{video.title}</p>
            </div>
          ))}
        </div>
      </main>

      <aside className={styles.playlist}>
        <h2>Playlist</h2>
        {watchlist.map((video) => (
          <div key={video.id} className={styles.playlistItem} onClick={() => setVideoId(video.id)}>
            <img src={`https://img.youtube.com/vi/${video.id}/default.jpg`} alt={video.title} />
            <div className={styles.playlistItemTitle}>{video.title}</div>
          </div>
        ))}
      </aside>
    </div>
  );
}
