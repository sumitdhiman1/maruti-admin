'use client';

import React from 'react';

export default function CareerCtaSection() {
  return (
    <section className="career-cta-section" style={{ backgroundImage: "url('/assets/images/event--3.webp')" }}>
      <div className="career-cta-overlay"></div>
      <div className="container">
        <div className="career-cta-content">
          <div className="career-cta-text">
            <h2 className="career-title">Your Career Begins Here</h2>
            <p className="career-description">
              Join one of Nepal's leading pharmaceutical companies and grow in a culture of learning, recognition and innovation.
            </p>
          </div>

          <div className="career-cta-action">
            <a href="#careers" className="btn career-btn">
              Explore Careers
              <svg className="btn-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
