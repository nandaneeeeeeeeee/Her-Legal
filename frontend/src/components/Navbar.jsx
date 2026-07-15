import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../AuthContext";
import "./Navbar.css";

function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/chat", label: "AI Chat" },
    { to: "/about", label: "Solutions" },
    { to: "/campaigns", label: "Resources" },
    { to: "/news", label: "News" },
    { to: "/team", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="nav-logo">her<span>legal</span></Link>
          <ul className={`nav-links${open ? " open" : ""}`}>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="nav-right">
          <button className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }} onClick={() => navigate("/chat")}>
            <Search size={16} />
          </button>
          {user ? (
            <button className="btn btn-ghost" onClick={logout} style={{ height: 36, padding: "0 12px" }}>
              <LogOut size={16} />
              <span style={{ marginLeft: 6 }}>Logout</span>
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={onLoginClick} style={{ height: 36, padding: "0 12px" }}>
              <LogIn size={16} />
              <span style={{ marginLeft: 6 }}>Login</span>
            </button>
          )}
          <Link to="/confessions" className="btn btn-primary" style={{ height: 36, padding: "0 20px", fontSize: 13 }}>
            Start Free
          </Link>
          <button className="nav-toggle" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
