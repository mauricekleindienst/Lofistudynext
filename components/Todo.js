import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import { DragDropContext, Droppable, Draggable as DndDraggable } from 'react-beautiful-dnd';
import styles from '../styles/Todo.module.css';
import { FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

export default function Todo({ onMinimize }) {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#ff7b00');

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
      const newTodoItem = { 
        id: Date.now(), 
        text: newTodo, 
        completed: false, 
        color: selectedColor,
        position: todos.length + 1
      };
      setTodos(prev => [...prev, newTodoItem]);
      setNewTodo('');

      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: session.user.email, 
            text: newTodo, 
            color: selectedColor 
          }),
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

  const toggleTodo = async (id) => {
    if (session?.user?.email) {
      const updatedTodos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);

      try {
        const todoToUpdate = updatedTodos.find(todo => todo.id === id);
        const response = await fetch('/api/todos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id, 
            email: session.user.email, 
            completed: todoToUpdate.completed 
          }),
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

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index + 1
    }));

    setTodos(updatedItems);

    try {
      const response = await fetch('/api/todos/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session.user.email, 
          newOrder: updatedItems.map(todo => ({ id: todo.id, position: todo.position }))
        }),
      });

      if (!response.ok) {
        console.error('Failed to reorder todos');
        fetchTodosFromServer();
      }
    } catch (error) {
      console.error('Error reordering todos:', error);
      fetchTodosFromServer();
    }
  };

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.todoContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Todo List</h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>Organize tasks.</span>
          </div>
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
              <div className={styles.colorPicker}>
                {['#ff7b00', '#00ff7b', '#7b00ff', '#ff007b', '#7bff00'].map(color => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className={`${styles.colorButton} ${selectedColor === color ? styles.selectedColor : ''}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
              <button onClick={addTodo} className={styles.addButton}>
                <FaPlus />
              </button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="todos">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={styles.todoList}>
                    {todos.map((todo, index) => (
                      <DndDraggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={styles.todoItem}
                            style={{ borderLeft: `5px solid ${todo.color}` }}
                          >
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => toggleTodo(todo.id)}
                              className={styles.todoCheckbox}
                            />
                            {editingTodo === todo.id ? (
                              <input
                                type="text"
                                value={todo.text}
                                onChange={(e) => {
                                  const updatedTodos = todos.map(t => 
                                    t.id === todo.id ? { ...t, text: e.target.value } : t
                                  );
                                  setTodos(updatedTodos);
                                }}
                                onBlur={() => setEditingTodo(null)}
                                className={styles.editInput}
                                autoFocus
                              />
                            ) : (
                              <span className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}>
                                {todo.text}
                              </span>
                            )}
                            <button onClick={() => setEditingTodo(todo.id)} className={styles.editButton}>
                              <FaEdit />
                            </button>
                            <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </DndDraggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </>
        ) : (
          <p>Please sign in to use the Todo list.</p>
        )}
      </div>
    </Draggable>
  );
}