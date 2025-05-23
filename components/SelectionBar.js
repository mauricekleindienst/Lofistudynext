import React, { useState, useMemo, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "./DragDropComponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
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
import PdfModal from "./PdfModal";
import styles from "../styles/SelectionBar.module.css";

// Define the admin emails for access control
const ADMIN_EMAILS = ['admin@lofi.study', 'your-admin-email@example.com', 'kleindiema@gmail.com'];

const initialIcons = [
  { id: "pomodoro", label: "Pomodoro", icon: "alarm" },
  { id: "sounds", label: "Sounds", icon: "graphic_eq" },
  { id: "youtubePlayer", label: "YouTube", icon: "smart_display" },
  { id: "todo", label: "Todo", icon: "checklist" },
  { id: "notes", label: "Notes", icon: "note_alt" },
  { id: "quiz", label: "Flashcards", icon: "school" },
  { id: "stats", label: "Stats", icon: "bar_chart" },
  { id: "scoreboard", label: "Scoreboard", icon: "stairs" },
  { id: "info", label: "Info", icon: "info" },
  { id: "pdf", label: "PDF Library", icon: "picture_as_pdf" },
  { id: "settings", label: "Settings", icon: "settings" },
];

const components = {
  pomodoro: PomodoroTimer,
  sounds: Sounds,
  notes: Notes,
  scoreboard: Scoreboard,
  youtubePlayer: YouTubePlayer,
  todo: Todo,
  stats: Stats,
  settings: Settings,
  quiz: Quiz,
};

export default function SelectionBar({ userEmail, userName }) {
  const { data: session } = useSession();
  const router = useRouter();
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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [savedPdfs, setSavedPdfs] = useState([]);

  // Check if the current user is an admin
  const isAdmin = session && ADMIN_EMAILS.includes(session.user.email);

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
        const newInfo = {};
        
        // Fetch todos count
        try {
          const todosRes = await fetch('/api/todos/count');
          if (todosRes.ok) {
            const todosData = await todosRes.json();
            newInfo.todo = todosData.count;
          }
        } catch (e) {
          console.log('Failed to fetch todos count:', e.message);
        }

        // Fetch weekly pomodoro count
        try {
          const pomodoroRes = await fetch('/api/pomodoros/weekly');
          if (pomodoroRes.ok) {
            const pomodoroData = await pomodoroRes.json();
            newInfo.pomodoro = pomodoroData.count;
          }
        } catch (e) {
          console.log('Failed to fetch pomodoro count:', e.message);
        }

        // Fetch flashcards count
        try {
          const flashcardsRes = await fetch('/api/flashcards/count');
          if (flashcardsRes.ok) {
            const flashcardsData = await flashcardsRes.json();
            newInfo.quiz = flashcardsData.count;
          }
        } catch (e) {
          console.log('Failed to fetch flashcards count:', e.message);
        }

        // Fetch user rank
        try {
          const rankRes = await fetch('/api/scoreboard/rank');
          if (rankRes.ok) {
            const rankData = await rankRes.json();
            newInfo.scoreboard = rankData.rank;
          }
        } catch (e) {
          console.log('Failed to fetch scoreboard rank:', e.message);
        }

        setComponentInfo(prev => ({ ...prev, ...newInfo }));
      } catch (error) {
        console.error('Error fetching component info:', error);
      }
    };

    fetchInfo();
    // Reduced polling interval for other components that don't have live updates
    const interval = setInterval(fetchInfo, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [session]);

  // Cleanup PDFs when component unmounts
  useEffect(() => {
    return () => {
      savedPdfs.forEach(pdf => {
        if (pdf.file) {
          URL.revokeObjectURL(pdf.file);
        }
      });
    };
  }, []);

  const toggleComponentVisibility = (component) => {
    if (component === "help") {
    
      setShowTutorial(true);
      return;
    }

    if (component === "pdf") {
      setShowPdfModal(!showPdfModal);
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
    () => {
      return visibleComponents.map((component) => {
        const Component = components[component];
        if (!Component) return null;
        return (
          <Component
            key={component}
            onClose={() => toggleComponentVisibility(component)}
            onMinimize={() => toggleComponentVisibility(component)}
            userEmail={userEmail}
            userName={userName}
          />
        );
      });
    },
    [visibleComponents, userEmail, userName]
  );

  const toggleZenMode = () => {
    setZenMode((prev) => !prev); // Toggle Zen Mode state
  };

  // Function to navigate to the admin feedback page
  const goToAdminFeedback = () => {
    router.push('/admin/feedback');
  };

  return (
    <div>
      {showTutorial && (
        <BackgroundPrompt onClose={() => setShowTutorial(false)} />
      )}
      {showPdfModal && (
        <PdfModal
          onClose={() => setShowPdfModal(false)}
          savedPdfs={savedPdfs}
          setSavedPdfs={setSavedPdfs}
        />
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
