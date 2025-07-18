import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useAuth } from "../../contexts/AuthContext";
import { backgrounds } from "../../data/backgrounds";
import styles from "../../styles/Auth.module.css";

export default function SignIn() {
  const { user, signIn, signInWithGoogle, signInWithDiscord, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);  const [currentBgIndex, setCurrentBgIndex] = useState(() => 
    Math.floor(Math.random() * backgrounds.length)
  );
  const router = useRouter();

  useEffect(() => {
    // Don't automatically redirect authenticated users - let them access auth pages
    // Only redirect if coming from a protected route or after explicit authentication
  }, []);

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

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message || "Failed to sign in");
      } else {
        // Successful sign in, redirect
        const from = router.query.from || '/app';
        router.push(from);
      }
    } catch (error) {
      setError(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setError("Failed to sign in with Google");
      }
    } catch (error) {
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithDiscord();
      if (error) {
        setError("Failed to sign in with Discord");
      }
    } catch (error) {
      setError("Failed to sign in with Discord");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <div className={styles.loadingSpinner}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - LoFi Study</title>
        <meta name="description" content="Sign in to your LoFi Study account and continue your productive study journey." />
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
          
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to continue your study session</p>
          
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
          
          <form onSubmit={handleEmailSignIn} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={styles.input} 
                placeholder="Enter your email" 
                disabled={isLoading} 
                required 
                autoComplete="email" 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordContainer}>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className={styles.input} 
                  placeholder="Enter your password" 
                  disabled={isLoading} 
                  required 
                  autoComplete="current-password" 
                />
                <button 
                  type="button" 
                  onClick={togglePasswordVisibility} 
                  className={styles.passwordToggle} 
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg className={styles.passwordToggleIcon} viewBox="0 0 24 24" fill="currentColor">
                    {showPassword ? (
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    ) : (
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loadingSpinner}>Signing In...</span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <div className={styles.divider}>
            <span>or continue with</span>
          </div>
          
          <div className={styles.socialButtons}>
            <button 
              onClick={handleGoogleSignIn} 
              className={`${styles.socialButton} ${styles.googleButton}`} 
              disabled={isLoading} 
              type="button"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            
            <button 
              onClick={handleDiscordSignIn} 
              className={`${styles.socialButton} ${styles.discordButton}`} 
              disabled={isLoading} 
              type="button"
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0190 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z" fill="#5865F2" />
              </svg>
              Continue with Discord
            </button>
          </div>
          
          <div className={styles.links}>
            <Link href="/auth/forgot-password" className={styles.link}>
              Forgot password?
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
