// pages/auth/signin.js
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Login.module.css";
import Image from "next/image";

const backgrounds = [
  { id: 1, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
  { id: 2, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4", alt: "Rain", note: "Rain" },
  { id: 3, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4", alt: "Train", note: "Train" },
  { id: 4, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" },
  { id: 5, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn" },
  { id: 6, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4", alt: "Night", note: "Night" },
  { id: 7, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" },
  { id: 8, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4", alt: "Train2", note: "Train2" },
  { id: 9, src: "https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom" },
];
// const backgrounds = [
//   { id: 1, src: "/backgrounds/Night.mp4", alt: "Night", note: "Night" },
//   { id: 2, src: "/backgrounds/Rain.mp4", alt: "Rain", note: "Rain" },
//   { id: 3, src: "/backgrounds/Train.mp4", alt: "Train", note: "Train" },
//   { id: 4, src: "/backgrounds/Classroom.mp4", alt: "Classroom", note: "Classroom" },
//   { id: 5, src: "/backgrounds/Autumn.mp4", alt: "Autumn", note: "Autumn" },
//   { id: 6, src: "/backgrounds/Couch.mp4", alt: "Couch", note: "Couch" },
//   { id: 7, src: "/backgrounds/Skyrim.mp4", alt: "Skyrim", note: "Skyrim" },
//   { id: 8, src: "/backgrounds/Train2.mp4", alt: "Train2", note: "Train2" },
//   { id: 9, src: "/backgrounds/Chillroom.mp4", alt: "Chillroom", note: "Chillroom" },
// ];
export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [background, setBackground] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const randomBackground =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/app");
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      {background && (
        <video
          className={`${styles.videoBackground} ${videoLoaded ? styles.loaded : ''}`}
          autoPlay
          loop
          muted
          src={background.src}
          onLoadedData={() => setVideoLoaded(true)}
        />
      )}
      <div className={styles.gradientOverlay}></div>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Sign In</h1>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className={styles.authInput}
          />
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className={`${styles.authInput} ${styles.passwordInput}`}
            />
             <button
              type="button"
              onClick={togglePasswordVisibility}
              className={styles.passwordToggle}
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
          <button type="submit" className={styles.authButton}>
            Sign In
          </button>
        </form>
        <button
          onClick={() => signIn("google")}
          className={styles.authButtonGoogle}
        >
         <Image
            src="/icons/google.svg"
            alt="Google icon"
            width={100} height={100}
            className={styles.authButtonIcon}
          />
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("discord")}
          className={styles.authButtonDiscord}
        >
         <Image
            src="/icons/discord.svg"
            alt="Discord icon"
            width={100} height={100}
            className={styles.authButtonIcon}
          />
          Sign in with Discord
        </button>
        {error && <p className={styles.authError}>{error}</p>}
        <Link href="/auth/register">
          <p className={styles.authLink}>
            Don&apos;t have an account? Register
          </p>
        </Link>
        <Link href="/auth/forgot-password">
          <p className={styles.authLink}>Forgot Password?</p>
        </Link>
      </div>
    </div>
  );
}
