import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, Sparkles, ChevronDown } from "lucide-react";
import api from "../utils/api";
import "./Chatbot.css";

const SUGGESTED_QUESTIONS = [
  "How do I find matches?",
  "How to send an interest?",
  "Why can't I chat with someone?",
  "How to upload my photo?",
  "How to set privacy settings?",
];

const TypingIndicator = () => (
  <div className="cb-msg cb-msg-bot">
    <div className="cb-avatar"><Bot size={14} /></div>
    <div className="cb-bubble cb-typing">
      <span /><span /><span />
    </div>
  </div>
);

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! 💕 I'm your **PhirseShaadi Assistant**. I can help you with finding matches, sending interests, uploading photos, and more!\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, messages]);

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>");
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setShowSuggestions(false);

    const userMsg = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Build history (exclude the initial greeting from API call)
      const history = updatedMessages
        .filter((_, i) => i > 0) // skip initial greeting
        .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

      const res = await api.post("/chatbot/chat", { messages: history });
      const botReply = res.data.reply || "Sorry, I couldn't understand that. Please try again!";

      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FLOATING BUBBLE */}
      <button
        className={`cb-fab ${open ? "cb-fab-hidden" : ""}`}
        onClick={() => setOpen(true)}
        title="Chat with PhirseShaadi Assistant"
        id="chatbot-fab-btn"
      >
        <div className="cb-fab-icon">
          <MessageCircle size={26} fill="white" />
        </div>
        <div className="cb-fab-pulse" />
        <span className="cb-fab-label">Need Help?</span>
      </button>

      {/* CHAT WINDOW */}
      <div className={`cb-window ${open ? "cb-window-open" : ""}`} id="chatbot-window">
        {/* HEADER */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-header-avatar">
              <Bot size={18} />
              <span className="cb-online-dot" />
            </div>
            <div className="cb-header-info">
              <span className="cb-header-name">PhirseShaadi Assistant</span>
              <span className="cb-header-status">
                <Sparkles size={10} /> AI-Powered • Always Online
              </span>
            </div>
          </div>
          <button className="cb-close-btn" onClick={() => setOpen(false)} id="chatbot-close-btn">
            <ChevronDown size={20} />
          </button>
        </div>

        {/* MESSAGES */}
        <div className="cb-messages" id="chatbot-messages">
          {messages.map((msg, i) => (
            <div
              key={`msg-${i}`}
              className={`cb-msg ${msg.role === "assistant" ? "cb-msg-bot" : "cb-msg-user"}`}
            >
              {msg.role === "assistant" && (
                <div className="cb-avatar"><Bot size={14} /></div>
              )}
              <div
                className="cb-bubble"
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
              />
            </div>
          ))}

          {loading && <TypingIndicator />}

          {/* SUGGESTED QUESTIONS */}
          {showSuggestions && !loading && (
            <div className="cb-suggestions">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  className="cb-suggestion-pill"
                  onClick={() => sendMessage(q)}
                  id={`chatbot-suggestion-${i}`}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="cb-input-area">
          <textarea
            ref={inputRef}
            className="cb-input"
            id="chatbot-input"
            placeholder="Ask me anything about PhirseShaadi..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className={`cb-send-btn ${input.trim() && !loading ? "cb-send-active" : ""}`}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            id="chatbot-send-btn"
          >
            <Send size={17} />
          </button>
        </div>
        <p className="cb-footer-note">Powered by PhirseShaadi AI 💕</p>
      </div>

      {/* BACKDROP on mobile */}
      {open && <div className="cb-backdrop" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Chatbot;
