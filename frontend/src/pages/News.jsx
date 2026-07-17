import { useLanguage } from "../LanguageContext";

function News() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">{t("news.label")}</span>
      <h1 style={{ marginBottom: 48 }}>{t("news.title")}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {[
          { title: t("news.articles.0.title"), date: t("news.articles.0.date"), excerpt: t("news.articles.0.excerpt") },
          { title: t("news.articles.1.title"), date: t("news.articles.1.date"), excerpt: t("news.articles.1.excerpt") },
          { title: t("news.articles.2.title"), date: t("news.articles.2.date"), excerpt: t("news.articles.2.excerpt") },
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
