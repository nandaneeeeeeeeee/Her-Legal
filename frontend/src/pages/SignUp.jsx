import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuth } from "../AuthContext";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

export default function SignUp() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError("");
    setLoading(true);
    try {
      const data = await googleLogin(credential);
      navigate(data.isNewUser ? "/onboarding" : "/dashboard");
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t("auth.createAccount")}</h1>
        <p className="auth-subtitle">{t("auth.joinDesc")}</p>

        {error && <div className="auth-error">{error}</div>}

        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err.message)}
          disabled={loading}
        />

        <div className="auth-divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>{t("auth.username")}</label>
            <input className="auth-input" type="text" placeholder="Your name" value={form.username} onChange={update('username')} required minLength={3} />
          </div>
          <div className="auth-field">
            <label>{t("auth.email")}</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
          </div>
          <div className="auth-field">
            <label>{t("auth.phone")}</label>
            <input className="auth-input" type="tel" placeholder="+977-xxxxxxxxx" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="auth-field">
            <label>{t("auth.password")}</label>
            <input className="auth-input" type="password" placeholder="At least 6 characters" value={form.password} onChange={update('password')} required minLength={6} />
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> {t("auth.pleaseWait")}</> : t("auth.createAccountBtn")}
          </button>
        </form>

        <div className="auth-footer">
          {t("auth.alreadyHaveAccount")} <Link to="/auth/login">{t("auth.signInAction")}</Link>
        </div>
      </div>
    </div>
  );
}
