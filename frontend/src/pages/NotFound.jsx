import { Link } from "react-router-dom";
import { useLanguage } from "../LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div style={{ padding: "120px 24px 80px", textAlign: "center" }}>
      <h1 style={{ fontSize: 72, color: "var(--primary)", marginBottom: 8 }}>404</h1>
      <h2 style={{ marginBottom: 16 }}>{t("notFound.title")}</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
        {t("notFound.desc")}
      </p>
      <Link to="/" className="btn btn-primary" style={{ padding: "12px 32px" }}>
        {t("notFound.goHome")}
      </Link>
    </div>
  );
}
