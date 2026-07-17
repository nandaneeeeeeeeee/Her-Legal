import { useLanguage } from "../LanguageContext";

function Campaigns() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">{t("campaigns.label")}</span>
      <h1 style={{ marginBottom: 48 }}>{t("campaigns.title")}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        {[
          { title: t("campaigns.items.0.title"), tag: t("campaigns.items.0.tag"), desc: t("campaigns.items.0.desc") },
          { title: t("campaigns.items.1.title"), tag: t("campaigns.items.1.tag"), desc: t("campaigns.items.1.desc") },
          { title: t("campaigns.items.2.title"), tag: t("campaigns.items.2.tag"), desc: t("campaigns.items.2.desc") },
        ].map((campaign) => (
          <div key={campaign.title} style={{
            background: "var(--bg-card)", borderRadius: "var(--radius-md)", overflow: "hidden",
            border: "1px solid var(--border)", transition: "all 0.3s ease"
          }}>
            <div style={{ height: 8, background: "var(--primary)" }} />
            <div style={{ padding: 32 }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.1em", color: "var(--accent)", background: "var(--accent-light)",
                padding: "4px 10px", borderRadius: 999, marginBottom: 12
              }}>
                {campaign.tag}
              </span>
              <h3 style={{ marginBottom: 10 }}>{campaign.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{campaign.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Campaigns;
