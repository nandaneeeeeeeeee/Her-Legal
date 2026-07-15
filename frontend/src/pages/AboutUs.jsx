function AboutUs() {
  return (
    <div style={{ padding: "120px 24px 80px", maxWidth: "var(--max-width)", margin: "0 auto", width: "100%" }}>
      <span className="section-label">About Us</span>
      <h1 style={{ marginBottom: 24 }}>Empowering women through legal awareness</h1>
      <p style={{ fontSize: 17, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 680, marginBottom: 48 }}>
        Her Legal is a Nepal-based initiative dedicated to providing women with accessible legal
        information, a safe community to share their stories, and compassionate support when they
        need it most. We believe every woman deserves to know her rights and have her voice heard.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
        {[
          { title: "Our Mission", desc: "To bridge the gap between Nepali women and their legal rights through education, community support, and accessible resources." },
          { title: "Our Vision", desc: "A Nepal where every woman is informed of her rights, empowered to speak up, and supported in her journey toward justice." },
          { title: "Our Values", desc: "Safety, confidentiality, empathy, and unwavering belief in every woman's right to dignity and legal protection." },
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
