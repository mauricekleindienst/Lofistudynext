import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createClient } from '../utils/supabase/client';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import styles from '../styles/Notes.module.css';

export default function Notes({ onMinimize }) {
  const { user, session } = useAuth();
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  useEffect(() => {
    if (user?.email && session?.access_token) {
      fetchNotes();
    }
  }, [user, session]);  const fetchNotes = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if we have a session
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/notes', { 
        headers,
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch notes');
      }

      const data = await response.json();
      setNotes(data);
      setLoading(false);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching notes:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to load notes: ' + err.message);
      }
      
      setLoading(false);
    }
  };  const saveNote = async () => {
    if (!currentNote.title || !currentNote.content) return;
    
    setIsSaving(true);
    try {
      const method = currentNote.id ? 'PUT' : 'POST';
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if we have a session
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/notes', {
        method,
        headers,
        body: JSON.stringify(currentNote),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save note');
      }
      
      const savedNote = await response.json();
      
      if (currentNote.id) {
        setNotes(notes.map(note => 
          note.id === savedNote.id ? savedNote : note
        ));
      } else {
        setNotes([...notes, savedNote]);
      }
      
      setCurrentNote({ id: null, title: '', content: '' });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error saving note:', err);
      
      if (err.name === 'AbortError') {
        setError('Save timed out. Please check your connection and try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Failed to save note: ' + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };
  const deleteNote = async (id) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if we have a session
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      setNotes(notes.filter(note => note.id !== id));
      if (currentNote.id === id) {
        setCurrentNote({ id: null, title: '', content: '' });
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Failed to delete note');
    }
  };

  const handleNoteSelect = (note) => {
    setCurrentNote(note);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveNote();
    }
  };
  if (!user) {
    return (
      <Draggable handle=".drag-handle">
        <div className={styles.notesContainer}>
          <div className={`${styles.dragHandle} drag-handle`}></div>
          <div className={styles.header}>
            <h2>Notes</h2>
            <button onClick={onMinimize} className={styles.closeButton}>
              <span className="material-icons">remove</span>
            </button>
          </div>
          <div className={styles.authPrompt}>
            <p>Please sign in to use Notes</p>
          </div>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.notesContainer} onKeyDown={handleKeyDown}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Notes</h2>
          <div className={styles.headerButtons}>
            <motion.button
              className={styles.saveButton}
              onClick={saveNote}
              disabled={isSaving || !currentNote.title || !currentNote.content}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-icons">
                {isSaving ? 'sync' : 'save'}
              </span>
            </motion.button>
            <button onClick={onMinimize} className={styles.closeButton}>
              <span className="material-icons">remove</span>
            </button>
          </div>
        </div>

        <div className={styles.notesContent}>
          <div className={styles.notesList}>
            <motion.button
              className={styles.newNoteButton}
              onClick={() => setCurrentNote({ id: null, title: '', content: '' })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="material-icons">add</span>
              New Note
            </motion.button>

            {notes.map(note => (
              <motion.div
                key={note.id}
                className={`${styles.noteItem} ${currentNote.id === note.id ? styles.active : ''}`}
                onClick={() => handleNoteSelect(note)}
                whileHover={{ x: 5 }}
              >
                <div className={styles.noteInfo}>
                  <h3>{note.title}</h3>
                  <p>{note.content.substring(0, 50)}...</p>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                >
                  <span className="material-icons">delete</span>
                </button>
              </motion.div>
            ))}
          </div>

          <div className={styles.editor}>
            <input
              type="text"
              placeholder="Note title"
              value={currentNote.title}
              onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
              className={styles.titleInput}
            />
            <textarea
              placeholder="Start typing your note..."
              value={currentNote.content}
              onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
              className={styles.contentInput}
            />
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
      </div>
    </Draggable>
  );
}
