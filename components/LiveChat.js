import Draggable from "react-draggable";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Picker from "emoji-picker-react";
import styles from "../styles/LiveChat.module.css";


const socket = io();

export default function LiveChat({ onMinimize, userName, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Receive chat history
    socket.on("chat history", (history) => {
      setMessages(history);
      scrollToBottom();
    });

    // Receive new chat messages
    socket.on("chat message", (msg) => {
      console.log("Received message:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
      onNewMessage();
      scrollToBottom();
    });

    return () => {
      socket.off("chat history");
      socket.off("chat message");
    };
  }, [userName, onNewMessage]);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        id: `${messages.length}-${Date.now()}`, // Use a combination of length and timestamp for a unique key
        text: newMessage,
        userName: userName,
        time: new Date().toLocaleString(), // Add formatted timestamp
      };
      console.log("Sending message with userName:", userName);
      socket.emit("chat message", message);
      setNewMessage("");
      scrollToBottom();
    } else {
      console.log("New message is empty, not sending.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageText = (text) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const onEmojiClick = (event, emojiObject) => {
    console.log("Emoji object:", emojiObject);
    // Adjust this line based on the structure of emojiObject
    setNewMessage(newMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Draggable handle=".drag-handle">
      <div className={styles.chatContainer}>
        <div className={`${styles.dragHandle} drag-handle`}></div>
        <div className={styles.header}>
          <h2>Live Chat</h2>
          <div className={styles.tooltip}>
            <span className="material-icons">help</span>
            <span className={styles.tooltiptext}>Your tooltip text here</span>
          </div>
          <button onClick={onMinimize} className="material-icons">
            remove
          </button>
        </div>
        <div className={styles.messages}>
          {messages.map((message) => (
            <div key={message.id} className={styles.message}>
              <strong>{message.userName || "Unknown"}:</strong>{" "}
              {formatMessageText(message.text)}
              <div className={styles.timestamp}>{message.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
        <div className={styles.inputContainer}>
          <button
            type="button"
            className={styles.emojiButton}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className={styles.emojiPicker}>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className={styles.input}
          />
          <button onClick={sendMessage} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </Draggable>
  );
}
