import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../api/auth";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed");
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

        {!sent ? (
          <>
            <h1>Reset password</h1>
            <p className="auth-subtitle">Enter your email and we'll send you a reset code.</p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>{t("auth.email")}</label>
                <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? <><Loader size={16} className="spin" /> Sending...</> : "Send reset code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="auth-success">If an account exists, a reset code has been sent.</div>
            <p className="auth-subtitle" style={{ marginTop: 16 }}>
              <Link to={`/auth/reset-password?email=${encodeURIComponent(email)}`} className="auth-link">
                Enter your reset code
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
