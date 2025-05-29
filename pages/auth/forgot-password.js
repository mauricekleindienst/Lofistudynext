import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { backgrounds } from "../../data/backgrounds";
import styles from "../../styles/Auth.module.css";

export default function ForgotPassword() {
  const { resetPassword, user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  const [currentBgIndex, setCurrentBgIndex] = useState(() => 
    Math.floor(Math.random() * backgrounds.length)
  );
  const router = useRouter();

  useEffect(() => {
    // Allow users to access forgot password even if logged in
    // Only redirect if explicitly requested
    if (user && router.query.redirect === 'true') {
      const from = router.query.from || '/app';
      router.push(from);
    }
  }, [user, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => {
        // Generate a random index that's different from the current one
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * backgrounds.length);
        } while (newIndex === prevIndex && backgrounds.length > 1);
        return newIndex;
      });
    }, 15000); // Change background every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message || "Failed to send reset email");
      } else {
        setMessage("Check your email for password reset instructions. You may need to check your spam folder.");
      }
    } catch (error) {
      setError(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - LoFi Study</title>
        <meta name="description" content="Reset your LoFi Study account password and get back to studying." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={styles.container}>
        <video 
          key={backgrounds[currentBgIndex].id} 
          className={styles.backgroundVideo} 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={backgrounds[currentBgIndex].src} type="video/mp4" />
        </video>
        <div className={styles.overlay} />
        
        <div className={styles.authCard}>
          <div className={styles.logoContainer}>
            <Image 
              src="/lo-fi.study.svg" 
              alt="LoFi Study Logo" 
              width={180} 
              height={50} 
              priority 
            />
          </div>
          
          <h1 className={styles.title}>Reset Password</h1>
          <p className={styles.subtitle}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          
          {error && (
            <div className={styles.messageContainer}>
              <div className={styles.errorMessage}>
                <svg className={styles.messageIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {message && (
            <div className={styles.messageContainer}>
              <div className={styles.successMessage}>
                <svg className={styles.messageIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {message}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={styles.input} 
                placeholder="Enter your email address" 
                disabled={isLoading} 
                required 
                autoComplete="email" 
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}>Sending Reset Link...</span>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
          
          <div className={styles.links}>
            <Link href="/auth/signin" className={styles.link}>
              Back to Sign In
            </Link>
            <span className={styles.separator}>•</span>
            <span className={styles.linkText}>Don&apos;t have an account?</span>
            <Link href="/auth/register" className={styles.link}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}