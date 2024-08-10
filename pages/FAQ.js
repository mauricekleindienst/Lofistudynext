// pages/faq.js

import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

export default function FAQ() {
  const faqs = [
    {
      question: "What is Lo-Fi Study?",
      answer:
        "Lo-Fi Study is an app designed to enhance your study sessions with ambient sounds, Pomodoro timer, collaborative rooms, and more.",
    },
    {
      question: "How do I use the Pomodoro timer?",
      answer:
        "The Pomodoro timer helps you stay focused by breaking your study sessions into manageable chunks. Simply set the timer and start studying.",
    },
    {
      question: "Can I study with friends?",
      answer:
        "Yes, you can create Voice Calls to study with friends, chat, and stay motivated together.",
    },
    {
      question: "Is there a way to track my progress?",
      answer:
        "Yes, the app features a scoreboard where you can track your study progress and compete with friends.",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>FAQ - Lo-Fi Study</title>
        <meta
          name="description"
          content="Frequently Asked Questions about Lo-Fi Study"
        />
      </Head>
      
      <Header />

      <main className={styles.main}>
        <section className={styles.faqSection}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
