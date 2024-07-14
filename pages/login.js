import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import styles from '../styles/Login.module.css';

const backgrounds = [
  { id: 1, src: '/backgrounds/Night.mp4', alt: 'Night' },
  { id: 2, src: '/backgrounds/Rain.mp4', alt: 'Rain' },
  { id: 3, src: '/backgrounds/Train.mp4', alt: 'Train' },
  { id: 4, src: '/backgrounds/Classroom.mp4', alt: 'Classroom' },
  { id: 5, src: '/backgrounds/Autumn.mp4', alt: 'Autumn' },
  { id: 6, src: '/backgrounds/Couch.mp4', alt: 'Couch' }
];

export default function Login() {
  const [background, setBackground] = useState(null);

  useEffect(() => {
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    setBackground(randomBackground);
  }, []);

  return (
    <div className={styles.container}>
      {background && (
        <video className={styles.videoBackground} autoPlay loop muted src={background.src} />
      )}
      <div className={styles.gradientOverlay}></div>
      <main className={styles.main}>
        <div className={styles.hero}>
          <Image src="/lo-fi.study.svg" alt="lo-fi.study" className={styles.logo} />
          <h1 className={styles.title}>Welcome to lo-fi.study</h1>
          <p className={styles.subtitle}>Sign in to access your calm, digital space to work.</p>
          <button onClick={() => signIn('google')} className={styles.loginButton}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
              <path fill="#4285F4" d="M44.5,20H24v8.5h11.7C34.7,33.7,30.7,37,24,37c-7,0-12.7-5.7-12.7-12.7S17,11.7,24,11.7c3.2,0,6.1,1.2,8.3,3.3l6.2-6.2C34.8,5.9,29.6,4,24,4C12.9,4,4,12.9,4,24s8.9,20,20,20c10,0,18.4-7.1,19.8-16.7C44.9,25.8,44.5,20,44.5,20z"/>
              <path fill="#FBBC05" d="M6.5,14.5l6.2,4.6c1.6-3.3,4.9-5.7,8.8-5.7c3.3,0,6.3,1.3,8.5,3.5l6.4-6.4C32.9,5.9,29.6,4,24,4C17,4,11,8.4,8.1,14.2"/>
              <path fill="#34A853" d="M24,44c5.4,0,10.1-2,13.6-5.2l-6.4-6.4c-2.3,1.6-5.1,2.5-8.2,2.5c-4.6,0-8.6-2.6-10.6-6.4l-6.3,6.3C10.5,39.5,17,44,24,44z"/>
              <path fill="#EA4335" d="M44.5,20H24v8.5h11.7c-1.1,3.2-3.7,5.7-7,7.1l6.4,6.4c3.8-3.4,6.4-8.3,6.4-14.1C41.5,23.3,44.5,20,44.5,20z"/>
            </svg>
            Login with Google
          </button>
        </div>
      </main>
    </div>
  );
}
