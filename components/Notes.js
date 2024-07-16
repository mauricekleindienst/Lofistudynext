import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import styles from '../styles/Notes.module.css';

const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
const Header = dynamic(() => import('@editorjs/header'), { ssr: false });

export default function Notes({ onMinimize }) {
  const { data: session, status } = useSession();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (session && status === 'authenticated') {
      fetchNotesFromServer();
    }
  }, [session, status]);

  useEffect(() => {
    if (selectedPage) {
      setContent(selectedPage.content);
      initializeEditor(selectedPage.content);
    }
  }, [selectedPage]);

  const initializeEditor = async (data) => {
    const EditorJSModule = (await import('@editorjs/editorjs')).default;
    const HeaderModule = (await import('@editorjs/header')).default;

    if (editorInstance.current) {
      await editorInstance.current.isReady;
      editorInstance.current.destroy();
    }

    editorInstance.current = new EditorJSModule({
      holder: editorRef.current,
      tools: {
        header: HeaderModule,
      },
      data: data ? JSON.parse(data) : {},
      onChange: async () => {
        const savedData = await editorInstance.current.save();
        saveNoteToServer(savedData);
      },
    });
  };

  const fetchNotesFromServer = async () => {
    try {
      const response = await fetch(`/api/notes?email=${session.user.email}`);
      if (response.ok) {
        const notes = await response.json();
        setPages(notes);
        if (notes.length > 0) {
          setSelectedPage(notes[0]);
        }
      } else {
        console.error('Failed to fetch notes:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNoteToServer = async (savedData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedPage?.id,
          email: session.user.email,
          title: selectedPage?.title,
          content: JSON.stringify(savedData),
        }),
      });
      if (!response.ok) {
        console.error('Failed to save note:', await response.json());
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const createNewPage = async () => {
    const newPage = {
      id: null,
      email: session.user.email,
      title: 'New Page',
      content: '{}',
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
    initializeEditor('{}');
  };

  const deletePage = async (pageId) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pageId, email: session.user.email }),
      });
      if (response.ok) {
        const updatedPages = pages.filter((page) => page.id !== pageId);
        setPages(updatedPages);
        setSelectedPage(updatedPages.length > 0 ? updatedPages[0] : null);
      } else {
        console.error('Failed to delete note:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <Draggable handle={`.${styles.header}`}>
      <ResizableBox
        width={800}
        height={600}
        minConstraints={[400, 300]}
        maxConstraints={[1000, 800]}
        className={styles.resizableBox}
      >
        <div className={styles.notesContainer}>
          <div className={styles.header}>
            <h2>Notes</h2>
            <button onClick={onMinimize} className="material-icons">remove</button>
          </div>
          <div className={styles.content}>
            <div className={styles.pageList}>
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`${styles.pageItem} ${
                    selectedPage?.id === page.id ? styles.active : ''
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  {page.title}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                    className="material-icons"
                  >
                    delete
                  </button>
                </div>
              ))}
              <button onClick={createNewPage} className={styles.addPageButton}>
                + Add Page
              </button>
            </div>
            <div ref={editorRef} className={styles.editor}></div>
          </div>
        </div>
      </ResizableBox>
    </Draggable>
  );
}
