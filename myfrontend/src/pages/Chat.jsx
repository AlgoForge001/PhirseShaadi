import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, Search, Info, MoreVertical, 
  ChevronLeft, MessageCircle, AlertCircle 
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api, { getConversations, getChatHistory } from '../utils/api';
import Navbar from '../components/Navbar';
import './Chat.css';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [_loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await getConversations();
      if (res.data.success) setConversations(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await getChatHistory(userId);
      if (res.data.success) setMessages(res.data.data);
    } catch (err) { console.error(err); }
  };

  const startNewChat = async (userId) => {
    try {
      const res = await api.get(`/profile/${userId}`);
      if (res.data.success) {
        const profile = res.data.profile;
        setActiveConversation({
          _id: 'new',
          recipient: profile,
          participants: [user._id, userId],
          lastMessage: '',
          lastMessageTime: new Date()
        });
      }
    } catch (err) { console.error("Failed to load recipient profile", err); }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    const msgData = {
      from: user._id,
      to: activeConversation.recipient._id,
      text: newMessage
    };

    socket.emit('message:send', msgData);
    setNewMessage('');
  };

  // ── HOOKS ──

  // 1. Initial Load of Conversations
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    initChat();
  }, []);

  // 2. Handle direct chat via URL ID
  useEffect(() => {
    if (id && conversations.length >= 0) {
      const existing = conversations.find(c => 
        c.participants.some(p => p._id === id)
      );

      if (existing) {
        const recipient = existing.participants.find(p => p._id === id);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveConversation({ ...existing, recipient });
      } else {
        startNewChat(id);
      }
    }
  }, [id, conversations]);

  // 3. Fetch Messages when active conversation changes
  useEffect(() => {
    if (activeConversation?.recipient?._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchMessages(activeConversation.recipient._id);
    }
  }, [activeConversation]);

  // 4. Socket Listeners
  useEffect(() => {
    if (socket) {
      socket.on('message:receive', (msg) => {
        if (activeConversation?.recipient?._id === msg.from || activeConversation?.recipient?._id === msg.to) {
          setMessages((prev) => [...prev, msg]);
        }
        fetchConversations();
      });

      socket.on('message:sent', (msg) => {
        if (activeConversation?.recipient?._id === msg.to) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      socket.on('error', (err) => {
        setError(err.message);
        setTimeout(() => setError(null), 5000);
      });
    }
    return () => {
      if (socket) {
        socket.off('message:receive');
        socket.off('message:sent');
        socket.off('error');
      }
    };
  }, [socket, activeConversation]);

  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  const filteredConversations = conversations.filter(c => {
    const recipient = c.participants.find(p => p._id !== user._id);
    return recipient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           recipient?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="chat-premium-page">
      <Navbar />
      
      <div className="chat-main-container">
        {/* SIDEBAR */}
        <div className={`chat-sidebar ${activeConversation ? 'hide-mobile' : ''}`}>
          <div className="sidebar-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="conv-list">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const recipient = conv.participants.find(p => p._id !== user._id);
                const isSelected = activeConversation?.recipient?._id === recipient?._id;
                
                return (
                  <div 
                    key={conv._id} 
                    className={`conv-item ${isSelected ? 'active' : ''}`}
                    onClick={() => navigate(`/chat/${recipient._id}`)}
                  >
                    <div className="avatar-wrap">
                      <img src={recipient?.photos?.[0]?.url || 'https://via.placeholder.com/50'} alt="" />
                      {recipient?.online && <span className="online-indicator" />}
                    </div>
                    <div className="conv-meta">
                      <div className="conv-row-1">
                        <h4>{recipient?.fullName || recipient?.name}</h4>
                        <span>{new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="last-msg">{conv.lastMessage}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-conv">
                <MessageCircle size={40} opacity={0.3} />
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        {/* MESSAGES AREA */}
        <div className={`chat-window ${!activeConversation ? 'hide-mobile' : ''}`}>
          {activeConversation ? (
            <>
              <div className="chat-header">
                <button className="back-btn-mobile" onClick={() => navigate('/chat')}>
                  <ChevronLeft size={24} />
                </button>
                <div className="header-user">
                  <img src={activeConversation.recipient?.photos?.[0]?.url || 'https://via.placeholder.com/50'} alt="" />
                  <div className="user-text">
                    <h3>{activeConversation.recipient?.fullName || activeConversation.recipient?.name}</h3>
                    <span className="user-status">{activeConversation.recipient?.online ? 'Online' : 'Recently active'}</span>
                  </div>
                </div>
                <div className="header-actions">
                  <button><Info size={20} /></button>
                  <button><MoreVertical size={20} /></button>
                </div>
              </div>

              {error && (
                <div className="chat-error-bar">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="messages-scroll">
                {messages.length > 0 ? (
                  messages.map((m, i) => (
                    <div key={i} className={`msg-bubble-wrapper ${m.from === user._id ? 'sent' : 'received'}`}>
                      <div className="msg-bubble">
                        <p>{m.text}</p>
                        <span className="msg-time-stamp">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="start-convo">
                    <div className="sparkle-icon">✨</div>
                    <p>Start your beautiful journey with a message</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a thoughtful message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <div className="empty-box">
                <MessageCircle size={60} />
                <h2>Your Conversations</h2>
                <p>Select a match to start your conversation or express interest to unlock chatting.</p>
                <button className="search-trigger" onClick={() => navigate('/search')}>Explore Matches</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
