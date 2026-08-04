import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, LogOut, ChevronDown, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-badge">MARUTI</span>
        <h1 className="navbar-title">Admin Portal</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
          <Bell size={20} color="#475569" />
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#c054c2',
            }}
          />
        </div>

        {/* Clickable User Profile Container */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '9999px',
              background: profileOpen ? '#faf5fa' : 'transparent',
              border: '1px solid',
              borderColor: profileOpen ? '#c054c2' : 'transparent',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                {user?.name || 'Administrator'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {user?.role ? user.role.toUpperCase() : 'ADMIN'}
              </span>
            </div>
            <ChevronDown size={16} color="#64748b" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </div>

          {/* User Profile Dropdown Menu */}
          {profileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                width: '240px',
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(192, 84, 194, 0.25)',
                border: '1px solid #e2e8f0',
                zIndex: 1000,
                overflow: 'hidden',
                animation: 'dropdownFade 0.2s ease-out',
              }}
            >
              <div style={{ padding: '1rem', background: '#faf5fa', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0a192f' }}>
                  {user?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {user?.email || 'admin@maruti.com'}
                </div>
                <span className="badge badge-active" style={{ background: '#c054c2', color: 'white', marginTop: '8px', fontSize: '0.7rem' }}>
                  {user?.role ? user.role.toUpperCase() : 'ADMIN'}
                </span>
              </div>

              <div style={{ padding: '8px' }}>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'transparent',
                    color: '#e31837',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LogOut size={16} color="#e31837" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
