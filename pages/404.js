import Link from 'next/link';
import styles from '../styles/404.module.css';

const Custom404 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.errorNumber}>
        <div className={`${styles.number} ${styles.leftCoffee}`}>4</div>
        <div className={styles.coffeeMug}></div>
        <div className={`${styles.number} ${styles.rightCoffee}`}>4</div>
      </div>
      <div className={styles.smScreen}>404</div>
      <div className={styles.meanMsg}>
        Nothing to see here, <Link href="/"><a>go back home!</a></Link>
      </div>
    </div>
  );
};

export default Custom404;
