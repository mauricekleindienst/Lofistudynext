import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMusic, faImages, faComments, faStickyNote, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const features = [
  {
    title: 'Focus Timer',
    description: 'Boost your productivity with our Pomodoro timer.',
    icon: faClock
  },
  {
    title: 'Ambient Sounds',
    description: 'Relax and focus with a variety of ambient soundscapes.',
    icon: faMusic
  },
  {
    title: 'Custom Backgrounds',
    description: 'Personalize your space with different background videos.',
    icon: faImages
  },
  {
    title: 'Live Chat',
    description: 'Interact and study together with others in real-time.',
    icon: faComments
  },
  {
    title: 'Notes',
    description: 'Keep your notes organized and accessible.',
    icon: faStickyNote
  },
  {
    title: 'Calendar',
    description: 'Schedule your study sessions and stay on track.',
    icon: faCalendarAlt
  }
];

const backgrounds = [
  '/backgrounds/Night.mp4',
  '/backgrounds/Rain.mp4',
  '/backgrounds/Train.mp4',
  '/backgrounds/Classroom.mp4',
  '/backgrounds/Autumn.mp4',
  '/backgrounds/Couch.mp4'
];

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/lo-fi.study.svg" alt="lo-fi.study" width={100} height={100} />
        </div>
        <nav className={styles.nav}>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
          <Link href="/study" passHref>
            <button className={styles.loginButton}>Login</button>
          </Link>
        </nav>
      </header>
      <main className={styles.main}>
        <div className={styles.carouselContainer}>
          <Carousel
            showThumbs={false}
            autoPlay
            infiniteLoop
            showStatus={false}
            showIndicators={false}
            interval={5000}
          >
            {backgrounds.map((bg, index) => (
              <div key={index}>
                <video autoPlay loop muted src={bg} className={styles.carouselVideo} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className={styles.hero}>
          <h1>lo-fi.study</h1>
          <p>Your calm, digital space to</p>
          <h2>Work</h2>
          <Link href="/login" passHref>
            <button className={styles.registerButton}>Register now</button>
          </Link>
        </div>
      </main>
      <section className={styles.features}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <FontAwesomeIcon icon={feature.icon} className={styles.featureIcon} />
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </section>
      <footer className={styles.footer}>
        <p>&copy; 2024 lo-fi.study</p>
      </footer>
    </div>
  );
}
