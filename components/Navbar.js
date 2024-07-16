// pages/index.js
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
                <div className="row">
                    <div className="col-md-6">
                        <div id="carouselExampleIndicators" className={`carousel slide ${styles.carouselSlide}`} data-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <Image className="d-block w-100" style={{ borderRadius: '10px !important' }} src="https://i.ibb.co/K0qdm4r/lgsarius-cyberpunk-night-study-girl-window-desklight-c1650ad7-776d-470a-a2e0-da9e78140212.webp" alt="First slide" width={800} height={400} />
                                </div>
                                <div className="carousel-item">
                                    <Image className="d-block w-100" style={{ borderRadius: '10px !important' }} src="https://i.ibb.co/fGQQfWr/lgsarius-Lofi-study-girl-on-desk-cybperunk-like-coffee-rain-82a5d58d-44f1-4b9a-ae8f-1f82844543a6.webp" alt="Second slide" width={800} height={400} />
                                </div>
                                <div className="carousel-item">
                                    <Image className="d-block w-100" style={{ borderRadius: '10px !important' }} src="https://i.ibb.co/pdsgshq/lgsarius-Lofi-girl-and-cat-studying-in-a-field-sunset-3d94459d-fd73-43ee-8c1f-c4547239bb7a.webp" alt="Third slide" width={800} height={400} />
                                </div>
                                <div className="carousel-item">
                                    <Image className="d-block w-100" style={{ borderRadius: '10px !important' }} src="https://i.ibb.co/PG0bPhB/lgsarius-Lofi-study-girl-on-desk-plants-rain-coffee-rain-02e5bc5f-943e-4c0b-b986-1cf5d7362034.webp" alt="Fourth slide" width={800} height={400} />
                                </div>
                                <div className="carousel-item">
                                    <Image className="d-block w-100" style={{ borderRadius: '10px !important' }} src="https://i.ibb.co/m9QYfwJ/lgsarius-Lofi-Trainstation-sunset-648859c2-8af6-4b30-b276-dca8f45ba231.webp" alt="Fifth slide" width={800} height={400} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className={styles.contentContainer}>
                            <div className={styles.heroText}>
                                <h1 style={{ textAlign: 'center' }}>Craft your focus environment</h1>
                                <p style={{ textAlign: 'center' }}>Whether you prefer getting work done in the cozy atmosphere of a cafe or escaping to the tranquil shores of the beach, lo-fi.study offers you both experiences and much more.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="container px-4 px-lg-5">
                        <h2 className="text-center mt-0">lo-fi.study Features</h2>
                        <hr className="divider" />
                        <div className="row gx-4 gx-lg-5">
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="mt-2">
                                    <i className="fas fa-clock fa-4x"></i>
                                    <div className="mb-2"><i className="bi-gem fs-1 text-primary"></i></div>
                                    <h3 className="h4 mb-2">Pomodoro Timer</h3>
                                    <p className="text-muted mb-0">Boost productivity with our Pomodoro Timer feature, helping you stay focused and efficient.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="mt-2">
                                    <i className="fab fa-soundcloud fa-4x"></i>
                                    <div className="mb-2"><i className="bi-laptop fs-1 text-primary"></i></div>
                                    <h3 className="h4 mb-2">Curated Music</h3>
                                    <p className="text-muted mb-0">Enhance your study sessions with our vast collection of curated music playlists suitable for every mood.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="mt-2">
                                    <i className="fas fa-clipboard fa-4x"></i>
                                    <div className="mb-2"><i className="bi-globe fs-1 text-primary"></i></div>
                                    <h3 className="h4 mb-2">Task Planner</h3>
                                    <p className="text-muted mb-0">Stay organized and on top of your tasks with our intuitive Task Planner.</p>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6 text-center">
                                <div className="mt-2">
                                    <i className="fas fa-sticky-note fa-4x"></i>
                                    <div className="mb-2"><i className="bi-heart fs-1 text-primary"></i></div>
                                    <h3 className="h4 mb-2">Notes Window</h3>
                                    <p className="text-muted mb-0">Capture your thoughts and ideas effortlessly with our Notes Window.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
