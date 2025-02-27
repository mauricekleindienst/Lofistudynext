// pages/contact.js

import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";
import { motion } from "framer-motion";

export default function Contact() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    
    setStatus("SENDING");
    
    try {
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
        
        // Clear success message after 5 seconds
        setTimeout(() => setStatus(""), 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setStatus("ERROR");
      
      // Clear error message after 5 seconds
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Contact - Lo-Fi Study</title>
        <meta
          name="description"
          content="Get in touch with us at Lo-Fi Study"
        />
      </Head>

      <Header />

      <main className={styles.main}>
        <motion.section 
          className={styles.contactSection}
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
            Get in <span className={styles.gradientText}>Touch</span>
          </motion.h1>
          <motion.p 
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We&apos;d love to hear from you! Send us your questions, feedback, or suggestions.
          </motion.p>
          
          <motion.div 
            className={styles.contactWrapper}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={styles.contactInfo}>
              <div className={styles.contactMethod}>
               
               
              </div>
            
              <div className={styles.contactMethod}>
                <span className="material-icons">forum</span>
                <div>
                  <h3>Community</h3>
                  <p>Join our Discord server</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              action="https://formspree.io/f/mqazannj"
              method="POST"
              className={styles.contactForm}
            >
              <div className={styles.formGroup}>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div className={styles.formGroup}>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div className={styles.formGroup}>
                <motion.textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Your message"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <motion.button 
                type="submit" 
                className={styles.submitButton}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,123,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
                disabled={status === "SENDING"}
              >
                {status === "SENDING" ? (
                  <span className={styles.sendingSpinner}>
                    <span className="material-icons">sync</span>
                    Sending...
                  </span>
                ) : "Send Message"}
              </motion.button>
              
              {status === "SUCCESS" && (
                <motion.div 
                  className={`${styles.formMessage} ${styles.successMessage}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="material-icons">check_circle</span>
                  Thanks! Your message has been sent.
                </motion.div>
              )}
              
              {status === "ERROR" && (
                <motion.div 
                  className={`${styles.formMessage} ${styles.errorMessage}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <span className="material-icons">error</span>
                  Oops! There was an error. Please try again.
                </motion.div>
              )}
            </form>
          </motion.div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
