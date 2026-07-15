function News() {
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">Updates</span>
      <h1 style={{ marginBottom: 48 }}>News & Magazines</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {[
          { title: "New Legal Aid Centers Opening in Province 2", date: "Jun 28, 2026", excerpt: "Five new legal aid centers are opening across Province 2 to provide free legal counsel to women in rural areas." },
          { title: "Domestic Violence Law Amendments: What You Need to Know", date: "Jun 15, 2026", excerpt: "Recent amendments to domestic violence laws strengthen protections for survivors. Here's a plain-language breakdown." },
          { title: "Her Legal Reaches 500 Women Helped Milestone", date: "May 30, 2026", excerpt: "We're humbled to share that Her Legal has now supported over 500 women across Nepal with legal guidance and support." },
        ].map((article) => (
          <div key={article.title} style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32,
            border: "1px solid var(--border)", transition: "all 0.3s ease"
          }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.05em" }}>{article.date}</span>
            <h3 style={{ fontSize: 18, margin: "8px 0 12px" }}>{article.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{article.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
