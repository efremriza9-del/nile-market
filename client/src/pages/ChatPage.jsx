import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './ChatPage.css';

const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeConv, setActiveConv] = useState(conversationId || null);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join', user._id);
    socketRef.current.on('newMessage', (msg) => {
      if (msg.conversation === activeConv) {
        setMessages(prev => [...prev, msg]);
      }
      loadConversations();
    });
    loadConversations();
    return () => socketRef.current?.disconnect();
  }, [user]);

  useEffect(() => {
    if (activeConv) loadMessages(activeConv);
  }, [activeConv]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await API.get('/api/messages/conversations');
      setConversations(res.data);
    } catch (err) {}
  };

  const loadMessages = async (convId) => {
    try {
      const res = await API.get(`/api/messages/${convId}`);
      setMessages(res.data);
    } catch (err) {}
  };

  const sendMessage = () => {
    if (!text.trim() || !activeConv) return;
    const conv = conversations.find(c => c.conversation === activeConv);
    if (!conv) return;
    socketRef.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: conv.otherUser._id,
      productId: conv.product?._id,
      text: text.trim(),
    });
    setText('');
  };

  const activeConvData = conversations.find(c => c.conversation === activeConv);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>💬 Messages</h3>
        </div>
        {conversations.length === 0 ? (
          <div className="no-convs">No conversations yet</div>
        ) : (
          conversations.map(conv => (
            <div
              key={conv.conversation}
              className={`conv-item ${activeConv === conv.conversation ? 'active' : ''}`}
              onClick={() => setActiveConv(conv.conversation)}
            >
              <div className="conv-avatar">{conv.otherUser.name[0].toUpperCase()}</div>
              <div className="conv-info">
                <div className="conv-name">{conv.otherUser.name}</div>
                <div className="conv-product">{conv.product?.name}</div>
                <div className="conv-last">{conv.lastMessage.text}</div>
              </div>
              {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
            </div>
          ))
        )}
      </div>

      <div className="chat-main">
        {!activeConv ? (
          <div className="chat-empty">
            <div className="chat-empty-icon">💬</div>
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">
                {activeConvData?.otherUser.name[0].toUpperCase()}
              </div>
              <div>
                <div className="chat-header-name">{activeConvData?.otherUser.name}</div>
                <div className="chat-header-product">{activeConvData?.product?.name}</div>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`message ${msg.sender._id === user._id || msg.sender === user._id ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="chat-input">
              <input
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage} disabled={!text.trim()}>➤</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
