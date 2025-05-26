import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/Auth.module.css";

const backgrounds = [
  { id: 1, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Couch.mp4", alt: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train" },
  { id: 4, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4", alt: "Classroom" },
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn" },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night" },
  { id: 7, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4", alt: "Skyrim" },
  { id: 8, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4", alt: "Train2" },
  { id: 9, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4", alt: "Chillroom" },
];

export default function ForgotPassword() {
  const { resetPassword, user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/app');
    }
  }, [user, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 10000);
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