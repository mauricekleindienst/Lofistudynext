import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import debounce from "lodash/debounce";

import styles from "../styles/Notes.module.css";

const EditorJS = dynamic(() => import("@editorjs/editorjs"), { ssr: false });
const Header = dynamic(() => import("@editorjs/header"), { ssr: false });

export default function Notes({ onMinimize }) {
  const { data: session, status } = useSession();
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchNotesFromServer();
    }
  }, [session, status]);

  useEffect(() => {
    if (selectedPage) {
      initializeEditor(selectedPage.content).catch((error) => {
        console.error("Failed to initialize editor:", error);
      });
    }
  }, [selectedPage?.id]);

  const getFirstSixLetters = (blocks) => {
    let text = '';
    for (let block of blocks) {
      if (block.type === "paragraph" || block.type === "header") {
        text += block.data.text;
        if (text.length >= 6) break;
      }
    }
    return text.slice(0, 6);
  };

  const initializeEditor = async (data) => {
    const EditorJSModule = (await import("@editorjs/editorjs")).default;
    const HeaderModule = (await import("@editorjs/header")).default;

    if (editorInstance.current) {
      try {
        await editorInstance.current.isReady;
        if (typeof editorInstance.current.destroy === "function") {
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
            const newTitle = getFirstSixLetters(savedData.blocks);

            setSelectedPage((prevPage) => {
              const updatedPage = {
                ...prevPage,
                title: newTitle,
                content: JSON.stringify(savedData),
              };

              setPages((prevPages) =>
                prevPages.map((page) =>
                  page.id === updatedPage.id ? updatedPage : page
                )
              );

              debouncedSaveToServer(updatedPage);

              return updatedPage;
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
        setError(
          `Failed to fetch notes: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError(
        "An unexpected error occurred while fetching notes. Please try again."
      );
    }
  };

  const saveNoteToServer = async (page) => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: page.id,
          email: session.user.email,
          title: page.title,
          content: page.content,
        }),
      });
      if (!response.ok) {
        console.error("Failed to save note:", await response.json());
      } else {
        const updatedPage = await response.json();
        setPages((prevPages) =>
          prevPages.map((p) => (p.id === page.id ? updatedPage : p))
        );
        setSelectedPage(updatedPage);
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const debouncedSaveToServer = debounce(saveNoteToServer, 500);

  const createNewPage = async () => {
    const tempId = `temp_${Math.random().toString(36).substr(2, 9)}`;
    const newPage = {
      id: tempId,
      email: session.user.email,
      title: "New Page",
      content: JSON.stringify({ blocks: [] }),
    };

    setPages((prevPages) => [...prevPages, newPage]);
    setSelectedPage(newPage);

    initializeEditor(newPage.content);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPage),
      });
      if (response.ok) {
        const savedPage = await response.json();
        setPages((prevPages) =>
          prevPages.map((p) => (p.id === tempId ? savedPage : p))
        );
        setSelectedPage(savedPage);
      } else {
        console.error("Failed to save new page:", await response.json());
      }
    } catch (error) {
      console.error("Error saving new page:", error);
    }
  };

  const deletePage = async (pageId) => {
    if (pages.length === 1) {
      alert("The only remaining page cannot be deleted.");
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
              {pages.map((page) => (
                <div
                  key={page.id || Math.random()}
                  className={`${styles.pageItem} ${
                    selectedPage?.id === page.id ? styles.active : ""
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  {page.title}
                  {pages.length > 1 && (
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
