import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import "./Confessions.css";

function Confessions() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/v1/confessions");
      const data = await res.json();
      setPosts(data);
    } catch {}
  };

  const sharePost = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isAnonymous: true }),
      });
      if (res.ok) {
        setText("");
        fetchPosts();
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const reply = async (postId) => {
    const text = replyText[postId]?.trim();
    if (!text) return;
    try {
      const res = await fetch(`/api/v1/confessions/${postId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setReplyText((prev) => ({ ...prev, [postId]: "" }));
        fetchPosts();
      }
    } catch {}
  };

  return (
    <div className="confessions-page">
      <div className="confessions-header">
        <span className="section-label">Share Your Story</span>
        <h1>Your voice, your truth</h1>
        <p>Share your experience anonymously. You are not alone.</p>
      </div>

      <div className="post-box">
        <textarea
          placeholder="What would you like to share?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="post-box-footer">
          <label className="anonymous-toggle">
            <input type="checkbox" defaultChecked readOnly />
            Post anonymously
          </label>
          <button className="btn btn-primary" onClick={sharePost} disabled={loading} style={{ padding: "10px 24px", fontSize: 14 }}>
            {loading ? "Posting..." : "Share →"}
          </button>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-author">{post.isAnonymous ? "Anonymous" : user?.username || "Anonymous"}</div>
          <p className="post-text">{post.text}</p>
          {post.replies?.map((r, i) => (
            <div key={i} className="replies">
              <div className="reply">
                <span className="reply-author">{r.author} </span>
                {r.text}
              </div>
            </div>
          ))}
          <div className="reply-box">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText[post._id] || ""}
              onChange={(e) => setReplyText((prev) => ({ ...prev, [post._id]: e.target.value }))}
            />
            <button onClick={() => reply(post._id)}>Reply</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Confessions;
