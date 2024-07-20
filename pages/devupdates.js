// pages/dev-updates.js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function DevUpdates() {
    const router = useRouter();
    const updates = [
        {
            title: "Version 1.2.0 Released",
            date: "2024-06-15",
            description: "We've added new ambient sounds and improved the Pomodoro timer functionality. Bug fixes and performance improvements included."
        },
        {
            title: "Collaborative Rooms Feature",
            date: "2024-05-10",
            description: "You can now create and join collaborative rooms to study with friends. Stay motivated together with our new chat feature."
        },
        {
            title: "Progress Tracking",
            date: "2024-04-01",
            description: "Track your study progress with our new scoreboard. Compete with friends and stay on top of your study goals."
        }
    ];

    return (
        <div className={styles.container}>
            <Head>
                <title>Dev Updates - Lo-Fi Study</title>
                <meta name="description" content="Development Updates for Lo-Fi Study" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <section className={styles.updateSection}>
                    <h1 className={styles.title}>Development Updates</h1>
                    <div className={styles.updateGrid}>
                        {updates.map((update, index) => (
                            <div key={index} className={styles.updateItem}>
                                <h3 className={styles.updateTitle}>{update.title}</h3>
                                <p className={styles.updateDate}>{update.date}</p>
                                <p className={styles.updateDescription}>{update.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>© 2024 Lo-Fi.Study App. All rights reserved.</p>
                <ul>
                    <li><Link href="/legal">Legal</Link></li>
                    <li><Link href="/data">Data Policy</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </footer>
        </div>
    );
}
