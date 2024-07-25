// pages/terms-of-service.js

import { useRouter } from "next/router";
import Header from "../components/Header";
import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import { useState } from "react";
import styles from "../styles/Home.module.css";

export default function Terms() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setStatus("SUCCESS");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Terms of Service - Lo-Fi Study</title>
        <meta
          name="description"
          content="Read our terms of service at Lo-Fi Study"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.contactSection}>
          <h1 className={styles.title}>Terms of Service</h1>

          <p>
            <strong>Effective Date:</strong> 20/07/2024
          </p>
          <p>
            <strong>lo-fi.study</strong>
          </p>

          <h2>1. ACCEPTANCE OF TERMS</h2>
          <p>
            By accessing or using our website, you agree to be bound by these
            Terms of Service and our Privacy Policy. If you do not agree to
            these terms, please do not use our website.
          </p>

          <h2>2. CHANGES TO TERMS</h2>
          <p>
            We reserve the right to update or modify these Terms of Service at
            any time without prior notice. Your continued use of the website
            following the posting of any changes constitutes acceptance of those
            changes.
          </p>

          <h2>3. USER RESPONSIBILITIES</h2>
          <p>
            As a user of our website, you agree to use the website in compliance
            with all applicable laws and regulations. You agree not to use the
            website for any unlawful or prohibited purpose.
          </p>

          <h2>4. ACCOUNT REGISTRATION</h2>
          <p>
            To access certain features of our website, you may need to register
            an account. You agree to provide accurate and complete information
            during the registration process and to keep your account information
            updated.
          </p>

          <h2>5. LOGIN SERVICES</h2>
          <p>
            We offer login services via Google and Discord. By using these
            services, you agree to their respective terms and privacy policies.
            We collect and store your email address for login and communication
            purposes.
          </p>

          <h2>6. TERMINATION OF USE</h2>
          <p>
            We reserve the right to terminate or suspend your access to our
            website at any time, without notice, for conduct that we believe
            violates these Terms of Service or is harmful to other users of the
            website, us, or third parties, or for any other reason.
          </p>

          <h2>7. DISCLAIMER OF WARRANTIES</h2>
          <p>
            Our website is provided &quot;as is&quot; and &quot;as
            available&quot; without any warranties of any kind, either express
            or implied. We do not warrant that the website will be uninterrupted
            or error-free.
          </p>

          <h2>8. LIMITATION OF LIABILITY</h2>
          <p>
            In no event shall we be liable for any indirect, incidental,
            special, consequential, or punitive damages arising out of or
            related to your use of the website.
          </p>

          <h2>9. INDEMNIFICATION</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims,
            damages, or expenses arising out of your use of the website or your
            violation of these Terms of Service.
          </p>

          <h2>10. CONTACT INFORMATION</h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at support@lo-fi.study.
          </p>

          <p>
            <strong>Lofi Study - All rights reserved.</strong>
          </p>
          <p>
            <strong>Last updated:</strong> 20/07/2024
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
