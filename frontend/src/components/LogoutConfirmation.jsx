import { LogOut, X } from "lucide-react";

export default function LogoutConfirmation({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="authreq-overlay" onClick={onClose}>
      <div className="authreq-modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
        <button className="authreq-close" onClick={onClose}><X size={18} /></button>
        <div className="authreq-icon">
          <LogOut size={28} />
        </div>
        <h2>Sign out</h2>
        <p className="authreq-desc">Are you sure you want to sign out? You can always sign back in.</p>
        <button className="btn btn-primary" style={{ width: '100%', background: '#DC2626' }} onClick={onConfirm}>
          Sign out
        </button>
        <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
