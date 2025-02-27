import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Sounds.module.css";
import {
  FaUmbrella,
  FaFire,
  FaWater,
  FaKeyboard,
  FaSnowflake,
  FaCoffee,
  FaVolumeUp,
  FaVolumeMute
} from "react-icons/fa";
import { FaHouseFloodWaterCircleArrowRight } from "react-icons/fa6";

const sounds = [
  { name: "Rain", icon: <FaUmbrella />, file: "/sounds/rain.mp3", color: "#4A90E2" },
  { name: "Fire", icon: <FaFire />, file: "/sounds/fire.mp3", color: "#FF6B6B" },
  { name: "Ocean", icon: <FaWater />, file: "/sounds/ocean.mp3", color: "#50E3C2" },
  { name: "River", icon: <FaHouseFloodWaterCircleArrowRight />, file: "/sounds/waterstream.mp3", color: "#4ECDC4" },
  { name: "Keyboard", icon: <FaKeyboard />, file: "/sounds/keyboard.mp3", color: "#A8A8A8" },
  { name: "Coffee", icon: <FaCoffee />, file: "/sounds/coffee.mp3", color: "#C49B76" },
  { name: "Blizzard", icon: <FaSnowflake />, file: "/sounds/blizzard.mp3", color: "#87CEEB" }
];

export default function Sounds({ onMinimize }) {
  const [volumes, setVolumes] = useState(Array(sounds.length).fill(0));
  const [masterVolume, setMasterVolume] = useState(100);
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

  const handleVolumeChange = (index, volume) => {
    setVolumes((prev) => {
      const newVolumes = [...prev];
      newVolumes[index] = volume;
      return newVolumes;
    });
    const audio = audioRefs.current[index];
    audio.volume = (volume / 100) * (masterVolume / 100);
    volume > 0 ? audio.play() : audio.pause();
  };

  const handleMasterVolumeChange = (value) => {
    setMasterVolume(value);
    audioRefs.current.forEach((audio, index) => {
      if (volumes[index] > 0) {
        audio.volume = (volumes[index] / 100) * (value / 100);
      }
    });
  };

  const toggleSound = (index) => {
    const newVolume = volumes[index] > 0 ? 0 : 75;
    handleVolumeChange(index, newVolume);
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

        <div className={styles.masterVolume}>
          <div className={styles.masterVolumeIcon}>
            {masterVolume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={(e) => handleMasterVolumeChange(parseInt(e.target.value))}
            className={styles.masterVolumeSlider}
          />
          <span className={styles.masterVolumeValue}>{masterVolume}%</span>
        </div>

        <div className={styles.soundsList}>
          {sounds.map((sound, index) => (
            <div 
              key={sound.name} 
              className={`${styles.sound} ${volumes[index] > 0 ? styles.active : ''}`}
              style={{ '--sound-color': sound.color }}
            >
              <button 
                className={styles.toggleButton}
                onClick={() => toggleSound(index)}
                title={volumes[index] > 0 ? "Stop" : "Play"}
              >
                <span className={styles.icon}>{sound.icon}</span>
              </button>
              
              <div className={styles.soundControls}>
                <span className={styles.soundName}>{sound.name}</span>
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volumes[index]}
                    onChange={(e) => handleVolumeChange(index, parseInt(e.target.value))}
                    className={styles.slider}
                  />
                  <span className={styles.volumeValue}>{volumes[index]}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
