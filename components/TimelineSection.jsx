'use client';

import React from 'react';

const milestones = [
  { badge: '09', year: '2009', date: '12 May', desc: 'Foundation of Maruti Pharma' },
  { badge: '11', year: '2011', date: 'August', desc: 'Operations & Marketing Started' },
  { badge: '13', year: '2013', date: 'March', desc: 'WHO-GMP Certification' },
  { badge: '14', year: '2014', date: 'April', desc: 'ISO 9001:2008 • 14001:2004 Certification' },
  { badge: '17', year: '2017', date: 'April', desc: 'EVARA Division (Ortho, Gastro, Neuro & Uro Care)' },
  { badge: '17', year: '2017', date: 'May', desc: 'Facility expanded (Tablets, Capsules & Lotions)' },
  { badge: '19', year: '2019', date: 'Jan', desc: 'Launched range of Lotions – Journey Continues' },
];

export default function TimelineSection() {
  return (
    <section className="timeline-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-title">HISTORY</span>
          <h2 className="section-title">
            Our Journey of <span className="italic-purple">Excellence</span>
          </h2>
        </div>

        <div className="timeline-wrapper">
          <div className="timeline-line"></div>

          <div className="timeline-grid">
            {milestones.map((item, idx) => (
              <div key={idx} className="timeline-item">
                <div className="timeline-badge-wrapper">
                  <div className="timeline-badge">{item.badge}</div>
                </div>
                <div className="timeline-content">
                  <h4 className="timeline-year">{item.year}</h4>
                  <span className="timeline-date">{item.date}</span>
                  <p className="timeline-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline-action text-center">
          <a href="#" className="btn">
            View Milestones
            <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
