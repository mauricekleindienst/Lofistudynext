import React, { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSession } from "next-auth/react";
import PomodoroTimer from "./PomodoroTimer";
import Sounds from "./Sounds";
import Notes from "./Notes";
import LiveChat from "./LiveChat";
import Scoreboard from "./Scoreboard";
import Settings from "./Settings";
import Todo from "./Todo";
import Stats from "./Stats";
import YouTubePlayer from "./YouTubePlayer";
import Quiz from "./Quiz";
import BackgroundPrompt from "./BackgroundPrompt";
import styles from "../styles/SelectionBar.module.css";

const initialIcons = [
  { id: "pomodoro", label: "Pomodoro", icon: "alarm" },
  { id: "sounds", label: "Sounds", icon: "graphic_eq" },
  { id: "youtubePlayer", label: "YouTube", icon: "smart_display" },
  { id: "todo", label: "Todo", icon: "checklist" },
  { id: "quiz", label: "Flashcards", icon: "school" },
  { id: "stats", label: "Stats", icon: "bar_chart" },
  { id: "scoreboard", label: "Scoreboard", icon: "stairs" },
  { id: "settings", label: "Settings", icon: "settings" },
  { id: "help", label: "Background Tutorial", icon: "help_outline" },
];

const components = {
  pomodoro: PomodoroTimer,
  sounds: Sounds,
  // note: Notes,
  scoreboard: Scoreboard,
  youtubePlayer: YouTubePlayer,
  todo: Todo,
  stats: Stats,
  settings: Settings,
  quiz: Quiz,
};

export default function SelectionBar({ userEmail, userName }) {
  const { data: session } = useSession();
  const [icons, setIcons] = useState(initialIcons);
  const [visibleComponents, setVisibleComponents] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState(false);
  const [zenMode, setZenMode] = useState(false); // Add Zen Mode state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(true);
  const [componentInfo, setComponentInfo] = useState({
    pomodoro: {
      count: null,
      isRunning: false,
      timeLeft: null,
      mode: null
    },
    todo: null,
    quiz: null,
    scoreboard: null
  });

  // Listen for Pomodoro updates
  useEffect(() => {
    const handlePomodoroUpdate = (event) => {
      if (event.detail) {
        setComponentInfo(prev => ({
          ...prev,
          pomodoro: event.detail
        }));
      }
    };

    window.addEventListener('pomodoroUpdate', handlePomodoroUpdate);
    return () => window.removeEventListener('pomodoroUpdate', handlePomodoroUpdate);
  }, []);

  // Listen for Todo updates
  useEffect(() => {
    const handleTodoUpdate = (event) => {
      if (event.detail && typeof event.detail.count === 'number') {
        setComponentInfo(prev => ({
          ...prev,
          todo: event.detail.count
        }));
      }
    };

    window.addEventListener('todoUpdate', handleTodoUpdate);
    return () => window.removeEventListener('todoUpdate', handleTodoUpdate);
  }, []);

  useEffect(() => {
    // Check tutorial state when component mounts
    const checkTutorialState = async () => {
      if (!userEmail) return;
      
      try {
        const response = await fetch('/api/tutorials/state?tutorial=background_prompt');
        const data = await response.json();
        // Only show tutorial automatically if it hasn't been completed
        if (!data.completed) {
          setShowTutorial(true);
        }
      } catch (error) {
        console.error('Failed to fetch tutorial state:', error);
      }
    };

    checkTutorialState();
  }, [userEmail]);

  // Fetch initial component info
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchInfo = async () => {
      try {
        console.log('Fetching component info...');
        
        // Fetch todos count
        const todosRes = await fetch('/api/todos/count');
        const todosData = await todosRes.json();

        // Fetch weekly pomodoro count
        const pomodoroRes = await fetch('/api/pomodoros/weekly');
        const pomodoroData = await pomodoroRes.json();

        // Fetch flashcards count
        const flashcardsRes = await fetch('/api/flashcards/count');
        const flashcardsData = await flashcardsRes.json();

        // Fetch user rank
        const rankRes = await fetch('/api/scoreboard/rank');
        const rankData = await rankRes.json();

        const newInfo = {
          todo: todosData.count,
          pomodoro: pomodoroData.count,
          quiz: flashcardsData.count,
          scoreboard: rankData.rank
        };

        console.log('Component info fetched:', newInfo);
        setComponentInfo(newInfo);
      } catch (error) {
        console.error('Error fetching component info:', error);
      }
    };

    fetchInfo();
    // Reduced polling interval for other components that don't have live updates
    const interval = setInterval(fetchInfo, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [session]);

  const toggleComponentVisibility = (component) => {
    if (component === "help") {
      console.log("Opening tutorial");
      setShowTutorial(true);
      return;
    }

    setVisibleComponents((prev) =>
      prev.includes(component)
        ? prev.filter((c) => c !== component)
        : [...prev, component]
    );
    if (component === "chat") setNewChatMessage(false);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedIcons = Array.from(icons);
    const [removed] = reorderedIcons.splice(result.source.index, 1);
    reorderedIcons.splice(result.destination.index, 0, removed);

    setIcons(reorderedIcons);
  };

  const formatTime = (seconds) => {
    if (!seconds) return null;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderInfoBadge = (iconId) => {
    const info = componentInfo[iconId];
    console.log(`Rendering badge for ${iconId}:`, info);

    if (iconId === 'pomodoro') {
      if (info?.isRunning && info?.timeLeft) {
        return (
          <div className={`${styles.infoBadge} ${styles.highlight}`}>
            {formatTime(info.timeLeft)}
          </div>
        );
      } else if (info?.count > 0) {
        return (
          <div className={`${styles.infoBadge} ${styles.highlight}`}>
            {info.count}
          </div>
        );
      }
      return null;
    }

    // Handle other badges
    if (!info || (typeof info === 'number' && info <= 0)) return null;

    let badgeClass = styles.infoBadge;
    if (iconId === 'scoreboard') badgeClass += ' ' + styles.small;

    return (
      <div className={badgeClass}>
        {iconId === 'scoreboard' ? `#${info}` : info}
      </div>
    );
  };

  const renderedComponents = useMemo(
    () =>
      Object.entries(components).map(([name, Component]) => (
        <div
          key={name}
          className={visibleComponents.includes(name) ? "" : styles.hidden}
        >
          <Component
            onMinimize={() => toggleComponentVisibility(name)}
            userEmail={userEmail}
            userName={userName}
            onNewMessage={() => setNewChatMessage(true)}
          />
        </div>
      )),
    [visibleComponents, userEmail, userName]
  );

  const toggleZenMode = () => {
    setZenMode((prev) => !prev); // Toggle Zen Mode state
  };

  return (
    <div>
      {showTutorial && (
        <BackgroundPrompt onClose={() => setShowTutorial(false)} />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="selectionBar" direction="horizontal">
          {(provided) => (
            <div
              className={`${styles.selectionBar} ${
                zenMode ? styles.hidden : "" // Conditionally hide bar in Zen Mode
              }`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {icons.map((icon, index) => (
                <Draggable key={icon.id} draggableId={icon.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.iconButton} ${
                        snapshot.isDragging ? styles.dragging : ""
                      } ${visibleComponents.includes(icon.id) ? styles.active : ""}`}
                      onClick={() => toggleComponentVisibility(icon.id)}
                      aria-label={icon.label}
                    >
                      <span className="material-icons">{icon.icon}</span>
                      {renderInfoBadge(icon.id)}
                      {icon.id === "chat" && newChatMessage && (
                        <span className={styles.notificationDot}></span>
                      )}
                      <div className={styles.tooltip}>{icon.label}</div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {renderedComponents}
    </div>
  );
}
