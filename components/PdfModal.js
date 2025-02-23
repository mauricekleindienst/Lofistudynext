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

export default function PdfModal({ onClose, savedPdfs = [], onPdfsChange }) {
  const [error, setError] = useState(null);
  const [fullViewPdf, setFullViewPdf] = useState(null);

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
      onPdfsChange([...savedPdfs, {
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
    const newPdfs = [...savedPdfs];
    URL.revokeObjectURL(newPdfs[index].file);
    newPdfs.splice(index, 1);
    onPdfsChange(newPdfs);
    if (fullViewPdf?.index === index) {
      setFullViewPdf(null);
    }
  };

  const handlePdfClick = (pdf, index) => {
    setFullViewPdf({ ...pdf, index });
  };

  const exitFullView = () => {
    setFullViewPdf(null);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>PDF Viewer</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {!fullViewPdf ? (
          <>
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
                  {savedPdfs.length === 0 ? 'Select PDF to View' : 'Open Another PDF'}
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
              {savedPdfs.map((pdf, index) => (
                <div 
                  key={pdf.file} 
                  className={styles.pdfViewer} 
                  onClick={() => handlePdfClick(pdf, index)}
                >
                  <div className={styles.viewerHeader}>
                    <div className={styles.viewerTitle}>
                      <button 
                        className={styles.backButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClosePdf(index);
                        }}
                        title="Close PDF"
                      >
                        <span className="material-icons">close</span>
                      </button>
                      <span className={styles.fileName}>{pdf.name}</span>
                    </div>
                    <button 
                      className={styles.expandButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePdfClick(pdf, index);
                      }}
                      title="Expand PDF"
                    >
                      <span className="material-icons">fullscreen</span>
                    </button>
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
          </>
        ) : (
          <div className={styles.fullView}>
            <div className={styles.viewerHeader}>
              <div className={styles.viewerTitle}>
                <button 
                  className={styles.backButton}
                  onClick={exitFullView}
                  title="Exit Full View"
                >
                  <span className="material-icons">arrow_back</span>
                </button>
                <span className={styles.fileName}>{fullViewPdf.name}</span>
              </div>
              <button 
                className={styles.backButton}
                onClick={() => handleClosePdf(fullViewPdf.index)}
                title="Close PDF"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            <div className={styles.fullViewContainer}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={fullViewPdf.file}
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