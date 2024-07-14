// context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/pomodoros');
      const data = await response.json();
      setUsers(data);
    };

    fetchData();
  }, []);

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
