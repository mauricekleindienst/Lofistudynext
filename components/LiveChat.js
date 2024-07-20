import Draggable from 'react-draggable';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from '../styles/LiveChat.module.css';

const socket = io();

export default function LiveChat({ onMinimize, userName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    console.log("UserName:", userName);
    // Receive chat history
    socket.on('chat history', (history) => {
      setMessages(history);
    });

    // Receive new chat messages
    socket.on('chat message', (msg) => {
      console.log("Received message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat history');
      socket.off('chat message');
    };
  }, [userName]);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      const message = { id: messages.length, text: newMessage, userName };
      console.log("Sending message:", message);
      socket.emit('chat message', message);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Draggable>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h2>Live Chat</h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>Your tooltip text here</span>
          </div>
          <button onClick={onMinimize} className="material-icons">remove</button>
        </div>
        <div className={styles.messages}>
          {messages.map((message) => (
            <div key={message.id} className={styles.message}>
              <strong>{message.userName}: </strong>{message.text}
            </div>
          ))}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.sendButton}>Send</button>
        </div>
      </div>
    </Draggable>
  );
}