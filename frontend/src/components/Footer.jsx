import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

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
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>{t("footer.platform")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[[t("footer.aiAssistant"), "/chat"], [t("footer.legalTopics"), "/#topics"], [t("footer.documents"), "/chat"], [t("footer.knowledgeHub"), "/news"]].map(([label, href]) => (
                <Link key={label} to={href} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text)"}
                >{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>{t("footer.company")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[[t("footer.about"), "/team"], [t("footer.contact"), "/contact"], [t("footer.privacy"), "/contact"], [t("footer.terms"), "/contact"]].map(([label, href]) => (
                <Link key={label} to={href} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text)"}
                >{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 16 }}>{t("footer.support")}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[[t("footer.helpline"), "/contact"], [t("footer.faq"), "/#faq"], [t("footer.safety"), "/contact"]].map(([label, href]) => (
                <Link key={label} to={href} style={{ fontSize: 13, color: "var(--text)", transition: "color 0.2s" }}
                  onMouseEnter={(e) => e.target.style.color = "var(--primary)"}
                  onMouseLeave={(e) => e.target.style.color = "var(--text)"}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
        }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Her Legal. {t("footer.rightsReserved")}
          </p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
            {t("footer.builtWith")} <Heart size={12} color="var(--primary)" />
          </p>
        </div>
      </div>
    </footer>
  );
}
