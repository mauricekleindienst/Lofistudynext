// pages/auth/ChangePassword.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/Login.module.css";

export default function ChangePassword() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: "" });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push("at least 8 characters");

    if (/[a-z]/.test(password)) score++;
    else feedback.push("lowercase letter");

    if (/[A-Z]/.test(password)) score++;
    else feedback.push("uppercase letter");

    if (/\d/.test(password)) score++;
    else feedback.push("number");

    if (/[^a-zA-Z0-9]/.test(password)) score++;
    else feedback.push("special character");

    const strengthLevels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthLevel = strengthLevels[Math.min(score, 4)];

    setPasswordStrength({
      score,
      feedback: feedback.length > 0 ? `Password needs: ${feedback.join(", ")}` : `Password strength: ${strengthLevel}`,
      color: score < 2 ? "#ef4444" : score < 4 ? "#f59e0b" : "#10b981"
    });
  };

  useEffect(() => {
    // Check for access_token and refresh_token in URL hash (from email link)
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      // Supabase handles the session automatically from the URL fragments
      setMessage("Please enter your new password below.");
    }
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password. Use a mix of letters, numbers, and special characters.");
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword(newPassword);
      setMessage("Your password has been successfully updated! Redirecting to sign in...");
      // Clear form
      setNewPassword("");
      setConfirmPassword("");
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/auth/signin?message=Password updated successfully");
      }, 3000);
    } catch (error) {
      setError(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setNewPassword(password);
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({ score: 0, feedback: "" });
    }
  };

  return (
    <>
      <Head>
        <title>Change Password - LoFi Study</title>
        <meta name="description" content="Update your LoFi Study account password. Create a strong, secure password for your account." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Change Password - LoFi Study" />
        <meta property="og:description" content="Update your LoFi Study account password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Change Password</h1>
        <form onSubmit={handlePasswordReset} className={styles.authForm}>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              required
              minLength="8"
              aria-label="New Password"
              className={`${styles.authInput} ${styles.passwordInput}`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.passwordToggleIcon}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.passwordToggleIcon}>
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              )}
            </button>
          </div>
          {newPassword && (
            <div className={styles.passwordStrength} style={{ color: passwordStrength.color }}>
              {passwordStrength.feedback}
            </div>
          )}
          <div className={styles.passwordInputWrapper}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              minLength="8"
              aria-label="Confirm Password"
              className={`${styles.authInput} ${styles.passwordInput}`}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className={styles.passwordToggle}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.passwordToggleIcon}>
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.passwordToggleIcon}>
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                </svg>
              )}
            </button>
          </div>
          <button type="submit" disabled={isLoading} className={styles.authButton}>
            {isLoading ? "Updating..." : "Change Password"}
          </button>
        </form>
        {message && (
          <div className={styles.authMessage}>
            <div className={styles.authSuccess}>
              <svg className={styles.authMessageIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {message}
            </div>
          </div>
        )}
        {error && (
          <div className={styles.authMessage}>
            <div className={styles.authError}>
              <svg className={styles.authMessageIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              {error}
            </div>
          </div>
        )}
        <div className={styles.authLinks}>
          <Link href="/auth/signin">
            <p className={styles.authLink}>Back to Sign In</p>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
