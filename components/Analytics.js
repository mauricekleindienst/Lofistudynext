import styles from '../styles/Analytics.module.css';
import MetricCard from './MetricCard';
import FocusPatternChart from './charts/FocusPatternChart';
import ProductivityHeatmap from './charts/ProductivityHeatmap';
import GoalsProgress from './charts/GoalsProgress';

const calculateFocusScore = () => {
  // Implement focus score calculation logic
  return 85; // Placeholder value
};

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