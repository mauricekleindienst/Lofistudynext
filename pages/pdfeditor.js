import React, { useState, useCallback, useReducer, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaBook, FaClipboard, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import useWindowSize from '../hooks/useWindowSize';
import pdfjs from "pdfjs-dist/package.json"; // Import the entire module
// Styles
const styles = {
  container: 'min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8',
  title: 'text-4xl font-bold text-center mb-8 text-orange-500',
  content: 'flex bg-gray-800 rounded-lg shadow-lg overflow-hidden',
  sidebar: 'bg-gray-900 transition-all duration-300 ease-in-out',
  sidebarCollapsed: 'w-16',
  sidebarExpanded: 'w-64',
  tabs: 'flex flex-col',
  tabButton: 'flex items-center p-4 hover:bg-gray-800 transition-colors duration-200',
  tabIcon: 'mr-3',
  activeTab: 'bg-gray-800 text-orange-500',
  tabContent: 'p-4',
  mainContent: 'flex-1 relative',
  toggleButton: 'absolute top-1/2 -translate-y-1/2 left-0 bg-orange-500 text-white p-2 rounded-r-md',
  dropzone: 'border-2 border-dashed border-orange-500 rounded-lg p-8 text-center cursor-pointer',
  pdfViewer: 'h-full flex flex-col items-center overflow-y-auto bg-gray-800 p-4',
  pdfControls: 'flex justify-between items-center w-full p-4 bg-gray-900 mt-4',
  button: 'px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200',
  errorMessage: 'text-red-500 mt-4 text-center',
};

const initialState = {
  file: null,
  activeTab: 'upload',
  isSidebarOpen: true,
  numPages: null,
  pageNumber: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    case 'SET_NUM_PAGES':
      return { ...state, numPages: action.payload };
    case 'SET_PAGE_NUMBER':
      return { ...state, pageNumber: action.payload };
    default:
      return state;
  }
}

export default function StudyPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const [width] = useWindowSize();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const tabs = useMemo(() => [
    { id: 'upload', icon: FaUpload, label: 'Upload' },
    { id: 'pdf', icon: FaBook, label: 'PDF Viewer' },
    { id: 'cards', icon: FaClipboard, label: 'Record Cards' },
  ], []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile.type === 'application/pdf') {
        dispatch({ type: 'SET_FILE', payload: URL.createObjectURL(uploadedFile) });
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'pdf' });
        setError(null);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>PDF Study Tool</h1>
      <div className={styles.content}>
        <motion.div 
          className={`${styles.sidebar} ${state.isSidebarOpen ? styles.sidebarExpanded : styles.sidebarCollapsed}`}
          animate={{ width: state.isSidebarOpen ? '16rem' : '4rem' }}
        >
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${state.activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              >
                <tab.icon className={styles.tabIcon} />
                {state.isSidebarOpen && <span>{tab.label}</span>}
              </button>
            ))}
          </div>
          {state.isSidebarOpen && (
            <div className={styles.tabContent}>
              {state.activeTab === 'upload' && (
                <div {...getRootProps()} className={styles.dropzone}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the PDF file here ...</p>
                  ) : (
                    <p>Drag 'n' drop a PDF file here, or click to select a file</p>
                  )}
                </div>
              )}
              {state.activeTab === 'cards' && <div>Record Cards Component (To be implemented)</div>}
            </div>
          )}
        </motion.div>
        <div className={styles.mainContent}>
          <button 
            aria-label={state.isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className={styles.toggleButton}
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          >
            {state.isSidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          {state.file && (
            <div className={styles.pdfViewer}>
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={state.file} plugins={[defaultLayoutPluginInstance]} />
              </Worker>
            </div>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
