import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/Login.module.css';

const backgrounds = [
  { id: 1, src: '/backgrounds/Night.mp4', alt: 'Night', note: 'Night' },
  { id: 2, src: '/backgrounds/Rain.mp4', alt: 'Rain', note: 'Rain' },
  { id: 3, src: '/backgrounds/Train.mp4', alt: 'Train', note: 'Train' },
  { id: 4, src: '/backgrounds/Classroom.mp4', alt: 'Classroom', note: 'Classroom' },
  { id: 5, src: '/backgrounds/Autumn.mp4', alt: 'Autumn', note: 'Autumn' },
  { id: 6, src: '/backgrounds/Couch.mp4', alt: 'Couch', note: 'Couch' },
  { id: 7, src: '/backgrounds/Skyrim.mp4', alt: 'Skyrim', note: 'Skyrim' },
  { id: 8, src: '/backgrounds/Train2.mp4', alt: 'Train2', note: 'Train2' },
  { id: 9, src: '/backgrounds/Chillroom.mp4', alt: 'Chillroom', note: 'Chillroom' },
];

export default function SignIn() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [background, setBackground] = useState(null);

  useEffect(() => {
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/study');
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {background && (
        <video className={styles.videoBackground} autoPlay loop muted src={background.src} />
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={styles.authInput}
          />
          <button type="submit" className={styles.authButton}>Sign In</button>
        </form>
        <button onClick={() => signIn('google')} className={styles.authButtonGoogle}>
          <img src="/icons/google.svg" alt="Google icon" className={styles.authButtonIcon} />
          Sign in with Google
        </button>
        <button onClick={() => signIn('discord')} className={styles.authButtonDiscord}>
          <img src="/icons/discord.svg" alt="Discord icon" className={styles.authButtonIcon} />
          Sign in with Discord
        </button>
        {error && <p className={styles.authError}>{error}</p>}
        <Link href="/auth/register">
          <p className={styles.authLink}>Don't have an account? Register</p>
        </Link>
        <Link href="/auth/forgot-password">
          <p className={styles.authLink}>Forgot Password?</p>
        </Link>
      </div>
    </div>
  );
}
