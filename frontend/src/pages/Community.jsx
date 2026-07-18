import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart, MessageCircle, Bookmark, TrendingUp, Clock,
  Flame, Plus, Search, ChevronRight, Sparkles
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { useAuth } from "../AuthContext";
import { getPosts } from "../api/community";
import AuthRequired from "../components/AuthRequired";
import "./Community.css";

const CATEGORIES = [
  { key: "all", value: "All" },
  { key: "womenRights", value: "Women's Rights" },
  { key: "employment", value: "Employment" },
  { key: "marriage", value: "Marriage" },
  { key: "property", value: "Property" },
  { key: "domesticViolence", value: "Domestic Violence" },
  { key: "cyberCrime", value: "Cyber Crime" },
  { key: "citizenship", value: "Citizenship" },
  { key: "familyLaw", value: "Family Law" },
  { key: "general", value: "General" },
];

const ANONYMOUS_NAMES = [
  'Anonymous Lotus', 'Anonymous Hope', 'Anonymous Citizen',
  'Anonymous Sparrow', 'Anonymous Orchid', 'Anonymous River',
];

function getRandomName() {
  return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
}

export default function Community() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('latest');
  const [category, setCategory] = useState('all');
  const [showAuthReq, setShowAuthReq] = useState(false);
  const [authAction, setAuthAction] = useState('default');

  useEffect(() => {
    loadPosts();
  }, [sort, category]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (category !== 'all') params.category = category;
      const data = await getPosts(params);
      setPosts(data.data.posts || []);
    } catch {
      setError('Could not load posts. Make sure the backend server is running.');
    }
    setLoading(false);
  };

  const handleCreatePost = () => {
    if (!isAuthenticated) {
      setAuthAction('post');
      setShowAuthReq(true);
      return;
    }
    navigate('/community/new');
  };

  const timeAgo = (date) => {
    const sec = (Date.now() - new Date(date).getTime()) / 1000;
    if (sec < 60) return t("common.justNow");
    if (sec < 3600) return `${Math.floor(sec / 60)}${t("common.mAgo")}`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}${t("common.hAgo")}`;
    return `${Math.floor(sec / 86400)}${t("common.dAgo")}`;
  };

  const getAuthorName = (post) => {
    if (post.isAnonymous) return post.anonymousIdentity || t("common.anonymous");
    return post.userId?.username || t("common.anonymous");
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="container">
          <div className="community-header-top">
            <div>
              <h1>{t("community.title")}</h1>
              <p className="community-subtitle">{t("community.subtitle")}</p>
            </div>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              <Plus size={16} /> {t("community.shareStory")}
            </button>
          </div>

          <div className="community-tabs">
            <button className={`community-tab${sort === 'latest' ? ' active' : ''}`} onClick={() => setSort('latest')}>
              <Clock size={14} /> {t("community.latest")}
            </button>
            <button className={`community-tab${sort === 'trending' ? ' active' : ''}`} onClick={() => setSort('trending')}>
              <Flame size={14} /> {t("community.trending")}
            </button>
          </div>

          <div className="community-categories">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  className={`community-cat${category === c.value.toLowerCase() || (category === 'all' && c.key === 'all') ? ' active' : ''}`}
                  onClick={() => setCategory(c.key === 'all' ? 'all' : c.value)}
                >
                  {t(`community.${c.key}`)}
                </button>
              ))}
          </div>
        </div>
      </div>

      <div className="container community-content">
        {loading ? (
          <div className="community-loading">{t("community.loadingPosts")}</div>
        ) : error ? (
          <div className="community-empty">
            <Sparkles size={36} style={{ color: '#C8102E', opacity: 0.6 }} />
            <h3>Connection Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={loadPosts}>Retry</button>
          </div>
        ) : posts.length === 0 ? (
          <div className="community-empty">
            <Sparkles size={40} />
            <h3>{t("community.noPosts")}</h3>
            <p>{t("community.noPostsDesc")}</p>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              {t("community.createPost")}
            </button>
          </div>
        ) : (
          <div className="community-grid">
            {posts.map(post => (
              <Link key={post._id} to={`/community/${post._id}`} className="community-card">
                <div className="community-card-header">
                  <div className="community-author">
                    <div className="community-avatar">
                      {post.isAnonymous ? 'A' : ((getAuthorName(post)?.[0]) || 'U')}
                    </div>
                    <div>
                      <strong>{getAuthorName(post)}</strong>
                      <span>{timeAgo(post.createdAt)}</span>
                    </div>
                  </div>
                  {post.category && (
                    <span className="community-tag">{post.category}</span>
                  )}
                </div>
                <h3 className="community-card-title">{post.title}</h3>
                <p className="community-card-text">{post.text?.slice(0, 200)}{post.text?.length > 200 ? '...' : ''}</p>
                <div className="community-card-stats">
                  <span><Heart size={14} /> {post.reactions?.helpful?.length || 0}</span>
                  <span><MessageCircle size={14} /> {post.commentCount || 0}</span>
                  <span><Bookmark size={14} /> {post.saveCount || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <AuthRequired open={showAuthReq} onClose={() => setShowAuthReq(false)} action={authAction} />
    </div>
  );
}
