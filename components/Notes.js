import { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import styles from '../styles/Notes.module.css';

// Dynamically import EditorJS and tools with no SSR
const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
const Header = dynamic(() => import('@editorjs/header'), { ssr: false });

export default function Notes({ onMinimize }) {
  const { data: session, status } = useSession();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (session && status === 'authenticated') {
      fetchNoteFromServer();
    }
  }, [session, status]);

  useEffect(() => {
    async function initializeEditor() {
      if (typeof window !== 'undefined') {
        const EditorJSModule = (await import('@editorjs/editorjs')).default;
        const HeaderModule = (await import('@editorjs/header')).default;

        if (editorRef.current) {
          editorInstance.current = new EditorJSModule({
            holder: editorRef.current,
            tools: {
              header: HeaderModule,
            },
            data: content ? JSON.parse(content) : {},
            onChange: async () => {
              const savedData = await editorInstance.current.save();
              saveNoteToServer(savedData);
            },
          });
        }
      }
    }

    initializeEditor();

    return () => {
      if (editorInstance.current) {
        editorInstance.current.destroy();
      }
    };
  }, [content]);

  const fetchNoteFromServer = async () => {
    try {
      const response = await fetch('/api/notes');
      if (response.ok) {
        const noteContent = await response.json();
        setContent(noteContent);
      } else {
        console.error('Failed to fetch note:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  };

  const saveNoteToServer = async (savedData) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: JSON.stringify(savedData) }),
      });
      if (!response.ok) {
        console.error('Failed to save note:', await response.json());
      }
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <Draggable handle={`.${styles.header}`}>
      <ResizableBox
        width={400}
        height={300}
        minConstraints={[300, 200]}
        maxConstraints={[800, 600]}
        className={styles.resizableBox}
      >
        <div className={styles.notesContainer}>
          <div className={styles.header}>
            <h2>Notes</h2>
            <button onClick={onMinimize} className="material-icons">remove</button>
          </div>
          <div ref={editorRef} className={styles.editor}></div>
        </div>
      </ResizableBox>
    </Draggable>
  );
}
