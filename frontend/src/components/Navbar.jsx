import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, X, Search, Bell, User, Settings,
  LogOut, Globe, LayoutDashboard, ChevronDown
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { useLanguage } from "../LanguageContext";
import LogoutConfirmation from "./LogoutConfirmation";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/", labelKey: "navbar.home" },
  { to: "/chat", labelKey: "navbar.aiChat" },
  { to: "/community", label: "Community" },
  { to: "/glossary", label: "Resources" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useAuth();
  const { lang, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    setShowLogout(false);
    setProfileOpen(false);
    await logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

  const displayName = user?.name || user?.email?.split("@")[0] || "";

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isAuthPage = location.pathname.startsWith("/auth/");

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="nav-container">
          {/* LEFT: Logo + Primary Nav */}
          <div className="nav-left">
            <Link to="/" className="nav-logo">
              <img src="/logo.jpeg" alt="Her Legal" className="nav-logo-image" />
            </Link>
            <ul className={`nav-links${mobileOpen ? " open" : ""}`}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={isActive(link.to) ? "active" : ""}>
                    {link.label || t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Utility + CTA */}
          <div className="nav-right">
            <button
              className="nav-icon-btn"
              onClick={() => navigate("/glossary")}
              title="Search"
            >
              <Search size={16} />
            </button>

            {user && (
              <button
                className="nav-icon-btn has-alert"
                onClick={() => navigate("/notifications")}
                title="Notifications"
              >
                <Bell size={16} />
              </button>
            )}

            <div className="nav-lang-toggle">
              <button
                className={`nav-lang-btn${lang === "en" ? " active" : ""}`}
                onClick={() => setLanguage("en")}
              >
                EN
              </button>
              <button
                className={`nav-lang-btn${lang === "ne" ? " active" : ""}`}
                onClick={() => setLanguage("ne")}
              >
                ने
              </button>
            </div>

            <div className="nav-divider" />

            {user ? (
              <div className="nav-profile" ref={profileRef}>
                <button
                  className="nav-profile-trigger"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="nav-avatar">{initials}</div>
                  <span className="nav-profile-name">{displayName}</span>
                  <ChevronDown size={14} style={{ color: "#9ca3af" }} />
                </button>

                <div className={`nav-dropdown${profileOpen ? " open" : ""}`}>
                  <Link to="/dashboard" className="nav-dropdown-item"
                    onClick={() => setProfileOpen(false)}>
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>

                  <Link to="/auth/settings/profile" className="nav-dropdown-item"
                    onClick={() => setProfileOpen(false)}>
                    <Settings size={15} />
                    Settings
                  </Link>

                  <div className="nav-dropdown-divider" />

                  <div className="nav-dropdown-lang">
                    <Globe size={15} />
                    <span>Language</span>
                    <div className="nav-lang-toggle">
                      <button
                        className={`nav-lang-btn${lang === "en" ? " active" : ""}`}
                        onClick={() => { setLanguage("en"); setProfileOpen(false); }}
                      >
                        EN
                      </button>
                      <button
                        className={`nav-lang-btn${lang === "ne" ? " active" : ""}`}
                        onClick={() => { setLanguage("ne"); setProfileOpen(false); }}
                      >
                        ने
                      </button>
                    </div>
                  </div>

                  <div className="nav-dropdown-divider" />

                  <button
                    className="nav-dropdown-item"
                    onClick={() => { setProfileOpen(false); setShowLogout(true); }}
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              !isAuthPage && (
                <>
                  <Link to="/auth/login" className="nav-auth-btn login">
                    <User size={14} />
                    Log in
                  </Link>
                  <Link to="/community" className="nav-auth-btn cta">
                    Get Started
                  </Link>
                </>
              )
            )}

            <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <LogoutConfirmation
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}

export default Navbar;
