import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { useAuth } from "../AuthContext";
import { updateProfile } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsProfile() {
  const { user, updateUser } = useAuth();
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
      setSuccess("Profile updated");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-card">
        <button className="auth-back" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={16} /> Dashboard
        </button>
        <h1>Profile</h1>
        <p className="auth-subtitle">Update your personal information.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input className="auth-input" type="email" value={user?.email || ""} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="auth-field">
            <label>Username</label>
            <input className="auth-input" type="text" value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required minLength={3} />
          </div>
          <div className="auth-field">
            <label>Phone</label>
            <input className="auth-input" type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> Saving...</> : <><Save size={16} /> Save changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
