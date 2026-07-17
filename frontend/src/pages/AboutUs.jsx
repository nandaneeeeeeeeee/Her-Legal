import { useLanguage } from "../LanguageContext";

function AboutUs() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">{t("aboutUs.label")}</span>
      <h1 style={{ marginBottom: 24 }}>{t("aboutUs.title")}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 680, marginBottom: 48 }}>
        {t("aboutUs.desc")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {[
          { title: t("aboutUs.cards.0.title"), desc: t("aboutUs.cards.0.desc") },
          { title: t("aboutUs.cards.1.title"), desc: t("aboutUs.cards.1.desc") },
          { title: t("aboutUs.cards.2.title"), desc: t("aboutUs.cards.2.desc") },
        ].map((item) => (
          <div key={item.title} style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32, border: "1px solid var(--border)" }}>
            <h3 style={{ marginBottom: 10 }}>{item.title}</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;
