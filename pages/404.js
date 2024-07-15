import Link from 'next/link';
import styles from '../styles/404.module.css';

const Custom404 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.error}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.message}>Oops! The page you are looking for cannot be found.</p>
        <Link href="/">
          <a className={styles.homeLink}>Go back to Home</a>
        </Link>
      </div>
      <div className={styles.animationContainer}>
        <div className={styles.animation}></div>
      </div>
    </div>
  );
};

export default Custom404;
