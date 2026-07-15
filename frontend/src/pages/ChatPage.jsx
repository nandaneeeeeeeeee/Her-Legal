import { useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useChatbot } from "../ChatbotContext";
import { SendHorizonal, Loader2, MessageCircle, Sparkles, ArrowRight } from "lucide-react";

const suggestions = [
  "What are my property rights in Nepal?",
  "How do I file for divorce?",
  "What is the legal age for marriage?",
  "How can I report domestic violence?",
];

function ChatPage() {
  const { user } = useAuth();
  const { setOpen } = useChatbot();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, userId: user?._id }),
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
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Sparkles size={20} />
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", margin: 0, fontSize: "1.4rem" }}>Saathi</h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>AI legal assistant for women in Nepal</p>
          </div>
        </div>

        <div style={styles.messages}>
          {messages.length === 0 && (
            <div style={styles.empty}>
              <div style={styles.emptyIcon}>
                <MessageCircle size={32} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", margin: "0 0 8px" }}>How can I help you?</h3>
              <p style={{ fontSize: 14, color: "var(--text-muted)", maxWidth: 400, lineHeight: 1.6 }}>
                Ask any question about your legal rights in Nepal — marriage, divorce, property, domestic violence, and more.
              </p>
              <div style={styles.suggestions}>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={styles.suggestion}
                  >
                    {s} <ArrowRight size={12} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 18px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "var(--primary)" : "var(--bg-alt)",
                  color: msg.role === "user" ? "#fff" : "var(--text)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}>
              <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: "var(--bg-alt)", display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            style={styles.input}
          />
          <button onClick={() => sendMessage()} disabled={loading} style={styles.sendBtn}>
            <SendHorizonal size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "100px 16px 24px",
    background: "var(--bg)",
    minHeight: "100vh",
  },
  container: {
    width: "100%",
    maxWidth: 720,
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-card)",
    borderRadius: "var(--radius-lg)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow-md)",
    overflow: "hidden",
    height: "calc(100vh - 124px)",
    maxHeight: 700,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 24px",
    borderBottom: "1px solid var(--border)",
    background: "var(--bg-alt)",
    color: "var(--primary)",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  },
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: "100%",
    padding: "0 24px",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "var(--primary-light)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 24,
    width: "100%",
    maxWidth: 400,
  },
  suggestion: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "12px 18px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    fontSize: 14,
    color: "var(--text)",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    padding: "16px 24px",
    borderTop: "1px solid var(--border)",
    background: "var(--bg-card)",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "9999px",
    border: "1px solid var(--border)",
    fontSize: 15,
    fontFamily: "var(--font-body)",
    outline: "none",
    background: "var(--bg)",
    color: "var(--text)",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
  },
};

export default ChatPage;
