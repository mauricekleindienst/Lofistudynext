// components/Footer.js

import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import CustomCursor from '../components/CustomCursor';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.logo}>
                    <Link href="/">
                        <img src="/lo-fi.study.svg" alt="Atla" />
                    </Link>
                    <p>Creating A Study Space with LoFi</p>
                    <button className={styles.signUpButton}>Sign Up</button>
                </div>
                <div className={styles.navSection}>
                    <h3>Navigation</h3>
                    <ul>
                        <li><Link href="/app">Study App</Link></li>
                        <li><Link href="/aboutus">About Us</Link></li>
                        <li><Link href="/dev-updates">Changelog</Link></li>
                        <li><Link href="/feedback">Feedback</Link></li>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className={styles.navSection}>
                <h3>Legal</h3>
                    <ul>
                        <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                        <li><Link href="/terms-of-service">Terms of Service</Link></li>
                    </ul>
                </div>
                <div className={styles.navSection}>
                    
                </div>
            </div>
            <div className={styles.copyright}>
                © 2024 Copyright Lo-Fi.study. All rights reserved.
            </div>
        </footer>
    );
}