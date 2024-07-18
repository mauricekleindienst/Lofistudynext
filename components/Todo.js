import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import styles from '../styles/Todo.module.css';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function Todo({ onMinimize }) {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const fetchTodosFromServer = useCallback(async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/todos?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          console.error('Failed to fetch todos');
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTodosFromServer();
    }
  }, [status, fetchTodosFromServer]);

  const addTodo = async () => {
    if (newTodo.trim() !== '' && session?.user?.email) {
      const newTodoItem = { id: Date.now(), text: newTodo, completed: false };
      setTodos(prev => [...prev, newTodoItem]);
      setNewTodo('');

      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email, text: newTodo }),
        });

        if (!response.ok) {
          console.error('Failed to add todo');
          setTodos(prev => prev.filter(todo => todo.id !== newTodoItem.id));
        }
      } catch (error) {
        console.error('Error adding todo:', error);
        setTodos(prev => prev.filter(todo => todo.id !== newTodoItem.id));
      }
    }
  };

  const deleteTodo = async (id) => {
    if (session?.user?.email) {
      setTodos(prev => prev.filter(todo => todo.id !== id));

      try {
        const response = await fetch('/api/todos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, email: session.user.email }),
        });

        if (!response.ok) {
          console.error('Failed to delete todo');
          fetchTodosFromServer();
        }
      } catch (error) {
        console.error('Error deleting todo:', error);
        fetchTodosFromServer();
      }
    }
  };

  const toggleTodo = async (id, completed) => {
    if (session?.user?.email) {
      setTodos(prev => prev.map(todo => 
        todo.id === id ? { ...todo, completed: !completed } : todo
      ));

      try {
        const response = await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, email: session.user.email, completed: !completed }),
        });

        if (!response.ok) {
          console.error('Failed to update todo');
          fetchTodosFromServer();
        }
      } catch (error) {
        console.error('Error updating todo:', error);
        fetchTodosFromServer();
      }
    }
  };

  return (
    <Draggable handle=".draggable-header">
      <div className={styles.todoContainer}>
        <div className={`${styles.header} draggable-header`}>
          <h2>Todo List</h2>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>
        {status === 'authenticated' ? (
          <>
            <div className={styles.addTodo}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new todo..."
                className={styles.todoInput}
              />
              <button onClick={addTodo} className={styles.addButton}>
                <FaPlus />
              </button>
            </div>
            <div className={styles.todoList}>
              {todos.map((todo) => (
                <div key={todo.id} className={styles.todoItem}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className={styles.todoCheckbox}
                  />
                  <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
                    {todo.text}
                  </span>
                  <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Please sign in to use the Todo list.</p>
        )}
      </div>
    </Draggable>
  );
}