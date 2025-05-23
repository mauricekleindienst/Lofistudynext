import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Suppress the React Beautiful DnD defaultProps warning
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    const errorMessage = args[0];
    if (
      typeof errorMessage === 'string' && 
      (errorMessage.includes('defaultProps will be removed from memo components') ||
       errorMessage.includes('Support for defaultProps will be removed from memo components'))
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

export { DragDropContext, Droppable, Draggable };
