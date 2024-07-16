// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import { useEffect } from 'react';
import Typed from 'typed.js';

const logoPath = '/lo-fi.study.svg';
const macChromePath = '/Macchrome.webp';

export default function Home() {
    useEffect(() => {
        const typed = new Typed('#typed-text', {
            strings: ["Work", "Study", "Chill", "Code"],
            typeSpeed: 120,
            backSpeed: 120,
            backDelay: 500,
            smartBackspace: true,
            loop: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className={styles.container}>
            <Head>
                <title>lo-fi.study - Improve Your Focus and Productivity</title>
                <meta name="description" content="lo-fi.study is a website that helps you to study by giving you a distraction-free environment. Enjoy ambient music and focus better." />
                <meta name="author" content="lo-fi.study" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="lo-fi.study - Improve Your Focus and Productivity" />
                <meta property="og:description" content="lo-fi.study is a website that helps you to study by giving you a distraction-free environment. Enjoy ambient music and focus better." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.lo-fi.study" />
                <meta property="og:image" content="/images/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="lo-fi.study - Improve Your Focus and Productivity" />
                <meta name="twitter:description" content="lo-fi.study is a website that helps you to study by giving you a distraction-free environment. Enjoy ambient music and focus better." />
                <meta name="twitter:image" content="/images/twitter-image.jpg" />
            </Head>
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className={styles.heroImg}>
                            <Image src={logoPath} alt="lo-fi.study Logo" className={styles.loginLogo} width={300} height={300} />
                        </div>
                        <div className={styles.heroText} style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '2em' }}>Your calm, digital space to<br /><br /><span style={{ textAlign: 'center' }} id="typed-text"></span></p>
                        </div>
                        <Link href="/signup" legacyBehavior>
                            <a className={styles.heroImgBtn}>Register now</a>
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <Image id="image1" src={macChromePath} alt="website preview" className={`${styles.webPrev} ${styles.imgShadow} ${styles.smoothTransition}`} width={800} height={600} />
                    </div>
                </div>
                {/* Add more sections as necessary */}
            </div>
        </div>
    );
}
