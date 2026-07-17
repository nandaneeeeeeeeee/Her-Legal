import { useLanguage } from "../LanguageContext";

function Team() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">{t("team.label")}</span>
      <h1 style={{ marginBottom: 48 }}>{t("team.title")}</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 32 }}>
        {[
          { name: t("team.members.0.name"), role: t("team.members.0.role"), initials: "AG" },
          { name: t("team.members.1.name"), role: t("team.members.1.role"), initials: "DSM" },
          { name: t("team.members.2.name"), role: t("team.members.2.role"), initials: "NS" },
          { name: t("team.members.3.name"), role: t("team.members.3.role"), initials: "SK" },
        ].map((member) => (
          <div key={member.name} style={{ textAlign: "center" }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%", margin: "0 auto 16px",
              background: "var(--primary-light)", display: "flex", alignItems: "center",
              justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 28,
              fontWeight: 600, color: "var(--primary)"
            }}>
              {member.initials}
            </div>
            <h3 style={{ fontSize: 16, marginBottom: 4 }}>{member.name}</h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
