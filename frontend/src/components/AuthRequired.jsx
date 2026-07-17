import { useNavigate } from "react-router-dom";
import { Shield, Lock, Sparkles, X } from "lucide-react";
import "./AuthRequired.css";

export default function AuthRequired({ open, onClose, action }) {
  const navigate = useNavigate();

  if (!open) return null;

  const messages = {
    'chat': 'Sign in to ask the AI legal assistant and save your conversations.',
    'post': 'Create an account to share your story anonymously in the community.',
    'document': 'Sign in to generate and save legal documents.',
    'upload': 'Sign in to upload and analyze legal documents.',
    'save': 'Sign in to bookmark resources for later.',
    'react': 'Sign in to react to community posts.',
    'report': 'Sign in to report content.',
    'default': 'Create an account to access this feature.',
  };

  const msg = messages[action] || messages.default;

  return (
    <div className="authreq-overlay" onClick={onClose}>
      <div className="authreq-modal" onClick={e => e.stopPropagation()}>
        <button className="authreq-close" onClick={onClose}><X size={18} /></button>

        <div className="authreq-icon">
          <Shield size={28} />
        </div>
        <h2>Account required</h2>
        <p className="authreq-desc">{msg}</p>

        <div className="authreq-benefits">
          <div className="authreq-benefit">
            <Lock size={14} />
            <span>Your identity stays hidden from the public</span>
          </div>
          <div className="authreq-benefit">
            <Shield size={14} />
            <span>Only authorized moderators can investigate abuse</span>
          </div>
          <div className="authreq-benefit">
            <Sparkles size={14} />
            <span>Your documents and conversations are private</span>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/auth/signup')}>
          Create free account
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/auth/login')}>
          Sign in
        </button>
        <button className="authreq-continue" onClick={onClose}>
          Continue browsing
        </button>
      </div>
    </div>
  );
}
