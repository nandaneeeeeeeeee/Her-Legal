import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, Eye, EyeOff, Sparkles } from "lucide-react";
import { createPost } from "../api/community";
import "./CreatePost.css";

const CATEGORIES = [
  "Women's Rights", "Employment", "Marriage", "Property",
  "Domestic Violence", "Cyber Crime", "Citizenship",
  "Consumer Rights", "Family Law", "General",
];

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    text: "",
    category: "General",
    tags: "",
    isAnonymous: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.text.trim()) {
      setError("Title and text are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await createPost({
        title: form.title,
        text: form.text,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isAnonymous: form.isAnonymous,
      });
      navigate(`/community/${data.data._id}`);
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-card">
        <button className="auth-back" onClick={() => navigate('/community')}>
          <ArrowLeft size={16} /> Back to community
        </button>

        <div className="create-post-privacy">
          <Sparkles size={16} />
          <span>
            {form.isAnonymous
              ? "Your identity is hidden. No one will see your name."
              : "This post will show your username."}
          </span>
          <button
            className="create-post-toggle-btn"
            onClick={() => setForm(prev => ({ ...prev, isAnonymous: !prev.isAnonymous }))}
          >
            {form.isAnonymous ? <EyeOff size={14} /> : <Eye size={14} />}
            {form.isAnonymous ? 'Anonymous' : 'Public'}
          </button>
        </div>

        <h1>Share your story</h1>
        <p className="community-subtitle">Your voice matters. Share anonymously or publicly.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="create-post-field">
            <label>Title</label>
            <input
              className="auth-input"
              type="text"
              placeholder="What's on your mind?"
              value={form.title}
              onChange={update('title')}
              required
              maxLength={200}
            />
          </div>

          <div className="create-post-field">
            <label>Category</label>
            <select
              className="auth-input"
              value={form.category}
              onChange={update('category')}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="create-post-field">
            <label>Your story</label>
            <textarea
              className="create-post-textarea"
              placeholder="Share your experience, ask for advice, or start a discussion..."
              value={form.text}
              onChange={update('text')}
              required
              maxLength={10000}
              rows={8}
            />
            <span className="create-post-chars">{form.text.length}/10000</span>
          </div>

          <div className="create-post-field">
            <label>Tags (optional, comma separated)</label>
            <input
              className="auth-input"
              type="text"
              placeholder="e.g. workplace, harassment, advice"
              value={form.tags}
              onChange={update('tags')}
            />
          </div>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> Posting...</> : "Share with community"}
          </button>
        </form>
      </div>
    </div>
  );
}
