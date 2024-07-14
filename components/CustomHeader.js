import { signOut } from 'next-auth/react';
import styles from '../styles/CustomHeader.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import MovableModal from './MovableModal';

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setPdfUrl(e.target.result);
        setIsPdfOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const closePdf = () => {
    setIsPdfOpen(false);
    setPdfUrl(null);
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
          <iframe src={pdfUrl} width="100%" height="100%"></iframe>
        </MovableModal>
      )}
    </div>
  );
}
