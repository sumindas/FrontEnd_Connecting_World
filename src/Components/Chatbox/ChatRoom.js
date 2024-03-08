import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${id}/`);
    console.log(socketRef.current)

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      socketRef.current.close();
    };
  }, [id]); 

  const sendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim() !== '') {
      socketRef.current.send(JSON.stringify({ message: newMessage }));
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;
