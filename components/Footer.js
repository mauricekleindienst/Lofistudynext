import Link from 'next/link';
import styles from './Footer.module.css'; // Adjust the path as necessary

const Footer = () => (
    <footer className={styles.footer}>
        <p>© 2024 Lo-Fi.Study App. All rights reserved.</p>
        <ul>
            <li>
                <Link href="/legal">
                    <a>Legal</a>
                </Link>
            </li>
            <li>
                <Link href="/data">
                    <a>Data Policy</a>
                </Link>
            </li>
            <li>
                <Link href="/contact">
                    <a>Contact</a>
                </Link>
            </li>
        </ul>
    </footer>
);

export default Footer;
