import { signOut } from "next-auth/react";
import styles from "../styles/CustomHeader.module.css";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import MovableModal from "./MovableModal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { toolbarPlugin, zoomPlugin } from "@react-pdf-viewer/toolbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import "../styles/react-pdf-viewer-overrides.css";
import CustomCursor from "../components/CustomCursor";
import pdfjs from "pdfjs-dist/package.json"; // Import the entire module

export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [dropdownVisible, setDropdownVisible] = useState(false);
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
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.url) {
        const fullUrl = `${
          window.location.origin
        }/app?roomUrl=${encodeURIComponent(data.url)}`;
        await navigator.clipboard.writeText(fullUrl);
        setToast({
          show: true,
          message: "Room created! Link copied to clipboard.",
        });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
        router.push({
          pathname: "/app",
          query: { roomUrl: data.url },
        });
      } else {
        console.error("Error creating video room:", data.error);
        setToast({
          show: true,
          message: "Error creating room. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error creating video room:", error);
      setToast({
        show: true,
        message: "Error creating room. Please try again.",
      });
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

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
    console.log("Dropdown visible:", !dropdownVisible); // Debugging line
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
        style={{ display: "none" }}
        id="pdfInput"
        onChange={handleFileChange}
      />
      <div className={styles.iconButton}>
        <button onClick={() => signOut()} className={styles.iconButton}>
          <span className="material-icons">logout</span>
        </button>
      </div>
      {isPdfOpen && pdfBlobUrl && (
        <MovableModal onClose={closePdf}>
          <Worker
            workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  background: "rgba(0, 0, 0, 0.8)",
                }}
              >
                <Toolbar />
              </div>
              <div style={{ flexGrow: 1, overflow: "hidden" }}>
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
