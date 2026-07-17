import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, LogIn, LogOut, LayoutDashboard, Bell, Users } from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import LogoutConfirmation from "./LogoutConfirmation";
import "./Navbar.css";

function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { user, logout } = useAuth();
  const { lang, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
    navigate("/");
  };

  const links = [
    { to: "/", label: t("navbar.home") },
    { to: "/chat", label: t("navbar.aiChat") },
    { to: "/community", label: "Community" },
    { to: "/about", label: t("navbar.solutions") },
    { to: "/campaigns", label: t("navbar.resources") },
    { to: "/news", label: t("navbar.news") },
    { to: "/team", label: t("navbar.about") },
    { to: "/contact", label: t("navbar.contact") },
  ];

  const isAuthPage = location.pathname.startsWith("/auth/");

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              <img src="/logo.jpeg" alt="Her Legal" className="nav-logo-image" width="100" height="40" />
            </Link>
            <ul className={`nav-links${open ? " open" : ""}`}>
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-right">
            <div className="nav-language-selector">
              <label htmlFor="language-select" className="nav-language-label">{t("navbar.selectLanguage")}</label>
              <select
                id="language-select"
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="nav-language-select"
              >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
              </select>
            </div>
            <button className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }} onClick={() => navigate("/chat")}>
              <Search size={16} />
            </button>
            {user ? (
              <>
                <Link to="/community" className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }}>
                  <Users size={16} />
                </Link>
                <Link to="/notifications" className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }}>
                  <Bell size={16} />
                </Link>
                <Link to="/dashboard" className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }}>
                  <LayoutDashboard size={16} />
                </Link>
                <button className="btn btn-ghost" onClick={() => setShowLogout(true)} style={{ height: 36, padding: "0 12px" }}>
                  <LogOut size={16} />
                  <span style={{ marginLeft: 6 }}>{t("navbar.logout")}</span>
                </button>
              </>
            ) : (
              !isAuthPage && (
                <Link to="/auth/login" className="btn btn-ghost" style={{ height: 36, padding: "0 12px" }}>
                  <LogIn size={16} />
                  <span style={{ marginLeft: 6 }}>{t("navbar.login")}</span>
                </Link>
              )
            )}
            <Link to="/community" className="btn btn-primary" style={{ height: 36, padding: "0 20px", fontSize: 13 }}>
              {t("navbar.startFree")}
            </Link>
            <button className="nav-toggle" onClick={() => setOpen(!open)}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>
      <LogoutConfirmation open={showLogout} onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
    </>
  );
}

export default Navbar;
