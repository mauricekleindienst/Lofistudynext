import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import styles from '../styles/Calendar.module.css';
import ApiCalendar from 'react-google-calendar-api';

const config = {
  clientId: "YOUR_CLIENT_ID",
  apiKey: "YOUR_API_KEY",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Calendar({ onMinimize }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    apiCalendar.onLoad(() => {
      const signedIn = apiCalendar.sign; // Check the current sign-in status
      setIsSignedIn(signedIn);
    });
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchEvents();
    }
  }, [isSignedIn, currentDate]);

  const fetchEvents = async () => {
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    try {
      const result = await apiCalendar.listEvents({
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        maxResults: 100,
        orderBy: 'startTime',
      });
      setEvents(result.result.items);
    } catch (error) {
      console.error('Error fetching events', error);
    }
  };

  const handleSignIn = () => {
    apiCalendar.handleAuthClick().then(() => {
      setIsSignedIn(true);
    }).catch((error) => {
      console.error('Error during sign-in', error);
    });
  };

  const handleSignOut = () => {
    try {
      apiCalendar.handleSignoutClick();
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const days = [];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyDay}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start.dateTime || event.start.date);
        return eventDate.toDateString() === date.toDateString();
      });
      days.push(
        <div key={`day-${i}`} className={`${styles.calendarDay} ${dayEvents.length > 0 ? styles.hasEvents : ''}`}>
          {i}
          {dayEvents.length > 0 && <div className={styles.eventIndicator}></div>}
        </div>
      );
    }
    return days;
  };

  return (
    <Draggable>
      <div className={styles.calendarContainer}>
        <div className={styles.header}>
          <h2>Calendar</h2>
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.calendarContent}>
          {isSignedIn ? (
            <>
              <button onClick={handleSignOut}>Sign Out</button>
              <div className={styles.calendarHeader}>
                <button onClick={prevMonth} className="material-icons">chevron_left</button>
                <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <button onClick={nextMonth} className="material-icons">chevron_right</button>
              </div>
              <div className={styles.weekDays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className={styles.weekDay}>{day}</div>
                ))}
              </div>
              <div className={styles.calendarGrid}>
                {renderCalendarDays()}
              </div>
            </>
          ) : (
            <button onClick={handleSignIn}>Sign In to Google Calendar</button>
          )}
        </div>
      </div>
    </Draggable>
  );
}
