import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../AuthContext";
import { updatePreferences } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsNotifications() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
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
      setSuccess("Preferences saved");
      setTimeout(() => setSuccess(""), 3000);
    } catch {}
    setLoading(false);
  };

  const items = [
    { key: 'receiveReplies', label: 'Replies', desc: 'Get notified when someone replies to your posts' },
    { key: 'receiveNotifications', label: 'Community activity', desc: 'Stay updated on community activity' },
    { key: 'receiveLegalUpdates', label: 'Legal updates', desc: 'Receive updates about Nepali law changes' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button className="auth-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <h1>Notifications</h1>
        <p className="auth-subtitle">Manage your notification preferences.</p>

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
          {loading ? <><Loader size={16} className="spin" /> Saving...</> : "Save preferences"}
        </button>
      </div>
    </div>
  );
}
