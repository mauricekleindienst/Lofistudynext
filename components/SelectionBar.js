import React, { useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
  const [icons, setIcons] = useState(initialIcons);
  const [visibleComponents, setVisibleComponents] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState(false);
  const [zenMode, setZenMode] = useState(false); // Add Zen Mode state

  const toggleComponentVisibility = (component) => {
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
