import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Sounds.module.css";
import {
  FaUmbrella,
  FaFire,
  FaWater,
  FaKeyboard,
  FaSnowflake,
  FaCoffee 
} from "react-icons/fa";
import { FaHouseFloodWaterCircleArrowRight } from "react-icons/fa6";

const sounds = [
  { name: "Rain", icon: <FaUmbrella />, file: "/sounds/rain.mp3" },
  { name: "Fire", icon: <FaFire />, file: "/sounds/fire.mp3" },
  { name: "Ocean", icon: <FaWater />, file: "/sounds/ocean.mp3" },
  { name: "River", icon: <FaHouseFloodWaterCircleArrowRight />, file: "/sounds/waterstream.mp3" },
  { name: "Keyboard", icon: <FaKeyboard />, file: "/sounds/keyboard.mp3" },
  { name: "Coffee", icon: <FaCoffee />, file: "/sounds/coffee.mp3" },
  { name: "Blizzard", icon: <FaSnowflake />, file: "/sounds/blizzard.mp3" }
];

export default function Sounds({ onMinimize }) {
  const [volumes, setVolumes] = useState(Array(sounds.length).fill(0));
  const audioRefs = useRef([]);

useEffect(() => {
  if (!audioRefs.current.length) {
    audioRefs.current = sounds.map(() => new Audio());
  }
  const currentAudioRefs = audioRefs.current;
  currentAudioRefs.forEach((audio, index) => {
    audio.src = sounds[index].file;
    audio.loop = true;
  });

  return () => {
    currentAudioRefs.forEach((audio) => audio.pause());
  };
}, []);

  useEffect(() => {
    const currentAudioRefs = audioRefs.current;
    currentAudioRefs.forEach((audio, index) => {
      audio.src = sounds[index].file;
      audio.loop = true;
    });

    return () => {
      currentAudioRefs.forEach((audio) => audio.pause());
    };
  }, []);

  const handleVolumeChange = (index, volume) => {
    setVolumes((prev) => {
      const newVolumes = [...prev];
      newVolumes[index] = volume;
      return newVolumes;
    });
    const audio = audioRefs.current[index];
    audio.volume = volume / 100;
    volume > 0 ? audio.play() : audio.pause();
  };
  
  
  return (
    <Draggable handle=".drag-handle">
      <div className={styles.soundsContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Ambient Sounds</h2>
          <button onClick={onMinimize} className={styles.minimizeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>
        <div className={styles.soundsList}>
          {sounds.map((sound, index) => (
            <div key={sound.name} className={styles.sound}>
              <span
                className={`${styles.icon} ${volumes[index] > 0 ? styles.iconPlaying : ''}`}
              >
                {sound.icon}
              </span>
              <span className={styles.soundName}>{sound.name}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[index]}
                onChange={(e) => handleVolumeChange(index, parseInt(e.target.value))}
                className={styles.slider}
              />
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
