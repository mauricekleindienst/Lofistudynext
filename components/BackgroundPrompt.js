import React, { useEffect, useState } from 'react';
import styles from '../styles/app.module.css';

export default function BackgroundPrompt({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      icon: 'waving_hand',
      title: 'Welcome to Lo-Fi.study!',
      description: 'Your personalized study space for enhanced productivity and focus.',
      hint: 'Click Next to explore features'
    },
    {
      icon: 'alarm',
      title: 'Pomodoro Timer',
      description: 'Stay focused with our Pomodoro timer. Work in focused intervals and track your study sessions.',
      hint: 'Perfect for maintaining productivity'
    },
    {
      icon: 'checklist',
      title: 'Task Management',
      description: 'Keep track of your tasks with our Todo list. Stay organized and never miss an assignment.',
      hint: 'Stay organized and productive'
    },
    {
      icon: 'school',
      title: 'Flashcards',
      description: 'Create and study flashcards to enhance your learning. Perfect for memorization and quick reviews.',
      hint: 'Boost your learning efficiency'
    },
    {
      icon: 'wallpaper',
      title: 'Study Environments',
      description: 'Choose from a variety of ambient backgrounds to create your perfect study atmosphere.',
      hint: 'Click the waves icon to customize'
    }
  ];

  const handleClose = async () => {
    try {
      console.log('Saving tutorial state...');
      const response = await fetch('/api/tutorials/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tutorial: 'background_prompt',
          completed: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save tutorial state');
      }

      console.log('Tutorial state saved successfully');
      if (onClose) onClose();
    } catch (error) {
      console.error('Failed to update tutorial state:', error);
      if (onClose) onClose();
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.backgroundPrompt}>
      <div className={styles.promptContent}>
        <button onClick={handleClose} className={styles.closeButton}>
          <span className="material-icons">close</span>
        </button>
        
        <div className={styles.iconWrapper}>
          <span className="material-icons">{steps[currentStep].icon}</span>
        </div>
        
        <h2>{steps[currentStep].title}</h2>
        <p>{steps[currentStep].description}</p>
        
        <div className={styles.navigationControls}>
          {currentStep > 0 && (
            <button onClick={handlePrevious} className={styles.navButton}>
              <span className="material-icons">arrow_back</span>
              Previous
            </button>
          )}
          
          <div className={styles.stepIndicators}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`${styles.stepDot} ${currentStep === index ? styles.active : ''}`}
              />
            ))}
          </div>
          
          <button onClick={handleNext} className={styles.navButton}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < steps.length - 1 && <span className="material-icons">arrow_forward</span>}
          </button>
        </div>
      </div>
    </div>
  );
} 