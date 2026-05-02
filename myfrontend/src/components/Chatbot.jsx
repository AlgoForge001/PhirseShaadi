import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send, Search, Info, MoreVertical,
  ChevronLeft, MessageCircle, AlertCircle
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api, { getConversations, getChatHistory, checkChatAccess } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Chatbot.css';
// ── SVG Icons ────────────────────────────────────────────────────────────────

const EnvelopeIcon = ({ size = 44, stroke = '#6B3F69', strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 8.586 6.293a2 2 0 0 0 2.828 0L22 7" />
  </svg>
);

const EnvelopeSparkIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="#9b7a9b" strokeWidth={1.2}
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 8.586 6.293a2 2 0 0 0 2.828 0L22 7" />
    <path d="M12 11.5v3M10.5 13h3" stroke="#b06fb0" strokeWidth="1.5" />
  </svg>
);

const SmileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5"
    strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canChat, setCanChat] = useState(true);
  const messagesEndRef = useRef(null);

  // ── helpers ──────────────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const avatarUrl = (person, size = 50) =>
    person?.photos?.[0]?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      person?.fullName || person?.name || 'U'
    )}&background=6B3F69&color=fff&size=${size}`;

  // ── data fetching ─────────────────────────────────────────────────────────

  const myId = user?._id || user?.id;

  const fetchConversations = async () => {
    try {
      const [convRes, intRes] = await Promise.all([
        getConversations(),
        api.get('/interest/accepted'),
      ]);

      let allConvs = [];
      if (convRes.data.success) allConvs = convRes.data.data;

      if (intRes.data.success) {
        const acceptedUsers = intRes.data.data.map((i) => i.user);
        acceptedUsers.forEach((accUser) => {
          if (!accUser || !accUser._id) return;
          const exists = allConvs.find((c) =>
            c.participants.some((p) => (p._id || p) === accUser._id)
          );
          if (!exists) {
            allConvs.push({
              _id: `new_${accUser._id}`,
              participants: [user, accUser],
              lastMessage: 'Start the conversation ✨',
              lastMessageTime: new Date(),
            });
          }
        });
      }

      setConversations(allConvs);
      setConversationsLoaded(true);
    } catch (err) {
      console.error(err);
      setConversationsLoaded(true);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const accessRes = await checkChatAccess(userId);
      if (accessRes.data.success) {
        setCanChat(accessRes.data.canChat);
      }

      const res = await getChatHistory(userId);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startNewChat = async (userId) => {
    try {
      const profileRes = await api.get(`/profile/${userId}`);
      if (profileRes.data.success) {
        const profile = profileRes.data.profile;
        setActiveConversation({
          _id: 'new_' + userId,
          recipient: profile,
          participants: [user._id, userId],
          lastMessage: '',
          lastMessageTime: new Date(),
        });
      }
    } catch (err) {
      console.error('Failed to load recipient profile', err);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !socket || !canChat) return;
    socket.emit('message:send', {
      from: myId,
      to: activeConversation.recipient._id,
      text: newMessage,
    });
    setNewMessage('');
  };

  // ── effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchConversations();
      setLoading(false);
    };
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id || !conversationsLoaded) return;
    if (activeConversation?.recipient?._id === id) return;

    const existing = conversations.find((c) =>
      c.participants.some((p) => String(p._id || p) === String(id))
    );

    if (existing) {
      const recipient = existing.participants.find((p) => String(p._id || p) === String(id));
      setActiveConversation({ ...existing, recipient });
    } else {
      startNewChat(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, conversationsLoaded, conversations]);

  useEffect(() => {
    if (activeConversation?.recipient?._id) {
      fetchMessages(activeConversation.recipient._id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.recipient?._id]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:receive', (msg) => {
      if (
        String(activeConversation?.recipient?._id) === String(msg.from) ||
        String(activeConversation?.recipient?._id) === String(msg.to)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      fetchConversations();
    });

    socket.on('message:sent', (msg) => {
      if (String(activeConversation?.recipient?._id) === String(msg.to)) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on('error', (err) => {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      socket.off('message:receive');
      socket.off('message:sent');
      socket.off('error');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, activeConversation]);

  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  // ── derived ───────────────────────────────────────────────────────────────

  const filteredConversations = conversations.filter((c) => {
    const recipient = c.participants.find((p) => String(p._id || p) !== String(myId));
    const term = searchTerm.toLowerCase();
    return (
      recipient?.fullName?.toLowerCase().includes(term) ||
      recipient?.name?.toLowerCase().includes(term)
    );
  });

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="chat-premium-page">
      <Navbar />

      <div className="chat-main-container">

        {/* ════ SIDEBAR ════ */}
        <div className={`chat-sidebar ${activeConversation ? 'hide-mobile' : ''}`}>

          <div className="sidebar-header">
            <div className="sidebar-title-row">
              <h2>Messages</h2>
              {conversations.length > 0 && (
                <span className="conv-count-badge">{conversations.length} chats</span>
              )}
            </div>

            <div className="sidebar-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              <button className="filter-tab active">All</button>
              <button className="filter-tab">Online</button>
              <button className="filter-tab">Recent</button>
            </div>
          </div>

          <div className="conv-list">
            {loading && !conversationsLoaded ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="conv-skeleton">
                  <div className="skel-avatar" />
                  <div className="skel-lines">
                    <div className="skel-line long" />
                    <div className="skel-line short" />
                  </div>
                </div>
              ))
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const recipient = conv.participants.find(
                  (p) => String(p._id || p) !== String(myId)
                );
                const isSelected =
                  activeConversation?.recipient?._id === recipient?._id;

                return (
                  <div
                    key={conv._id}
                    className={`conv-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setActiveConversation({ ...conv, recipient });
                      navigate(`/chat/${recipient._id}`);
                    }}
                  >
                    <div className="avatar-wrap">
                      <img src={avatarUrl(recipient, 50)} alt={recipient?.fullName || recipient?.name} />
                      {recipient?.online && <span className="online-indicator" />}
                    </div>
                    <div className="conv-meta">
                      <div className="conv-row-1">
                        <h4>{recipient?.fullName || recipient?.name}</h4>
                        <span>
                          {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="last-msg">{conv.lastMessage || 'Say hello!'}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-conv">
                <div className="empty-conv-illustration">
                  {/* ✅ SVG replaces 💌 emoji */}
                  <EnvelopeIcon size={44} stroke="#6B3F69" strokeWidth={1.5} />
                </div>
                <h3>No Messages Yet</h3>
                <p>Connect with matches to start a beautiful conversation</p>
                <button className="empty-conv-cta" onClick={() => navigate('/search')}>
                  Find Matches
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ════ CHAT WINDOW ════ */}
        <div className={`chat-window ${!activeConversation ? 'hide-mobile' : ''}`}>
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button
                    className="back-btn-mobile"
                    onClick={() => { setActiveConversation(null); navigate('/chat'); }}
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <div className="header-user">
                    <div className="header-avatar-wrap">
                      <img
                        src={avatarUrl(activeConversation.recipient, 46)}
                        alt={activeConversation.recipient?.fullName}
                      />
                      {activeConversation.recipient?.online && (
                        <span className="header-avatar-online" />
                      )}
                    </div>
                    <div className="user-text">
                      <h3>
                        {activeConversation.recipient?.fullName ||
                          activeConversation.recipient?.name}
                      </h3>
                      <span
                        className={`user-status ${
                          activeConversation.recipient?.online ? '' : 'offline'
                        }`}
                      >
                        {activeConversation.recipient?.online
                          ? '● Online'
                          : 'Recently active'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="header-actions">
                  <button
                    title="View Profile"
                    onClick={() =>
                      navigate(`/profile/${activeConversation.recipient?._id}`)
                    }
                  >
                    <Info size={19} />
                  </button>
                  <button title="More options">
                    <MoreVertical size={19} />
                  </button>
                </div>
              </div>

              {/* Error bar */}
              {error && (
                <div className="chat-error-bar">
                  <AlertCircle size={15} /> {error}
                </div>
              )}

              {/* Messages */}
              <div className="messages-scroll">
                {messages.length > 0 ? (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`msg-bubble-wrapper ${
                        String(m.from) === String(myId) ? 'sent' : 'received'
                      }`}
                    >
                      {String(m.from) !== String(myId) && (
                        <img
                          className="msg-avatar-small"
                          src={avatarUrl(activeConversation.recipient, 30)}
                          alt=""
                        />
                      )}
                      <div className="msg-bubble">
                        <p>{m.text}</p>
                        <span className="msg-time-stamp">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="start-convo">
                    {/* ✅ SVG replaces 💌 emoji */}
                    <div className="sparkle-icon">
                      <EnvelopeSparkIcon size={52} />
                    </div>
                    <p>Send the first message and start your beautiful journey together</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {canChat ? (
                <form className="chat-input-area" onSubmit={handleSendMessage}>
                  <div className="input-wrapper">
                    {/* ✅ SVG replaces 😊 emoji */}
                    <button type="button" className="emoji-btn" tabIndex={-1}>
                      <SmileIcon />
                    </button>
                    <input
                      type="text"
                      placeholder="Type a thoughtful message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="send-btn"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              ) : (
                <div className="chat-access-denied">
                  <AlertCircle size={16} />
                  <span>Accept each other's interest first to start chatting</span>
                </div>
              )}
            </>
          ) : (
            /* No conversation selected */
            <div className="chat-empty-state">
              <div className="empty-box">
                <div className="empty-box-icon">
                  <MessageCircle size={40} color="#6B3F69" />
                </div>
                <h2>Your Conversations</h2>
                <p>
                  Select a match from the sidebar to continue chatting, or explore
                  new matches to connect with.
                </p>
                <button className="explore-btn" onClick={() => navigate('/search')}>
                  Explore Matches
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ✅ Footer moved inside return, after chat container */}
      <Footer />
    </div>
  );
};

export default Chat;