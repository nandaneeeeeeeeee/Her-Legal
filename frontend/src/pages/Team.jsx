function Team() {
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">People</span>
      <h1 style={{ marginBottom: 48 }}>Our Team</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 32 }}>
        {[
          { name: "Aarati Sharma", role: "Founder & Legal Director", initials: "AS" },
          { name: "Priya Adhikari", role: "Community Lead", initials: "PA" },
          { name: "Sita Bhandari", role: "Legal Advisor", initials: "SB" },
          { name: "Maya Rana", role: "Mental Health Counselor", initials: "MR" },
          { name: "Rita Thapa", role: "Outreach Coordinator", initials: "RT" },
          { name: "Neha Gurung", role: "Communications Lead", initials: "NG" },
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
