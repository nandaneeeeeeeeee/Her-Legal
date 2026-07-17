import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../AuthContext";
import { verifyMagicLink } from "../api/auth";
import { useLanguage } from "../LanguageContext";

export default function MagicLinkVerify() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError(t("auth.noToken"));
      return;
    }

    verifyMagicLink(token)
      .then((data) => {
        setStatus('success');
        setTimeout(() => {
          navigate(data.isNewUser ? '/onboarding' : '/dashboard');
        }, 1500);
      })
      .catch((err) => {
        setStatus('error');
        setError(err.message || t("auth.invalidOrExpiredLink"));
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <Loader size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h1>{t("auth.verifying")}</h1>
            <p className="auth-subtitle">{t("auth.signingInMagicLink")}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={40} style={{ color: '#16A34A', marginBottom: 16 }} />
            <h1>{t("auth.signedIn")}</h1>
            <p className="auth-subtitle">{t("auth.redirectingDashboard")}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={40} style={{ color: '#DC2626', marginBottom: 16 }} />
            <h1>{t("auth.linkExpired")}</h1>
            <p className="auth-subtitle">{error}</p>
            <div className="auth-footer" style={{ marginTop: 24 }}>
              <a href="/auth/login" className="auth-link">{t("auth.trySignInAgain")}</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
