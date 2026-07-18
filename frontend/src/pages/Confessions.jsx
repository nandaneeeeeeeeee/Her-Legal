import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { getApiUrl } from "../api/config";
import "./Confessions.css";

function Confessions() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [anonymous, setAnonymous] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(getApiUrl('/confessions'));
      const data = await res.json();
      setPosts(data);
    } catch {}
  };

  const sharePost = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(getApiUrl('/confessions'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, isAnonymous: anonymous }),
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
      const res = await fetch(getApiUrl(`/confessions/${postId}/reply`), {
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
        <span className="section-label">{t("confessions.label")}</span>
        <h1>{t("confessions.title")}</h1>
        <p>{t("confessions.desc")}</p>
      </div>

      <div className="post-box">
        <textarea
          placeholder={t("confessions.placeholder")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="post-box-footer">
          <label className="anonymous-toggle">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            {t("confessions.anonymous")}
          </label>
          <button className="btn btn-primary" onClick={sharePost} disabled={loading} style={{ padding: "10px 24px", fontSize: 14 }}>
            {loading ? t("confessions.posting") : t("confessions.share")}
          </button>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post._id} className="post-card">
          <div className="post-author">{post.isAnonymous ? t("confessions.anonymousAuthor") : user?.username || t("confessions.anonymousAuthor")}</div>
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
              placeholder={t("confessions.replyPlaceholder")}
              value={replyText[post._id] || ""}
              onChange={(e) => setReplyText((prev) => ({ ...prev, [post._id]: e.target.value }))}
            />
            <button onClick={() => reply(post._id)}>{t("confessions.reply")}</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Confessions;
