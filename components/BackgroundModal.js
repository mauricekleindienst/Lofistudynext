import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../styles/BackgroundModal.module.css';

export default function BackgroundModal({ backgrounds, onSelect, selectedBackground, onClose }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBg, setHoveredBg] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(new Set());
  const [loadedThumbnails, setLoadedThumbnails] = useState(new Set());
  const videoRefs = useRef(new Map());
  const observerRef = useRef(null);

  // Define categories with icons for better visual representation
  const categories = [
    { id: 'all', label: 'All', icon: 'grid_view' },
    { id: 'nature', label: 'Nature', icon: 'park' },
    { id: 'urban', label: 'Urban', icon: 'location_city' },
    { id: 'cozy', label: 'Cozy', icon: 'weekend' },
    { id: 'gaming', label: 'Gaming', icon: 'sports_esports' }
  ];
  // Use the category property from backgrounds data
  const getBackgroundCategory = (background) => {
    return background.category || 'all';
  };
  // Handle Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const backgroundId = parseInt(video.dataset.backgroundId);
            
            if (!loadedThumbnails.has(backgroundId)) {
              // Load the video for thumbnail preview
              if (video.src) {
                video.load();
                setLoadedThumbnails(prev => new Set([...prev, backgroundId]));
              }
            }
            
            // Continue observing to ensure proper loading
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Cleanup videos when component unmounts
  useEffect(() => {
    return () => {
      // Pause and cleanup all videos
      videoRefs.current.forEach(video => {
        if (video) {
          video.pause();
          video.src = '';
          video.load();
        }
      });
      videoRefs.current.clear();
    };
  }, []);

  const handleVideoLoad = useCallback((backgroundId) => {
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(backgroundId);
      return newSet;
    });
  }, []);

  const handleVideoError = useCallback((backgroundId) => {
    setLoadingVideos(prev => {
      const newSet = new Set(prev);
      newSet.delete(backgroundId);
      return newSet;
    });
  }, []);
  const handleMouseEnter = useCallback((backgroundId, videoSrc) => {
    setHoveredBg(backgroundId);
    
    const video = videoRefs.current.get(backgroundId);
    if (video) {
      // If video is loaded (has metadata), play it
      if (video.readyState >= 2) {
        video.currentTime = 0;
        video.play().catch(() => {
          // Video play failed, ignore silently
        });
      } else {
        // Video not loaded yet, ensure it starts loading
        setLoadingVideos(prev => new Set([...prev, backgroundId]));
        if (!loadedThumbnails.has(backgroundId)) {
          video.load();
        }
      }
    }
  }, [loadedThumbnails]);

  const handleMouseLeave = useCallback((backgroundId) => {
    setHoveredBg(null);
    
    const video = videoRefs.current.get(backgroundId);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const handleBackgroundSelect = useCallback((background) => {
    // Pause all videos before selection
    videoRefs.current.forEach(video => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    
    onSelect(background);
  }, [onSelect]);

  const filteredBackgrounds = backgrounds.filter(bg => {
    const matchesCategory = filter === 'all' || getBackgroundCategory(bg) === filter;
    const matchesSearch = bg.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerContent}>
            <span className="material-icons">wallpaper</span>
            <h2>Select Background</h2>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className={styles.searchBar}>
          <span className="material-icons">search</span>
          <input
            type="text"
            placeholder="Search backgrounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search backgrounds"
          />
          {searchQuery && (
            <button 
              className={styles.clearSearch} 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <span className="material-icons">close</span>
            </button>
          )}
        </div>        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${filter === category.id ? styles.active : ''}`}
              onClick={() => setFilter(category.id)}
              aria-label={`Filter by ${category.label}`}
              title={category.label}
            >
              <span className="material-icons">{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.resultsInfo}>
          <p>
            {filteredBackgrounds.length} {filteredBackgrounds.length === 1 ? 'background' : 'backgrounds'} 
            {filter !== 'all' ? ` in ${filter}` : ''}
            {searchQuery ? ` matching "${searchQuery}"` : ''}
          </p>
        </div>        <div className={styles.backgroundGrid}>
          {filteredBackgrounds.length > 0 ? (
            filteredBackgrounds.map(background => (
              <div
                key={background.id}
                className={`${styles.backgroundCard} ${selectedBackground?.id === background.id ? styles.selected : ''}`}
                onClick={() => handleBackgroundSelect(background)}
                onMouseEnter={() => handleMouseEnter(background.id, background.src)}
                onMouseLeave={() => handleMouseLeave(background.id)}
              >                <div className={styles.videoWrapper}>
                  <video
                    ref={el => {
                      if (el) {
                        videoRefs.current.set(background.id, el);
                        // Set up intersection observer for lazy loading
                        if (observerRef.current && !loadedThumbnails.has(background.id)) {
                          el.dataset.backgroundId = background.id.toString();
                          observerRef.current.observe(el);
                        }
                      }
                    }}
                    src={background.src}
                    muted
                    loop
                    preload="metadata"
                    onLoadedData={() => handleVideoLoad(background.id)}
                    onError={() => handleVideoError(background.id)}
                    data-background-id={background.id}
                  />
                  {loadingVideos.has(background.id) && (
                    <div className={styles.videoLoader}>
                      <div className={styles.loadingSpinner}></div>
                    </div>
                  )}                  {hoveredBg === background.id && !loadingVideos.has(background.id) && (
                    <div className={styles.videoOverlay}>
                      <button className={styles.selectButton}>
                        <span className="material-icons">check_circle</span>
                      </button>
                    </div>
                  )}
                  {selectedBackground?.id === background.id && (
                    <div className={styles.selectedIndicator}>
                      <span className="material-icons">check_circle</span>
                    </div>
                  )}
                </div>
                <div className={styles.backgroundInfo}>
                  <h3>{background.note}</h3>
                  <p>by {background.createdby || 'Unknown'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <span className="material-icons">search_off</span>
              <h3>No backgrounds found</h3>
              <p>Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}