import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../AuthContext";
import { verifyMagicLink } from "../api/auth";

export default function MagicLinkVerify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Invalid magic link. No token provided.');
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
        setError(err.message || 'Invalid or expired magic link');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <Loader size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: 16 }} />
            <h1>Verifying...</h1>
            <p className="auth-subtitle">Signing you in with the magic link.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle size={40} style={{ color: '#16A34A', marginBottom: 16 }} />
            <h1>Signed in!</h1>
            <p className="auth-subtitle">Redirecting to your dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={40} style={{ color: '#DC2626', marginBottom: 16 }} />
            <h1>Link expired</h1>
            <p className="auth-subtitle">{error}</p>
            <div className="auth-footer" style={{ marginTop: 24 }}>
              <a href="/auth/login" className="auth-link">Try signing in again</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
