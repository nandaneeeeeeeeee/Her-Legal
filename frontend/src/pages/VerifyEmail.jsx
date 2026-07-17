import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, Mail } from "lucide-react";
import { verifyEmail } from "../api/auth";
import "./Auth.css";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("No email provided"); return; }
    setError("");
    setLoading(true);
    try {
      await verifyEmail(email, code);
      setSuccess(true);
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Mail size={28} />
          </div>
        </div>
        <h1>Verify your email</h1>
        <p className="auth-subtitle">
          We sent a 4-digit code to <strong>{email || "your email"}</strong>
        </p>

        {success ? (
          <div className="auth-success">Email verified! Redirecting to login...</div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label>Verification code</label>
                <input
                  className="auth-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="0000"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  required
                  style={{ textAlign: 'center', fontSize: 24, letterSpacing: 12, fontWeight: 700 }}
                />
              </div>
              <button className="auth-submit" type="submit" disabled={loading || code.length !== 4}>
                {loading ? <><Loader size={16} className="spin" /> Verifying...</> : "Verify email"}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer" style={{ marginTop: 32 }}>
          <button className="auth-link" onClick={() => navigate("/auth/login")}>Back to login</button>
        </div>
      </div>
    </div>
  );
}
