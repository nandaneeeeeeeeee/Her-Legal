import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Her Legal</Link>
      <ul className="nav-links">
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/contact">Contact / Help</Link></li>
        <li><Link to="/team">Team</Link></li>
        <li><Link to="/campaigns">Campaigns</Link></li>
        <li><Link to="/news">News & Magazines</Link></li>
        <li><Link to="/confessions">Share Your Story</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;