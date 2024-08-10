import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigateTo("/")}>
        <Image src="/lo-fi.study.svg" alt="lo-fi.study" width={100} height={100} />
      </div>
      <div className={styles.hamburger} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`${styles.buttonContainer} ${isMenuOpen ? styles.open : ''}`}>
        <button onClick={() => navigateTo("/dev-updates")} className={styles.contactButton}>
          Updates
        </button>
        <button onClick={() => navigateTo("/Contact")} className={styles.contactButton}>
          Contact
        </button>
        <button onClick={() => navigateTo("/FAQ")} className={styles.faqButton}>
          FAQ
        </button>
        <button onClick={() => navigateTo("/auth/signin")} className={styles.loginButton}>
          Sign In
        </button>
      </div>
    </header>
  );
}