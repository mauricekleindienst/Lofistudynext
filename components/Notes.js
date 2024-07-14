import { useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import dynamic from 'next/dynamic';
import styles from '../styles/Notes.module.css';

// Dynamically import EditorJS and tools with no SSR
const EditorJS = dynamic(() => import('@editorjs/editorjs'), { ssr: false });
const Header = dynamic(() => import('@editorjs/header'), { ssr: false });

export default function Notes({ onMinimize }) {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);

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
          });
        }
      }
    }

    initializeEditor();

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
      }
    };
  }, []);

  return (
    <Draggable>
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
