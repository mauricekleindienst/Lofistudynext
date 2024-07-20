// pages/dev-updates.js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';
import updates from '../data/updates.json';

export default function DevUpdates() {
    const router = useRouter();

    const handleUpdateClick = (id) => {
        router.push(`/dev-updates/${id}`);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Dev Updates - Lo-Fi Study</title>
                <meta name="description" content="Development Updates for Lo-Fi Study" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className={styles.main}>
                <section className={styles.devUpdateSection}>
                    <h1 className={styles.title}>Development Updates</h1>
                    <div className={styles.devUpdateGrid}>
                        {updates.map((update) => (
                            <div 
                                key={update.id} 
                                className={styles.devUpdateItem}
                                onClick={() => handleUpdateClick(update.id)}
                            >
                                <h3 className={styles.devUpdateItemTitle}>{update.title}</h3>
                                <p className={styles.devUpdateItemDate}>{update.date}</p>
                                <p className={styles.devUpdateItemDescription}>{update.description}</p>
                                {Array.isArray(update.knownBugs) && update.knownBugs.length > 0 && (
                                    <div className={styles.devKnownBugs}>
                                        <h4>Known Bugs:</h4>
                                        <ul>
                                            {update.knownBugs.map((bug, index) => (
                                                <li key={index}>{bug}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <p className={styles.devReadMore}>Read more...</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
