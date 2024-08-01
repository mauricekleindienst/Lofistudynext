import React, { useState, useEffect } from "react";
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

export default function Stats({ onMinimize }) {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/getPomodoroStats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email,
        }),
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch Pomodoro stats:", error);
    }
  };

  if (!stats) {
    return <div className={styles.loading}>Loading stats...</div>;
  }

  const categoryData = {
    labels: ["Studying", "Coding", "Writing", "Working", "Other"],
    datasets: [
      {
        data: [
          stats.studying,
          stats.coding,
          stats.writing,
          stats.working,
          stats.other,
        ].map((value) => value || 0),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const weeklyLabels = Object.keys(stats.daily_counts || {}).slice(-7);
  const weeklyData = Object.values(stats.daily_counts || {}).slice(-7);

  const weeklyChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Pomodoros",
        data: weeklyData.map((value) => value || 0),
        backgroundColor: "rgba(255, 123, 0, 0.6)",
        borderColor: "rgba(255, 123, 0, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <Draggable handle=".dragHandle">
      <div className={styles.statsContainer}>
        <div className={`${styles.dragHandle} dragHandle`}></div>
        <div className={styles.header}>
          <h2>Pomodoro Stats</h2>
          <button
            onClick={onMinimize}
            className="material-icons"
            aria-label="Minimize"
          >
            remove
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.statsSummary}>
            <p>Total: {stats.pomodoro_count || 0}</p>
            <p>Daily Avg: {(stats.pomodoro_count / 7).toFixed(1) || 0}</p>
          </div>
          <div className={styles.chartsContainer}>
            <div className={styles.chartWrapper}>
              <h3>Categories</h3>
              <Doughnut
                data={categoryData}
                options={{
                  plugins: {
                    legend: { display: true },
                    tooltip: { enabled: true },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height={200}
                width={200}
              />
            </div>
            <div className={styles.chartWrapper}>
              <h3>Weekly Progress</h3>
              <Bar
                data={weeklyChartData}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },

                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 },
                      grid: { display: false },
                    },
                    x: {
                      grid: { display: false },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: true,
                }}
                height={200}
                width={300}
              />
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
