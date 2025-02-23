import React, { useState } from 'react';
import styles from '../styles/BackgroundModal.module.css';

export default function BackgroundModal({ backgrounds, onSelect, selectedBackground, onClose }) {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'nature', label: 'Nature' },
    { id: 'urban', label: 'Urban' },
    { id: 'cozy', label: 'Cozy' },
    { id: 'gaming', label: 'Gaming' }
  ];

  const getBackgroundCategory = (note) => {
    if (note.toLowerCase().includes('rain') || note.toLowerCase().includes('autumn') || note.toLowerCase().includes('garden')|| note.toLowerCase().includes('island')) return 'nature';
    if (note.toLowerCase().includes('train') || note.toLowerCase().includes('night') || note.toLowerCase().includes('city')) return 'urban';
    if (note.toLowerCase().includes('couch') || note.toLowerCase().includes('room') || note.toLowerCase().includes('coffee')) return 'cozy';
    if (note.toLowerCase().includes('minecraft') || note.toLowerCase().includes('skyrim')) return 'gaming';
    return 'all';
  };

  const filteredBackgrounds = backgrounds.filter(bg => {
    const matchesCategory = filter === 'all' || getBackgroundCategory(bg.note) === filter;
    const matchesSearch = bg.note.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Select Background</h2>
          <button className={styles.closeButton} onClick={onClose}>
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
          />
        </div>

        <div className={styles.categories}>
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${filter === category.id ? styles.active : ''}`}
              onClick={() => setFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={styles.backgroundGrid}>
          {filteredBackgrounds.map(background => (
            <div
              key={background.id}
              className={`${styles.backgroundCard} ${selectedBackground?.id === background.id ? styles.selected : ''}`}
              onClick={() => onSelect(background)}
            >
              <div className={styles.videoWrapper}>
                <video
                  src={background.src}
                  muted
                  loop
                  onMouseEnter={e => e.target.play()}
                  onMouseLeave={e => e.target.pause()}
                />
              </div>
              <div className={styles.backgroundInfo}>
                <h3>{background.note}</h3>
                <p>by {background.createdby}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 