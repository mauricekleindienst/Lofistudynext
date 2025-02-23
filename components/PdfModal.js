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
  const [pdfs, setPdfs] = useState([]);
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
      setPdfs(prev => [...prev, {
        file: fileUrl,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      }]);
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

  const handleClosePdf = (index) => {
    setPdfs(prev => {
      const newPdfs = [...prev];
      URL.revokeObjectURL(newPdfs[index].file);
      newPdfs.splice(index, 1);
      return newPdfs;
    });
  };

  // Cleanup URLs when component unmounts
  React.useEffect(() => {
    return () => {
      pdfs.forEach(pdf => {
        if (pdf.file) {
          URL.revokeObjectURL(pdf.file);
        }
      });
    };
  }, []);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>PDF Viewer</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className={styles.uploadSection}>
          <div 
            className={styles.uploadView}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label className={styles.uploadButton}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <span className="material-icons">upload_file</span>
              {pdfs.length === 0 ? 'Select PDF to View' : 'Open Another PDF'}
            </label>
            <p className={styles.uploadInfo}>
              Select a PDF file from your device or drag and drop it here
            </p>
            <p className={styles.privacyInfo}>
              <span className="material-icons">lock</span>
              Your PDF stays on your device - we never upload or store it on our servers
            </p>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </div>

        <div className={styles.pdfGrid}>
          {pdfs.map((pdf, index) => (
            <div key={pdf.file} className={styles.pdfViewer}>
              <div className={styles.viewerHeader}>
                <div className={styles.viewerTitle}>
                  <button 
                    className={styles.backButton}
                    onClick={() => handleClosePdf(index)}
                    title="Close PDF"
                  >
                    <span className="material-icons">close</span>
                  </button>
                  <span className={styles.fileName}>{pdf.name}</span>
                </div>
              </div>
              <div className={styles.documentContainer}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={pdf.file}
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
          ))}
        </div>
      </div>
    </div>
  );
} 