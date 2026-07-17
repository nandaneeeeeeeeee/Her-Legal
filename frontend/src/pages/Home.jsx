import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Shield, Lock, MessageCircle,
  Search, Heart, Phone, BookOpen, Scale, MapPin,
  FileText, User, AlertCircle, ChevronRight,
  Bot, Send, Check, Globe, Quote,
  Clock, Star, Feather, Fingerprint
} from "lucide-react";
import "./Home.css";

/* ─── HOOKS ─── */
function useScrollReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); o.unobserve(el); }
    }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Reveal({ children, delay = "", className = "" }) {
  const [ref, vis] = useScrollReveal();
  return (
    <div ref={ref} className={`reveal ${delay} ${vis ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function useCounter(target, duration = 2200) {
  const [count, setCount] = useState(0);
  const [ref, vis] = useScrollReveal();
  useEffect(() => {
    if (!vis) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);
  return [ref, count];
}

/* ─── HERO CHAT ─── */
const DEMO_QUESTIONS = [
  "Can my employer fire me without notice?",
  "What are my property rights after marriage?",
  "How do I file a domestic violence complaint?",
  "What is the legal age for marriage in Nepal?",
];

const RESPONSES = {
  "Can my employer fire me without notice?": {
    text: "Under Nepal's Labour Act, 2074, your employer cannot terminate you without a valid reason and proper notice. The notice period depends on your employment duration:\n\n\u2022 Less than 1 year: 30 days notice\n\u2022 1\u20133 years: 60 days notice\n\u2022 More than 3 years: 90 days notice",
    actions: ["Generate Notice Letter", "File Complaint"],
  },
  "What are my property rights after marriage?": {
    text: "Under Nepali law, both spouses have equal rights to property acquired during marriage. Key points:\n\n\u2022 Property owned before marriage remains separate\n\u2022 Jointly acquired property is shared equally\n\u2022 Daughters have equal inheritance rights to sons\n\u2022 You can register property in your name",
    actions: ["Property Registration Guide", "Consult a Lawyer"],
  },
  "How do I file a domestic violence complaint?": {
    text: "You can file a complaint under the Domestic Violence Act, 2066. Here's how:\n\n1. Visit the nearest police station or call 1145\n2. File a First Information Report (FIR)\n3. Request a protection order from the court\n4. Seek medical examination if injured\n5. Contact a legal aid provider for support",
    actions: ["Find Legal Aid", "Emergency Contacts"],
  },
  "What is the legal age for marriage in Nepal?": {
    text: "The legal age for marriage in Nepal is:\n\n\u2022 20 years for both men and women\n\u2022 Marriage below 20 requires parental consent\n\u2022 Marriage below 18 is prohibited\n\u2022 Child marriage is a criminal offense\n\u2022 Both parties must freely consent to the marriage",
    actions: ["Marriage Registration Guide", "Report Child Marriage"],
  },
};

function HeroChat() {
  const [question, setQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  const handleQuestion = useCallback(async (q) => {
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1600));
    const matched = Object.keys(RESPONSES).find(k => q.includes(k.slice(0, 20)));
    setMessages(prev => [...prev, {
      role: "assistant",
      text: RESPONSES[q]?.text || RESPONSES[matched]?.text || "I understand your question. Based on Nepali law, this depends on your specific situation. Would you like to start a full conversation for detailed guidance?"
    }]);
    setIsTyping(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const val = question.trim();
    if (!val) return;
    const matched = Object.keys(RESPONSES).find(k =>
      k.toLowerCase().includes(val.toLowerCase())
    );
    if (matched) await handleQuestion(matched);
    else await handleQuestion(val);
    setQuestion("");
  };

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  return (
    <div className="hero-chat">
      <div className="hero-chat-header">
        <span className="hero-chat-dot" />
        <Bot size={14} />
        <span>Saathi \u2014 AI Legal Assistant</span>
        <span className="hero-chat-status">Online</span>
      </div>
      <div className="hero-chat-body" ref={chatRef}>
        {messages.length === 0 ? (
          <div className="hero-chat-welcome">
            <div className="hero-chat-welcome-icon"><Bot size={32} /></div>
            <p>Ask me anything about Nepali law.</p>
            <div className="hero-chat-prompts">
              {DEMO_QUESTIONS.map((q, i) => (
                <button key={i} className="hero-chat-prompt"
                  onClick={() => handleQuestion(q)}>
                  <Quote size={10} /> {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="hero-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`hero-chat-msg ${msg.role}`}>
                <div className={`hero-chat-bubble ${msg.role}-bubble`}>
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j}>{line || '\u00A0'}</p>
                  ))}
                  {msg.role === "assistant" && i === messages.length - 1 && !isTyping && (
                    <div className="hero-chat-bubble-actions">
                      {["Save Answer", "Generate Document", "Share"].map((a, j) => (
                        <button key={j} className="hero-chat-bubble-action">
                          {a} <ArrowRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="hero-chat-msg assistant">
                <div className="hero-chat-bubble assistant-bubble typing">
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <form className="hero-chat-footer" onSubmit={handleSubmit}>
        <input type="text" placeholder="Ask a legal question..." value={question}
          onChange={e => setQuestion(e.target.value)} disabled={isTyping} />
        <button type="submit" disabled={!question.trim() || isTyping}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

/* ════════════════════════════════════════════
   SECTIONS
   ════════════════════════════════════════════ */

/* ─── 2. REALITY — editorial full-width ─── */
function RealitySection() {
  return (
    <section className="reality-sec">
      <div className="reality-image-wrap">
        <img src="/images/woman-portrait.jpg" alt=""
          className="reality-image" />
        <div className="reality-overlay" />
      </div>
      <div className="container">
        <div className="reality-content">
          <Reveal>
            <span className="section-label light-label">The Reality</span>
            <h2>Most women in Nepal face legal challenges alone.</h2>
            <p className="reality-p">
              The law is written in language that requires years to understand.
              Lawyers charge fees most cannot afford. And asking for help often
              means risking judgment.
            </p>
          </Reveal>
          <Reveal delay="reveal-d1" className="reality-stats-row">
            <div className="reality-stat-badge">
              <strong>73%</strong>
              <span>of Nepali women are unaware of their legal rights</span>
            </div>
            <div className="reality-stat-badge">
              <strong>68%</strong>
              <span>never seek legal help due to cost or fear of judgment</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 3. AI ASSISTANT — product split ─── */
function AISection() {
  const navigate = useNavigate();
  return (
    <section className="ai-sec">
      <div className="container">
        <div className="ai-layout">
          <Reveal className="ai-visual-side">
            <div className="ai-mockup">
              <div className="ai-mockup-top">
                <div className="ai-mockup-dots"><span /><span /><span /></div>
                <span>Saathi AI</span>
              </div>
              <div className="ai-mockup-body">
                <div className="ai-msg-user">
                  <div className="ai-msg-bubble user-msg">
                    What are my rights during divorce?
                  </div>
                </div>
                <div className="ai-msg-assistant">
                  <div className="ai-msg-bubble assistant-msg">
                    <div className="ai-source">Muluki Civil Code, 2074</div>
                    <p>Under Nepali law, both spouses have equal rights to property acquired during marriage. You are entitled to:</p>
                    <ul>
                      <li>Equal division of jointly acquired property</li>
                      <li>Alimony if you are financially dependent</li>
                      <li>Child custody based on the child's best interest</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="ai-mockup-input">
                <span>Ask a follow-up...</span>
                <Send size={13} />
              </div>
            </div>
          </Reveal>
          <Reveal delay="reveal-d1" className="ai-text-side">
            <span className="section-label">AI Legal Assistant</span>
            <h2>You ask. It answers.<br />In plain language.</h2>
            <p className="ai-desc">
              Trained on Nepal's constitution, civil code, labour act, and 30+ legal documents.
              Your personal legal guide, available anytime, completely free.
            </p>
            <div className="ai-features">
              {[
                { icon: <Check size={14} />, text: "Instant answers, 24/7" },
                { icon: <Check size={14} />, text: "Nepali & English support" },
                { icon: <Check size={14} />, text: "Sources cited for every claim" },
                { icon: <Check size={14} />, text: "100% anonymous" },
              ].map((f, i) => (
                <div key={i} className="ai-feature-row">
                  <span className="ai-check">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/chat")}>
              Try the AI Assistant <ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 4. CATEGORIES — bento grid ─── */
const BENTO = [
  { s: "b-lg", t: "Domestic Violence", d: "Protection orders, filing complaints, emergency shelters",
    c: "#DC2626", i: <Shield size={22} />,
    img: "/images/women-group.jpg" },
  { s: "b-sm", t: "Marriage & Divorce", d: "Registration, alimony, child custody",
    c: "#E11D48", i: <Heart size={18} /> },
  { s: "b-sm", t: "Property Rights", d: "Inheritance, ownership, land registration",
    c: "#7C3AED", i: <Scale size={18} /> },
  { s: "b-md", t: "Employment", d: "Harassment, maternity leave, unfair termination",
    c: "#2563EB", i: <User size={20} />,
    stat: { v: "12", l: "rights protected under law" } },
  { s: "b-tall", t: "Know Your Rights", d: "Constitutional guarantees, reproductive rights, education",
    c: "#C8102E", i: <Star size={22} />,
    img: "/images/schoolgirls.jpg" },
  { s: "b-sm", t: "Cyber Crime", d: "Online harassment, privacy, digital evidence",
    c: "#D97706", i: <AlertCircle size={18} /> },
  { s: "b-sm", t: "Police & FIR", d: "Filing complaints, your rights at the station",
    c: "#0891B2", i: <MapPin size={18} /> },
];

function BentoSection() {
  const navigate = useNavigate();
  return (
    <section className="bento-sec">
      <div className="container">
        <Reveal className="bento-head">
          <span className="section-label">Legal Topics</span>
          <h2>Across every area of life.<br />Know your rights in each.</h2>
        </Reveal>
        <div className="bento-grid">
          {BENTO.map((item, i) => (
            <Reveal key={i} delay={`reveal-d${(i % 4) + 1}`}
              className={`bento-card ${item.s}`}
              style={{ '--accent': item.c }}
              onClick={() => navigate("/chat")}>
              {item.img && (
                <div className="bento-img-wrap">
                  <img src={item.img} alt="" className="bento-img" />
                  <div className="bento-img-overlay" />
                </div>
              )}
              <div className="bento-card-icon" style={{ color: item.c, background: `${item.c}14` }}>
                {item.i}
              </div>
              <h3>{item.t}</h3>
              <p>{item.d}</p>
              {item.stat && (
                <div className="bento-stat">
                  <strong style={{ color: item.c }}>{item.stat.v}</strong>
                  <span>{item.stat.l}</span>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. DOCUMENTS — product showcase ─── */
function DocumentSection() {
  const navigate = useNavigate();
  return (
    <section className="doc-sec">
      <div className="container">
        <div className="doc-layout">
          <Reveal className="doc-text-side">
            <span className="section-label">Document Generator</span>
            <h2>One click.<br />A legal document.<br />            <span className="text-accent">Ready to file.</span></h2>
            <p className="doc-desc">
              From complaint letters to affidavits. Answer simple questions, and the AI
              drafts a complete, properly formatted legal document.
            </p>
            <div className="doc-types">
              {["Complaint Letter","Legal Notice","Affidavit",
                "Agreement","Application","Demand Letter"].map((t, i) => (
                <span key={i} className="doc-type-tag">{t}</span>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/documents")}>
              Generate a Document <ArrowRight size={16} />
            </button>
          </Reveal>
          <Reveal delay="reveal-d1" className="doc-visual-side">
            <div className="doc-preview-card">
              <div className="doc-preview-top">
                <FileText size={15} />
                <span>Complaint Letter Draft</span>
              </div>
              <div className="doc-preview-content">
                <div className="doc-line" /><div className="doc-line short" />
                <div className="doc-spacer" />
                <div className="doc-line" /><div className="doc-line" />
                <div className="doc-line short" /><div className="doc-spacer" />
                <div className="doc-line medium" /><div className="doc-line" />
                <div className="doc-line short" />
              </div>
              <div className="doc-preview-foot">
                <Check size={11} />
                Generated by AI \u2014 ready to review and download
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 6. KNOWLEDGE — editorial masonry ─── */
const ARTICLES = [
  { t: "Understanding Divorce in Nepal", tag: "Marriage", read: "8 min", c: "#E11D48",
    desc: "Complete guide to divorce procedures, alimony, and child custody under Nepali law." },
  { t: "Property Rights for Women", tag: "Property", read: "6 min", c: "#7C3AED",
    desc: "Know your inheritance rights, property ownership after marriage, and land registration." },
  { t: "Domestic Violence: Filing a Complaint", tag: "Safety", read: "5 min", c: "#DC2626",
    desc: "Step-by-step guide from FIR to protection order." },
  { t: "Maternity Leave Entitlements", tag: "Employment", read: "4 min", c: "#059669",
    desc: "Your rights to paid leave, job security, and accommodations during pregnancy." },
  { t: "Workplace Harassment", tag: "Employment", read: "10 min", c: "#2563EB",
    desc: "Legal protections, how to file complaints, and employer obligations." },
  { t: "Inheritance Laws Explained", tag: "Property", read: "7 min", c: "#7C3AED",
    desc: "Daughters' equal rights, wills vs. intestate succession." },
];

function KnowledgeSection() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const filtered = ARTICLES.filter(a =>
    a.t.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="know-sec">
      <div className="container">
        <Reveal className="know-head">
          <span className="section-label">Knowledge Hub</span>
          <h2>Learn your rights.<br />On your own time.</h2>
        </Reveal>
        <Reveal delay="reveal-d1">
          <div className="know-search-bar">
            <Search size={15} />
            <input type="text" placeholder="Search articles..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </Reveal>
        <div className="know-grid">
          {filtered.map((a, i) => (
            <Reveal key={i} delay={`reveal-d${(i % 4) + 1}`}
              className="know-card"
              style={{ '--accent': a.c }}
              onClick={() => navigate("/glossary")}>
              <span className="know-tag">{a.tag}</span>
              <h3>{a.t}</h3>
              <p>{a.desc}</p>
              <div className="know-foot">
                <span><Clock size={11} /> {a.read}</span>
                <ArrowRight size={13} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. COMMUNITY — visual collage ─── */
const STORIES = [
  { text: "Finally understood my property rights after my divorce. Thank you to everyone who shared their stories here.", r: 24, a: "Anonymous Lotus", color: "#C8102E" },
  { text: "Filed my first workplace harassment complaint today. I was scared but this community gave me courage.", r: 42, a: "Anonymous Hope", color: "#2563EB" },
  { text: "The AI assistant helped me draft a legal notice for my landlord. Saved me thousands in lawyer fees.", r: 31, a: "Anonymous Orchid", color: "#059669" },
  { text: "Shared my story for the first time. The support was overwhelming.", r: 56, a: "Anonymous Sunflower", color: "#7C3AED" },
];

function CommunitySection() {
  const navigate = useNavigate();
  return (
    <section className="comm-sec">
      <div className="comm-visual-half">
        <img src="/images/two-women.jpg" alt="" className="comm-photo" />
        <div className="comm-photo-overlay" />
        <div className="comm-photo-stat">
          <strong>2,400+</strong>
          <span>women in our community</span>
        </div>
      </div>
      <div className="container">
        <div className="comm-content-row">
          <Reveal className="comm-text">
            <span className="section-label">Community</span>
            <h2>You're not alone.<br />Thousands have shared.</h2>
            <p className="comm-desc">
              A safe space to share anonymously, ask questions, and support
              other women facing legal challenges. No judgment. Just understanding.
            </p>
            <button className="btn btn-primary" onClick={() => navigate("/community")}>
              Join the Community <ArrowRight size={16} />
            </button>
          </Reveal>
          <Reveal delay="reveal-d1" className="comm-cards-col">
            {STORIES.map((s, i) => (
              <div key={i} className="comm-story"
                style={{ '--card-color': s.color }}>
                <div className="comm-story-head">
                  <div className="comm-story-av" style={{ background: s.color }}>
                    {s.a.split(' ')[1]?.[0] || '?'}
                  </div>
                  <span>{s.a}</span>
                </div>
                <p>{s.text}</p>
                <div className="comm-story-reactions">
                  <Heart size={12} /> {s.r}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 8. STATS ─── */
function StatsSection() {
  const [r1, u] = useCounter(10000);
  const [r2, a] = useCounter(5000);
  const [r3, d] = useCounter(1200);
  const [r4, p] = useCounter(800);
  return (
    <section className="stats-sec">
      <div className="container">
        <div className="stats-row">
          {[
            { ref: r1, val: u, label: "Active Users", suff: "+" },
            { ref: r2, val: a, label: "AI Answers", suff: "+" },
            { ref: r3, val: d, label: "Documents Generated", suff: "+" },
            { ref: r4, val: p, label: "Community Stories", suff: "+" },
          ].map((s, i) => (
            <React.Fragment key={i}>
              <div className="stats-cell" ref={s.ref}>
                <div className="stats-num">{s.val.toLocaleString()}{s.suff}</div>
                <div className="stats-lbl">{s.label}</div>
              </div>
              {i < 3 && <div className="stats-div" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 9. EMERGENCY ─── */
function EmergencySection() {
  return (
    <section className="emergency-sec">
      <div className="emergency-bg-img">
        <img src="/images/mother-children.jpg" alt="" />
        <div className="emergency-bg-overlay" />
      </div>
      <div className="container">
        <Reveal className="emergency-inner">
          <div className="emergency-heart-icon"><Heart size={32} /></div>
          <span className="section-label" style={{ color: '#F5B301', background: 'rgba(245,179,1,0.14)' }}>
            Need Immediate Help?
          </span>
          <h2>You are not alone.<br />Help is one call away.</h2>
          <p className="emergency-sub">
            Free, confidential support available 24/7. Trained professionals are ready to listen.
          </p>
          <div className="emergency-nums">
            {[
              { label: "Women's Helpline", num: "1145", prime: true },
              { label: "Police Emergency", num: "100" },
              { label: "Legal Aid Commission", num: "16600178585" },
            ].map((e, i) => (
              <a key={i} href={`tel:${e.num}`}
                className={`emergency-btn${e.prime ? ' prime' : ''}`}>
                <Phone size={16} />
                <div>
                  <strong>{e.label}</strong>
                  <span>{e.num}</span>
                </div>
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── 10. TRUST ─── */
function TrustSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="trust-sec">
      <div className="container">
        <Reveal className="trust-head">
          <span className="section-label">Why Her Legal</span>
          <h2>Built on trust.<br />            <span className="text-accent">Guaranteed by design.</span></h2>
        </Reveal>
        <div className="trust-split">
          <div className="trust-cards-col">
            {[
              { icon: <Fingerprint size={20} />, c: "#059669", t: "Complete Anonymity",
                d: "No personal information required. Your identity is never stored or shared." },
              { icon: <Lock size={20} />, c: "#2563EB", t: "End-to-End Privacy",
                d: "All conversations encrypted. We don't track, log, or sell your data." },
              { icon: <Globe size={20} />, c: "#C8102E", t: "Built for Nepal",
                d: "Every answer references actual Nepali legislation. From the Constitution to the Civil Code." },
              { icon: <Feather size={20} />, c: "#7C3AED", t: "Free for Everyone",
                d: "All features are completely free. No hidden charges, no premium tiers." },
            ].map((g, i) => (
              <Reveal key={i} delay={`reveal-d${i + 1}`} className="trust-card"
                style={{ '--accent': g.c }}>
                <div className="trust-card-icon" style={{ color: g.c, background: `${g.c}10` }}>
                  {g.icon}
                </div>
                <h3>{g.t}</h3>
                <p>{g.d}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay="reveal-d2" className="trust-faq-col">
            <div className="trust-faq-box">
              <h3>Common questions</h3>
              {[
                { q: "Is my identity really protected?",
                  a: "Absolutely. All interactions are completely anonymous. We don't store personal information, and your identity is never revealed to other users." },
                { q: "How accurate is the AI?",
                  a: "Our AI is trained on 30+ Nepali legal texts including the Constitution, Muluki Civil Code, Labour Act, and Domestic Violence Act. Always verify critical decisions with a qualified lawyer." },
                { q: "Can I use the site in Nepali?",
                  a: "Yes. The platform supports both English and Nepali. Ask questions in either language and receive answers in the same language." },
              ].map((f, idx) => (
                <div key={idx} className={`trust-faq${open === idx ? ' open' : ''}`}>
                  <button className="trust-faq-q" onClick={() => setOpen(open === idx ? null : idx)}>
                    {f.q}
                    <ChevronRight size={14} className={`trust-faq-cv${open === idx ? ' rot' : ''}`} />
                  </button>
                  <div className="trust-faq-a" style={{ maxHeight: open === idx ? 250 : 0 }}>
                    <p>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ─── 11. CTA ─── */
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="cta-sec">
      <div className="cta-bg-img">
        <img src="/images/women-mountain.jpg" alt="" />
        <div className="cta-bg-overlay" />
      </div>
      <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <Reveal>
          <h2 className="cta-title">
            Legal guidance.<br />
            <span className="text-accent">Made understandable.</span>
          </h2>
        </Reveal>
        <Reveal delay="reveal-d1">
          <p className="cta-sub">
            Start with Her Legal. It's free, anonymous, and built for every woman in Nepal.
          </p>
        </Reveal>
        <Reveal delay="reveal-d2">
          <button className="btn btn-primary cta-btn" onClick={() => navigate("/chat")}>
            Get Started <ArrowRight size={18} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════
   EXPORT
   ════════════════════════════════════════════ */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* 1. HERO — split */}
      <section className="hero-sec">
        <div className="hero-bg" />
        <div className="container hero-grid">
          <Reveal className="hero-text-col">
            <div className="hero-badge">
              <Sparkles size={12} /> AI-Powered Legal Guidance
            </div>
            <h1 className="hero-title">
              Know your<br />rights.
              <span className="hero-title-accent">Before life asks.</span>
            </h1>
            <p className="hero-sub">
              Understand Nepali law in plain language. Get instant answers,
              generate legal documents, and take action \u2014 all in one place,
              completely anonymous.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary hero-btn"
                onClick={() => navigate("/chat")}>
                Start AI Assistant <ArrowRight size={16} />
              </button>
              <button className="hero-btn-outline"
                onClick={() => navigate("/community")}>
                Join Community
              </button>
            </div>
            <div className="hero-meta">
              <span><Shield size={13} /> 100% Anonymous</span>
              <span><Lock size={13} /> Private &amp; Secure</span>
              <span><MapPin size={13} /> Nepal-Specific</span>
            </div>
          </Reveal>
          <Reveal delay="reveal-d1" className="hero-visual-col">
            <HeroChat />
          </Reveal>
        </div>
      </section>

      {/* 2. REALITY — editorial full-width */}
      <RealitySection />

      {/* 3. AI — product split */}
      <AISection />

      {/* 4. CATEGORIES — bento */}
      <BentoSection />

      {/* 5. DOCUMENTS — product showcase */}
      <DocumentSection />

      {/* 6. KNOWLEDGE — masonry */}
      <KnowledgeSection />

      {/* 7. COMMUNITY — visual collage */}
      <CommunitySection />

      {/* 8. STATS — counters */}
      <StatsSection />

      {/* 9. EMERGENCY — full-width */}
      <EmergencySection />

      {/* 10. TRUST — editorial */}
      <TrustSection />

      {/* 11. CTA */}
      <CTASection />

    </div>
  );
}
