import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import { updatePreferences } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsNotifications() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState({
    receiveReplies: true,
    receiveNotifications: true,
    receiveLegalUpdates: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?.communityPrefs) {
      setPrefs(prev => ({ ...prev, ...user.communityPrefs }));
    }
  }, [user]);

  const toggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = await updatePreferences({ communityPrefs: prefs });
      updateUser(data.data);
      setSuccess(t("settingsNotifications.preferencesSaved"));
      setTimeout(() => setSuccess(""), 3000);
    } catch {}
    setLoading(false);
  };

  const items = [
    { key: 'receiveReplies', label: t("settingsNotifications.replies"), desc: t("settingsNotifications.repliesDesc") },
    { key: 'receiveNotifications', label: t("settingsNotifications.communityActivity"), desc: t("settingsNotifications.communityActivityDesc") },
    { key: 'receiveLegalUpdates', label: t("settingsNotifications.legalUpdates"), desc: t("settingsNotifications.legalUpdatesDesc") },
  ];

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button className="auth-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> {t("common.dashboard")}
        </button>
        <h1>{t("settingsNotifications.title")}</h1>
        <p className="auth-subtitle">{t("settingsNotifications.subtitle")}</p>

        {success && <div className="auth-success">{success}</div>}

        <div className="settings-notif-list">
          {items.map(item => (
            <label key={item.key} className="settings-notif-row">
              <div>
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </div>
              <input type="checkbox" checked={prefs[item.key]} onChange={() => toggle(item.key)} />
            </label>
          ))}
        </div>

        <button className="auth-submit" onClick={handleSave} disabled={loading}>
          {loading ? <><Loader size={16} className="spin" /> {t("common.saving")}</> : t("settingsNotifications.savePreferences")}
        </button>
      </div>
    </div>
  );
}
