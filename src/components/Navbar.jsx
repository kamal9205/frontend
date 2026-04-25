import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LinkIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  return (
    <nav>
      <div className="container nav-container">
        <Link to="/" className="nav-logo text-gradient">
          <LinkIcon size={28} />
          ShortyUI
        </Link>
        <div className="nav-links">
          <Link to="/" className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}>
            Shorten
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Hi, {user.name}</span>
              <button 
                onClick={logout} 
                className="glass-button" 
                style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', marginLeft: '12px' }}>
              <Link to="/login" className="glass-button" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-glass)' }}>
                Login
              </Link>
              <Link to="/signup">
                <button className="glass-button" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
