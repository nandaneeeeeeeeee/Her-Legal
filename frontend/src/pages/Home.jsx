import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useChatbot } from "../ChatbotContext";
import {
  ArrowRight, Sparkles, Shield, Lock, MapPin, MessageCircle,
  ChevronDown, Search, Heart, Phone, BookOpen, Scale,
  FileText, User, AlertCircle
} from "lucide-react";
import "./Home.css";

// ─── HOOKS ───
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); o.unobserve(el); } }, { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Section({ children, delay = "" }) {
  const [ref, vis] = useReveal();
  return <div ref={ref} className={`reveal ${delay} ${vis ? "visible" : ""}`}>{children}</div>;
}

// ─── HERO AI DEMO ───
function AIChatDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      if (step < 4) setStep(s => s + 1);
    }, step === 0 ? 1500 : step === 1 ? 2000 : step === 2 ? 2500 : 3000);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const reset = setInterval(() => { setStep(0); }, 16000);
    return () => clearInterval(reset);
  }, []);

  return (
    <div className="ai-demo">
      <div className="ai-demo-header">
        <Sparkles size={14} />
        <span>Her Legal AI</span>
      </div>
      <div className="ai-demo-body">
        {step >= 0 && (
          <div className="chat-msg user">
            <div className="chat-bubble user-bubble">
              Can my employer fire me without notice?
            </div>
          </div>
        )}
        {step >= 1 && (
          <div className="chat-msg ai">
            <div className="ai-thinking">
              <span className="dot-pulse" />
              Analyzing Nepal Labour Act, 2074...
            </div>
          </div>
        )}
        {step >= 2 && (
          <div className="chat-msg ai">
            <div className="chat-bubble ai-bubble">
              <strong>Under Nepal's Labour Act, 2074:</strong>
              <p style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6 }}>
                Your employer cannot terminate you without a valid reason and proper notice. 
                The required notice period depends on your employment duration:
              </p>
              <ul style={{ margin: "8px 0", paddingLeft: 16, fontSize: 13, lineHeight: 1.8 }}>
                <li>Less than 1 year: 30 days notice</li>
                <li>1–3 years: 60 days notice</li>
                <li>More than 3 years: 90 days notice</li>
              </ul>
            </div>
          </div>
        )}
        {step >= 3 && (
          <div className="chat-msg ai">
            <div className="chat-links">
              <span className="chat-link"><Scale size={12} /> Labour Act, 2074</span>
              <span className="chat-link"><FileText size={12} /> Severance Guide</span>
              <span className="chat-link"><MessageCircle size={12} /> File Complaint</span>
            </div>
          </div>
        )}
        {step >= 4 && (
          <div className="chat-msg ai">
            <div className="chat-next">
              <ArrowRight size={14} />
              <span>Generate a formal notice letter for your employer</span>
            </div>
          </div>
        )}
      </div>
      <div className="ai-demo-footer">
        <input type="text" placeholder="Ask a legal question..." readOnly />
        <button><ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

// ─── LEGAL TOPIC CARD ───
const topics = [
  { icon: <Shield size={22} />, title: "Domestic Violence", desc: "Protection orders, filing complaints, and safety resources under the Domestic Violence Act." },
  { icon: <Heart size={22} />, title: "Marriage & Divorce", desc: "Marriage registration, divorce proceedings, alimony, and child custody rights." },
  { icon: <Scale size={22} />, title: "Property Rights", desc: "Inheritance, property ownership, and land rights guaranteed by Nepali law." },
  { icon: <BriefcaseIcon />, title: "Employment", desc: "Workplace rights, harassment, equal pay, maternity leave, and termination protections." },
  { icon: <BookOpen size={22} />, title: "Citizenship", desc: "Citizenship certificates, naturalization, and rights of Nepali women and their children." },
  { icon: <AlertCircle size={22} />, title: "Cyber Crime", desc: "Online harassment, data privacy, and filing cyber complaints under the Electronic Transactions Act." },
  { icon: <MapPin size={22} />, title: "Police Complaints", desc: "How to file an FIR, your rights during arrest, and police accountability." },
  { icon: <User size={22} />, title: "Women's Rights", desc: "Constitutional guarantees, reproductive rights, and special legal protections for women." },
];

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

// ─── KNOWLEDGE HUB CARD ───
const articles = [
  { title: "Understanding Divorce in Nepal", tag: "Marriage", read: "8 min" },
  { title: "Property Rights for Women", tag: "Property", read: "6 min" },
  { title: "Workplace Harassment: Your Rights", tag: "Employment", read: "10 min" },
  { title: "Inheritance Laws Explained", tag: "Property", read: "7 min" },
  { title: "Filing a Police Complaint", tag: "Safety", read: "5 min" },
  { title: "Domestic Violence Protection", tag: "Safety", read: "9 min" },
  { title: "Maternity Leave Entitlements", tag: "Employment", read: "4 min" },
  { title: "Cyber Harassment: Legal Options", tag: "Cyber", read: "6 min" },
];

// ─── EXPORT ───
export default function Home() {
  const { setOpen } = useChatbot();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [search, setSearch] = useState("");
  const topicsRef = useRef(null);

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const faqs = [
    { q: "Is my identity protected?", a: "Absolutely. All interactions with Her Legal are anonymous. We don't collect personal information. Your privacy and safety are our top priorities." },
    { q: "How do I get legal help?", a: "Start by asking our AI assistant below — it's free and instant. For specific legal guidance, we can connect you with our network of legal partners through the Contact page." },
    { q: "Is this service free?", a: "Yes. Every feature — AI legal assistant, document templates, knowledge hub, and community support — is completely free." },
    { q: "What if I need emergency help?", a: "If you're in immediate danger, call the Women's Helpline at 1145 or Police at 100. Our Emergency section has all the numbers." },
  ];

  return (
    <div className="home">

      {/* ═══════ HERO ═══════ */}
      <section className="hero-sec">
        <div className="container hero-grid">
          <div className="hero-text-col">
            <div className="hero-badge reveal visible">
              <Sparkles size={12} /> AI-Powered Legal Guidance
            </div>
            <h1 className="reveal visible reveal-d1">
              Know your<br />rights.
              <span className="hero-accent"> Before life asks.</span>
            </h1>
            <p className="hero-sub reveal visible reveal-d2">
              Understand Nepali law in plain language. Get instant answers, generate documents, and take action — all in one place.
            </p>
            <div className="hero-actions reveal visible reveal-d3">
              <button className="btn btn-primary" onClick={() => navigate("/chat")}>
                Start AI Assistant <ArrowRight size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => topicsRef.current?.scrollIntoView({ behavior: "smooth" })}>
                Explore Legal Topics
              </button>
            </div>
            <div className="hero-trust reveal visible reveal-d4">
              <span><Shield size={14} /> 100% Anonymous</span>
              <span><Lock size={14} /> Private & Secure</span>
              <span><MapPin size={14} /> Nepal-Specific</span>
            </div>
          </div>
          <div className="hero-visual-col reveal visible reveal-d2">
            <AIChatDemo />
          </div>
        </div>
      </section>

      {/* ═══════ TRUST STRIP ═══════ */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {[
              { icon: <Sparkles size={18} />, label: "AI-Powered Guidance" },
              { icon: <Heart size={18} />, label: "Women Focused" },
              { icon: <Lock size={18} />, label: "Privacy First" },
              { icon: <MapPin size={18} />, label: "Nepal Specific" },
              { icon: <Scale size={18} />, label: "Legal Information" },
              { icon: <FileText size={18} />, label: "Document Assistance" },
            ].map((item) => (
              <div key={item.label} className="trust-item">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PROBLEM ═══════ */}
      <section className="problem-sec">
        <div className="container">
          <Section>
            <span className="section-label">The Problem</span>
          </Section>
          <Section delay="reveal-d1">
            <h2 style={{ maxWidth: 700 }}>
              Legal information shouldn't require a lawyer to understand.
            </h2>
            <p className="section-desc">
              In Nepal, most women face three barriers when trying to understand their legal rights.
            </p>
          </Section>
          <div className="problem-grid">
            {[
              { icon: <Scale size={24} />, title: "Confusing Laws", desc: "Legal documents are written in complex language that's nearly impossible to navigate without professional help." },
              { icon: <Heart size={24} />, title: "Expensive Consultations", desc: "Private lawyers charge NPR 1,000–5,000 per consultation — out of reach for most Nepali women." },
              { icon: <Shield size={24} />, title: "No Trusted Guidance", desc: "Fear of judgment, stigma, and lack of anonymous resources keep women from seeking the help they need." },
            ].map((item, i) => (
              <Section key={item.title} delay={`reveal-d${i + 1}`}>
                <div className="problem-card">
                  <div className="problem-icon-wrap">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ LEGAL TOPICS ═══════ */}
      <section className="topics-sec" ref={topicsRef}>
        <div className="container">
          <Section>
            <span className="section-label">Legal Topics</span>
          </Section>
          <Section delay="reveal-d1">
            <h2>Know your rights, across every area of life</h2>
          </Section>
          <div className="topics-grid">
            {topics.map((topic, i) => (
              <Section key={topic.title} delay={`reveal-d${(i % 4) + 1}`}>
                <div className="topic-card" onClick={() => navigate("/chat")} style={{ cursor: "pointer" }}>
                  <div className="topic-icon">{topic.icon}</div>
                  <h3>{topic.title}</h3>
                  <p>{topic.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="how-sec">
        <div className="container">
          <Section>
            <span className="section-label">How It Works</span>
          </Section>
          <Section delay="reveal-d1">
            <h2>From confusion to action in four steps</h2>
          </Section>
          <div className="how-grid">
            {[
              { step: "01", icon: <MessageCircle size={24} />, title: "Ask", desc: "Type your legal question in plain language. No jargon needed." },
              { step: "02", icon: <Sparkles size={24} />, title: "Understand", desc: "Get a clear, plain-English answer based on Nepali law — tailored to your situation." },
              { step: "03", icon: <FileText size={24} />, title: "Generate", desc: "Create legal documents, complaint letters, and notices with one click." },
              { step: "04", icon: <ArrowRight size={24} />, title: "Take Action", desc: "Know exactly what to do next — whether it's filing a complaint or contacting a lawyer." },
            ].map((item, i) => (
              <Section key={item.title} delay={`reveal-d${i + 1}`}>
                <div className="how-card">
                  <span className="how-step">{item.step}</span>
                  <div className="how-icon-wrap">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  {i < 3 && <div className="how-line" />}
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WOMEN'S SUPPORT ═══════ */}
      <section className="support-sec">
        <div className="container" style={{ textAlign: "center" }}>
          <Section>
            <div className="support-card">
              <Heart size={32} className="support-heart" />
              <span className="section-label" style={{ color: "var(--accent)" }}>Need immediate help?</span>
              <h2 style={{ color: "#fff", marginBottom: 12 }}>You are not alone.</h2>
              <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: 480, margin: "0 auto 36px", fontSize: 15, lineHeight: 1.7 }}>
                If you're in danger or need urgent support, these resources are available 24/7.
              </p>
              <div className="support-grid">
                {[
                  { icon: <Phone size={20} />, label: "Women's Helpline", number: "1145" },
                  { icon: <Shield size={20} />, label: "Police Emergency", number: "100" },
                  { icon: <Heart size={20} />, label: "Legal Aid", number: "16600178585" },
                ].map((item) => (
                  <a key={item.label} href={`tel:${item.number}`} className="support-item" style={{ textDecoration: "none", color: "inherit" }}>
                    <div className="support-item-icon">{item.icon}</div>
                    <div>
                      <strong>{item.label}</strong>
                      <span className="support-number">{item.number}</span>
                    </div>
                  </a>
                ))}
              </div>
              <button className="btn btn-primary" style={{ marginTop: 32, background: "#fff", color: "var(--primary)", boxShadow: "none" }}
                onClick={() => setOpen(true)}>
                Talk to Saathi <ArrowRight size={16} />
              </button>
            </div>
          </Section>
        </div>
      </section>

      {/* ═══════ KNOWLEDGE HUB ═══════ */}
      <section className="hub-sec">
        <div className="container">
          <Section>
            <span className="section-label">Knowledge Hub</span>
          </Section>
          <Section delay="reveal-d1">
            <h2>Learn. Understand. Empower.</h2>
          </Section>
          <Section delay="reveal-d2">
            <div className="hub-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </Section>
          <div className="hub-grid">
            {filteredArticles.map((article, i) => (
              <Section key={article.title} delay={`reveal-d${(i % 4) + 1}`}>
                <div className="hub-card" onClick={() => navigate("/news")} style={{ cursor: "pointer" }}>
                  <span className="hub-tag">{article.tag}</span>
                  <h3>{article.title}</h3>
                  <div className="hub-footer">
                    <span className="hub-read">{article.read} read</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="faq-sec">
        <div className="container" style={{ textAlign: "center" }}>
          <Section>
            <span className="section-label">FAQ</span>
          </Section>
          <Section delay="reveal-d1">
            <h2>Common questions</h2>
          </Section>
          <Section delay="reveal-d2">
            <div className="faq-list">
              {faqs.map((item, idx) => (
                <div key={idx} className={`faq-row${faq === idx ? " open" : ""}`}>
                  <button className="faq-q" onClick={() => setFaq(faq === idx ? null : idx)}>
                    {item.q} <ChevronDown size={16} className={`faq-cv${faq === idx ? " rot" : ""}`} />
                  </button>
                  <div className="faq-a" style={{ maxHeight: faq === idx ? 200 : 0 }}>
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="final-cta">
        <div className="container" style={{ textAlign: "center" }}>
          <Section>
            <h2 className="cta-big">
              Legal guidance.<br />
              <span className="cta-accent">Made understandable.</span>
            </h2>
          </Section>
          <Section delay="reveal-d1">
            <p className="cta-sub">
              Start with Her Legal. It's free, anonymous, and built for every woman in Nepal.
            </p>
          </Section>
          <Section delay="reveal-d2">
            <div className="cta-actions">
              <button className="btn btn-primary cta-btn" onClick={() => setOpen(true)}>
                Start with Her Legal <ArrowRight size={18} />
              </button>
            </div>
          </Section>
        </div>
      </section>

    </div>
  );
}
