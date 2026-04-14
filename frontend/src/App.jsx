import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './App.css';

// Socket connection to Node.js backend
// IMPORTANT: Update this URL when deploying to production!
const SOCKET_URL = "http://localhost:8000"; 
const socket = io(SOCKET_URL);

function App() {
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Users List (Extracted dynamically from unique phone numbers in messages)
  const users = [...new Set(messages.map(m => m.from || m.to))].filter(Boolean);

  useEffect(() => {
    // Listen for new messages from Server (through Webhook)
    socket.on('new_message', (data) => {
      console.log("Real-time msg received:", data);
      
      const newMsg = {
        id: Date.now(),
        from: data.from,
        text: data.msg_body,
        type: 'received',
        timestamp: data.timestamp || new Date().toLocaleTimeString()
      };
      
      setMessages((prev) => [...prev, newMsg]);
      
      // Auto-select user if no chat is active
      if (!activeUser) setActiveUser(data.from);
    });

    return () => {
      socket.off('new_message');
    };
  }, [activeUser]);

  // Scroll to bottom when message list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeUser) return;

    // 1. Optically add to UI immediately (Sent message)
    const newMsg = {
      id: Date.now(),
      to: activeUser,
      text: inputText,
      type: 'sent',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    // 2. Call backend API to actually send message via Meta!
    try {
      // 🛠 BUG FIX: Calling our newly made POST /send endpoint in Node.js
      await axios.post(`${SOCKET_URL}/send`, { to: activeUser, message: inputText });
      console.log(`✅ Passed to Server -> Out to customer (+${activeUser}): ${inputText}`);
    } catch (err) {
      console.error("❌ Failed to send msg to backend:", err);
    }
  };

  // Filter messages for the currently selected user
  const activeChat = messages.filter(
    m => (m.type === 'received' && m.from === activeUser) || (m.type === 'sent' && m.to === activeUser)
  );

  return (
    <div className="dashboard-container">
      {/* LEFT SIDEBAR: User List */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Chats</h3>
        </div>
        <ul className="user-list">
          {users.map(user => (
            <li 
              key={user} 
              className={activeUser === user ? 'active' : ''}
              onClick={() => setActiveUser(user)}
            >
              <div className="avatar">👤</div>
              <div className="user-details">
                <span className="user-name">+{user}</span>
                <span className="preview">Click to view chat...</span>
              </div>
            </li>
          ))}
          {users.length === 0 && <p className="no-chats">No active chats yet...</p>}
        </ul>
      </div>

      {/* RIGHT SIDE: Chat Panel */}
      <div className="chat-panel">
        {activeUser ? (
          <>
            <div className="chat-header">
              <div className="avatar">👤</div>
              <h2>+{activeUser}</h2>
            </div>
            
            <div className="chat-messages">
              {activeChat.map(msg => (
                <div key={msg.id} className={`message-bubble ${msg.type}`}>
                  <p>{msg.text}</p>
                  <span className="time">{msg.timestamp}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="empty-chat">
            <h2>WhatsApp Bot Live Dashboard</h2>
            <p>Select a chat or waiting for incoming messages...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;