import { useState } from "react";
import { useAuth } from "../AuthContext";
import { X } from "lucide-react";

function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const user = await login(form.email, form.password);
        if (user) onClose();
      } else {
        await register(form);
        setMode("login");
        setForm({ ...form, password: "" });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <h2 style={{ marginBottom: 8 }}>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
          {mode === "login" ? "Sign in to save your conversations." : "Join Her Legal anonymously."}
        </p>

        {error && <p style={{ color: "var(--primary)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mode === "register" && (
            <input
              className="modal-input"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          )}
          <input
            className="modal-input"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {mode === "register" && (
            <input
              className="modal-input"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          )}
          <input
            className="modal-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 20, textAlign: "center" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 600, cursor: "pointer", fontSize: 13 }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-content {
          background: var(--bg-card);
          border-radius: var(--radius-md);
          padding: 32px;
          width: 100%;
          max-width: 400px;
          position: relative;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .modal-close {
          position: absolute; top: 12px; right: 12px;
          background: none; border: none; cursor: pointer;
          color: var(--text-muted);
        }
        .modal-input {
          width: 100%; padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          font-size: 14px; font-family: var(--font-body);
          background: var(--bg);
          outline: none; box-sizing: border-box;
        }
        .modal-input:focus {
          border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}

export default AuthModal;
