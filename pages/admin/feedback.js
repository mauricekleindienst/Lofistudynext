import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import styles from '../../styles/AdminFeedback.module.css';
import Head from 'next/head';

export default function AdminFeedback() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Admins list - in a real app, this would be stored in your database or environment variables
  const admins = useMemo(() => ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'], []);
  
  useEffect(() => {
    // Check if user is authenticated and an admin
    if (!authLoading) {
      if (!user) {
        router.push('/auth/signin');
      } else if (!admins.includes(user.email)) {
        router.push('/app');
      } else {
        fetchFeedback();
      }
    }
  }, [user, authLoading, router, currentPage, filter, admins, fetchFeedback]);
  
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/feedback?page=${currentPage}&limit=10`;
      if (filter !== 'all') {
        url += `&status=${filter}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      setFeedback(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handleViewDetails = (item) => {
    setSelectedFeedback(item);
    setResponseText(item.response || '');
    setIsModalOpen(true);
  };
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      // Update local state
      setFeedback(feedback.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ));
      
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback({ ...selectedFeedback, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };
  
  const handleSubmitResponse = async () => {
    if (!selectedFeedback) return;
    
    try {
      const response = await fetch(`/api/feedback/${selectedFeedback.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          response: responseText,
          status: 'responded'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit response');
      }
      
      // Update local state
      const updatedFeedback = { 
        ...selectedFeedback, 
        response: responseText,
        status: 'responded'
      };
      
      setFeedback(feedback.map(item => 
        item.id === selectedFeedback.id ? updatedFeedback : item
      ));
      
      setSelectedFeedback(updatedFeedback);
      alert('Response submitted successfully!');
      
    } catch (err) {
      console.error('Error submitting response:', err);
      alert('Failed to submit response. Please try again.');
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feedback?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete feedback');
      }
      
      // Update local state
      setFeedback(feedback.filter(item => item.id !== id));
      
      if (selectedFeedback && selectedFeedback.id === id) {
        setIsModalOpen(false);
        setSelectedFeedback(null);
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      alert('Failed to delete feedback. Please try again.');
    }
  };
  
  if (authLoading || loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }
  
  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }
  
  return (
    <>
      <Head>
        <title>Admin - Feedback Management | Lo-fi.study</title>
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Feedback Management</h1>
          <div className={styles.headerActions}>
            <select
              className={styles.filterSelect}
              value={filter}
              onChange={handleFilterChange}
            >
              <option value="all">All Feedback</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="responded">Responded</option>
            </select>
            <button 
              className={styles.backButton}
              onClick={() => router.push('/app')}
            >
              Back to App
            </button>
          </div>
        </header>
        
        {feedback.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No feedback found with the current filter.</p>
          </div>
        ) : (
          <>
            <table className={styles.feedbackTable}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map(item => (
                  <tr key={item.id} className={styles.feedbackRow}>
                    <td className={styles.emailCell}>{item.email}</td>
                    <td className={styles.messageCell}>
                      {item.message.length > 100 
                        ? `${item.message.substring(0, 100)}...` 
                        : item.message}
                    </td>
                    <td className={styles.dateCell}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className={styles.statusCell}>
                      <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className={styles.actionsCell}>
                      <button 
                        onClick={() => handleViewDetails(item)}
                        className={styles.actionButton}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleStatusChange(item.id, 'reviewed')}
                        className={`${styles.actionButton} ${item.status === 'reviewed' ? styles.active : ''}`}
                        disabled={item.status === 'reviewed'}
                      >
                        Mark Reviewed
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className={styles.pagination}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={styles.paginationButton}
              >
                Previous
              </button>
              <span className={styles.pageInfo}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={styles.paginationButton}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Feedback Details Modal */}
      {isModalOpen && selectedFeedback && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Feedback Details</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={styles.closeButton}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.feedbackDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>From:</span>
                  <span className={styles.detailValue}>{selectedFeedback.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date:</span>
                  <span className={styles.detailValue}>
                    {new Date(selectedFeedback.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status:</span>
                  <span className={`${styles.statusBadge} ${styles[selectedFeedback.status]}`}>
                    {selectedFeedback.status}
                  </span>
                </div>
                <div className={styles.messageBox}>
                  <h3>Message:</h3>
                  <p>{selectedFeedback.message}</p>
                </div>
                
                <div className={styles.responseBox}>
                  <h3>Response:</h3>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response to this feedback..."
                    className={styles.responseTextarea}
                    rows={5}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <div className={styles.statusButtons}>
                <button 
                  onClick={() => handleStatusChange(selectedFeedback.id, 'pending')}
                  className={`${styles.statusButton} ${selectedFeedback.status === 'pending' ? styles.active : ''}`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedFeedback.id, 'reviewed')}
                  className={`${styles.statusButton} ${selectedFeedback.status === 'reviewed' ? styles.active : ''}`}
                >
                  Reviewed
                </button>
                <button 
                  onClick={() => handleStatusChange(selectedFeedback.id, 'responded')}
                  className={`${styles.statusButton} ${selectedFeedback.status === 'responded' ? styles.active : ''}`}
                >
                  Responded
                </button>
              </div>
              <div className={styles.actionButtons}>
                <button 
                  onClick={() => handleDelete(selectedFeedback.id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
                <button 
                  onClick={handleSubmitResponse}
                  className={styles.submitButton}
                  disabled={!responseText.trim()}
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 