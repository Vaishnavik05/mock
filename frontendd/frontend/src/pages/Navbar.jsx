import React, { useState } from 'react';
import '../styles/Navbar.css';

function Navbar({ currentUser, onLogout, activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'books', label: 'Books' },
    { id: 'members', label: 'Members' },
    { id: 'issue', label: 'Issue Books' },
    { id: 'return', label: 'Return Books' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span>Library</span>
        </div>

        <button
          className="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="navbar-right">
          <span className="user-name">{currentUser?.name || currentUser?.email}</span>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;