// pages/privacy-policy.js

import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function PrivacyPolicy() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Privacy Policy - Lo-Fi Study</title>
        <meta
          name="description"
          content="Privacy Policy of Lo-Fi Study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        <section className={styles.privacySection}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p>
            <strong>Effective Date:</strong> 23/07/2024
          </p>
          <p>
            <strong>lo-fi.study</strong>
          </p>

          <h2>1. Introduction</h2>
          <p>
  Lo-Fi Study (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
</p>

          <h2>2. Data Controller</h2>
          <p>
            Lo-Fi Study is the controller and responsible for your personal data. If you have any questions about this privacy policy, please contact us at support@lo-fi.study.
          </p>

          <h2>3. Personal Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you, which we have grouped together as follows:</p>
          <ul>
            <li>Identity Data: includes first name, last name, username or similar identifier.</li>
            <li>Contact Data: includes email address and telephone numbers.</li>
            <li>Technical Data: includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li>Usage Data: includes information about how you use our website and services.</li>
          </ul>

          <h2>4. How We Collect Your Personal Data</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li>Direct interactions: You may give us your Identity and Contact Data by filling in forms or by corresponding with us.</li>
            <li>Automated technologies or interactions: As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns.</li>
            <li>Third parties or publicly available sources: We may receive personal data about you from various third parties, such as Google Analytics.</li>
          </ul>

          <h2>5. How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>To provide and maintain our service, including to monitor the usage of our website.</li>
            <li>To manage your account: to manage your registration as a user of the service.</li>
            <li>To contact you: To contact you by email or other equivalent forms of electronic communication regarding updates or informative communications related to the functionalities, products or contracted services.</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.</p>

          <h2>7. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.</p>

          <h2>8. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          <p>If you wish to exercise any of these rights, please contact us at support@lo-fi.study.</p>

          <h2>9. Changes to This Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this Privacy Policy.</p>

          <h2>10. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us at support@lo-fi.study.</p>

          <p>
            <strong>Lo-Fi Study - All rights reserved.</strong>
          </p>
          <p>
            <strong>Last updated:</strong> 23/07/2024
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}