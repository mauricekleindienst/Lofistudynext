// components/Footer.js

import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>© 2024 Lo-Fi.Study App. All rights reserved.</p>
            <ul>
                <li><Link href="/legal">Legal</Link></li>
                <li><Link href="/data">Data Policy</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </footer>
    );
}
