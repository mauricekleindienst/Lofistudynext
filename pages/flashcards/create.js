import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/create.module.css';

export default function CreateFlashcard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, tags: tags.split(',').map(tag => tag.trim()) }),
    });
  
    if (response.ok) {
      // Redirect to flashcards overview after creation
      router.push('/flashcards');
    } else {
      console.error('Failed to create container');
    }
  };
  
  return (
    <div className={styles.container}>
      <h1>Create New Flashcard Container</h1>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className={styles.input}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.submitButton}>
          Create Container
        </button>
        <button type="button" onClick={() => router.push('/flashcards')} className={styles.cancelButton}>
          Cancel
        </button>
      </form>
    </div>
  );
}
