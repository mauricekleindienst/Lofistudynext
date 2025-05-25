// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSupabaseBrowserClient } from '../lib/supabase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, session } = useAuth();
  const [users, setUsers] = useState([]);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.access_token) {
        setUsers([]);
        return;
      }

      try {
        const response = await fetch('/api/pomodoros', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch pomodoros data:', error);
        // Set empty array as fallback
        setUsers([]);
      }
    };

    // Only fetch if user is authenticated
    if (user && session) {
      fetchData();
    } else {
      setUsers([]);
    }
  }, [user, session]);

  const addPomodoro = async (userId) => {
    if (!session?.access_token) {
      console.error('No session token available');
      return;
    }

    const response = await fetch('/api/pomodoros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ userId })
    });

    if (response.ok) {
      const updatedUser = await response.json();
      setUsers(users.map(user => (user.id === userId ? updatedUser : user)));
    }
  };

  return (
    <UserContext.Provider value={{ users, addPomodoro }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
