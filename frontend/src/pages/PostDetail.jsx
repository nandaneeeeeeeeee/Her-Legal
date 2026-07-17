import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import {
  ArrowLeft, Heart, MessageCircle, Bookmark, Flag,
  Share2, Loader, Send, ThumbsUp, Lightbulb, Smile,
  MoreHorizontal, Trash2
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { getPost, reactToPost, savePost, reportPost, addComment, deletePost } from "../api/community";
import AuthRequired from "../components/AuthRequired";
import "./PostDetail.css";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentAnon, setCommentAnon] = useState(true);
  const [sending, setSending] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showAuthReq, setShowAuthReq] = useState(false);
  const [authAction, setAuthAction] = useState('default');

  useEffect(() => { loadPost(); }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const data = await getPost(id);
      setPost(data.data.post);
    } catch { navigate('/community'); }
    setLoading(false);
  };

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setAuthAction(action);
      setShowAuthReq(true);
      return false;
    }
    return true;
  };

  const handleReact = async (type) => {
    if (!requireAuth('react')) return;
    try {
      const data = await reactToPost(id, type);
      setPost(prev => {
        const counts = { ...prev.reactionCounts, [type]: data.data.count };
        const reacted = { ...prev.userReacted, [type]: data.data.reacted };
        return { ...prev, reactionCounts: counts, userReacted: reacted };
      });
    } catch {}
  };

  const handleSave = async () => {
    if (!requireAuth('save')) return;
    try {
      const data = await savePost(id);
      setPost(prev => ({
        ...prev,
        userReacted: { ...prev.userReacted, saved: data.data.saved },
        saveCount: prev.saveCount + (data.data.saved ? 1 : -1),
      }));
    } catch {}
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    try {
      await reportPost(id, reportReason);
      setShowReport(false);
      setReportReason("");
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!requireAuth('post')) return;
    if (!commentText.trim()) return;
    setSending(true);
    try {
      const data = await addComment(id, commentText, commentAnon);
      setPost(prev => ({
        ...prev,
        comments: [...prev.comments, data.data],
        commentCount: prev.commentCount + 1,
      }));
      setCommentText("");
    } catch {}
    setSending(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(t("postDetail.deleteConfirm"))) return;
    try {
      await deletePost(id);
      navigate('/community');
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
    return <div className="postdetail-loading"><Loader size={32} className="spin" /></div>;
  }

  if (!post) return null;

  const isOwner = user && post.userId?._id === user._id;
  const reactions = [
    { type: 'helpful', icon: <ThumbsUp size={16} />, label: t("postDetail.helpful") },
    { type: 'supportive', icon: <Smile size={16} />, label: t("postDetail.supportive") },
    { type: 'insightful', icon: <Lightbulb size={16} />, label: t("postDetail.insightful") },
  ];

  return (
    <div className="postdetail-page">
      <div className="postdetail-container">
        <button className="auth-back" onClick={() => navigate('/community')}>
          <ArrowLeft size={16} /> {t("postDetail.community")}
        </button>

        <article className="postdetail-card">
          <div className="postdetail-header">
            <div className="community-author">
              <div className="community-avatar">
                {post.isAnonymous ? 'A' : (post.userId?.username?.[0] || 'U')}
              </div>
              <div>
                <strong>{post.anonymousIdentity || post.userId?.username || t("common.anonymous")}</strong>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
            <div className="postdetail-actions-top">
              {post.category && <span className="community-tag">{post.category}</span>}
              {isOwner && (
                <button className="postdetail-icon-btn" onClick={handleDelete} title="Delete">
                  <Trash2 size={16} />
                </button>
              )}
              <button className="postdetail-icon-btn" onClick={() => setShowReport(!showReport)} title="Report">
                <Flag size={16} />
              </button>
              <button className="postdetail-icon-btn" onClick={() => navigator.share?.({ url: window.location.href })} title="Share">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <h1 className="postdetail-title">{post.title}</h1>
          <div className="postdetail-text">{post.text}</div>

          {/* Reactions */}
          <div className="postdetail-reactions">
            {reactions.map(r => (
              <button
                key={r.type}
                className={`postdetail-reaction-btn${post.userReacted?.[r.type] ? ' active' : ''}`}
                onClick={() => handleReact(r.type)}
              >
                {r.icon}
                <span>{r.label}</span>
                <span className="postdetail-reaction-count">{post.reactionCounts?.[r.type] || 0}</span>
              </button>
            ))}
            <button
              className={`postdetail-reaction-btn save${post.userReacted?.saved ? ' active' : ''}`}
              onClick={handleSave}
            >
              <Bookmark size={16} />
              <span>{t("postDetail.saves")}</span>
            </button>
          </div>

          {/* Report form */}
          {showReport && (
            <div className="postdetail-report">
              <textarea
                className="create-post-textarea"
                placeholder={t("postDetail.reportPlaceholder")}
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                rows={3}
              />
              <button className="btn btn-primary" style={{ marginTop: 8, background: '#DC2626' }} onClick={handleReport}>
                {t("postDetail.submitReport")}
              </button>
            </div>
          )}

          {/* Stats bar */}
          <div className="postdetail-stats">
            <span><Heart size={14} /> {post.reactionCounts?.helpful || 0} {t("postDetail.helpful")}</span>
            <span><MessageCircle size={14} /> {post.commentCount || 0} {t("postDetail.comments")}</span>
            <span><Bookmark size={14} /> {post.saveCount || 0} {t("postDetail.saves")}</span>
          </div>
        </article>

        {/* Comments */}
        <div className="postdetail-comments-section">
          <h2>{t("postDetail.comments")} ({post.commentCount || 0})</h2>

          {/* Comment form */}
          {isAuthenticated ? (
            <form className="postdetail-comment-form" onSubmit={handleComment}>
              <div className="postdetail-comment-input-wrap">
                <textarea
                  placeholder={t("postDetail.commentPlaceholder")}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  rows={2}
                  className="create-post-textarea"
                />
              </div>
              <div className="postdetail-comment-actions">
                <label className="postdetail-comment-anon">
                  <input type="checkbox" checked={commentAnon} onChange={e => setCommentAnon(e.target.checked)} />
                  {t("postDetail.postAnonymous")}
                </label>
                <button className="btn btn-primary" type="submit" disabled={sending || !commentText.trim()} style={{ height: 36 }}>
                  {sending ? <Loader size={14} className="spin" /> : <Send size={14} />}
                  <span>{t("postDetail.send")}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="postdetail-comment-login">
              <button className="auth-link" onClick={() => { setAuthAction('post'); setShowAuthReq(true); }}>
                {t("postDetail.signInToComment")}
              </button>
            </div>
          )}

          {/* Comment list */}
          <div className="postdetail-comments">
            {post.comments?.length === 0 ? (
              <p className="postdetail-no-comments">{t("postDetail.noComments")}</p>
            ) : (
              post.comments?.map(c => (
                <div key={c._id} className="postdetail-comment">
                  <div className="community-author" style={{ marginBottom: 8 }}>
                    <div className="community-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {c.author?.[0] || 'A'}
                    </div>
                    <div>
                      <strong style={{ fontSize: 13 }}>{c.author || t("common.anonymous")}</strong>
                      <span style={{ fontSize: 11 }}>{timeAgo(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="postdetail-comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AuthRequired open={showAuthReq} onClose={() => setShowAuthReq(false)} action={authAction} />
    </div>
  );
}
