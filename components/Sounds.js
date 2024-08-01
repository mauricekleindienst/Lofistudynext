import { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import styles from "../styles/Sounds.module.css";
import {
  FaUmbrella,
  FaFire,
  FaWater,
  FaKeyboard,
  FaSnowflake
} from "react-icons/fa";
import { FaHouseFloodWaterCircleArrowRight } from "react-icons/fa6";

const sounds = [
  { name: "Rain", icon: <FaUmbrella />, file: "/sounds/rain.mp3" },
  { name: "Fire", icon: <FaFire />, file: "/sounds/fire.mp3" },
  { name: "Ocean", icon: <FaWater />, file: "/sounds/ocean.mp3" },
  { name: "Waterstream", icon: <FaHouseFloodWaterCircleArrowRight />, file: "/sounds/waterstream.mp3" },
  { name: "Keyboard", icon: <FaKeyboard />, file: "/sounds/keyboard.mp3" },
  { name: "Blizzard", icon: <FaSnowflake />, file: "/sounds/blizzard.mp3" }
];

export default function Sounds({ onMinimize }) {
  const [volumes, setVolumes] = useState(Array(sounds.length).fill(0));
  const audioRefs = useRef(sounds.map(() => new Audio()));

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
    const newVolumes = [...volumes];
    newVolumes[index] = volume;
    setVolumes(newVolumes);
    audioRefs.current[index].volume = volume / 100;
    if (volume > 0) {
      audioRefs.current[index].play();
    } else {
      audioRefs.current[index].pause();
    }
  };

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.soundsContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Ambient Sounds</h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>
              Play ambient sounds for focus.
            </span>
          </div>
          <button onClick={onMinimize} className={styles.minimizeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>
        <div className={styles.soundsList}>
          {sounds.map((sound, index) => (
            <div key={sound.name} className={styles.sound}>
              <span className={styles.icon}>{sound.icon}</span>
              <span className={styles.soundName}>{sound.name}</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volumes[index]}
                onChange={(e) =>
                  handleVolumeChange(index, parseInt(e.target.value))
                }
                className={styles.slider}
              />
            </div>
          ))}
        </div>
      </div>
    </Draggable>
  );
}
