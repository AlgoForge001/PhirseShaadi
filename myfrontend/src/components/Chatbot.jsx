import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Minus, Maximize2 } from 'lucide-react';
import api from '../utils/api';
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

  const suggestions = [
    "How it works?",
    "How to find matches?",
    "How to send interest?",
    "Is my data safe?",
    "Privacy settings",
    "Premium features"
  ];

  const handleSuggestionClick = (suggestion) => {
    handleSend(null, suggestion);
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() || loading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot/chat', {
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

  return (
    <div className={`floating-chatbot ${isOpen ? 'open' : ''}`}>
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <MessageSquare size={24} />
          <span className="toggle-label">Help</span>
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
              <button onClick={() => setIsOpen(false)} title="Close">
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
                    <button key={i} onClick={() => handleSuggestionClick(s)}>
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

          <form className="chatbot-input" onSubmit={(e) => handleSend(e)}>
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
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
