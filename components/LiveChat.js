// components/LiveChat.js
import { useState } from 'react';
import styles from '../styles/LiveChat.module.css';

export default function LiveChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { id: messages.length, text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h2>Live Chat</h2>
      <div className={styles.messages}>
        {messages.map(message => (
          <div key={message.id} className={styles.message}>
            {message.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        className={styles.input}
      />
      <button onClick={sendMessage} className={styles.sendButton}>Send</button>
    </div>
  );
}
