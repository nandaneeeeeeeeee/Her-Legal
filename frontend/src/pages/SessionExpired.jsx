import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

export default function SessionExpired() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
            <Clock size={28} />
          </div>
        </div>
        <h1>Session expired</h1>
        <p className="auth-subtitle">
          Your session has expired. Please sign in again to continue.
        </p>
        <Link to="/auth/login" className="btn btn-primary" style={{ display: 'inline-flex', marginTop: 8 }}>
          Sign in again
        </Link>
      </div>
    </div>
  );
}
