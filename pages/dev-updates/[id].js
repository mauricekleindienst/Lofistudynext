// pages/dev-updates/[id].js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
import updates from '../../data/updates.json';

export default function UpdateDetail() {
    const router = useRouter();
    const { id } = router.query;
    const update = updates.find(update => update.id === parseInt(id));

    if (!update) {
        return <p>Update not found</p>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{update.title} - Lo-Fi Study</title>
                <meta name="description" content={update.description} />
               
            </Head>

            <main className={styles.main}>
                <section className={styles.devUpdateSection}>
                    <h1 className={styles.devUpdateTitle}>{update.title}</h1>
                    <div className={styles.devUpdateItem}>
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
                        <Link href="/dev-updates">
                            <p className={styles.devBackLink}>Back to updates</p>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className={styles.footer}>
                <p>© 2024 Lo-Fi Study App. All rights reserved.</p>
                <ul className={styles.footerLinks}>
                    <li><Link href="/legal">Legal</Link></li>
                    <li><Link href="/data">Data Policy</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
            </footer>
        </div>
    );
}
