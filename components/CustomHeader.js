import { signOut } from "next-auth/react";
import styles from "../styles/CustomHeader.module.css";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import MovableModal from "./MovableModal";



export default function CustomHeader() {
  const [isFullscreen, setIsFullscreen] = useState(false);
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




  return (
    <div className={styles.header}>
      <button className={styles.iconButton} onClick={shareVideoRoom}>
        <span className="material-icons">videocam</span>
      </button>
      <button className={styles.iconButton} onClick={toggleFullscreen}>
  <span className="material-icons">
    {isFullscreen ? "fullscreen_exit" : "fullscreen"}
  </span>
</button>

      <div className={styles.iconButton}>
        <button onClick={() => signOut()} className={styles.iconButton}>
          <span className="material-icons">logout</span>
        </button>
      </div>
      {toast.show && (
        <div className={styles.toast}>
          <span className={styles.toastMessage}>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
