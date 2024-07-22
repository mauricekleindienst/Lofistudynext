// components/Navbar.js
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import CustomCursor from '../components/CustomCursor';

const logo = '/favicon.ico';

const Navbar = () => {
    return (
        <nav className={`navbar navbar-expand-md navbar-light bg-light ${styles.navbar}`} style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
            <div className="container-fluid">
                <Link href="/" passHref>
                    <span className="navbar-brand">
                        <Image src={logo} alt="Logo" width={50} height={50} className="d-inline-block align-top" />
                    </span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
               
                    <ul className="navbar-nav ms-auto">
                        <li className={`nav-item ${styles.navItem}`}>
                            <Link href="/contact" passHref>
                                <span className={`nav-link ${styles.navButton}`}>Contact</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${styles.navItem}`}>
                            <Link href="/faq" passHref>
                                <span className={`nav-link ${styles.navButton}`}>FAQ</span>
                            </Link>
                        </li>
                        <li className={`nav-item ${styles.navItem}`}>
                            <Link href="/auth/signin" passHref>
                                <span className={`nav-link ${styles.loginButton}`}>Sign In</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            
        </nav>
    );
};

export default Navbar;
