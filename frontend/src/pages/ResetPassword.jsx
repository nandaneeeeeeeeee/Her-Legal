import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader, ArrowLeft } from "lucide-react";
import { resetPassword } from "../api/auth";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

export default function ResetPassword() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || "";
  const [form, setForm] = useState({ resetCode: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError(t("settingsSecurity.passwordsMismatch"));
      return;
    }
    if (!email) { setError(t("auth.noEmail")); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, form.resetCode, form.newPassword, form.confirmPassword);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message || t("auth.resetFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate("/auth/login")}>
          <ArrowLeft size={16} /> {t("auth.backToLogin")}
        </button>

        {!success ? (
          <>
            <h1>{t("auth.enterResetCode")}</h1>
            <p className="auth-subtitle">
              {t("auth.resetCodeSent")} <strong>{email || t("auth.yourEmail")}</strong>
            </p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>{t("auth.resetCode")}</label>
                <input
                  className="auth-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="0000"
                  value={form.resetCode}
                  onChange={e => update('resetCode')({ target: { value: e.target.value.replace(/\D/g, '').slice(0, 4) } })}
                  required
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: 12, fontWeight: 700 }}
                />
              </div>
              <div className="auth-field">
                <label>{t("settingsSecurity.newPassword")}</label>
                <input className="auth-input" type="password" placeholder={t("settingsSecurity.passwordPlaceholder")} value={form.newPassword} onChange={update('newPassword')} required minLength={6} />
              </div>
              <div className="auth-field">
                <label>{t("settingsSecurity.confirmPassword")}</label>
                <input className="auth-input" type="password" placeholder={t("auth.repeatPassword")} value={form.confirmPassword} onChange={update('confirmPassword')} required minLength={6} />
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> {t("auth.resetting")}</> : t("auth.resetPassword")}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-success">{t("auth.resetSuccess")}</div>
            <div className="auth-footer" style={{ marginTop: 16 }}>
              <Link to="/auth/login" className="auth-link">{t("auth.signInAction")}</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
