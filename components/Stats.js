// Stats.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Doughnut, Bar } from "react-chartjs-2";
import Draggable from "react-draggable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import styles from "../styles/Stats.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CATEGORIES = ["Studying", "Coding", "Writing", "Working", "Other"];
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

export default function Stats({ onMinimize }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getPomodoroStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (response.status === 404) {
        setError("No stats found on your Account. Start a Pomodoro to begin tracking your stats.");
        setStats(null);
      } else if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      } else {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch Pomodoro stats:", error);
      setError("Failed to fetch stats. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const retryFetch = () => {
    setError("");
    fetchStats();
  };

  const categoryData = useMemo(() => ({
    labels: CATEGORIES,
    datasets: [{
      data: CATEGORIES.map(category => stats?.[category.toLowerCase()] ?? 0),
      backgroundColor: COLORS,
      hoverBackgroundColor: COLORS,
    }],
  }), [stats]);

  const weeklyChartData = useMemo(() => {
    if (!stats?.daily_counts) return null;
    const weeklyLabels = Object.keys(stats.daily_counts).slice(-7);
    const weeklyData = Object.values(stats.daily_counts).slice(-7);
    return {
      labels: weeklyLabels,
      datasets: [{
        label: "Pomodoros",
        data: weeklyData,
        backgroundColor: "rgba(255, 123, 0, 0.6)",
        borderColor: "rgba(255, 123, 0, 1)",
        borderWidth: 1,
      }],
    };
  }, [stats]);

  if (error) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.header}>
          <h2>Pomodoro Stats</h2>
          <button onClick={onMinimize} className="material-icons" aria-label="Minimize">
            remove
          </button>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={retryFetch} className={styles.retryButton} aria-label="Retry">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className={styles.loading}>Loading stats...</div>;
  }

  if (!stats) {
    return <div className={styles.loading}>No stats available</div>;
  }

  return (
    <Draggable handle=".dragHandle">
      <div className={styles.statsContainer}>
        <div className={`${styles.dragHandle} dragHandle`}></div>
        <div className={styles.header}>
          <h2>Pomodoro Stats</h2>
          <button onClick={onMinimize} className="material-icons" aria-label="Minimize">
            remove
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.statsSummary}>
            <p>Total: {stats.pomodoro_count ?? 0}</p>
            <p>Daily Avg: {((stats.pomodoro_count ?? 0) / 7).toFixed(1)}</p>
          </div>
          <div className={styles.chartsContainer}>
            <div className={styles.chartWrapper}>
              <h3>Categories</h3>
              <Doughnut
                data={categoryData}
                options={{
                  plugins: { legend: { display: true }, tooltip: { enabled: true } },
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { animateScale: true },
                }}
                height={200}
                width={200}
              />
            </div>
            {weeklyChartData && (
              <div className={styles.chartWrapper}>
                <h3>Study Days</h3>
                <Bar
                  data={weeklyChartData}
                  options={{
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                        grid: { display: false },
                      },
                      x: { grid: { display: false } },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { animateScale: true },
                  }}
                  height={200}
                  width={300}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}
