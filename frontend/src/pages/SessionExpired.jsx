import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function SessionExpired() {
  const { t } = useLanguage();
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={28} />
          </div>
        </div>
        <h1>{t("auth.sessionExpired")}</h1>
        <p className="auth-subtitle">
          {t("auth.sessionExpiredDesc")}
        </p>
        <Link to="/auth/login" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 8 }}>
          {t("auth.signInAgain")}
        </Link>
      </div>
    </div>
  );
}
