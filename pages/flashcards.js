import { useSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { useRouter } from "next/router";
import styles from "../styles/flashcards.module.css";
import { useState, useEffect } from 'react';
export async function getServerSideProps(context) {
  const { data: session, status } = useSession();
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  try {
    const containers = await prisma.flashcardContainer.findMany({
      where: {
        user_email: session.user.email,
      },
    });

    return {
      props: { containers },
    };
  } catch (error) {
    console.error('Error fetching flashcard containers:', error);
    return {
      props: { containers: [] },
    };
  }
}
if (status === "unauthenticated") {
  if (typeof window !== "undefined") {
    window.location.href = "/auth/signin";
  }
}
export default function Flashcards({ containers }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContainers, setFilteredContainers] = useState(containers);
  const [favorites, setFavorites] = useState([]);
  const [sortOrder, setSortOrder] = useState('date'); // 'date', 'alphabetical', 'tags'
  const router = useRouter();

  useEffect(() => {
    filterAndSortContainers();
  }, [searchTerm, sortOrder, containers]);

  const filterAndSortContainers = () => {
    let filtered = containers.filter(container =>
      container.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      container.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOrder === 'alphabetical') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'tags') {
      filtered = filtered.sort((a, b) => (a.tags[0] || '').localeCompare(b.tags[0] || ''));
    } else {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredContainers(filtered);
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleCreateContainer = () => {
    router.push('/flashcards/create'); // Redirect to a separate create page
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.title} ${styles.titleShadow}`}>
       Your Lo-Fi.Study Flashcards
      </div>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search containers..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.filters}>
          <button onClick={() => setSortOrder('date')} className={styles.filterButton}>
            Sort by Date
          </button>
          <button onClick={() => setSortOrder('alphabetical')} className={styles.filterButton}>
            Sort Alphabetically
          </button>
          <button onClick={() => setSortOrder('tags')} className={styles.filterButton}>
            Sort by Tags
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        <div className={styles.card} onClick={handleCreateContainer}>
          <span className="material-icons">add</span>
          <p>Create Flashcard-Set</p>
        </div>
        {filteredContainers.map(container => (
          <div
            key={container.id}
            className={`${styles.card} ${favorites.includes(container.id) ? styles.favorite : ''}`}
          >
            <div className={styles.cardTitle}>
              {container.title}
              <span className={styles.favoriteIcon} onClick={() => toggleFavorite(container.id)}>
                {favorites.includes(container.id) ? '★' : '☆'}
              </span>
            </div>
            <div className={styles.cardDescription}>{container.description}</div>
            <div className={styles.cardMeta}>
              <span className={styles.lastReviewed}>Last reviewed: {container.lastReviewed}</span>
              <span className={styles.progress}>
                Progress: {container.progress}%
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${container.progress}%` }}
                  ></div>
                </div>
              </span>
            </div>
            <div className={styles.cardTags}>
              {container.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <div className={styles.quickActions}>
              <button className={styles.actionButton}>Edit</button>
              <button className={styles.actionButton}>Delete</button>
              <button className={styles.actionButton}>Share</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
