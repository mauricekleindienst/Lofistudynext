import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import CustomCursor from "../components/CustomCursor";
import styles from "../styles/Notes.module.css";

const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });
const Header = dynamic(() => import("@editorjs/header"), { ssr: false });

export default function Notes({ onMinimize }) {
  const { data: session, status } = useSession();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchNotesFromServer();
    }
  }, [session, status, fetchNotesFromServer]);

  useEffect(() => {
    if (selectedPage) {
      setContent(selectedPage.content);
      initializeEditor(selectedPage.content).catch(error => {
        console.error("Failed to initialize editor:", error);
      });
    }
  }, [selectedPage?.id, initializeEditor]);

  const getFirstSevenWords = (blocks) => {
    let words = [];
    for (let block of blocks) {
      if (block.type === 'paragraph' || block.type === 'header') {
        words = words.concat(block.data.text.split(' '));
        if (words.length >= 7) break;
      }
    }
    return words.slice(0, 7).join(' ');
  };

  const initializeEditor = async (data) => {
    const EditorJSModule = (await import("@editorjs/editorjs")).default;
    const HeaderModule = (await import("@editorjs/header")).default;

    if (editorInstance.current) {
      try {
        await editorInstance.current.isReady;
        if (typeof editorInstance.current.destroy === 'function') {
          await editorInstance.current.destroy();
        }
      } catch (error) {
        console.warn("Error destroying previous EditorJS instance:", error);
      }
    }

    try {
      editorInstance.current = new EditorJSModule({
        holder: editorRef.current,
        tools: {
          header: HeaderModule,
        },
        data: data ? JSON.parse(data) : {},
        onChange: async () => {
          if (editorInstance.current) {
            const savedData = await editorInstance.current.save();
            const newTitle = getFirstSevenWords(savedData.blocks);
            
            // Update the local state
            setSelectedPage(prevPage => ({
              ...prevPage,
              title: newTitle,
              content: JSON.stringify(savedData)
            }));

            // Save to server
            saveNoteToServer({
              ...savedData,
              title: newTitle
            });
          }
        },
      });

      await editorInstance.current.isReady;
    } catch (error) {
      console.error("Error initializing EditorJS:", error);
    }
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
        const errorData = await response.json();
        console.error("Failed to fetch notes:", errorData);
        setError(`Failed to fetch notes: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("An unexpected error occurred while fetching notes. Please try again.");
    }
  };

  const saveNoteToServer = async (savedData) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedPage?.id,
          email: session.user.email,
          title: savedData.title,
          content: JSON.stringify(savedData),
        }),
      });
      if (response.ok) {
        const updatedNote = await response.json();
        setPages(prevPages =>
          prevPages.map(page =>
            page.id === updatedNote.id ? updatedNote : page
          )
        );
        setSelectedPage(updatedNote);
      } else {
        console.error("Failed to save note:", await response.json());
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const createNewPage = async () => {
    const newPage = {
      id: null,
      email: session.user.email,
      title: "New Page",
      content: "{}",
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPage);
    initializeEditor("{}");
  };

  const deletePage = async (pageId) => {
    if (pages[0].id === pageId) {
      alert("The first page cannot be deleted.");
      return;
    }

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: pageId, email: session.user.email }),
      });
      if (response.ok) {
        const updatedPages = pages.filter((page) => page.id !== pageId);
        setPages(updatedPages);
        setSelectedPage(updatedPages.length > 0 ? updatedPages[0] : null);
      } else {
        console.error("Failed to delete note:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting note:", error);
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
            <div className={styles.tooltip}>
              <span className="material-icons">help</span>
              <span className={styles.tooltiptext}>Jot down ideas.</span>
            </div>
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.pageList}>
              {pages.map((page, index) => (
                <div
                  key={page.id}
                  className={`${styles.pageItem} ${
                    selectedPage?.id === page.id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  {page.title}
                  {index !== 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePage(page.id);
                      }}
                      className="material-icons"
                    >
                      delete
                    </button>
                  )}
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
