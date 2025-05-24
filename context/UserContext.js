// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/pomodoros');
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
    if (user) {
      fetchData();
    }
  }, [user]);

  const addPomodoro = async (userId) => {
    const response = await fetch('/api/pomodoros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
