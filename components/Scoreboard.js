// components/Scoreboard.js
import { useUserContext } from '../context/UserContext';
import Draggable from 'react-draggable';
import styles from '../styles/Scoreboard.module.css';

export default function Scoreboard({ onMinimize }) {
  const { users } = useUserContext();

  // Sort users by Pomodoros completed, descending
  const sortedUsers = [...users].sort((a, b) => b.pomodoros - a.pomodoros);

  return (
    <Draggable>
      <div className={styles.scoreboardContainer}>
        <div className={styles.header}>
          <h2>Scoreboard</h2>
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.scoreboard}>
          {sortedUsers.map((user, index) => (
            <div key={user.id} className={`${styles.user} ${index === 0 ? styles.firstPlace : ''}`}>
              <span>{user.given_name}</span>
              <span>{user.pomodoros} Pomodoros</span>
              {index === 0 && <span className={styles.crown}>👑</span>}
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
