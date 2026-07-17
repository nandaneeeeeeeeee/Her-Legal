import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { changePassword } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsSecurity() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.newPassword !== form.confirmPassword) {
      setError(t("settingsSecurity.passwordsMismatch"));
      return;
    }
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword, form.confirmPassword);
      setSuccess(t("settingsSecurity.passwordChanged"));
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || t("settingsSecurity.changeFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button className="auth-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> {t("common.dashboard")}
        </button>
        <h1>{t("settingsSecurity.title")}</h1>
        <p className="auth-subtitle">{t("settingsSecurity.subtitle")}</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>{t("settingsSecurity.currentPassword")}</label>
            <input className="auth-input" type="password" value={form.currentPassword} onChange={update('currentPassword')} required />
          </div>
          <div className="auth-field">
            <label>{t("settingsSecurity.newPassword")}</label>
            <input className="auth-input" type="password" placeholder={t("settingsSecurity.passwordPlaceholder")} value={form.newPassword} onChange={update('newPassword')} required minLength={6} />
          </div>
          <div className="auth-field">
            <label>{t("settingsSecurity.confirmPassword")}</label>
            <input className="auth-input" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required minLength={6} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> {t("common.saving")}</> : t("settingsSecurity.changePassword")}
          </button>
        </form>
      </div>
    </div>
  );
}
