import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  MessageCircle, FileText, Bookmark, Heart, Bell,
  Settings, User, LogOut, ArrowRight, Sparkles, Shield,
  Activity, ChevronRight, Scale,
  BookOpen, Users, TrendingUp, Gavel,
  LayoutDashboard, Calendar,
  MessageSquare, Info, Menu, ChevronLeft,
  Edit3, Trash2, Clock, Eye, Plus
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { getStats, getActivity } from "../api/dashboard";
import { getMyPosts, updatePost, deletePost } from "../api/community";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const token = user?.token;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [tab, setTab] = useState('overview');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Data states
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Edit post state
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'activity', 'settings', 'myposts'].includes(tabParam)) {
      setTab(tabParam);
    }
  }, [location]);

  useEffect(() => {
    if (!user || !token) return;
    loadStats();
    loadActivity();
  }, [user, token]);

  useEffect(() => {
    if ((tab === 'myposts' || tab === 'overview') && user && token) {
      loadMyPosts();
    }
  }, [tab, user, token]);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await getStats();
      setStats(res.data);
    } catch { /* API unavailable */ }
    setLoadingStats(false);
  };

  const loadActivity = async () => {
    setLoadingActivity(true);
    try {
      const res = await getActivity();
      setActivity(res.data || []);
    } catch { /* API unavailable */ }
    setLoadingActivity(false);
  };

  const loadMyPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await getMyPosts();
      setMyPosts(res.data || []);
    } catch { /* API unavailable */ }
    setLoadingPosts(false);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    try {
      await deletePost(postId);
      setMyPosts(prev => prev.filter(p => p._id !== postId));
    } catch { alert('Failed to delete post'); }
  };

  const startEdit = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditText(post.text);
    setEditCategory(post.category || 'General');
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditTitle('');
    setEditText('');
    setEditCategory('');
  };

  const saveEdit = async () => {
    if (!editTitle.trim() || !editText.trim()) return;
    setSaving(true);
    try {
      await updatePost(editingPost, { title: editTitle, text: editText, category: editCategory });
      setMyPosts(prev => prev.map(p => p._id === editingPost ? { ...p, title: editTitle, text: editText, category: editCategory } : p));
      cancelEdit();
    } catch { alert('Failed to update post'); }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const statItems = [
    { icon: <MessageCircle size={18} />, label: t("dashboard.aiConversations"), value: stats?.conversations ?? '—', color: '#C8102E' },
    { icon: <FileText size={18} />, label: t("dashboard.savedDocuments"), value: stats?.documents ?? '—', color: '#2563EB' },
    { icon: <Bookmark size={18} />, label: t("dashboard.bookmarks"), value: stats?.saved ?? '—', color: '#D97706' },
    { icon: <Heart size={18} />, label: t("dashboard.communityPosts"), value: stats?.posts ?? '—', color: '#059669' },
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
    { key: 'myposts', icon: <MessageSquare size={18} />, label: 'My Posts' },
    { key: 'activity', icon: <Activity size={18} />, label: t("dashboard.activity") },
    { key: 'settings', icon: <Settings size={18} />, label: t("common.settings") },
  ];

  const quickLinks = [
    { label: 'Ask AI', to: '/chat', icon: <Sparkles size={14} /> },
    { label: 'Documents', to: '/documents', icon: <FileText size={14} /> },
    { label: 'Community', to: '/confessions', icon: <Users size={14} /> },
    { label: 'Glossary', to: '/glossary', icon: <BookOpen size={14} /> },
    { label: 'Notifications', to: '/notifications', icon: <Bell size={14} /> },
  ];

  const tips = [
    { icon: <Gavel size={15} />, title: 'Constitutional Right', text: 'Article 18 of the Nepali Constitution guarantees equal rights to all women.', color: '#C8102E' },
    { icon: <Shield size={15} />, title: 'Legal Protection', text: 'The Domestic Violence Act 2066 provides protection and recourse for survivors.', color: '#7C3AED' },
    { icon: <Info size={15} />, title: 'Free Legal Aid', text: 'Women can access free legal aid through government-aided service centers across Nepal.', color: '#0891B2' },
  ];

  const categories = ['General', "Women's Rights", 'Employment', 'Marriage', 'Property', 'Domestic Violence', 'Cyber Crime', 'Citizenship', 'Family Law'];

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

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
                {statItems.map((s, i) => (
                  <div key={i} className="dash-stat-card">
                    <div className="dash-stat-icon" style={{ color: s.color, background: `${s.color}10` }}>
                      {s.icon}
                    </div>
                    <div className="dash-stat-body">
                      <div className="dash-stat-value">{loadingStats ? '...' : s.value}</div>
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
                    {loadingActivity ? (
                      <div className="dash-empty"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>
                    ) : activity.length === 0 ? (
                      <div className="dash-empty">
                        <div className="dash-empty-fig"><Activity size={32} /></div>
                        <p className="dash-empty-title">{t("dashboard.noActivity")}</p>
                        <p className="dash-empty-desc">{t("dashboard.noActivityDesc")}</p>
                        <button className="dash-primary-btn dash-primary-btn-sm" onClick={() => navigate('/chat')}>
                          {t("dashboard.startChatting")} <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="dash-timeline">
                        {activity.map((a, i) => (
                          <div key={i} className="dash-timeline-item" onClick={() => a.link && navigate(a.link)} style={a.link ? { cursor: 'pointer' } : {}}>
                            <div className="dash-timeline-dot" />
                            <div className="dash-timeline-body">
                              <span>{a.text}</span>
                              <small>{timeAgo(a.time)}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="dash-section-header" style={{ marginTop: 24 }}>
                    <div>
                      <h2 className="dash-section-title">My Recent Posts</h2>
                      <p className="dash-section-desc">Your latest community posts</p>
                    </div>
                    <button className="dash-ghost-btn" style={{ height: 34, padding: '0 14px', fontSize: 12 }} onClick={() => { setTab('myposts'); navigate('/dashboard?tab=myposts', { replace: true }); }}>
                      View all
                    </button>
                  </div>
                  <div className="dash-card">
                    {loadingPosts ? (
                      <div className="dash-empty"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>
                    ) : myPosts.length === 0 ? (
                      <div className="dash-empty">
                        <div className="dash-empty-fig"><MessageSquare size={32} /></div>
                        <p className="dash-empty-title">No posts yet</p>
                        <p className="dash-empty-desc">Share your story or ask the community for advice.</p>
                        <button className="dash-primary-btn dash-primary-btn-sm" onClick={() => navigate('/community/new')}>
                          Create first post <ArrowRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding: '8px 0' }}>
                        {myPosts.slice(0, 3).map(post => (
                          <Link key={post._id} to={`/community/${post._id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', textDecoration: 'none', color: 'inherit', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: post.isAnonymous ? '#7C3AED' : '#059669', flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-heading)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                              <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                                <span>{post.category || 'General'}</span>
                                <span>{timeAgo(post.createdAt)}</span>
                                {post.isAnonymous && <span style={{ color: '#7C3AED' }}>Anonymous</span>}
                              </div>
                            </div>
                            <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          </Link>
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

          {tab === 'myposts' && (
            <>
              <div className="dash-page-heading">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <h1>My Posts</h1>
                    <p className="dash-subtitle">Manage your community posts</p>
                  </div>
                  <button className="dash-primary-btn" onClick={() => navigate('/community/new')}>
                    <Plus size={16} />
                    <span>New Post</span>
                  </button>
                </div>
              </div>
              {loadingPosts ? (
                <div className="dash-card"><div className="dash-empty"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div></div>
              ) : myPosts.length === 0 ? (
                <div className="dash-card">
                  <div className="dash-empty">
                    <div className="dash-empty-fig"><MessageSquare size={32} /></div>
                    <p className="dash-empty-title">No posts yet</p>
                    <p className="dash-empty-desc">Share your story or ask the community for advice.</p>
                    <button className="dash-primary-btn" onClick={() => navigate('/community/new')}>
                      Create your first post <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dash-posts-list">
                  {myPosts.map(post => (
                    <div key={post._id} className="dash-post-card">
                      {editingPost === post._id ? (
                        <div className="dash-post-edit">
                          <input className="dash-edit-input" value={editTitle} onChange={e => setEditTitle(e.target.value)} placeholder="Post title" />
                          <select className="dash-edit-select" value={editCategory} onChange={e => setEditCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <textarea className="dash-edit-textarea" value={editText} onChange={e => setEditText(e.target.value)} placeholder="Post content" rows={5} />
                          <div className="dash-edit-actions">
                            <button className="dash-primary-btn dash-primary-btn-sm" onClick={saveEdit} disabled={saving}>
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="dash-ghost-btn" style={{ height: 36, fontSize: 12 }} onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="dash-post-head">
                            <div className="dash-post-meta">
                              <span className="dash-post-category">{post.category || 'General'}</span>
                              <span className="dash-post-time"><Clock size={12} /> {timeAgo(post.createdAt)}</span>
                              {post.isAnonymous && <span className="dash-post-anon">Anonymous</span>}
                            </div>
                            <div className="dash-post-actions">
                              <button className="dash-post-action-btn" onClick={() => startEdit(post)} title="Edit"><Edit3 size={14} /></button>
                              <button className="dash-post-action-btn dash-post-action-btn-danger" onClick={() => handleDelete(post._id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <h3 className="dash-post-title">{post.title}</h3>
                          <p className="dash-post-text">{post.text?.slice(0, 300)}{post.text?.length > 300 ? '...' : ''}</p>
                          <div className="dash-post-footer">
                            <Link to={`/community/${post._id}`} className="dash-post-view">
                              <Eye size={13} /> View post <ArrowRight size={12} />
                            </Link>
                            <span className="dash-post-reactions">
                              <Heart size={12} /> {post.reactions?.helpful?.length || 0}
                              <MessageCircle size={12} style={{ marginLeft: 10 }} /> {post.commentCount || 0}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                {loadingActivity ? (
                  <div className="dash-empty"><p style={{ color: 'var(--text-muted)' }}>Loading...</p></div>
                ) : activity.length === 0 ? (
                  <div className="dash-empty">
                    <div className="dash-empty-fig"><Activity size={36} /></div>
                    <p className="dash-empty-title">{t("dashboard.noActivity")}</p>
                    <p className="dash-empty-desc">{t("dashboard.noActivityDesc")}</p>
                    <button className="dash-primary-btn" onClick={() => navigate('/chat')}>
                      {t("dashboard.startChatting")} <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="dash-timeline">
                    {activity.map((a, i) => (
                      <div key={i} className="dash-timeline-item" onClick={() => a.link && navigate(a.link)} style={a.link ? { cursor: 'pointer' } : {}}>
                        <div className="dash-timeline-dot" />
                        <div className="dash-timeline-body">
                          <span>{a.text}</span>
                          <small>{timeAgo(a.time)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
