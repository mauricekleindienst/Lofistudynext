import { useState } from "react";
import { useRouter } from "next/router";
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import styles from "../../styles/Login.module.css";
import { auth } from "../../firebaseConfig";

export default function ChangePassword() {
  const router = useRouter();
  const { oobCode } = router.query; // oobCode is the code from the reset email
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Verify the password reset code first
      await verifyPasswordResetCode(auth, oobCode);
      // Complete the password reset
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("Your password has been successfully reset.");
      // Redirect to login page after a delay
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Change Password</h1>
        <form onSubmit={handlePasswordReset} className={styles.authForm}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className={styles.authInput}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className={styles.authInput}
          />
          <button type="submit" className={styles.authButton}>
            Change Password
          </button>
        </form>
        {message && <p className={styles.authMessage}>{message}</p>}
        {error && <p className={styles.authError}>{error}</p>}
      </div>
    </div>
  );
}
