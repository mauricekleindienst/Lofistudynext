// Stats.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Doughnut, Bar, Line } from "react-chartjs-2";
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
  PointElement,
  LineElement,
  Filler
} from "chart.js";
import styles from "../styles/Stats.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const CATEGORIES = ["Studying", "Coding", "Writing", "Working", "Other"];
const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

const INTENSITY_COLORS = {
  0: 'rgba(255, 123, 0, 0.1)',
  1: 'rgba(255, 123, 0, 0.3)',
  2: 'rgba(255, 123, 0, 0.5)',
  3: 'rgba(255, 123, 0, 0.7)',
  4: 'rgba(255, 123, 0, 0.9)'
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

export default function Stats({ onMinimize }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('daily');
  const [yearView, setYearView] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/getPomodoroStats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.status === 404) {
        setError("No stats found. Start a Pomodoro to begin tracking your stats.");
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
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchStats();
    }
  }, [user, fetchStats]);

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
      borderWidth: 0,
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
        borderRadius: 8,
      }],
    };
  }, [stats]);

  const studyTimeData = useMemo(() => {
    if (!stats?.daily_counts) return null;
    const labels = Object.keys(stats.daily_counts).slice(-14);
    const data = Object.values(stats.daily_counts).slice(-14).map(count => count * 25); // Convert pomodoros to minutes
    
    return {
      labels,
      datasets: [{
        label: "Study Time (minutes)",
        data: data,
        fill: true,
        borderColor: "rgba(255, 123, 0, 1)",
        backgroundColor: "rgba(255, 123, 0, 0.1)",
        tension: 0.4,
      }],
    };
  }, [stats]);

  const calculateStreak = () => {
    if (!stats?.daily_counts) return 0;
    const dates = Object.keys(stats.daily_counts).sort();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = dates.length - 1; i >= 0; i--) {
      if (stats.daily_counts[dates[i]] > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateAveragePerDay = () => {
    if (!stats?.daily_counts) return 0;
    const days = Object.values(stats.daily_counts);
    return (days.reduce((a, b) => a + b, 0) / days.length).toFixed(1);
  };

  const calculateTotalStudyTime = () => {
    if (!stats?.pomodoro_count) return '0h 0m';
    const totalMinutes = stats.pomodoro_count * 25;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getIntensityLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  };

  const generateYearlyData = () => {
    if (!stats?.daily_counts) return [];
    
    const today = new Date();
    const yearAgo = new Date();
    yearAgo.setFullYear(today.getFullYear() - 1);
    
    const days = [];
    for (let d = new Date(yearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = stats.daily_counts[dateStr] || 0;
      days.push({
        date: dateStr,
        count,
        intensity: getIntensityLevel(count)
      });
    }
    return days;
  };

  const calculateProductiveHours = () => {
    if (!stats?.daily_counts) return { peak: 'N/A', total: 0 };
    const hours = Array(24).fill(0);
    let totalHours = 0;
    
    Object.values(stats.daily_counts).forEach(count => {
      totalHours += (count * 25) / 60; // Convert minutes to hours
    });

    const peakHour = hours.indexOf(Math.max(...hours));
    return {
      peak: `${peakHour}:00 - ${peakHour + 1}:00`,
      total: Math.round(totalHours)
    };
  };

  const calculateWeekdayDistribution = () => {
    if (!stats?.daily_counts) return Array(7).fill(0);
    const weekdays = Array(7).fill(0);
    
    Object.entries(stats.daily_counts).forEach(([date, count]) => {
      const day = new Date(date).getDay();
      weekdays[day] += count;
    });
    
    return weekdays;
  };

  const formatWeekDay = (date) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[new Date(date).getDay()];
  };

  const getActivityColor = (count) => {
    if (count === 0) return 'rgba(255, 123, 0, 0.1)';
    if (count <= 2) return 'rgba(255, 123, 0, 0.3)';
    if (count <= 4) return 'rgba(255, 123, 0, 0.5)';
    if (count <= 6) return 'rgba(255, 123, 0, 0.7)';
    return 'rgba(255, 123, 0, 0.9)';
  };

  if (error) {
    return (
      <div className={styles.statsContainer}>
        <div className={styles.header}>
          <h2>Pomodoro Stats</h2>
          <button onClick={onMinimize} className="material-icons">
            remove
          </button>
        </div>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={retryFetch} className={styles.retryButton}>
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
          <button onClick={onMinimize} className="material-icons">
            remove
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'daily' ? styles.active : ''}`}
              onClick={() => setActiveTab('daily')}
            >
              Daily
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'weekly' ? styles.active : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'insights' ? styles.active : ''}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBlock}>
              <span className={styles.statIcon}>🔥</span>
              <div className={styles.statInfo}>
                <h3>Streak</h3>
                <p>{calculateStreak()}d</p>
              </div>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statIcon}>⏱️</span>
              <div className={styles.statInfo}>
                <h3>Study Time</h3>
                <p>{calculateTotalStudyTime()}</p>
              </div>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statIcon}>📊</span>
              <div className={styles.statInfo}>
                <h3>Daily Avg</h3>
                <p>{calculateAveragePerDay()}</p>
              </div>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statIcon}>🎯</span>
              <div className={styles.statInfo}>
                <h3>Total</h3>
                <p>{stats.pomodoro_count}</p>
              </div>
            </div>
            <div className={styles.statBlock}>
              <span className={styles.statIcon}>⚡</span>
              <div className={styles.statInfo}>
                <h3>Peak Hours</h3>
                <p>{calculateProductiveHours().peak}</p>
              </div>
            </div>
          </div>

          <div className={styles.yearGrid}>
            <div className={styles.yearHeader}>
              <h3>Activity</h3>
            </div>
            <div className={styles.contributionGrid}>
              {generateYearlyData().map((day, idx) => (
                <div
                  key={day.date}
                  className={styles.contributionCell}
                  style={{ backgroundColor: INTENSITY_COLORS[day.intensity] }}
                  data-tooltip={`${formatDate(day.date)} • ${day.count} pomodoros`}
                />
              ))}
            </div>
          </div>

          {activeTab === 'insights' && (
            <div className={styles.insightsGrid}>
              <div className={styles.chartBlock}>
                <h3>Weekly Distribution</h3>
                <Bar
                  data={{
                    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: [{
                      data: calculateWeekdayDistribution(),
                      backgroundColor: 'rgba(255, 123, 0, 0.6)',
                      borderColor: 'rgba(255, 123, 0, 1)',
                      borderWidth: 1,
                      borderRadius: 8,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                      },
                      x: { grid: { display: false } }
                    }
                  }}
                  height={150}
                />
              </div>
              
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <h4>Total Study Hours</h4>
                  <p>{calculateProductiveHours().total}h</p>
                </div>
                <div className={styles.statCard}>
                  <h4>Most Productive Day</h4>
                  <p>{new Date(Object.entries(stats?.daily_counts || {})
                    .reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0])[0])
                    .toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'daily' && weeklyChartData && (
            <div className={styles.chartBlock}>
              <h3>Daily Progress</h3>
              <Bar
                data={weeklyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
                height={150}
              />
            </div>
          )}

          {activeTab === 'weekly' && studyTimeData && (
            <div className={styles.chartBlock}>
              <h3>Study Time Trend</h3>
              <Line
                data={studyTimeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
                height={150}
              />
            </div>
          )}

          {activeTab === 'categories' && (
            <div className={styles.chartBlock}>
              <h3>Category Distribution</h3>
              <div className={styles.doughnutWrapper}>
                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          padding: 20,
                          usePointStyle: true
                        }
                      }
                    },
                    cutout: '60%'
                  }}
                  height={150}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
