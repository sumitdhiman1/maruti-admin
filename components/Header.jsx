'use client';

import React, { useState, useEffect } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <div className="header-logo-wrap">
            <a href="#" className="logo">
              <img
                src="/assets/images/Maruti-Pharma-Logo.png"
                alt="Maruti Pharma Pvt. Ltd."
                width="300"
                height="220"
              />
            </a>
          </div>

          <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`} id="navMenu">
            <div className="mobile-menu-header">
              <a href="#" className="logo">
                <img
                  src="/assets/images/Maruti-Pharma-Logo.png"
                  alt="Maruti Pharma"
                  width="300"
                  height="220"
                />
              </a>
              <button className="close-menu-btn" onClick={closeMobileMenu} id="closeMenu">
                &times;
              </button>
            </div>

            <ul className="nav-list">
              <li><a href="#" className="nav-link active">Home</a></li>
              <li><a href="#about" className="nav-link">About Us</a></li>
              <li><a href="#products" className="nav-link">Products</a></li>
              <li><a href="#divisions" className="nav-link">Divisions</a></li>
              <li><a href="#departments" className="nav-link">Departments</a></li>
              <li><a href="#careers" className="nav-link">Careers</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
            </ul>

            <div className="mobile-nav-btn">
              <a href="#contact" className="btn">Enquiry Now &rarr;</a>
            </div>
          </nav>

          <div className="header-action">
            <a href="#contact" className="btn">Enquiry Now &rarr;</a>
          </div>

          <button
            className="menu-toggle"
            id="menuToggle"
            aria-label="Toggle Navigation"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className={`menu-overlay ${mobileMenuOpen ? 'active' : ''}`}
            id="menuOverlay"
            onClick={closeMobileMenu}
          ></div>
        </div>
      </div>
    </header>
  );
}
