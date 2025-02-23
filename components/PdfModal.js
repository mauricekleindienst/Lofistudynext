import React, { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import styles from '../styles/PdfModal.module.css';

export default function PdfModal({ onClose }) {
  const [viewingPdf, setViewingPdf] = useState(null);
  const [error, setError] = useState(null);

  // Initialize the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setViewingPdf({
        file: fileUrl,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      });
      setError(null);
    } else {
      setError('Please select a valid PDF file');
    }
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  // Cleanup URLs when component unmounts or PDF changes
  React.useEffect(() => {
    return () => {
      if (viewingPdf?.file) {
        URL.revokeObjectURL(viewingPdf.file);
      }
    };
  }, [viewingPdf]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {!viewingPdf ? (
          <div 
            className={styles.uploadView}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className={styles.modalHeader}>
              <h2>PDF Viewer</h2>
              <button className={styles.closeButton} onClick={onClose}>
                <span className="material-icons">close</span>
              </button>
            </div>

            <div className={styles.uploadSection}>
              <label className={styles.uploadButton}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <span className="material-icons">upload_file</span>
                Select PDF to View
              </label>
              <p className={styles.uploadInfo}>
                Select a PDF file from your device or drag and drop it here
              </p>
              {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
          </div>
        ) : (
          <div className={styles.pdfViewer}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerTitle}>
                <button 
                  className={styles.backButton}
                  onClick={() => {
                    URL.revokeObjectURL(viewingPdf.file);
                    setViewingPdf(null);
                  }}
                  title="Close (Esc)"
                >
                  <span className="material-icons">close</span>
                </button>
                <span className={styles.fileName}>{viewingPdf.name}</span>
              </div>
            </div>
            <div className={styles.documentContainer}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={viewingPdf.file}
                  plugins={[
                    defaultLayoutPluginInstance,
                    zoomPluginInstance,
                    pageNavigationPluginInstance,
                  ]}
                  defaultScale={1}
                  theme={{
                    theme: 'dark',
                  }}
                />
              </Worker>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 