import { useEffect, useRef, useState } from 'react';
import styles from '../styles/FlashcardComponent.module.css';

// Import EditorJS tools directly
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  email: string;
}

interface EditorInstance {
  destroy: () => void;
  save: () => Promise<any>;
}

const FlashcardComponent = ({ userEmail }: { userEmail: string }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const questionEditorRef = useRef<EditorInstance | null>(null);
  const answerEditorRef = useRef<EditorInstance | null>(null);

  useEffect(() => {
    // Fetch flashcards for the logged-in user
    async function fetchFlashcards() {
      try {
        const res = await fetch(`/api/flashcards?email=${userEmail}`);
        const data = await res.json();
        setFlashcards(data);
      } catch (error) {
        console.error('Failed to fetch flashcards:', error);
      }
    }

    if (userEmail) {
      fetchFlashcards();
    }
  }, [userEmail]);

  useEffect(() => {
    // Check if running in the browser
    if (typeof window !== 'undefined') {
      // Dynamically import EditorJS only on the client-side
      import('@editorjs/editorjs').then((EditorJSModule) => {
        const EditorJS = EditorJSModule.default;

        questionEditorRef.current = new EditorJS({
          holder: 'question-editor',
          tools: { header: Header, list: List, image: ImageTool, paragraph: Paragraph },
          placeholder: 'Enter your question...',
        });

        answerEditorRef.current = new EditorJS({
          holder: 'answer-editor',
          tools: { header: Header, list: List, image: ImageTool, paragraph: Paragraph },
          placeholder: 'Enter your answer...',
        });
      });
    }

    return () => {
      // Clean up EditorJS instances
      if (questionEditorRef.current) {
        questionEditorRef.current.destroy();
      }
      if (answerEditorRef.current) {
        answerEditorRef.current.destroy();
      }
    };
  }, []);

  const addFlashcard = async () => {
    if (!questionEditorRef.current || !answerEditorRef.current) return;

    const questionData = await questionEditorRef.current.save();
    const answerData = await answerEditorRef.current.save();

    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          question: JSON.stringify(questionData),
          answer: JSON.stringify(answerData),
        }),
      });

      const newFlashcard = await res.json();
      setFlashcards([...flashcards, newFlashcard]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add flashcard:', error);
    }
  };

  return (
    <div className={styles.flashcardContainer}>
      <h1>My Flashcards</h1>
      <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
        Add New Flashcard
      </button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Create New Flashcard</h2>
            <div id="question-editor" className={styles.editor}></div>
            <div id="answer-editor" className={styles.editor}></div>
            <button onClick={addFlashcard} className={styles.saveButton}>
              Save Flashcard
            </button>
          </div>
        </div>
      )}

      <div className={styles.flashcardsList}>
        {flashcards.map((flashcard) => (
          <div key={flashcard.id} className={styles.flashcard}>
            <h3>Question:</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: JSON.parse(flashcard.question).blocks.map(
                  (block: any) => block.data.text
                ).join(''),
              }}
            />
            <h3>Answer:</h3>
            <div
              dangerouslySetInnerHTML={{
                __html: JSON.parse(flashcard.answer).blocks.map(
                  (block: any) => block.data.text
                ).join(''),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashcardComponent;
