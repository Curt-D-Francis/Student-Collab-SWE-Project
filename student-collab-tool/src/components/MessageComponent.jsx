import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send } from "lucide-react";
import "./messaging.css";

// Socket connection
const SOCKET_URL = "http://localhost:5000";

const MessageComponent = ({ projectId, currentUser }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Establish socket connection on component mount
  useEffect(() => {
    // Create socket connection
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Join the project room
    newSocket.emit("join_project", {
      project_id: projectId,
      username: currentUser,
    });

    // Listen for message history
    newSocket.on("message_history", (data) => {
      setMessages(data.messages);
    });

    // Listen for new messages
    newSocket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for user join/leave notifications
    newSocket.on("user_joined", (data) => {
      console.log(data.message);
    });

    newSocket.on("user_left", (data) => {
      console.log(data.message);
    });

    // Cleanup socket connection on unmount
    return () => {
      newSocket.emit("leave_project", {
        project_id: projectId,
        username: currentUser,
      });
      newSocket.disconnect();
    };
  }, [projectId, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = () => {
    if (!socket || newMessage.trim() === "") return;

    const messagePayload = {
      project_id: projectId,
      sender: currentUser,
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit("send_message", messagePayload);

    // Clear input
    setNewMessage("");
  };

  // Handle keyboard enter key for sending messages
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="message-container">
      {/* Message Header */}
      <div className="message-header">Project Group Chat - {projectId}</div>

      {/* Message List */}
      <div className="message-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-item ${
              msg.sender === currentUser ? "message-sent" : "message-received"
            }`}
          >
            <div
              className={`message-bubble ${
                msg.sender === currentUser
                  ? "message-bubble-sent"
                  : "message-bubble-received"
              }`}
            >
              {msg.sender !== currentUser && (
                <div className="message-sender">{msg.sender}</div>
              )}
              {msg.text}
              <div className="message-timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="message-textarea"
          maxLength={500}
        />
        <button
          onClick={handleSendMessage}
          disabled={newMessage.trim() === ""}
          className="message-send-button"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default MessageComponent;
