import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { updateProfile } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsProfile() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const data = await updateProfile(form);
      updateUser(data.data);
      setSuccess(t("settingsProfile.profileUpdated"));
    } catch (err) {
      setError(err.message || t("settingsProfile.updateFailed"));
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
        <h1>{t("settingsProfile.title")}</h1>
        <p className="auth-subtitle">{t("settingsProfile.subtitle")}</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>{t("settingsProfile.email")}</label>
            <input className="auth-input" type="email" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="auth-field">
            <label>{t("settingsProfile.username")}</label>
            <input className="auth-input" type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required minLength={3} />
          </div>
          <div className="auth-field">
            <label>{t("settingsProfile.phone")}</label>
            <input className="auth-input" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> {t("common.saving")}</> : <><Save size={16} /> {t("settingsProfile.saveChanges")}</>}
          </button>
        </form>
      </div>
    </div>
  );
}
