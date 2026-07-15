function ContactHelp() {
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">Get in Touch</span>
      <h1 style={{ marginBottom: 24 }}>Contact & Help</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 600, marginBottom: 48 }}>
        Reach out to us. Whether you need legal guidance, want to share your story, or
        just need someone to listen — we're here.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32, border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: 16 }}>Emergency Helplines</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Women's Helpline Nepal", "1145"],
              ["Police Emergency", "100"],
              ["National Women Commission", "16600178585"],
            ].map(([name, number]) => (
              <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{name}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>{number}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-md)", padding: 32, border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: 16 }}>Email Us</h3>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>For general inquiries:</p>
          <a href="mailto:hello@herlegal.org" style={{ color: "var(--primary)", fontWeight: 600, fontSize: 16 }}>hello@herlegal.org</a>
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12 }}>Follow Us</h3>
            <div style={{ display: "flex", gap: 16 }}>
              {["Facebook", "Instagram", "Twitter"].map((s) => (
                <span key={s} style={{ padding: "8px 16px", background: "var(--bg)", borderRadius: 999, fontSize: 13, fontWeight: 500, color: "var(--text-muted)", cursor: "default" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactHelp;
