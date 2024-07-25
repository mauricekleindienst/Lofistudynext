// pages/terms-of-service.js

import { useRouter } from "next/router";
import Header from "../components/Header";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function Terms() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Terms and Conditions - Lo-Fi Study</title>
        <meta
          name="description"
          content="Read our Terms and Conditions at Lo-Fi Study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.contactSection}>
          <h1 className={styles.title}>Terms and Conditions</h1>

          <p>
            <strong>Effective Date:</strong> 23/07/2024
          </p>
          <p>
            <strong>lo-fi.study</strong>
          </p>

          <h2>Operator Information (Impressum)</h2>
          <p>
            <strong>Operator:</strong> [Maurice Kleindienst]<br />
            <strong>Address:</strong> [Oberzwehrenerstraße 62b]<br />
            <strong>Email:</strong> [support@lo-fi.study]<br />
          </p>

          <h2>1. Scope of Application</h2>
          <p>
            These Terms and Conditions (T&C) apply to the use of our website. By using our website, you agree to these T&C.
          </p>

          <h2>2. Contract Formation</h2>
          <p>
            The presentation of products and services on our website does not constitute a legally binding offer, but rather a non-binding online catalog. By clicking the [Buy/Order] button, you submit a binding order.
          </p>

          <h2>3. Right of Withdrawal</h2>
          <p>
            As a consumer, you have the right to withdraw from this contract within fourteen days without giving any reason. The withdrawal period will expire after 14 days from the day of the conclusion of the contract. [Detailed information about the right of withdrawal to follow]
          </p>

          <h2>4. Prices and Payment</h2>
          <p>
            All prices are final prices and include statutory VAT. Payment is made via [payment methods].
          </p>

          <h2>5. Delivery</h2>
          <p>
            Delivery will be made within [delivery time] after receipt of payment. [Further details on delivery]
          </p>

          <h2>6. Warranty</h2>
          <p>
            The statutory warranty rights apply.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            We are liable without limitation for intent and gross negligence, as well as in accordance with the Product Liability Act. For slight negligence, we are liable for damages resulting from injury to life, body, or health of persons.
          </p>

          <h2>8. Data Protection</h2>
          <p>
            We process your personal data in accordance with our Privacy Policy and in compliance with the General Data Protection Regulation (GDPR).
          </p>

          <h2>9. Copyright</h2>
          <p>
            All content on this website is subject to German copyright law. Any form of reproduction, editing, distribution, and any kind of exploitation beyond the limits of copyright law requires the written consent of the respective author or creator.
          </p>

          <h2>10. Applicable Law and Jurisdiction</h2>
          <p>
            The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods. For consumers with habitual residence in the EU, the mandatory provisions of the law of the country of residence shall also apply. The place of jurisdiction for merchants within the meaning of the German Commercial Code is [your jurisdiction].
          </p>

          <h2>11. Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (OS), which you can find at https://ec.europa.eu/consumers/odr/. We are neither willing nor obligated to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>

          <h2>12. Severability Clause</h2>
          <p>
            Should individual provisions of this contract be invalid or unenforceable or become invalid or unenforceable after conclusion of the contract, the validity of the rest of the contract remains unaffected.
          </p>

          <h2>13. Contact Information</h2>
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <p>
            [Your Full Name or Company Name]<br />
            [Your Full Address]<br />
            Email: [Your Email]<br />
            Phone: [Your Phone Number]
          </p>

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