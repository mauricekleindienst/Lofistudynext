export default function Analytics() {
  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.metrics}>
        <MetricCard
          title="Focus Score"
          value={calculateFocusScore()}
          trend="+5% this week"
        />
        <MetricCard
          title="Peak Hours"
          value="2PM - 4PM"
          description="Your most productive time"
        />
        <MetricCard
          title="Study Streaks"
          value="5 days"
          goal="7 days"
        />
      </div>
      <div className={styles.charts}>
        <FocusPatternChart />
        <ProductivityHeatmap />
        <GoalsProgress />
      </div>
    </div>
  );
} 