import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Mail, Loader, ArrowLeft } from "lucide-react";
import { useAuth } from "../AuthContext";
import { sendMagicLink } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { useLanguage } from "../LanguageContext";
import "./Auth.css";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMagic, setShowMagic] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      const isNew = data.data?.isNewUser || data.data?.user?.isOnboarded === false;
      navigate(isNew ? "/onboarding" : "/dashboard");
    } catch (err) {
      const msg = err.message || "Login failed";
      setError(msg);

      if (msg.toLowerCase().includes("verify")) {
        navigate(`/auth/verify-email?email=${encodeURIComponent(email)}`);
      }
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

  const handleMagicSend = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendMagicLink(magicEmail);
      setMagicSent(true);
    } catch (err) {
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  if (showMagic) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          {!magicSent ? (
            <>
              <button className="auth-back" onClick={() => setShowMagic(false)}>
                <ArrowLeft size={16} />
                {t("common.back")}
              </button>
              <h1>Email login</h1>
              <p className="auth-subtitle">We'll send a magic link to your inbox.</p>
              {error && <div className="auth-error">{error}</div>}
              <form onSubmit={handleMagicSend}>
                <div className="auth-field">
                  <label>Email address</label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={magicEmail}
                    onChange={e => setMagicEmail(e.target.value)}
                    required
                  />
                </div>
                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? <><Loader size={16} className="spin" /> Sending...</> : "Send magic link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="auth-success" style={{ marginTop: 32 }}>Magic link sent! Check your inbox.</div>
              <p className="auth-subtitle" style={{ marginTop: 16, textAlign: 'center' }}>
                Didn't receive it?{" "}
                <button className="auth-link" onClick={() => { setMagicSent(false); setError(""); }}>
                  Resend
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t("auth.welcomeBack")}</h1>
        <p className="auth-subtitle">{t("auth.signInDesc")}</p>

        {error && <div className="auth-error">{error}</div>}

        <GoogleLoginButton
          onSuccess={handleGoogleSuccess}
          onError={(err) => setError(err.message)}
          disabled={loading}
        />

        <div className="auth-divider">or</div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>{t("auth.email")}</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>{t("auth.password")}</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right', marginBottom: 16 }}>
            <Link to="/auth/forgot-password" className="auth-link" style={{ fontSize: 13 }}>
              Forgot password?
            </Link>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? <><Loader size={16} className="spin" /> {t("auth.pleaseWait")}</> : t("auth.signIn")}
          </button>
        </form>

        <div className="auth-magic-link">
          <button className="auth-magic-toggle" onClick={() => setShowMagic(true)}>
            <Mail size={16} />
            Continue with Email (Magic Link)
          </button>
        </div>

        <div className="auth-footer">
          {t("auth.dontHaveAccount")} <Link to="/auth/signup">{t("auth.signUp")}</Link>
        </div>
      </div>
    </div>
  );
}
