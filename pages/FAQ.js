// pages/faq.js

import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Lo-Fi Study?",
      answer: "Lo-Fi Study is a free tool designed to enhance your study sessions with ambient sounds, Pomodoro timer, collaborative rooms, and more. It aims to create an optimal studying environment to boost your productivity and focus."
    },
    {
      question: "How do I use the Pomodoro timer?",
      answer: "The Pomodoro timer helps you stay focused by breaking your study sessions into manageable chunks. Simply set the timer for your desired study duration (typically 25 minutes), followed by a short break. After four Pomodoro sessions, take a longer break. This technique helps maintain focus and prevents burnout."
    },
    {
      question: "Can I study with friends?",
      answer: "Yes, you can create Voice Calls to study with friends, chat, and stay motivated together. Our collaborative rooms feature allows you to join or create study groups, share your progress, and keep each other accountable."
    },
    {
      question: "Is there a way to track my progress?",
      answer: "Yes, the app features a scoreboard where you can track your study progress and compete with friends. You can see your daily and weekly study time, completed Pomodoro sessions, and even earn achievements for consistent studying."
    },
    {
      question: "What kind of ambient sounds are available?",
      answer: "Lo-Fi Study offers a variety of ambient sounds to create the perfect study atmosphere. These include rain sounds, coffee shop ambiance, nature sounds, and of course, a selection of lo-fi music tracks. You can mix and match these sounds to create your ideal study environment."
    },
    {
      question: "Is Lo-Fi Study free to use?",
      answer: "Yes, Lo-Fi Study is completely free to use. We believe in providing accessible tools to help students and professionals improve their study habits without any cost barriers."
    },
    {
      question: "Can I use Lo-Fi Study on my mobile device?",
      answer: "Absolutely! Lo-Fi Study is designed to be responsive and works well on both desktop and mobile devices. You can access it through your mobile browser or download our app from the App Store or Google Play Store."
    },
    {
      question: "How can I provide feedback or report issues?",
      answer: "We value your feedback! You can reach out to us through the 'Contact' page on our website or send an email to support@lofistudy.com. For quick issues or suggestions, you can also use the feedback button within the app."
    },
    {
      question: "Are there any plans to add more features?",
      answer: "Yes, we're constantly working on improving Lo-Fi Study. Some features in our roadmap include customizable study plans, integration with popular task management apps, and more collaborative tools. Stay tuned for updates!"
    },
    {
      question: "How does Lo-Fi Study help with productivity?",
      answer: "Lo-Fi Study combines several research-backed techniques to boost productivity. The Pomodoro timer helps manage your time effectively, ambient sounds reduce distractions, and the social features provide accountability. Together, these create an environment conducive to focused, productive study sessions."
    }
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
        <motion.section 
          className={styles.faqSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Frequently Asked <span className={styles.gradientText}>Questions</span>
          </motion.h1>
          
          <motion.div 
            className={styles.faqGrid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={styles.faqItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.button
                  className={`${styles.faqQuestion} ${openIndex === index ? styles.active : ''}`}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {faq.question}
                  <motion.span 
                    className="material-icons"
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    expand_more
                  </motion.span>
                </motion.button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      className={styles.faqAnswer}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
