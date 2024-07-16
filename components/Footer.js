// components/Footer.js
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Footer = () => {
    return (
        <div className={`row ${styles.rowWithLine}`}>
            <div className={`container py-3 ${styles.footerWithLine}`}>
                <div className={`footer-content d-flex justify-content-between align-items-center ${styles.footerContent}`}>
                    <div className={`footer-left ${styles.footerLeft}`}>
                        <div className={`copyright py-2 ${styles.copyright}`}>
                            <Image className={`logo-shadow ${styles.reducedSize}`} src="/favicon.ico" alt="Logo" width={50} height={50} />
                            <p className="text-white">Copyright © 2024 lo-fi.study</p>
                        </div>
                    </div>
                    <div className={`footer-middle ${styles.footerMiddle}`}>
                        <div className={`settings-item py-2 ${styles.settingsItem}`}>
                            <Link href="/legal_notice" passHref>
                                <a className={`settings-link text-white ${styles.settingsLink}`}>Legal Notice</a>
                            </Link>
                        </div>
                        <div className={`settings-item py-2 ${styles.settingsItem}`}>
                            <Link href="/privacy_policy" passHref>
                                <a className={`settings-link text-white ${styles.settingsLink}`}>Privacy Policy</a>
                            </Link>
                        </div>
                    </div>
                    <div className={`footer-right ${styles.footerRight}`}>
                        <div className={`settings-item py-2 ${styles.settingsItem}`}>
                            <Link href="https://www.instagram.com/your_instagram_handle" passHref>
                                <a className={`settings-link text-white ${styles.settingsLink}`}>
                                    <i className="fab fa-instagram fa-3x"></i>
                                </a>
                            </Link>
                        </div>
                        <div className={`settings-item py-2 ${styles.settingsItem}`}>
                            <Link href="https://twitter.com/lo_fi_study" passHref>
                                <a className={`settings-link text-white ${styles.settingsLink}`}>
                                    <i className="fab fa-x-twitter fa-3x"></i>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
