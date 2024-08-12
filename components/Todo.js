import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Draggable from "react-draggable";
import {
  DragDropContext,
  Droppable,
  Draggable as DndDraggable,
} from "react-beautiful-dnd";
import styles from "../styles/Todo.module.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

export default function Todo({ onMinimize }) {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState(""); // New state for editing text
  const [selectedColor, setSelectedColor] = useState("#ff7b00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodosFromServer = useCallback(async () => {
    if (session?.user?.email) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/todos?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          setTodos(data.todos);
        } else {
          throw new Error("Failed to fetch todos");
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError("Failed to load todos. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  }, [session]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchTodosFromServer();
    }
  }, [status, fetchTodosFromServer]);

  const addTodo = async () => {
    if (newTodo.trim() !== "" && session?.user?.email) {
      const newTodoItem = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        color: selectedColor,
        position: todos.length + 1,
      };
      setTodos((prev) => [...prev, newTodoItem]);
      setNewTodo("");
      setError(null);

      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user.email,
            text: newTodo,
            color: selectedColor,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add todo");
        }
      } catch (error) {
        console.error("Error adding todo:", error);
        // Roll back optimistic update if server request fails
        setTodos((prev) => prev.filter((todo) => todo.id !== newTodoItem.id));
        setError("Failed to add todo. Please try again.");
      }
    }
  };

  const toggleTodo = async (id) => {
    if (session?.user?.email) {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      setTodos(updatedTodos);
      setError(null);

      try {
        const todoToUpdate = updatedTodos.find((todo) => todo.id === id);
        const response = await fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            email: session.user.email,
            completed: todoToUpdate.completed,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        setError("Failed to update todo. Please try again.");
        fetchTodosFromServer(); // Reload todos from server on failure
      }
    }
  };

  const deleteTodo = async (id) => {
    if (session?.user?.email) {
      // Optimistic update: remove the todo from the UI
      const originalTodos = todos;
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setError(null);

      try {
        const response = await fetch("/api/todos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, email: session.user.email }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete todo");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
        setError("Failed to delete todo. Please try again.");
        setTodos(originalTodos); // Rollback optimistic update on failure
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
      position: index + 1,
    }));

    setTodos(updatedItems);
    setError(null);

    try {
      const response = await fetch("/api/todos/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          newOrder: updatedItems.map((todo) => ({
            id: todo.id,
            position: todo.position,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder todos");
      }
    } catch (error) {
      console.error("Error reordering todos:", error);
      setError("Failed to reorder todos. Please try again.");
      fetchTodosFromServer(); // Reload todos from server on failure
    }
  };

  const startEditingTodo = (todo) => {
    setEditingTodo(todo.id);
    setEditingText(todo.text);
  };

  const saveEditedTodo = async (id) => {
    if (session?.user?.email) {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingText } : todo
      );
      setTodos(updatedTodos);
      setEditingTodo(null);
      setError(null);

      try {
        const response = await fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id,
            email: session.user.email,
            text: editingText,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update todo");
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        setError("Failed to update todo. Please try again.");
        fetchTodosFromServer(); // Reload todos from server on failure
      }
    }
  };

  const cancelEditingTodo = () => {
    setEditingTodo(null);
    setEditingText("");
  };

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.todoContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Todo List</h2>
          <button onClick={onMinimize} className={styles.closeButton}>
            <span className="material-icons">remove</span>
          </button>
        </div>
        {status === "authenticated" ? (
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
              <div className={styles.colorPicker}>
                {["#ff7b00", "#00ff7b", "#7b00ff", "#ff007b", "#7bff00"].map(
                  (color) => (
                    <button
                      key={color}
                      style={{ backgroundColor: color }}
                      className={`${styles.colorButton} ${
                        selectedColor === color ? styles.selectedColor : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    />
                  )
                )}
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="todos">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={styles.todoList}
                    >
                      {todos.map((todo, index) => (
                        <DndDraggable
                          key={todo.id}
                          draggableId={todo.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${styles.todoItem} ${
                                snapshot.isDragging ? styles.dragging : ""
                              }`}
                              style={{
                                ...provided.draggableProps.style,
                                borderLeft: `5px solid ${todo.color}`,
                                backgroundColor: snapshot.isDragging
                                  ? "#444"
                                  : "#333",
                                transition: "background-color 0.2s ease",
                              }}
                            >
                              <div className={styles.mainTodo}>
                                <div className={styles.todoHeader}>
                                  <input
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    className={styles.todoCheckbox}
                                  />
                                  {editingTodo === todo.id ? (
                                    <input
                                      type="text"
                                      value={editingText} // Use editingText state
                                      onChange={(e) => setEditingText(e.target.value)}
                                      onBlur={() => saveEditedTodo(todo.id)}
                                      className={styles.editInput}
                                      autoFocus
                                    />
                                  ) : (
                                    <span
                                      className={`${styles.todoText} ${
                                        todo.completed ? styles.completed : ""
                                      }`}
                                    >
                                      {todo.text}
                                    </span>
                                  )}
                                  <div className={styles.todoActions}>
                                    {editingTodo === todo.id ? (
                                      <>
                                        <button
                                          onClick={() => saveEditedTodo(todo.id)}
                                          className={styles.saveButton}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={cancelEditingTodo}
                                          className={styles.cancelButton}
                                        >
                                          Cancel
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => startEditingTodo(todo)}
                                          className={styles.editButton}
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          onClick={() => deleteTodo(todo.id)}
                                          className={styles.deleteButton}
                                        >
                                          <FaTrash />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DndDraggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </>
        ) : (
          <p>Please sign in to use the Todo list.</p>
        )}
      </div>
    </Draggable>
  );
}
