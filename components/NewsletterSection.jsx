'use client';

import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-overlay"></div>
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <span className="sub-title">Stay Updated</span>
            <h2 className="newsletter-title">
              Subscribe To Our <span className="italic-purple">Newsletter</span>
            </h2>
            <p className="newsletter-description">
              Receive the latest updates on pharmaceutical innovations, healthcare insights, and company news directly to your inbox.
            </p>
          </div>

          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <svg className="mail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>

                <input
                  type="email"
                  className="email-input"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button type="submit" className="subscribe-btn">
                  {subscribed ? 'Subscribed! 🎉' : 'Subscribe'}
                  <svg className="btn-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
