// components/Footer.js

import Link from 'next/link';
import styles from '../styles/Footer.module.css';
import Image from 'next/image';
import { FaTiktok, FaInstagram, FaGlobe } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.logo}>
                    <Link href="/">
                    <Image src="/lo-fi.study.svg" alt="LoFi" width={100} height={100}/>
                    </Link>
                    <p>Creating A Study Space with LoFi</p>
                    <button className={styles.signUpButton}> <Link href="/auth/signin">Sign Up</Link></button>
                </div>
                <div className={styles.navSection}>
                    <h3>Navigation</h3>
                    <ul>
                        <li><Link href="/app">Study App</Link></li>
                        <li><Link href="/aboutus">About Us</Link></li>
                        <li><Link href="/dev-updates">Changelog</Link></li>
                        <li><Link href="/FAQ">FAQ</Link></li>
                        <li><Link href="/Contact">Contact</Link></li>
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
                    <h3>Follow Us</h3>
                    <div className={styles.socialIcons}>
                        <Link href="https://www.tiktok.com/@lofi.study.app?lang=en" target="_blank" rel="noopener noreferrer">
                            <FaTiktok size={24} />
                        </Link>
                        <Link href="https://www.instagram.com/lo_fi.study/" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} />
                        </Link>
                        <Link href="https://www.mousewerk.de" target="_blank" rel="noopener noreferrer">
                            <FaGlobe size={24} />
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                © 2025 Copyright Lo-Fi.Study. All rights reserved.
            </div>
        </footer>
    );
}
