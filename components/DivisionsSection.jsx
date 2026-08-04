'use client';

import React, { useState, useEffect } from 'react';

const defaultDivisions = [
  {
    name: 'Derma Division',
    subtitle: 'Science–Backed Skin Solutions',
    description: 'Advanced skincare and dermatological products for healthier skin and better life.',
    imageUrl: '/assets/images/derma-division.jpeg',
    btnText: 'Explore Products',
    btnLink: '#products',
  },
  {
    name: 'Evara Division',
    subtitle: 'Everyday Health & Wellness',
    description: 'Science-backed pharmaceuticals for everyday health and wellness needs.',
    imageUrl: '/assets/images/evara-division.jpeg',
    btnText: 'Explore Products',
    btnLink: '#products',
  },
  {
    name: 'Elzac Division',
    subtitle: 'Reliable Effective Solutions',
    description: 'Reliable and effective pharmaceuticals for a healthier and stronger tomorrow.',
    imageUrl: '/assets/images/elzac-division.jpeg',
    btnText: 'Explore Products',
    btnLink: '#products',
  },
];

export default function DivisionsSection({ divisionsData: initialData }) {
  const [items, setItems] = useState(
    Array.isArray(initialData) && initialData.length > 0 ? initialData : defaultDivisions
  );

  // Sync initial server data when props update
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setItems(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchLiveDivisions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/divisions`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchLiveDivisions();
  }, []);

  return (
    <section className="divisions-section" id="divisions">
      <div className="container">
        <div className="section-header text-center">
          <span className="sub-title">Our Products</span>
          <h2 className="section-title">
            Our Therapeutic <span className="italic-purple">Divisions</span>
          </h2>
          <p className="section-description">
            Comprehensive pharmaceutical solutions across dermatology, everyday wellness, and specialized healthcare.
          </p>
        </div>

        <div className="divisions-grid">
          {items.map((div, index) => (
            <div key={index} className="division-card">
              <div
                className="division-banner"
                style={{
                  backgroundImage: `url('${div.imageUrl || defaultDivisions[index % 3].imageUrl}')`,
                }}
              >
                <div className="banner-overlay"></div>
                <div className="banner-content">
                  <h3 className="banner-title">{div.name}</h3>
                  <p className="banner-subtitle">{div.subtitle}</p>
                </div>
              </div>
              <div className="card-body">
                <p className="card-text">{div.description}</p>
                <a href={div.btnLink || '#products'} className="explore-link">
                  {div.btnText || 'Explore Products'}
                  <svg className="link-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
