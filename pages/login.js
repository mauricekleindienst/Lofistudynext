// pages/login.js
import { signIn } from 'next-auth/react';
import styles from '../styles/Login.module.css';

export default function Login() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1>Welcome to lo-fi.study</h1>
          <p>Sign in to access your calm, digital space to work.</p>
          <button onClick={() => signIn('google')} className={styles.loginButton}>
            Login with Google
          </button>
        </div>
      </main>
    </div>
  );
}
