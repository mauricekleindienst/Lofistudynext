// pages/contact.js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Contact() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = new FormData(form);
        const response = await fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            setStatus('SUCCESS');
            setName('');
            setEmail('');
            setMessage('');
        } else {
            setStatus('ERROR');
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>LEGAL NOTICE - Lo-Fi Study</title>
                <meta name="description" content="Get in touch with us at Lo-Fi Study" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
           

            <main className={styles.main}>
                <section className={styles.contactSection}>
                <h1>LEGAL NOTICE</h1>

<p><strong>Effective Date:</strong> 01/02/2024</p>
<p><strong>lo-fi.study</strong></p>

<h2>1. COLLECTION OF PERSONAL INFORMATION</h2>
<p>We may collect the following types of personal information when you visit our website:</p>
<ul>
    <li>Information you provide directly, such as [list specific information like name, email address, etc.].</li>
    <li>Automatically collected information: We may also collect information about your visit to our website, including your IP address, browser type, device information, and browsing behavior.</li>
</ul>

<h2>2. USE OF PERSONAL INFORMATION</h2>
<p>We use the collected personal information for the following purposes:</p>
<ul>
    <li>Login Service.</li>
</ul>

<h2>3. SHARING OF PERSONAL INFORMATION</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to third parties unless we provide you with notice and obtain your consent.</p>
<p>However, we may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.</p>

<h2>5. DATA SECURITY</h2>
<p>We implement reasonable security measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is completely secure.</p>

<h2>6. YOUR RIGHTS</h2>
<p>You have the right to:</p>
<ul>
    <li>Access, correct, update, or delete your personal information.</li>
    <li>Object to or restrict the processing of your personal information.</li>
    <li>Withdraw your consent for the processing of your personal information.</li>
</ul>
<p>To exercise these rights, please contact us at [Your Contact Information].</p>

<h2>7. CHANGES TO THIS PRIVACY POLICY</h2>
<p>We reserve the right to modify this privacy policy at any time. Changes and clarifications will take effect immediately upon posting on the website.</p>

<h2>8. CONTACT INFORMATION</h2>
<p>If you have any questions about this privacy policy, please contact us at support@mousewerk.de.</p>

<p><strong>Lofi Study- All rights reserved.</strong></p>
<p><strong>Last updated:</strong> 01/02/2024</p>    
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
