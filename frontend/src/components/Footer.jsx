import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      background: "var(--bg)", borderTop: "1px solid var(--border)",
      padding: "64px 32px 32px", marginTop: "auto"
    }}>
      <div className="container" style={{ padding: 0 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
          marginBottom: 48,
        }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, marginBottom: 12, color: "var(--text-heading)" }}>
              her<span style={{ color: "var(--primary)" }}>legal</span>
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 280 }}>
              Making legal information accessible, understandable, and actionable for every woman in Nepal.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>Platform</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["AI Assistant", "/chat"], ["Legal Topics", "/#topics"], ["Documents", "/chat"], ["Knowledge Hub", "/news"]].map(([l, t]) => (
                <Link key={l} to={t} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--primary)"}
                  onMouseLeave={e => e.target.style.color = "var(--text)"}
                >{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>Company</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["About", "/team"], ["Contact", "/contact"], ["Privacy", "/contact"], ["Terms", "/contact"]].map(([l, t]) => (
                <Link key={l} to={t} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--primary)"}
                  onMouseLeave={e => e.target.style.color = "var(--text)"}
                >{l}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[["Helpline", "/contact"], ["FAQ", "/#faq"], ["Safety", "/contact"]].map(([l, t]) => (
                <Link key={l} to={t} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "var(--primary)"}
                  onMouseLeave={e => e.target.style.color = "var(--text)"}
                >{l}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
        }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Her Legal. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            Built with <Heart size={12} color="var(--primary)" /> for every woman in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}
