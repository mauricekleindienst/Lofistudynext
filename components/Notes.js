import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import debounce from "lodash/debounce";
import { toast } from "react-toastify";

import styles from "../styles/Notes.module.css";

// Dynamically import EditorJS and its tools to prevent SSR issues
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
        throw new Error('Failed to fetch notes');
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Failed to fetch notes. Please try again.");
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
        throw new Error('Failed to save note');
      }
      const updatedPage = await response.json();
      setPages((prevPages) =>
        prevPages.map((p) => (p.id === updatedPage.id ? updatedPage : p))
      );
      setSelectedPage(updatedPage);
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    }
  };

  const debouncedSaveToServer = debounce(saveNoteToServer, 500);

  const createNewPage = async () => {
    const newPage = {
      email: session.user.email,
      title: "New Page",
      content: JSON.stringify({ blocks: [] }),
    };

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPage),
      });
      if (!response.ok) {
        throw new Error('Failed to create new page');
      }
      const savedPage = await response.json();
      setPages((prevPages) => [...prevPages, savedPage]);
      setSelectedPage(savedPage);
      toast.success("New page created successfully");
    } catch (error) {
      console.error("Error creating new page:", error);
      toast.error("Failed to create new page. Please try again.");
    }
  };

  const deletePage = async (pageId) => {
    if (pages.length === 1) {
      toast.warn("The only remaining page cannot be deleted.");
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
      if (!response.ok) {
        throw new Error('Failed to delete note');
      }
      const updatedPages = pages.filter((page) => page.id !== pageId);
      setPages(updatedPages);
      setSelectedPage(updatedPages.length > 0 ? updatedPages[0] : null);
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note. Please try again.");
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
           
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
          <div className={styles.content}>
            <div className={styles.pageList}>
              {pages.map((page) => (
                <div
                  key={page.id}
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
