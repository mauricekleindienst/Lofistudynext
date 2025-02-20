export default function Achievements() {
  return (
    <div className={styles.achievementsContainer}>
      <div className={styles.header}>
        <h2>Achievements</h2>
        <div className={styles.badges}>
          {/* Examples */}
          <Badge 
            title="Early Bird" 
            description="Complete 5 Pomodoros before 10 AM"
            progress={3}
            total={5}
          />
          <Badge 
            title="Night Owl" 
            description="Study for 2 hours after 10 PM"
            isCompleted={true}
          />
          <Badge 
            title="Focus Master" 
            description="Complete 10 Pomodoros without breaks"
            progress={7}
            total={10}
          />
        </div>
      </div>
    </div>
  );
} 