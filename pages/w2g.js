import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import styles from "../styles/W2g.module.css";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substr(2, 9);
    router.push(`/room/${roomId}`);
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div className={styles.settingsContainer}>
        <h2>YouTube Together</h2>
        <button className={styles.button} onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.header}>
        <h2>Welcome, {session.user.name}</h2>
        <button className={styles.closeButton} onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
      <div className={styles.settingsList}>
        <div className={styles.setting} onClick={createRoom}>
          <span className={styles.icon}>🎬</span>
          <span className={styles.settingName}>Create a New Room</span>
        </div>
      </div>
    </div>
  );
}