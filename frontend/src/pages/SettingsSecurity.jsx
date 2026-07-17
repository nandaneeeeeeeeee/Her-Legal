import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { useAuth } from "../AuthContext";
import { changePassword } from "../api/settings";
import "../pages/Auth.css";
import "../pages/Settings.css";

export default function SettingsSecurity() {
  const navigate = useNavigate();
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
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await changePassword(form.currentPassword, form.newPassword, form.confirmPassword);
      setSuccess("Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message || "Failed to change password");
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
        <h1>Security</h1>
        <p className="auth-subtitle">Change your password.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Current password</label>
            <input className="auth-input" type="password" value={form.currentPassword} onChange={update('currentPassword')} required />
          </div>
          <div className="auth-field">
            <label>New password</label>
            <input className="auth-input" type="password" placeholder="At least 6 characters" value={form.newPassword} onChange={update('newPassword')} required minLength={6} />
          </div>
          <div className="auth-field">
            <label>Confirm new password</label>
            <input className="auth-input" type="password" value={form.confirmPassword} onChange={update('confirmPassword')} required minLength={6} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> Saving...</> : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
