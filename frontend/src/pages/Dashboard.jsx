import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  MessageCircle, FileText, Bookmark, Heart, Bell,
  Settings, User, LogOut, ArrowRight, Sparkles, Shield,
  Clock, Activity, ChevronRight, Plus
} from "lucide-react";
import { useAuth } from "../AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const stats = [
    { icon: <MessageCircle size={18} />, label: 'AI Conversations', value: '—', color: '#C8102E' },
    { icon: <FileText size={18} />, label: 'Saved Documents', value: '—', color: '#2563EB' },
    { icon: <Bookmark size={18} />, label: 'Bookmarks', value: '—', color: '#D97706' },
    { icon: <Heart size={18} />, label: 'Community Posts', value: '—', color: '#059669' },
  ];

  const quickActions = [
    { icon: <Sparkles size={18} />, label: 'Ask AI Assistant', to: '/chat', color: 'var(--primary)' },
    { icon: <FileText size={18} />, label: 'Generate Document', to: '/chat', color: '#2563EB' },
    { icon: <Heart size={18} />, label: 'Community', to: '/confessions', color: '#059669' },
    { icon: <Bell size={18} />, label: 'Notifications', to: '/notifications', color: '#D97706' },
    { icon: <FileText size={18} />, label: 'Legal Documents', to: '/documents', color: '#7C3AED' },
    { icon: <Bookmark size={18} />, label: 'Legal Glossary', to: '/glossary', color: '#0891B2' },
  ];

  const recentActivity = [
    { icon: <User size={14} />, text: 'Account created', time: 'Just now' },
  ];

  return (
    <div className="dash-page">
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
          <div className="dash-user-info">
            <strong>{user.username}</strong>
            <span>{user.email}</span>
          </div>
        </div>
        <nav className="dash-nav">
          {[
            { key: 'overview', icon: <Activity size={16} />, label: 'Overview' },
            { key: 'activity', icon: <Clock size={16} />, label: 'Activity' },
            { key: 'settings', icon: <Settings size={16} />, label: 'Settings' },
          ].map(item => (
            <button
              key={item.key}
              className={`dash-nav-item${tab === item.key ? ' active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="dash-sidebar-bottom">
          <Link to="/" className="dash-nav-item">
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>Back to site</span>
          </Link>
          <button className="dash-nav-item" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      <div className="dash-main">
        {tab === 'overview' && (
          <div style={{ maxWidth: 800 }}>
            <div className="dash-welcome">
              <h1>Welcome, {user.username}</h1>
              <p>Here's what's happening with your account.</p>
            </div>

            {/* Stats */}
            <div className="dash-stats">
              {stats.map((s, i) => (
                <div key={i} className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ color: s.color, background: `${s.color}12` }}>
                    {s.icon}
                  </div>
                  <div className="dash-stat-value">{s.value}</div>
                  <div className="dash-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <h2 className="dash-section-title">Quick actions</h2>
            <div className="dash-actions-grid">
              {quickActions.map((a, i) => (
                <button key={i} className="dash-action-card" onClick={() => navigate(a.to)}>
                  <div className="dash-action-icon" style={{ color: a.color, background: `${a.color}15` }}>
                    {a.icon}
                  </div>
                  <span>{a.label}</span>
                  <ChevronRight size={14} />
                </button>
              ))}
            </div>

            {/* Recent activity */}
            <h2 className="dash-section-title">Recent activity</h2>
            <div className="dash-activity-list">
              {recentActivity.length === 0 ? (
                <div className="dash-empty">
                  <Activity size={32} />
                  <p>No recent activity</p>
                </div>
              ) : (
                recentActivity.map((a, i) => (
                  <div key={i} className="dash-activity-item">
                    <div className="dash-activity-icon">{a.icon}</div>
                    <div>
                      <span>{a.text}</span>
                      <small>{a.time}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'activity' && (
          <div>
            <h1>Activity</h1>
            <p className="dash-subtitle">Your recent activity across the platform.</p>
            <div className="dash-empty" style={{ marginTop: 40 }}>
              <Activity size={40} />
              <p>No activity yet. Start by chatting with the AI assistant or exploring the community.</p>
              <button className="btn btn-primary" onClick={() => navigate('/chat')} style={{ marginTop: 16 }}>
                Start chatting <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h1>Settings</h1>
            <p className="dash-subtitle">Manage your account settings.</p>
            <div className="dash-settings-grid">
              <Link to="/auth/settings/profile" className="dash-setting-card">
                <User size={20} />
                <div>
                  <strong>Profile</strong>
                  <span>Update your name, email, and photo</span>
                </div>
                <ChevronRight size={16} />
              </Link>
              <Link to="/auth/settings/security" className="dash-setting-card">
                <Shield size={20} />
                <div>
                  <strong>Security</strong>
                  <span>Password and authentication</span>
                </div>
                <ChevronRight size={16} />
              </Link>
              <Link to="/auth/settings/notifications" className="dash-setting-card">
                <Bell size={20} />
                <div>
                  <strong>Notifications</strong>
                  <span>Manage notification preferences</span>
                </div>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
