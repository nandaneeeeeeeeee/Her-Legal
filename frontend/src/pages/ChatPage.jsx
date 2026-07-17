import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import {
  SendHorizonal, Loader2, Sparkles, ArrowRight, Copy, Check,
  MessageCircle, Scale, Heart, Shield, AlertCircle, BookOpen, User,
  Bot, RefreshCw, Trash2, Plus, Clock, Edit3, ThumbsUp, ThumbsDown,
  Download, FileText, Phone, ChevronRight, Star, Bookmark, Settings,
  Mic, Paperclip, Volume2, Share2
} from "lucide-react";
import "./ChatPage.css";

const categories = [
  { icon: <Scale size={18} />, label: "Property Rights", prompt: "What are my property rights in Nepal?" },
  { icon: <BriefcaseIcon />, label: "Employment", prompt: "What are my workplace rights in Nepal?" },
  { icon: <Heart size={18} />, label: "Marriage & Divorce", prompt: "How do I file for divorce in Nepal?" },
  { icon: <Shield size={18} />, label: "Domestic Violence", prompt: "How to report domestic violence in Nepal?" },
  { icon: <User size={18} />, label: "Women's Rights", prompt: "What are women's constitutional rights in Nepal?" },
  { icon: <BookOpen size={18} />, label: "Citizenship", prompt: "Explain citizenship laws in Nepal" },
  { icon: <AlertCircle size={18} />, label: "Cyber Crime", prompt: "How to report cyber crime in Nepal?" },
  { icon: <Phone size={18} />, label: "Police & FIR", prompt: "How do I file a police complaint in Nepal?" },
];

const promptIdeas = [
  "Can my employer fire me without notice?",
  "Explain divorce procedures in Nepal",
  "What is the legal age for marriage?",
  "Create a rental agreement template",
];

const emergencyKeywords = ["abuse", "hurting", "emergency", "danger", "help me", "violence", " assaulted", "raped", "beating", "threat"];

const followUpOptions = [
  "Explain Simply",
  "Generate Letter",
  "Show Related Laws",
  "Find Legal Aid",
];

function BriefcaseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(() => localStorage.getItem("herlegal_activeConv") || null);
  const [loadingConvs, setLoadingConvs] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const navigate = useNavigate();

  const setActiveConvAndPersist = (id) => {
    setActiveConv(id);
    if (id) localStorage.setItem("herlegal_activeConv", id);
    else localStorage.removeItem("herlegal_activeConv");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    const el = document.querySelector(".chat-scroll");
    if (el) el.scrollTop = el.scrollHeight - el.clientHeight;
  }, [messages]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConv && user) {
      fetchMessages(activeConv);
    }
  }, [activeConv, user]);

  const fetchConversations = async () => {
    if (!user) return;
    setLoadingConvs(true);
    try {
      const res = await fetch(`/api/v1/chatbot/conversations/${user._id}`);
      if (res.ok) {
        const data = await res.json();
        console.log("[conv] fetched:", data.length);
        setConversations(data);
        if (!activeConv && data.length > 0) {
          setActiveConvAndPersist(data[0]._id);
        }
      } else {
        console.error("[conv] fetch failed:", res.status);
      }
    } catch (e) {
      console.error("[conv] error:", e);
    } finally {
      setLoadingConvs(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await fetch(`/api/v1/chatbot/conversation/${convId}`);
      if (res.ok) setMessages(await res.json());
    } catch {}
  };

  const createConversation = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/v1/chatbot/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      if (res.ok) {
        const conv = await res.json();
        setConversations((prev) => [conv, ...prev]);
        setActiveConvAndPersist(conv._id);
        setMessages([]);
      }
    } catch {}
  };

  const switchConversation = async (convId) => {
    setActiveConvAndPersist(convId);
    setMessages([]);
    await fetchMessages(convId);
  };

  const deleteConversation = async (convId, e) => {
    e.stopPropagation();
    try {
      await fetch(`/api/v1/chatbot/conversation/${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (activeConv === convId) {
        setActiveConvAndPersist(null);
        setMessages([]);
      }
    } catch {}
  };

  const renameConv = async (convId) => {
    if (!editTitleValue.trim()) return;
    try {
      const res = await fetch(`/api/v1/chatbot/conversation/${convId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitleValue.trim() }),
      });
      if (res.ok) {
        const updated = await res.json();
        setConversations((prev) => prev.map((c) => c._id === convId ? updated : c));
      }
    } catch {}
    setEditingTitle(null);
  };

  const { lang, t } = useLanguage();

  const detectEmergency = (text) => {
    const lower = text.toLowerCase();
    return emergencyKeywords.some((kw) => lower.includes(kw));
  };

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    setShowPanel(true);

    let convId = activeConv;
    if (!convId && user) {
      try {
        const res = await fetch("/api/v1/chatbot/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });
        if (res.ok) {
          const conv = await res.json();
          console.log("[conv] created:", conv._id);
          convId = conv._id;
          setActiveConvAndPersist(conv._id);
          setConversations((prev) => [conv, ...prev]);
        } else {
          console.error("[conv] create failed:", res.status);
        }
      } catch (e) {
        console.error("[conv] create error:", e);
      }
    }

    const isEmergency = detectEmergency(msg);
    const userMsg = { role: "user", content: msg, _id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, userId: user?._id, conversationId: convId, language: lang }),
      });
      if (!res.ok) {
        console.error("[chat] API failed:", res.status);
        throw new Error("API error");
      }
      const data = await res.json();
      const raw = data.response || data.error || "No response";

      const structured = isEmergency
        ? `**Need Immediate Help?**\n\nIf you're in danger, please contact:\n\n• Women's Helpline: **1145**\n• Police Emergency: **100**\n• Legal Aid: **16600178585**\n\n---\n\n${raw}`
        : raw;

      const tempId = Date.now() + 1;
      setMessages((prev) => [...prev, { role: "assistant", content: "", _id: tempId, sources: [], isEmergency }]);

      let displayed = "";
      const chars = structured.split("");
      for (let i = 0; i < chars.length; i++) {
        displayed += chars[i];
        await new Promise((r) => setTimeout(r, 10));
        setMessages((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((m) => m._id === tempId);
          if (idx !== -1) updated[idx] = { ...updated[idx], content: displayed };
          return updated;
        });
      }

      fetchConversations();
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again.", _id: Date.now() + 1 },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, user, activeConv]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = async (id, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  const newChat = () => {
    if (user) createConversation();
    else {
      setActiveConvAndPersist(null);
      setMessages([]);
    }
  };

  const formatContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith("---")) {
        elements.push(<hr key={`hr-${i}`} style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "16px 0" }} />);
        i++;
        continue;
      }

      if (/^\*\*.*\*\*$/.test(line.trim())) {
        elements.push(
          <div key={`h-${i}`} className="answer-headline">
            {line.trim().replace(/\*\*/g, "")}
          </div>
        );
        i++;
        continue;
      }

      if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
        const items = [];
        while (i < lines.length && (lines[i].trim().startsWith("•") || lines[i].trim().startsWith("-"))) {
          items.push(
            <li key={`li-${i}`}>
              {lines[i].trim().replace(/^[•-]\s*/, "")}
            </li>
          );
          i++;
        }
        elements.push(<ul key={`ul-${i}`} className="answer-list">{items}</ul>);
        continue;
      }

      if (line.trim()) {
        const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        elements.push(
          <p key={`p-${i}`} style={{ marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
      i++;
    }

    return elements;
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
  const panelData = lastMessage?.role === "assistant" ? {
    summary: lastMessage.content.slice(0, 120) + "...",
    isEmergency: lastMessage.isEmergency,
  } : null;

  return (
    <div className="chat-page">
      {/* ─── SIDEBAR ─── */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <Bot size={20} />
          <span>Saathi AI</span>
        </div>

        <button className="new-chat-btn" onClick={newChat}>
          <Plus size={15} />
          New Conversation
        </button>

        <div className="sidebar-section">
          <div className="sidebar-label">Recent</div>
          <div className="sidebar-conversations">
            {loadingConvs && <p className="sidebar-empty">Loading...</p>}
            {!loadingConvs && conversations.length === 0 && (
              <p className="sidebar-empty">No conversations yet</p>
            )}
            {conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conv-item ${activeConv === conv._id ? "active" : ""}`}
                onClick={() => switchConversation(conv._id)}
              >
                {editingTitle === conv._id ? (
                  <input
                    className="conv-rename-input"
                    value={editTitleValue}
                    onChange={(e) => setEditTitleValue(e.target.value)}
                    onBlur={() => renameConv(conv._id)}
                    onKeyDown={(e) => { if (e.key === "Enter") renameConv(conv._id); }}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <>
                    <Clock size={12} style={{ flexShrink: 0, color: "#9CA3AF" }} />
                    <span className="conv-title">{conv.title}</span>
                    <span className="conv-time">{timeAgo(conv.updatedAt || conv.createdAt)}</span>
                    <button
                      className="conv-del-btn"
                      onClick={(e) => deleteConversation(conv._id, e)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-nav">
          <button className="sidebar-nav-item" onClick={() => navigate("/contact")}><Bookmark size={15} /> Saved Documents</button>
          <button className="sidebar-nav-item" onClick={() => navigate("/contact")}><Star size={15} /> Bookmarks</button>
          <button className="sidebar-nav-item" onClick={() => navigate("/contact")}><Settings size={15} /> Settings</button>
          <a href="tel:1145" className="sidebar-nav-item emergency" style={{ textDecoration: "none" }}><Phone size={15} /> Emergency Help</a>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div className="chat-main">
        {messages.length > 0 && (
          <div className="conv-topbar">
            <span className="conv-topbar-title">
              {conversations.find((c) => c._id === activeConv)?.title || "Conversation"}
            </span>
            {activeConv && (
              <button className="conv-rename-btn" onClick={() => {
                const conv = conversations.find((c) => c._id === activeConv);
                setEditingTitle(activeConv);
                setEditTitleValue(conv?.title || "");
              }}>
                <Edit3 size={13} />
              </button>
            )}
          </div>
        )}

        <div className="chat-scroll">
          {messages.length === 0 ? (
            <div className="welcome-screen">
              <div className="welcome-badge">
                <Sparkles size={14} />
                AI Legal Assistant
              </div>
              <h1 className="welcome-title">
                Know your<br /><span className="welcome-accent">rights.</span>
              </h1>
              <p className="welcome-sub">
                Ask anything about women's legal rights in Nepal. Free, anonymous, private.
              </p>
              <div className="welcome-categories">
                {categories.map((cat) => (
                  <button key={cat.label} className="welcome-cat" onClick={() => sendMessage(cat.prompt)}>
                    <span className="cat-icon">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="welcome-prompts">
                {promptIdeas.map((p) => (
                  <button key={p} className="welcome-prompt" onClick={() => sendMessage(p)}>
                    <span style={{ flex: 1 }}>{p}</span>
                    <ArrowRight size={14} className="welcome-prompt-arrow" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-area">
                {messages.map((msg) => (
                <div key={msg._id} className={`message-row ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === "assistant" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">
                        {msg.role === "assistant" ? "Saathi" : "You"}
                      </span>
                    </div>

                    {msg.role === "assistant" && msg.isEmergency && (
                      <div className="emergency-banner">
                        <div className="emergency-title">Need Immediate Help?</div>
                        <div className="emergency-grid">
                          <a href="tel:1145" className="emergency-btn" style={{ textDecoration: "none" }}><Phone size={14} /> Women's Helpline 1145</a>
                          <a href="tel:100" className="emergency-btn" style={{ textDecoration: "none" }}><Shield size={14} /> Police 100</a>
                          <a href="tel:16600178585" className="emergency-btn" style={{ textDecoration: "none" }}><Heart size={14} /> Legal Aid 16600178585</a>
                        </div>
                      </div>
                    )}

                    <div className="message-bubble">
                      {msg.content === "" && msg.role === "assistant" ? (
                        <span className="typing-indicator">
                          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                        </span>
                      ) : (
                        formatContent(msg.content)
                      )}
                    </div>

                    {msg.role === "assistant" && msg.content && (
                      <>
                        <div className="answer-sources">
                          <button className="source-chip" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><Scale size={12} /> Nepal Constitution</button>
                          <button className="source-chip" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><FileText size={12} /> Labour Act, 2074</button>
                          <button className="source-chip" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><BookOpen size={12} /> Law Commission</button>
                        </div>

                        <div className="follow-ups">
                          {followUpOptions.map((f) => (
                            <button key={f} className="follow-chip" onClick={() => sendMessage(`${f} about: ${messages.filter(m => m.role === 'user').pop()?.content || ''}`)}>
                              {f}
                            </button>
                          ))}
                        </div>

                        <div className="message-actions">
                          <button className="action-btn" title="Helpful" onClick={() => alert("Thanks for your feedback!")}><ThumbsUp size={14} /></button>
                          <button className="action-btn" title="Not helpful" onClick={() => alert("Thanks for your feedback!")}><ThumbsDown size={14} /></button>
                          <button className="action-btn" onClick={() => copyMessage(msg._id, msg.content)} title="Copy">
                            {copiedId === msg._id ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <button className="action-btn" title="Download" onClick={() => { const b = new Blob([msg.content], {type: "text/plain"}); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `herlegal-${msg._id}.txt`; a.click(); }}><Download size={14} /></button>
                          <button className="action-btn" title="Speak" onClick={() => { const u = new SpeechSynthesisUtterance(msg.content); u.lang = "en-US"; speechSynthesis.speak(u); }}><Volume2 size={14} /></button>
                          <button className="action-btn" title="Share" onClick={() => { if (navigator.share) navigator.share({title: "Her Legal", text: msg.content}); else copyMessage(msg._id, msg.content); }}><Share2 size={14} /></button>
                        </div>

                        <div className="answer-disclaimer">
                          This is general legal guidance and not legal advice. Consult a qualified lawyer for your specific situation.
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {loading && (!messages.length || messages[messages.length - 1]?.content !== "") && (
                <div className="message-row assistant">
                  <div className="message-avatar"><Bot size={16} /></div>
                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">Saathi</span>
                    </div>
                    <div className="message-bubble">
                      <span className="typing-indicator">
                        <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your legal rights..."
              rows={1}
              className="chat-input"
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <div className="input-actions">
              <button className="input-action-btn" onClick={() => fileRef.current?.click()} title="Upload document">
                <Paperclip size={16} />
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setInput(prev => prev + "\n\n[Attached: " + f.name + "]\n" + r.result?.toString().slice(0, 500)); r.readAsText(f); } e.target.value = ""; }} />
              <button className="input-action-btn" title="Voice input" onClick={() => { const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; if (SpeechRecognition) { const rec = new SpeechRecognition(); rec.lang = "en-US"; rec.onresult = (e) => setInput(prev => prev + e.results[0][0].transcript); rec.start(); } else { alert("Voice input is not supported in your browser."); } }}>
                <Mic size={16} />
              </button>
              <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                {loading ? <Loader2 size={18} className="spin" /> : <SendHorizonal size={18} />}
              </button>
            </div>
          </div>
          <p className="input-footer">Her Legal provides legal information — not legal advice.</p>
        </div>
      </div>

      {/* ─── ACTION PANEL ─── */}
      <div className={`action-panel ${showPanel && lastMessage?.role === "assistant" ? "visible" : ""}`}>
        {panelData && (
          <>
            <div className="panel-section">
              <div className="panel-label">Key Takeaways</div>
              <p style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.6 }}>
                {panelData.summary}
              </p>
            </div>

            <div className="panel-section">
              <div className="panel-label">Related Laws</div>
              <button className="panel-item" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><Scale size={14} /> Nepal Constitution</button>
              <button className="panel-item" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><FileText size={14} /> Labour Act, 2074</button>
              <button className="panel-item" onClick={() => window.open("https://lawcommission.gov.np", "_blank")}><BookOpen size={14} /> Muluki Ain</button>
            </div>

            <div className="panel-section">
              <div className="panel-label">Recommended Documents</div>
              <button className="panel-item" onClick={() => navigate("/chat")}><FileText size={14} /> Complaint Letter</button>
              <button className="panel-item" onClick={() => navigate("/chat")}><FileText size={14} /> Rental Agreement</button>
            </div>

            <div className="panel-section">
              <div className="panel-label">Legal Aid Contacts</div>
              <a href="tel:1145" className="panel-item" style={{ textDecoration: "none" }}><Phone size={14} /> Women's Helpline: 1145</a>
              <a href="tel:100" className="panel-item" style={{ textDecoration: "none" }}><Shield size={14} /> Police: 100</a>
              <a href="tel:16600178585" className="panel-item" style={{ textDecoration: "none" }}><Heart size={14} /> Legal Aid: 16600178585</a>
            </div>

            <div className="panel-section">
              <div className="panel-label">Next Step</div>
              <button className="panel-item" onClick={() => navigate("/chat")}><ChevronRight size={14} /> Generate Legal Document</button>
              <button className="panel-item" onClick={() => navigate("/contact")}><ChevronRight size={14} /> Find Nearby Lawyer</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
