import { useLanguage } from "../LanguageContext";

function ContactHelp() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">{t("contactHelp.label")}</span>
      <h1 style={{ marginBottom: 24 }}>{t("contactHelp.title")}</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 600, marginBottom: 48 }}>
        {t("contactHelp.desc")}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32, border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: 16 }}>{t("contactHelp.emergencyTitle")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Women's Helpline Nepal", "1145"],
              ["Police Emergency", "100"],
              ["National Women Commission", "16600178585"],
            ].map(([name, number]) => (
              <a key={name} href={`tel:${number}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)", textDecoration: "none" }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{name}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>{number}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32, border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: 16 }}>{t("contactHelp.emailTitle")}</h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>{t("contactHelp.generalInquiry")}</p>
          <a href="mailto:hello@herlegal.org" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 16 }}>hello@herlegal.org</a>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>{t("contactHelp.followTitle")}</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {[t("contactHelp.socials.0"), t("contactHelp.socials.1"), t("contactHelp.socials.2")].map((s) => (
                <a key={s} href={`https://${s.toLowerCase()}.com`} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", background: "var(--bg)", borderRadius: 999, fontSize: 13, fontWeight: 500, color: "var(--text-muted)", cursor: "pointer", textDecoration: "none" }}>{s}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactHelp;
