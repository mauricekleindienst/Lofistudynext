import { signOut } from 'next-auth/react';
import styles from '../styles/CustomHeader.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import MovableModal from './MovableModal';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const router = useRouter();

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const shareVideoRoom = async () => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.url) {
        router.push({
          pathname: '/study',
          query: { roomUrl: data.url }
        });
      } else {
        console.error('Error creating video room:', data.error);
      }
    } catch (error) {
      console.error('Error creating video room:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPdfFile(file);
      setIsPdfOpen(true);
    }
  };

  const closePdf = () => {
    setIsPdfOpen(false);
    setPdfFile(null);
  };

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
      {isPdfOpen && (
        <MovableModal onClose={closePdf}>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
            <div style={{ height: '500px' }}>
              <Viewer fileUrl={URL.createObjectURL(pdfFile)} />
            </div>
          </Worker>
        </MovableModal>
      )}
    </div>
  );
}
