import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, MessageCircle } from 'lucide-react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: 'Hi! I am your MarriageSphere AI Assistant. I can help you find matches, understand how the platform works, or answer any other questions you have. How can I help you today? 💕' 
    }
  ]);

  const messagesEndRef = useRef(null);
  const backendUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://phirseshaadi.onrender.com/api' : 'http://localhost:5000/api');

  // Dedicated axios for chatbot to avoid global 401 redirects
  const chatApi = axios.create({ baseURL: backendUrl });

  useEffect(() => {
    // Attach to window for global access
    window.openChatbot = () => setIsOpen(true);
    return () => { delete window.openChatbot; };
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const suggestions = [
    "How it works?",
    "How to find matches?",
    "How to send interest?",
    "Is my data safe?",
    "Privacy settings",
    "Premium features"
  ];

  const handleSend = async (e, textOverride = null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const messageText = textOverride || input;
    if (!messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText };
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setLoading(true);

    try {
      // Send messages including the new one
      const response = await chatApi.post('/chatbot/chat', {
        messages: [...messages, userMessage]
      });

      if (response.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am sorry, I am having trouble connecting right now. Please try again later! 🙏' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`floating-chatbot ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
      {!isOpen ? (
        <button type="button" className="chatbot-toggle-compact" onClick={toggleChat} title="AI Assistant">
          <Bot size={24} />
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={20} />
              </div>
              <div className="bot-name">
                <h4>MarriageSphere AI</h4>
                <span className="status">Online</span>
              </div>
            </div>
            <div className="header-actions">
              <button type="button" onClick={() => setIsOpen(false)} title="Close">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  {msg.content}
                </div>
              </div>
            ))}
            
            {!loading && messages.length === 1 && (
              <div className="chatbot-suggestions">
                <p>Common Questions:</p>
                <div className="suggestions-grid">
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={(e) => handleSend(e, s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="message-row assistant">
                <div className="message-bubble typing">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-input" onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={!input.trim() || loading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
