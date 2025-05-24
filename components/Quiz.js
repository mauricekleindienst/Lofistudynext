import React, { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import Draggable from "react-draggable";
import styles from "../styles/Quiz.module.css";

const colorOptions = [
  "#ff7b00",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ff00ff",
  "#ffff00",
];

const RATINGS = [
  { value: 1, label: "Again", color: "#ff0000", icon: "sentiment_very_dissatisfied" },
  { value: 2, label: "Hard", color: "#ff7b00", icon: "sentiment_dissatisfied" },
  { value: 3, label: "Good", color: "#ffff00", icon: "sentiment_neutral" },
  { value: 4, label: "Easy", color: "#00ff00", icon: "sentiment_satisfied" },
  { value: 5, label: "Perfect", color: "#00ffff", icon: "sentiment_very_satisfied" },
];

export default function Quiz({ onMinimize }) {
  const { user, loading: authLoading } = useAuth();
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    question: "",
    answer: "",
    color: "#ff7b00",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch flashcards on component mount
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setLoading(false);
      setError("Please sign in to use flashcards");
      return;
    }

    fetchFlashcards();
  }, [user, authLoading]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/flashcards", {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch flashcards');
      }
      
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
      setError(error.message || "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!newCard.question || !newCard.answer) return;

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          ...newCard,
          email: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add flashcard');
      }

      const addedCard = await response.json();
      setFlashcards([...flashcards, addedCard]);
      setNewCard({
        question: "",
        answer: "",
        color: "#ff7b00",
        imageUrl: "",
      });
      setShowAddCard(false);
      setError(null);
    } catch (error) {
      console.error("Failed to add flashcard:", error);
      setError(error.message || "Failed to add flashcard");
    }
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => 
      prev === flashcards.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prev) => 
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
  };

  const handleMarkComplete = async () => {
    if (!user || !flashcards.length) return;
    
    const currentCard = flashcards[currentCardIndex];
    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: 'same-origin',
        body: JSON.stringify({ completed: !currentCard.completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update flashcard');
      }

      setFlashcards(flashcards.map(card => 
        card.id === currentCard.id 
          ? { ...card, completed: !card.completed }
          : card
      ));
    } catch (error) {
      console.error("Failed to update flashcard:", error);
      setError(error.message || "Failed to update flashcard");
    }
  };

  const handleRateCard = async (rating) => {
    if (!user || !flashcards.length) return;
    
    const currentCard = flashcards[currentCardIndex];
    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: 'same-origin',
        body: JSON.stringify({ 
          rating,
          lastReviewed: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update flashcard');
      }

      setFlashcards(flashcards.map(card => 
        card.id === currentCard.id 
          ? { ...card, rating }
          : card
      ));
      
      // Move to next card after rating
      handleNextCard();
    } catch (error) {
      console.error("Failed to update flashcard:", error);
      setError(error.message || "Failed to update flashcard");
    }
  };

  const handleKeyDown = useCallback((e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', user.email);

      const response = await fetch('/api/flashcards/upload', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload Anki file');
      }

      const newCards = await response.json();
      setFlashcards(prev => [...prev, ...newCards]);
      setError(null);
      event.target.value = ''; // Reset file input
    } catch (error) {
      console.error("Failed to upload Anki file:", error);
      setError(error.message || "Failed to upload Anki file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!user || !flashcards.length) return;
    
    const currentCard = flashcards[currentCardIndex];
    try {
      const response = await fetch(`/api/flashcards/${currentCard.id}`, {
        method: "DELETE",
        credentials: 'same-origin',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete flashcard');
      }

      // Remove the card from the state and adjust the current index
      setFlashcards(prev => prev.filter(card => card.id !== currentCard.id));
      if (currentCardIndex >= flashcards.length - 1) {
        setCurrentCardIndex(Math.max(0, flashcards.length - 2));
      }
    } catch (error) {
      console.error("Failed to delete flashcard:", error);
      setError(error.message || "Failed to delete flashcard");
    }
  };

  if (status === "loading") {
    return (
      <Draggable handle=".drag-handle">
        <div className={styles.quizContainer}>
          <div className={`${styles.dragHandle} drag-handle`} aria-hidden="true"></div>
          <div className={styles.header}>
            <h2>Flashcards</h2>
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
          <div className={styles.loading}>Loading...</div>
        </div>
      </Draggable>
    );
  }

  if (!user) {
    return (
      <Draggable handle=".drag-handle">
        <div className={styles.quizContainer}>
          <div className={`${styles.dragHandle} drag-handle`} aria-hidden="true"></div>
          <div className={styles.header}>
            <h2>Flashcards</h2>
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
          <div className={styles.authPrompt}>
            <p>Please sign in to use flashcards</p>
            <button 
              className={styles.signInButton}
              onClick={() => signIn()}
            >
              Sign In
            </button>
          </div>
        </div>
      </Draggable>
    );
  }

  if (error) {
    return (
      <Draggable handle=".drag-handle">
        <div className={styles.quizContainer}>
          <div className={`${styles.dragHandle} drag-handle`} aria-hidden="true"></div>
          <div className={styles.header}>
            <h2>Flashcards</h2>
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
          <div className={styles.error}>
            <p>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={fetchFlashcards}
            >
              Retry
            </button>
          </div>
        </div>
      </Draggable>
    );
  }

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.quizContainer} role="region" aria-label="Quiz">
        <div className={`${styles.dragHandle} drag-handle`} aria-hidden="true"></div>
        <div className={styles.header}>
          <h2>Flashcards</h2>
          <div className={styles.headerButtons}>
            <input
              type="file"
              accept=".apkg,.txt"
              onChange={handleFileUpload}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`${styles.uploadButton} material-icons`}
              disabled={isUploading}
              title="Upload Anki deck"
            >
              upload_file
            </button>
            <button onClick={onMinimize} className="material-icons">
              remove
            </button>
          </div>
        </div>

        {flashcards.length > 0 ? (
          <div className={styles.cardContainer}>
            <div 
              className={styles.flashcard} 
              style={{ backgroundColor: flashcards[currentCardIndex].color }}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <button 
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card flip
                  if (window.confirm('Are you sure you want to delete this flashcard?')) {
                    handleDeleteCard();
                  }
                }}
                aria-label="Delete flashcard"
              >
                <span className="material-icons">delete</span>
              </button>

              {showAnswer ? (
                <>
                  <div className={styles.answer}>
                    {flashcards[currentCardIndex].answer}
                  </div>
                  <div className={styles.ratingContainer}>
                    <p className={styles.ratingPrompt}>How well did you know this?</p>
                    <div className={styles.ratingButtons}>
                      {RATINGS.map((rating) => (
                        <button
                          key={rating.value}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card from flipping back
                            handleRateCard(rating.value);
                          }}
                          className={styles.ratingButton}
                          style={{ 
                            '--rating-color': rating.color,
                          }}
                          title={rating.label}
                        >
                          <span className="material-icons">{rating.icon}</span>
                          <span className={styles.ratingLabel}>{rating.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.question}>
                  {flashcards[currentCardIndex].question}
                </div>
              )}
              {flashcards[currentCardIndex].imageUrl && (
                <img 
                  src={flashcards[currentCardIndex].imageUrl} 
                  alt="Flashcard illustration" 
                  className={styles.cardImage}
                />
              )}
            </div>

            <div className={styles.controls}>
              <button onClick={handlePrevCard} className={styles.navButton}>
                <span className="material-icons">arrow_back</span>
              </button>
              <button 
                onClick={() => setShowAnswer(!showAnswer)} 
                className={styles.flipButton}
              >
                <span className="material-icons">flip</span>
              </button>
              <button onClick={handleNextCard} className={styles.navButton}>
                <span className="material-icons">arrow_forward</span>
              </button>
            </div>

            <div className={styles.progress}>
              {currentCardIndex + 1} / {flashcards.length}
            </div>

            <button 
              onClick={handleMarkComplete}
              className={`${styles.completeButton} ${
                flashcards[currentCardIndex].completed ? styles.completed : ""
              }`}
            >
              <span className="material-icons">
                {flashcards[currentCardIndex].completed ? "check_circle" : "radio_button_unchecked"}
              </span>
            </button>
          </div>
        ) : (
          <div className={styles.emptyState}>
            No flashcards yet. Add some to get started!
          </div>
        )}

        <button 
          onClick={() => setShowAddCard(true)} 
          className={styles.addButton}
        >
          <span className="material-icons">add</span>
        </button>

        {showAddCard && (
          <div className={styles.modal}>
            <div className={styles.addCardForm}>
              <div className={styles.formHeader}>
                <h3>Add New Flashcard</h3>
                <button 
                  onClick={() => setShowAddCard(false)}
                  className={`${styles.closeButton} material-icons`}
                >
                  close
                </button>
              </div>
              
              <form onSubmit={handleAddCard}>
                <div className={styles.inputGroup}>
                  <label htmlFor="question">Question:</label>
                  <textarea
                    id="question"
                    value={newCard.question}
                    onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                    required
                    placeholder="Enter your question here..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="answer">Answer:</label>
                  <textarea
                    id="answer"
                    value={newCard.answer}
                    onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                    required
                    placeholder="Enter the answer here..."
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="imageUrl">Image URL (optional):</label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={newCard.imageUrl}
                    onChange={(e) => setNewCard({ ...newCard, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className={styles.colorPicker}>
                  <label>Card Color:</label>
                  <div className={styles.colors}>
                    {colorOptions.map((color) => (
                      <div
                        key={color}
                        className={`${styles.colorOption} ${
                          newCard.color === color ? styles.selected : ""
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewCard({ ...newCard, color: color })}
                      />
                    ))}
                  </div>
                </div>

                <div className={styles.formButtons}>
                  <button type="submit" className={styles.submitButton}>
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
} 