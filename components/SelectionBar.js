import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PomodoroTimer from './PomodoroTimer';
import Sounds from './Sounds';
import Notes from './Notes';
import Calendar from './Calendar';
import LiveChat from './LiveChat';
import Scoreboard from './Scoreboard';
import Settings from './Settings';
import Todo from './Todo';
import CustomCursor from '../components/CustomCursor';
import Stats from './Stats';
import styles from '../styles/SelectionBar.module.css';

const initialIcons = [
  { id: 'pomodoro', label: 'Pomodoro', icon: 'alarm' },
  { id: 'sounds', label: 'Sounds', icon: 'graphic_eq' },
  { id: 'note', label: 'Note', icon: 'edit' },
  { id: 'calendar', label: 'Calendar', icon: 'event' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'scoreboard', label: 'Scoreboard', icon: 'stairs' },
  { id: 'todo', label: 'Todo', icon: 'checklist' },
  { id: 'stats', label: 'Stats', icon: 'bar_chart' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const components = {
  pomodoro: PomodoroTimer,
  sounds: Sounds,
  note: Notes,
  calendar: Calendar,
  chat: LiveChat,
  scoreboard: Scoreboard,
  todo: Todo,
  stats: Stats,
  settings: Settings,
};

export default function SelectionBar({ userEmail, userName }) {
  const [icons, setIcons] = useState(initialIcons);
  const [visibleComponents, setVisibleComponents] = useState([]);
  const [newChatMessage, setNewChatMessage] = useState(false);

  const handleIconClick = (component) => {
    setVisibleComponents((prevVisibleComponents) =>
      prevVisibleComponents.includes(component)
        ? prevVisibleComponents.filter((c) => c !== component)
        : [...prevVisibleComponents, component]
    );
    if (component === 'chat') {
      setNewChatMessage(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedIcons = Array.from(icons);
    const [removed] = reorderedIcons.splice(result.source.index, 1);
    reorderedIcons.splice(result.destination.index, 0, removed);

    setIcons(reorderedIcons);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="selectionBar" direction="horizontal">
          {(provided) => (
            <div
              className={styles.selectionBar}
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
                      className={`${styles.iconButton} ${snapshot.isDragging ? styles.dragging : ''}`}
                      onClick={() => handleIconClick(icon.id)}
                      aria-label={icon.label}
                    >
                      <span className="material-icons">{icon.icon}</span>
                      {icon.id === 'chat' && newChatMessage && (
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
        <CustomCursor />
      </DragDropContext>
      {Object.entries(components).map(([name, Component]) => (
        <div key={name} className={visibleComponents.includes(name) ? '' : styles.hidden}>
          <Component
            onMinimize={() => handleIconClick(name)}
            userEmail={userEmail}
            userName={userName}
            onNewMessage={() => setNewChatMessage(true)}
          />
        </div>
      ))}
    </div>
  );
}
