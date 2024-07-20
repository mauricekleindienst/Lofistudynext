import Link from 'next/link';
import styles from './Footer.module.css'; // Adjust the path as necessary
import styles from '../styles/Home.module.css';
const Footer = () => (
    <footer className={styles.footer}>
        <p>© 2024 Lo-Fi.Study App. All rights reserved.</p>
        <ul>
            <li><Link href="/legal">Legal</Link></li>
            <li><Link href="/data">Data Policy</Link></li>
            <li><Link href="/contact">Contact</Link></li>
        </ul>
        
    </footer>
);

export default Footer;
