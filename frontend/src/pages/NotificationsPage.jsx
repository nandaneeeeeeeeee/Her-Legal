import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, Trash2, Loader, ArrowLeft, MessageCircle, Heart, FileText, AlertCircle } from "lucide-react";
import { getNotifications, markAsRead, deleteNotification } from "../api/notifications";
import { useLanguage } from "../LanguageContext";
import "../pages/Auth.css";

const ICONS = {
  reply: <MessageCircle size={16} />,
  reaction: <Heart size={16} />,
  document_ready: <FileText size={16} />,
  system: <Bell size={16} />,
  legal_alert: <AlertCircle size={16} />,
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifs, setNotifs] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const data = await getNotifications();
      setNotifs(data.data.notifications);
      setUnreadCount(data.data.unreadCount);
    } catch {}
    setLoading(false);
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifs(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAsRead('all');
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const timeAgo = (date) => {
    const sec = (Date.now() - new Date(date).getTime()) / 1000;
    if (sec < 60) return t("common.justNow");
    if (sec < 3600) return `${Math.floor(sec / 60)}${t("common.mAgo")}`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}${t("common.hAgo")}`;
    return `${Math.floor(sec / 86400)}${t("common.dAgo")}`;
  };

  if (loading) {
    return <div className="auth-page"><Loader size={24} className="spin" /></div>;
  }

  return (
    <div className="auth-page" style={{ display: 'block', paddingTop: 40 }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
              <Link to="/dashboard" className="auth-link" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginBottom: 8 }}>
              <ArrowLeft size={14} /> {t("common.dashboard")}
            </Link>
            <h1 style={{ fontSize: 24 }}>{t("notificationsPage.title")}</h1>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-ghost" onClick={handleMarkAllRead} style={{ height: 36, fontSize: 13 }}>
              <CheckCheck size={14} /> {t("notificationsPage.markAllRead")}
            </button>
          )}
        </div>

        {notifs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <Bell size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p>{t("notificationsPage.empty")}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {notifs.map(n => (
              <div
                key={n._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  background: n.isRead ? 'var(--bg-card)' : 'var(--primary-light)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => !n.isRead && handleRead(n._id)}
              >
                <div style={{ color: 'var(--primary)', flexShrink: 0 }}>
                  {ICONS[n.type] || <Bell size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: 14, display: 'block' }}>{n.title}</strong>
                  {n.message && <span style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block' }}>{n.message}</span>}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{timeAgo(n.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
