'use client';

import React from 'react';

const defaultFeatures = [
  {
    iconUrl: '/assets/images/feature-icon1.jpeg',
    title: 'WHO-GMP',
    highlightWord: 'Certified',
    description: 'Manufactured under internationally recognized quality standards to ensure safety and efficacy.',
  },
  {
    iconUrl: '/assets/images/feature-icon2.jpeg',
    title: 'ISO 9001:2015',
    highlightWord: 'Certified',
    description: 'We follow globally accepted quality management systems for consistent quality and improvement.',
  },
  {
    iconUrl: '/assets/images/feature-icon3.jpeg',
    title: 'Quality',
    highlightWord: 'Assurance',
    description: 'Every product is developed with safety, reliability and quality at the core of everything we do.',
  },
];

export default function FeaturesSection({ certsData: initialData }) {
  const items = Array.isArray(initialData) && initialData.length > 0 ? initialData : defaultFeatures;

  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {items.map((item, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                <img
                  src={item.iconUrl || defaultFeatures[index % 3].iconUrl}
                  alt={`${item.title} ${item.highlightWord || ''}`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultFeatures[index % 3].iconUrl;
                  }}
                />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">
                  {item.title}{' '}
                  <span className="italic-text">{item.highlightWord || 'Certified'}</span>
                </h3>
                <p className="feature-description">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
