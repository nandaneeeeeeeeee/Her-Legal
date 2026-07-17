import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader, ArrowLeft } from "lucide-react";
import { resetPassword } from "../api/auth";
import "./Auth.css";

export default function ResetPassword() {
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
      setError("Passwords do not match");
      return;
    }
    if (!email) { setError("No email provided"); return; }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, form.resetCode, form.newPassword, form.confirmPassword);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <button className="auth-back" onClick={() => navigate("/auth/login")}>
          <ArrowLeft size={16} /> Back to login
        </button>

        {!success ? (
          <>
            <h1>Enter reset code</h1>
            <p className="auth-subtitle">
              Enter the 4-digit code sent to <strong>{email || "your email"}</strong>
            </p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Reset code</label>
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
                <label>New password</label>
                <input className="auth-input" type="password" placeholder="At least 6 characters" value={form.newPassword} onChange={update('newPassword')} required minLength={6} />
              </div>
              <div className="auth-field">
                <label>Confirm new password</label>
                <input className="auth-input" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={update('confirmPassword')} required minLength={6} />
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> Resetting...</> : "Reset password"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-success">Password reset successfully! Redirecting to login...</div>
            <div className="auth-footer" style={{ marginTop: 16 }}>
              <Link to="/auth/login" className="auth-link">Sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
