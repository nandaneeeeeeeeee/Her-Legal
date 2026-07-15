import { useState, useRef, useEffect } from "react";
import { useChatbot } from "../ChatbotContext";
import { useAuth } from "../AuthContext";
import { MessageCircle, X, SendHorizonal, Loader2 } from "lucide-react";
import "./ChatbotWidget.css";

function ChatbotWidget() {
  const { open, setOpen } = useChatbot();
  const { user } = useAuth();
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, userId: user?._id }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || data.error || "No response" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chatbot-container">
      {open && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span>Saathi — Here to help</span>
            <button onClick={() => setLang(lang === "en" ? "ne" : "en")}>
              {lang === "en" ? "नेपाली" : "English"}
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.length === 0 && (
              <p>
                {lang === "en"
                  ? "Hi, I'm here to help with questions about your rights. Ask me anything."
                  : "नमस्ते, म तपाईंको अधिकारसम्बन्धी प्रश्नमा सहयोग गर्न यहाँ छु।"}
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className={`chat-bubble ${msg.role}-bubble`}>{msg.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg assistant">
                <div className="chat-bubble assistant-bubble" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Loader2 size={14} className="spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="chatbot-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={lang === "en" ? "Type your question..." : "आफ्नो प्रश्न लेख्नुहोस्..."}
            />
            <button onClick={sendMessage} disabled={loading}>
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      )}
      <button className="chatbot-avatar" onClick={() => setOpen(!open)}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <style>{`
        .chat-msg { margin-bottom: 8px; }
        .chat-msg.user { display: flex; justify-content: flex-end; }
        .chat-msg.assistant { display: flex; justify-content: flex-start; }
        .chat-bubble {
          max-width: 85%; padding: 10px 14px; border-radius: 12px;
          font-size: 14px; line-height: 1.5; white-space: pre-wrap;
        }
        .user-bubble {
          background: var(--primary); color: #fff;
          border-bottom-right-radius: 4px;
        }
        .assistant-bubble {
          background: var(--bg-alt); color: var(--text);
          border-bottom-left-radius: 4px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}

export default ChatbotWidget;
