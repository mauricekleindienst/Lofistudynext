import { signOut } from 'next-auth/react';
import styles from '../styles/CustomHeader.module.css';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import MovableModal from './MovableModal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { toolbarPlugin, zoomPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '../styles/react-pdf-viewer-overrides.css';
import { version as pdfjsVersion } from 'pdfjs-dist/package.json';

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const router = useRouter();

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen((prev) => !prev);
  }, [isFullscreen]);

  const shareVideoRoom = useCallback(async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      if (data.url) {
        // Construct the full URL
        const fullUrl = `${window.location.origin}/study?roomUrl=${encodeURIComponent(data.url)}`;
        
        // Copy the full URL to clipboard
        await navigator.clipboard.writeText(fullUrl);
        
        // Show toast notification
        setToast({ show: true, message: 'Room created! Link copied to clipboard.' });
        
        // Hide toast after 3 seconds
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
  
        // Navigate to the study room
        router.push({
          pathname: '/study',
          query: { roomUrl: data.url },
        });
      } else {
        console.error('Error creating video room:', data.error);
        setToast({ show: true, message: 'Error creating room. Please try again.' });
      }
    } catch (error) {
      console.error('Error creating video room:', error);
      setToast({ show: true, message: 'Error creating room. Please try again.' });
    }
  }, [router]);
  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setPdfFile(file);
      setPdfBlobUrl(blobUrl);
      setIsPdfOpen(true);
    }
  }, []);

  const closePdf = useCallback(() => {
    setIsPdfOpen(false);
    setPdfFile(null);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  }, [pdfBlobUrl]);

  useEffect(() => {
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [pdfBlobUrl]);

  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  return (
    <div className={styles.header}>
      <button className={styles.iconButton} onClick={shareVideoRoom}>
        <span className="material-icons">videocam</span>
      </button>
      <button className={styles.iconButton} onClick={toggleFullscreen}>
        <span className="material-icons">fullscreen</span>
      </button>
      <input
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        id="pdfInput"
        onChange={handleFileChange}
      />
      <label htmlFor="pdfInput" className={styles.iconButton}>
        <span className="material-icons">picture_as_pdf</span>
      </label>
      <div className={styles.accountMenu}>
        <button className={styles.iconButton}>
          <span className="material-icons">account_circle</span>
        </button>
        <div className={styles.dropdownContent}>
          <button onClick={() => signOut()} className={styles.logoutButton}>
            <span className="material-icons">logout</span>
          </button>
        </div>
      </div>
      {isPdfOpen && pdfBlobUrl && (
        <MovableModal onClose={closePdf}>
          <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`}>
            <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(0, 0, 0, 0.8)' }}>
                <Toolbar />
              </div>
              <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                <Viewer
                  fileUrl={pdfBlobUrl}
                  plugins={[toolbarPluginInstance]}
                  defaultScale={1.5}
                />
              </div>
            </div>
          </Worker>
        </MovableModal>
      )}
      {toast.show && (
        <div className={styles.toast}>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}