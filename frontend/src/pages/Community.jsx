import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Heart, MessageCircle, Bookmark, TrendingUp, Clock,
  Flame, Plus, Search, ChevronRight, Sparkles
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { getPosts } from "../api/community";
import AuthRequired from "../components/AuthRequired";
import "./Community.css";

const CATEGORIES = [
  "All", "Women's Rights", "Employment", "Marriage", "Property",
  "Domestic Violence", "Cyber Crime", "Citizenship", "Family Law", "General",
];

const ANONYMOUS_NAMES = [
  'Anonymous Lotus', 'Anonymous Hope', 'Anonymous Citizen',
  'Anonymous Sparrow', 'Anonymous Orchid', 'Anonymous River',
];

function getRandomName() {
  return ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
}

export default function Community() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('latest');
  const [category, setCategory] = useState('all');
  const [showAuthReq, setShowAuthReq] = useState(false);
  const [authAction, setAuthAction] = useState('default');

  useEffect(() => {
    loadPosts();
  }, [sort, category]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (category !== 'all') params.category = category;
      const data = await getPosts(params);
      setPosts(data.data.posts || []);
    } catch { /* ignore */ }
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
    if (sec < 60) return 'just now';
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    return `${Math.floor(sec / 86400)}d ago`;
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="container">
          <div className="community-header-top">
            <div>
              <h1>Community</h1>
              <p className="community-subtitle">Share, learn, and support each other — anonymously if you choose.</p>
            </div>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              <Plus size={16} /> Share your story
            </button>
          </div>

          <div className="community-tabs">
            <button className={`community-tab${sort === 'latest' ? ' active' : ''}`} onClick={() => setSort('latest')}>
              <Clock size={14} /> Latest
            </button>
            <button className={`community-tab${sort === 'trending' ? ' active' : ''}`} onClick={() => setSort('trending')}>
              <Flame size={14} /> Trending
            </button>
          </div>

          <div className="community-categories">
            {CATEGORIES.map(c => (
              <button
                key={c}
                className={`community-cat${category === c.toLowerCase() || (category === 'all' && c === 'All') ? ' active' : ''}`}
                onClick={() => setCategory(c === 'All' ? 'all' : c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container community-content">
        {loading ? (
          <div className="community-loading">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="community-empty">
            <Sparkles size={40} />
            <h3>No posts yet</h3>
            <p>Be the first to share your story in this category.</p>
            <button className="btn btn-primary" onClick={handleCreatePost}>
              Create post
            </button>
          </div>
        ) : (
          <div className="community-grid">
            {posts.map(post => (
              <Link key={post._id} to={`/community/${post._id}`} className="community-card">
                <div className="community-card-header">
                  <div className="community-author">
                    <div className="community-avatar">
                      {post.isAnonymous ? 'A' : (post.userId?.username?.[0] || 'U')}
                    </div>
                    <div>
                      <strong>{post.anonymousIdentity || post.userId?.username || 'Anonymous'}</strong>
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
