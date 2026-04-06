import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">

        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Shop<span>Ease</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link to="/categories" onClick={() => setMenuOpen(false)}>Categories</Link>
          <Link to="/deal" onClick={() => setMenuOpen(false)}>Deals</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">

          {/* 🔐 Login / Logout UI */}
          {!user ? (
            <Link 
              to="/login" 
              className="btn"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          ) : (
            <div className="user-info">
              {/* ✅ Safe access (no crash) */}
              <span className="username">
                Hi, {user?.name || user?.email?.split("@")[0] || "User"}
              </span>

              <button 
                className="btn logout" 
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}

          {/* Cart */}
          <Link 
            to="/cart" 
            className="btn primary"
            onClick={() => setMenuOpen(false)}
          >
            Cart
          </Link>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;