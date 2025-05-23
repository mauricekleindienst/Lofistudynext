import React, { useState, useEffect } from 'react';
import styles from '../styles/BackgroundModal.module.css';

export default function BackgroundModal({ backgrounds, onSelect, selectedBackground, onClose }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredBg, setHoveredBg] = useState(null);

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
        </div>

        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${filter === category.id ? styles.active : ''}`}
              onClick={() => setFilter(category.id)}
              aria-label={`Filter by ${category.label}`}
              title={`Filter by ${category.label}`}
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
        </div>

        <div className={styles.backgroundGrid}>
          {filteredBackgrounds.length > 0 ? (
            filteredBackgrounds.map(background => (
              <div
                key={background.id}
                className={`${styles.backgroundCard} ${selectedBackground?.id === background.id ? styles.selected : ''}`}
                onClick={() => onSelect(background)}
                onMouseEnter={() => setHoveredBg(background.id)}
                onMouseLeave={() => setHoveredBg(null)}
              >
                <div className={styles.videoWrapper}>
                  <video
                    src={background.src}
                    muted
                    loop
                    onMouseEnter={e => e.target.play()}
                    onMouseLeave={e => e.target.pause()}
                  />
                  {hoveredBg === background.id && (
                    <div className={styles.videoOverlay}>
                      <button className={styles.selectButton}>
                        <span className="material-icons">check_circle</span>
                        Select
                      </button>
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