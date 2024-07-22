import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import CustomCursor from '../components/CustomCursor';

export default function Header() {
    const router = useRouter();

    return (
        <header className={styles.header}>
            <div className={styles.logo} onClick={() => router.push('/')}>
                <img src="/lo-fi.study.svg" alt="lo-fi.study" />
            </div>
            <div className={styles.buttonContainer}>
                <button onClick={() => router.push('/dev-updates')} className={styles.contactButton}>Updates</button>
                <button onClick={() => router.push('/Contact')} className={styles.contactButton}>Contact</button>
                <button onClick={() => router.push('/FAQ')} className={styles.faqButton}>FAQ</button>
                <button onClick={() => router.push('/auth/signin')} className={styles.loginButton}>Sign In</button>
            </div>
        </header>
    );
}
