import { useState } from 'react';
import styles from '../styles/FeedbackModal.module.css';
import { useSession } from 'next-auth/react';

export default function FeedbackModal({ isOpen, onClose }) {
  const { data: session } = useSession();
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setSubmitStatus({ type: 'error', message: 'Please enter your feedback' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user?.email || 'anonymous',
          message: feedback.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitStatus({ 
        type: 'success', 
        message: 'Thank you for your feedback! We appreciate your input.'
      });
      setFeedback('');
      
      // Close the modal after successful submission and a short delay
      setTimeout(() => {
        onClose();
        setSubmitStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
        
        <h2 className={styles.modalTitle}>Share Your Feedback</h2>
        <p className={styles.modalDescription}>
          We'd love to hear your thoughts on how we can improve Lo-fi.study. Your feedback helps us create a better study experience for everyone.
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.feedbackTextarea}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback, suggestions, or ideas..."
            rows={6}
            disabled={isSubmitting}
          />
          
          {submitStatus.message && (
            <div className={`${styles.statusMessage} ${styles[submitStatus.type]}`}>
              {submitStatus.message}
            </div>
          )}
          
          <div className={styles.formFooter}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 