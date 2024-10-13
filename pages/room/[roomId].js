//room/[roomId].js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';
import YouTube from 'react-youtube';
import { Search, SkipBack, SkipForward, Play, Pause, X } from 'lucide-react';

const backgrounds = [
  { id: 1, src: "/backgrounds/Couch.mp4", alt: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train" },
  // Add more backgrounds here...
];
const W2GRoom = () => {
  const router = useRouter();
  const { roomId } = router.query;
  const [videoId, setVideoId] = useState('RAjgZAEQ9nM');
  const [background, setBackground] = useState(null);  // Background state
  const [watchlist, setWatchlist] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);  
  const socketRef = useRef(null);

  const initializeSocket = useCallback(async () => {
    await fetch('/api/socket');
    socketRef.current = io();

    socketRef.current.emit('join-room', roomId);

    // Sync video on initial connection
    socketRef.current.on('sync-video', ({ videoId, currentTime, isPlaying }) => {
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

    socketRef.current.on('play-video', ({ videoId, currentTime }) => {
      setVideoId(videoId);
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
    });

    socketRef.current.on('pause-video', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    });

    socketRef.current.on('sync-time', (currentTime) => {
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true);
      }
    });

    socketRef.current.on('user-list-update', (users) => {
      setConnectedUsers(users);
    });
  }, [roomId]);

  useEffect(() => {
    if (roomId) {
      initializeSocket();
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId, initializeSocket]);

  const handlePlay = useCallback(() => {
    if (socketRef.current && playerRef.current) {
      const currentTime = playerRef.current?.getCurrentTime();
      socketRef.current.emit('play-video', { videoId, currentTime });
      setIsPlaying(true);
    }
  }, [videoId]);

  const handlePause = useCallback(() => {
    if (socketRef.current && playerRef.current) {
      const currentTime = playerRef.current?.getCurrentTime();
      socketRef.current.emit('pause-video', currentTime);
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((time) => {
    if (playerRef.current && socketRef.current) {
      playerRef.current.seekTo(time, true);
      socketRef.current.emit('sync-time', time);
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data.items);
    } catch (error) {
      console.error('Error searching videos:', error);
    }
  };

  const addToWatchlist = (video) => {
    setWatchlist((prevList) => [...prevList, video]);
  };

  const removeFromWatchlist = (id) => {
    setWatchlist((prevList) => prevList.filter((video) => video.id !== id));
  };


  return (
    <div className="relative flex flex-col h-screen bg-gray-900 text-white">
      {/* Background video */}
      {background && (
        <video
          autoPlay
          loop
          muted
          className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
        >
          <source src={background.src} type="video/mp4" />
        </video>
      )}

      <header className="z-10 bg-gray-800 bg-opacity-80 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500">Room: {roomId}</h1>
        <div className="flex space-x-2">
          {connectedUsers.map((user, index) => (
            <span key={index} className="bg-orange-500 text-sm px-2 py-1 rounded-full">{user}</span>
          ))}
        </div>
      </header>

      <main className="z-10 flex-grow flex overflow-hidden">
        <div className="flex-grow flex flex-col p-8 bg-gray-800 bg-opacity-80">
          <div className="mb-2 flex">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search videos"
              className="flex-grow bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button onClick={handleSearch} className="bg-orange-500 px-4 py-2 rounded-r-lg hover:bg-orange-600 transition duration-300">
              <Search size={20} />
            </button>
          </div>

          {/* YouTube Player */}
          <div className="flex-grow mb-2">
            <YouTube
              videoId={videoId}
              opts={{ height: '100%', width: '100%', playerVars: { autoplay: 0 } }}
              onReady={(e) => { playerRef.current = e.target; }}
              onPlay={handlePlay}
              onPause={handlePause}
              className="w-full h-full"
            />
          </div>

          {/* Controls and video status */}
          <div className="mt-4 flex justify-center items-center space-x-4">
            <button onClick={() => handleSeek(currentTime - 10)} className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition duration-300">
              <SkipBack size={20} />
            </button>
            <button onClick={isPlaying ? handlePause : handlePlay} className="bg-orange-500 p-2 rounded-full hover:bg-orange-600 transition duration-300">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => handleSeek(currentTime + 10)} className="bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition duration-300">
              <SkipForward size={20} />
            </button>
            <span className="text-sm">Current Time: {currentTime.toFixed(2)}s</span>
          </div>

          {/* Search results */}
          <div className="mt-4 grid grid-cols-6 gap-4 overflow-y-auto max-h-64">
            {searchResults.map(video => (
              <div key={video.id.videoId} className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition duration-300">
                {video.snippet?.thumbnails?.medium ? (
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-500 flex items-center justify-center">
                    <span>No Thumbnail</span>
                  </div>
                )}
                <p className="p-2 text-sm">{video.snippet?.title || "No title available"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist */}
        <aside className="w-64 bg-gray-800 bg-opacity-80 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Playlist</h2>
          {watchlist.map((video) => (
            <div key={video.id.videoId} className="flex items-center mb-2 bg-gray-700 rounded-lg overflow-hidden">
              <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} className="w-20 h-15 object-cover" />
              <div className="flex-grow p-2">
                <p className="text-sm truncate">{video.snippet.title}</p>
              </div>
              <button onClick={() => setVideoId(video.id.videoId)} className="p-2 bg-orange-500 hover:bg-orange-600 transition duration-300">
                <Play size={16} />
              </button>
              <button onClick={() => removeFromWatchlist(video.id.videoId)} className="p-2 bg-red-500 hover:bg-red-600 transition duration-300">
                <X size={16} />
              </button>
            </div>
          ))}
        </aside>
      </main>

      {/* Background video attribution */}
      {background && (
        <div className="absolute bottom-4 right-4 text-white text-sm opacity-50">
          Background: {background.alt}
        </div>
      )}
    </div>
  );
};

export default W2GRoom;