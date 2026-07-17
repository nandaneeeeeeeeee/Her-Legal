import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  MessageCircle, FileText, Bookmark, Heart, Bell,
  Settings, User, LogOut, ArrowRight, Sparkles, Shield,
  Activity, ChevronRight, Scale,
  BookOpen, Users, TrendingUp, Gavel,
  LayoutDashboard, Calendar,
  MessageSquare, Info, Menu, ChevronLeft
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [tab, setTab] = useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'activity', 'settings'].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [location]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const stats = [
    { icon: <MessageCircle size={18} />, label: t("dashboard.aiConversations"), value: '0', color: '#C8102E' },
    { icon: <FileText size={18} />, label: t("dashboard.savedDocuments"), value: '0', color: '#2563EB' },
    { icon: <Bookmark size={18} />, label: t("dashboard.bookmarks"), value: '0', color: '#D97706' },
    { icon: <Heart size={18} />, label: t("dashboard.communityPosts"), value: '0', color: '#059669' },
  ];

  const quickActions = [
    { icon: <Sparkles size={20} />, title: t("dashboard.askAI"), hint: 'Get instant legal guidance from our AI', to: '/chat', color: '#C8102E', bg: '#FFF0F0' },
    { icon: <Scale size={20} />, title: t("dashboard.generateDoc"), hint: 'Create legal documents and forms', to: '/documents', color: '#7C3AED', bg: '#F3F0FF' },
    { icon: <MessageSquare size={20} />, title: t("dashboard.community"), hint: 'Connect with others anonymously', to: '/confessions', color: '#059669', bg: '#ECFDF5' },
    { icon: <Bell size={20} />, title: t("common.notifications"), hint: 'View your alerts and updates', to: '/notifications', color: '#D97706', bg: '#FFFBEB' },
    { icon: <BookOpen size={20} />, title: t("dashboard.legalGlossary"), hint: 'Learn important legal terminology', to: '/glossary', color: '#0891B2', bg: '#ECFEFF' },
    { icon: <FileText size={20} />, title: t("dashboard.legalDocuments"), hint: 'Browse and manage your documents', to: '/documents', color: '#C8102E', bg: '#FFF0F0' },
  ];

  const navItems = [
    { key: 'overview', icon: <LayoutDashboard size={18} />, label: t("dashboard.overview") },
    { key: 'activity', icon: <Activity size={18} />, label: t("dashboard.activity") },
    { key: 'settings', icon: <Settings size={18} />, label: t("common.settings") },
  ];

  const tips = [
    { icon: <Gavel size={15} />, title: 'Constitutional Right', text: 'Article 18 of the Nepali Constitution guarantees equal rights to all women.', color: '#C8102E' },
    { icon: <Shield size={15} />, title: 'Legal Protection', text: 'The Domestic Violence Act 2066 provides protection and recourse for survivors.', color: '#7C3AED' },
    { icon: <Info size={15} />, title: 'Free Legal Aid', text: 'Women can access free legal aid through government-aided service centers across Nepal.', color: '#0891B2' },
  ];

  const quickLinks = [
    { label: 'Ask AI', to: '/chat', icon: <Sparkles size={14} /> },
    { label: 'Documents', to: '/documents', icon: <FileText size={14} /> },
    { label: 'Community', to: '/confessions', icon: <Users size={14} /> },
    { label: 'Glossary', to: '/glossary', icon: <BookOpen size={14} /> },
    { label: 'Notifications', to: '/notifications', icon: <Bell size={14} /> },
  ];

  const recentActivity = [];

  return (
    <div className="dash-page">
      {sidebarExpanded && <div className="dash-sidebar-overlay" onClick={() => setSidebarExpanded(false)} />}
      <aside className={`dash-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="dash-user">
          <button className="dash-sidebar-toggle" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
            {sidebarExpanded ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
          <div className="dash-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
          {sidebarExpanded && (
            <div className="dash-user-info">
              <strong>{user.username}</strong>
              <span>{user.email}</span>
            </div>
          )}
          {sidebarExpanded && (
            <button className="dash-sidebar-bell" onClick={() => navigate('/notifications')} title="Notifications">
              <Bell size={16} />
            </button>
          )}
        </div>

        <nav className="dash-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`dash-nav-item${tab === item.key ? ' active' : ''}`}
              onClick={() => {
                setTab(item.key);
                navigate(`/dashboard?tab=${item.key}`, { replace: true });
              }}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {sidebarExpanded && <span>{item.label}</span>}
              {tab === item.key && <span className="dash-nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="dash-sidebar-divider" />

        {sidebarExpanded && (
          <div className="dash-quick-links">
            <div className="dash-quick-links-label">Quick Links</div>
            {quickLinks.map((link, i) => (
              <button key={i} className="dash-quick-link" onClick={() => navigate(link.to)}>
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        )}

        <div className="dash-sidebar-bottom">
          <Link to="/" className="dash-nav-item">
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            {sidebarExpanded && <span>{t("common.backToSite")}</span>}
          </Link>
          <button className="dash-nav-item" onClick={handleLogout}>
            <LogOut size={16} />
            {sidebarExpanded && <span>{t("common.signOut")}</span>}
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-content">
          {tab === 'overview' && (
            <>
              <div className="dash-hero">
                <div className="dash-hero-pattern" />
                <div className="dash-hero-inner">
                  <div className="dash-hero-text">
                    <span className="dash-hero-date">
                      <Calendar size={12} />
                      {dateStr}
                    </span>
                    <h1 className="dash-hero-title">{user.username}</h1>
                    <p className="dash-hero-sub">{t("dashboard.welcomeSub")}</p>
                  </div>
                  <div className="dash-hero-actions">
                    <button className="dash-primary-btn" onClick={() => navigate('/chat')}>
                      <Sparkles size={16} />
                      <span>{t("dashboard.askAI")}</span>
                      <ArrowRight size={14} />
                    </button>
                    <button className="dash-ghost-btn" onClick={() => navigate('/documents')}>
                      <FileText size={16} />
                      <span>{t("dashboard.legalDocuments")}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="dash-stats">
                {stats.map((s, i) => (
                  <div key={i} className="dash-stat-card">
                    <div className="dash-stat-icon" style={{ color: s.color, background: `${s.color}10` }}>
                      {s.icon}
                    </div>
                    <div className="dash-stat-body">
                      <div className="dash-stat-value">{s.value}</div>
                      <div className="dash-stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <section className="dash-section">
                <div className="dash-section-header">
                  <div>
                    <h2 className="dash-section-title">{t("dashboard.quickActions")}</h2>
                    <p className="dash-section-desc">Frequently used tools and resources</p>
                  </div>
                </div>
                <div className="dash-actions-grid">
                  {quickActions.map((a, i) => (
                    <button key={i} className="dash-action-card" onClick={() => navigate(a.to)}>
                      <div className="dash-action-icon" style={{ color: a.color, background: a.bg }}>
                        {a.icon}
                      </div>
                      <div className="dash-action-body">
                        <span className="dash-action-title">{a.title}</span>
                        <span className="dash-action-hint">{a.hint}</span>
                      </div>
                      <ChevronRight size={15} className="dash-action-chevron" />
                    </button>
                  ))}
                </div>
              </section>

              <div className="dash-grid-2col">
                <section className="dash-section">
                  <div className="dash-section-header">
                    <div>
                      <h2 className="dash-section-title">{t("dashboard.recentActivity")}</h2>
                      <p className="dash-section-desc">Your latest actions on the platform</p>
                    </div>
                  </div>
                  <div className="dash-card">
                    {recentActivity.length === 0 ? (
                      <div className="dash-empty">
                        <div className="dash-empty-fig">
                          <Activity size={32} />
                        </div>
                        <p className="dash-empty-title">{t("dashboard.noActivity")}</p>
                        <p className="dash-empty-desc">{t("dashboard.noActivityDesc")}</p>
                        <button className="dash-primary-btn dash-primary-btn-sm" onClick={() => navigate('/chat')}>
                          {t("dashboard.startChatting")} <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="dash-timeline">
                        {recentActivity.map((a, i) => (
                          <div key={i} className="dash-timeline-item">
                            <div className="dash-timeline-dot" />
                            <div className="dash-timeline-body">
                              <span>{a.text}</span>
                              <small>{a.time}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                <section className="dash-section">
                  <div className="dash-section-header">
                    <div>
                      <h2 className="dash-section-title">Rights & Resources</h2>
                      <p className="dash-section-desc">Know your legal rights in Nepal</p>
                    </div>
                  </div>
                  <div className="dash-card">
                    {tips.map((tip, i) => (
                      <div key={i} className="dash-tip">
                        <div className="dash-tip-bar" style={{ background: tip.color }} />
                        <div className="dash-tip-icon" style={{ color: tip.color, background: `${tip.color}10` }}>
                          {tip.icon}
                        </div>
                        <div className="dash-tip-body">
                          <strong>{tip.title}</strong>
                          <p>{tip.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === 'activity' && (
            <>
              <div className="dash-page-heading">
                <div>
                  <h1>{t("dashboard.activity")}</h1>
                  <p className="dash-subtitle">{t("dashboard.activityTabDesc")}</p>
                </div>
              </div>
              <div className="dash-card dash-card-empty-lg">
                <div className="dash-empty">
                  <div className="dash-empty-fig">
                    <Activity size={36} />
                  </div>
                  <p className="dash-empty-title">{t("dashboard.noActivity")}</p>
                  <p className="dash-empty-desc">{t("dashboard.noActivityDesc")}</p>
                  <button className="dash-primary-btn" onClick={() => navigate('/chat')}>
                    {t("dashboard.startChatting")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {tab === 'settings' && (
            <>
              <div className="dash-page-heading">
                <div>
                  <h1>{t("common.settings")}</h1>
                  <p className="dash-subtitle">{t("dashboard.settingsTabDesc")}</p>
                </div>
              </div>
              <div className="dash-settings-grid">
                <Link to="/auth/settings/profile" className="dash-setting-card">
                  <div className="dash-setting-icon" style={{ color: '#C8102E', background: '#FFF0F0' }}>
                    <User size={20} />
                  </div>
                  <div className="dash-setting-body">
                    <strong>{t("dashboard.profileCard")}</strong>
                    <span>{t("dashboard.profileCardDesc")}</span>
                  </div>
                  <ChevronRight size={16} className="dash-setting-arrow" />
                </Link>
                <Link to="/auth/settings/security" className="dash-setting-card">
                  <div className="dash-setting-icon" style={{ color: '#7C3AED', background: '#F3F0FF' }}>
                    <Shield size={20} />
                  </div>
                  <div className="dash-setting-body">
                    <strong>{t("dashboard.securityCard")}</strong>
                    <span>{t("dashboard.securityCardDesc")}</span>
                  </div>
                  <ChevronRight size={16} className="dash-setting-arrow" />
                </Link>
                <Link to="/auth/settings/notifications" className="dash-setting-card">
                  <div className="dash-setting-icon" style={{ color: '#D97706', background: '#FFFBEB' }}>
                    <Bell size={20} />
                  </div>
                  <div className="dash-setting-body">
                    <strong>{t("dashboard.notificationsCard")}</strong>
                    <span>{t("dashboard.notificationsCardDesc")}</span>
                  </div>
                  <ChevronRight size={16} className="dash-setting-arrow" />
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
