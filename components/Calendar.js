import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import styles from '../styles/Calendar.module.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomCursor from '../components/CustomCursor';

const localizer = momentLocalizer(moment);

export default function Calendar({ onMinimize }) {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', start: new Date(), end: new Date() });

  const fetchEventsFromServer = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/calendar?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch events');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  }, [session]);

  const addEvent = async () => {
    if (newEvent.title && newEvent.start && session?.user?.email) {
      const newEventItem = { 
        id: Date.now(), 
        title: newEvent.title, 
        start: newEvent.start,
        end: newEvent.end
      };
      setEvents(prev => [...prev, newEventItem]);
      setNewEvent({ title: '', start: new Date(), end: new Date() });

      try {
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: session.user.email, 
            title: newEvent.title, 
            date: newEvent.start.toISOString().split('T')[0]
          }),
        });

        if (!response.ok) {
          console.error('Failed to add event');
          setEvents(prev => prev.filter(event => event.id !== newEventItem.id));
        }
      } catch (error) {
        console.error('Error adding event:', error);
        setEvents(prev => prev.filter(event => event.id !== newEventItem.id));
      }
    }
  };

  const deleteEventHandler = async (req, res) => {
    const { id, email } = req.body;
  
    if (!id || !email) {
      return res.status(400).json({ error: 'Id and email are required' });
    }
  
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM events WHERE id = $1 AND email = $2', [id, email]);
      client.release();
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  return (
    
    <Draggable handle=".draggable-header">
      <div className={styles.calendarContainer}>
        <div className={`${styles.header} draggable-header`}>
          <h2>Calendar Placeholder </h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>Placeholder</span>
          </div>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">close</span>
          </button>
        </div>
        {status === 'authenticated' ? (
          <>
            <div className={styles.addEvent}>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Event title"
                className={styles.eventInput}
              />
              <input
                type="datetime-local"
                value={moment(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value), end: new Date(e.target.value) })}
                className={styles.eventInput}
              />
              <button onClick={addEvent} className={styles.addButton}>
                Add Event
              </button>
            </div>
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </>
        ) : (
          <p>Please sign in to use the Calendar.</p>
        )}
      </div>
    </Draggable>
  );
}