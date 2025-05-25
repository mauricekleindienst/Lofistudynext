// pages/profile.js
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Profile.module.css";

export default function Profile() {
  const { user, updateProfile, signOut, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalPomodoros: 0,
    totalStudyTime: 0,
    todosCompleted: 0,
    currentStreak: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      fetchUserStats();
    }
  }, [user, loading, router]);

  const fetchUserStats = async () => {
    try {
      // Fetch pomodoro stats
      const pomodoroResponse = await fetch('/api/getPomodoroStats', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        },
      });
      
      if (pomodoroResponse.ok) {
        const pomodoroData = await pomodoroResponse.json();
        setStats(prev => ({
          ...prev,
          totalPomodoros: pomodoroData.pomodoro_count || 0,
          totalStudyTime: Math.round((pomodoroData.pomodoro_count || 0) * 25 / 60), // Convert to hours
        }));
      }

      // Fetch todo stats
      const todoResponse = await fetch('/api/todos/count', {
        headers: {
          'Authorization': `Bearer ${user?.access_token}`,
        },
      });
      
      if (todoResponse.ok) {
        const todoData = await todoResponse.json();
        setStats(prev => ({
          ...prev,
          todosCompleted: todoData.completed || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({ 
        data: { 
          full_name: fullName 
        } 
      });
      
      setMessage("Profile updated successfully!");
      setIsEditing(false);
      
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      setError("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Profile - LoFi Study</title>
        <meta name="description" content="Manage your LoFi Study account and view your study statistics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/app" className={styles.backButton}>
            ← Back to App
          </Link>
          <h1 className={styles.title}>My Profile</h1>
        </div>

        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatar}>
              {fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{fullName || email.split('@')[0]}</h2>
              <p className={styles.userEmail}>{email}</p>
            </div>
          </div>

          {message && <div className={styles.successMessage}>{message}</div>}
          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.profileForm}>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className={styles.inputGroup}>
                  <label htmlFor="fullName" className={styles.label}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.input}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    className={styles.input}
                    disabled
                    readOnly
                  />
                  <small className={styles.helpText}>Email cannot be changed</small>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(user.user_metadata?.full_name || "");
                      setError("");
                      setMessage("");
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Full Name:</span>
                  <span className={styles.infoValue}>{fullName || "Not set"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Account Type:</span>
                  <span className={styles.infoValue}>Standard User</span>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.statsCard}>
          <h3 className={styles.statsTitle}>Study Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.totalPomodoros}</div>
              <div className={styles.statLabel}>Pomodoros Completed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.totalStudyTime}h</div>
              <div className={styles.statLabel}>Total Study Time</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.todosCompleted}</div>
              <div className={styles.statLabel}>Tasks Completed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.currentStreak}</div>
              <div className={styles.statLabel}>Current Streak</div>
            </div>
          </div>
        </div>

        <div className={styles.actionsCard}>
          <h3 className={styles.actionsTitle}>Account Actions</h3>
          <div className={styles.actionButtons}>
            <Link href="/auth/ChangePassword" className={styles.actionButton}>
              Change Password
            </Link>
            <button
              onClick={handleSignOut}
              className={`${styles.actionButton} ${styles.signOutButton}`}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
