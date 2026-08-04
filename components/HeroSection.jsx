'use client';

import React, { useState, useEffect } from 'react';

export default function HeroSection({ heroData: initialData }) {
  const [banners, setBanners] = useState(Array.isArray(initialData) ? initialData : []);
  const [heroBgImage, setHeroBgImage] = useState('');

  // Sync initial server data when props update
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setBanners(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchFreshHeroData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/hero-banners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBanners(data);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchFreshHeroData();
  }, []);

  // Most recently updated Hero Banner from database
  const activeMainBanner = Array.isArray(banners) && banners.length > 0
    ? (banners.find((b) => b && b.status === 'Active' && (b.isDefault || b.bannerType === 'DefaultHero')) || banners[0])
    : null;

  // Sync image whenever activeMainBanner changes
  useEffect(() => {
    if (activeMainBanner?.imageUrl) {
      setHeroBgImage(activeMainBanner.imageUrl);
    }
  }, [activeMainBanner]);

  // Active Seasonal / Event Banners
  const activeEventBanners = Array.isArray(banners)
    ? banners.filter((b) => b && b.bannerType === 'FestivalEvent' && b.status === 'Active')
    : [];

  // Dynamic values from Main Hero Banner
  const badgeText = activeMainBanner?.badgeText || 'WHO-GMP & ISO 9001:2015 Certified';
  const title = activeMainBanner?.title || 'Inspiring New Hope For Healthy Life';
  const subtitle = activeMainBanner?.subtitle || 'At Maruti Pharma, we combine scientific expertise, quality manufacturing and innovative ideas to create healthcare solutions that make a meaningful difference in people\'s lives.';
  const primaryBtnText = activeMainBanner?.primaryBtnText || 'Explore Our Products';
  const primaryBtnLink = activeMainBanner?.primaryBtnLink || '#products';
  const secondaryBtnText = activeMainBanner?.secondaryBtnText || 'About Maruti';
  const secondaryBtnLink = activeMainBanner?.secondaryBtnLink || '#about';

  // Format title to keep first word in italic purple accent
  const titleWords = title.split(' ');
  const firstWord = titleWords[0] || 'Inspiring';
  const remainingTitle = titleWords.slice(1).join(' ');

  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Dynamic Background Image directly from Database */}
      {heroBgImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          <img
            src={heroBgImage}
            alt="Hero Background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
      )}

      <div className="hero-overlay" style={{ zIndex: 2 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div className="hero-content">
          {/* Active Festival / Event Alert Banner (if active in Admin Portal) */}
          {activeEventBanners.length > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #c054c2, #8b2890)',
                color: '#ffffff',
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginBottom: '1rem',
                boxShadow: '0 4px 15px rgba(192, 84, 194, 0.4)',
              }}
            >
              <span>🎉 Special Event:</span>
              <span>{activeEventBanners[0].eventName || 'Festive Promotion Active'}</span>
            </div>
          )}

          {/* Badge */}
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>{badgeText.replace(/^•\s*/, '')}</span>
          </div>

          {/* Dynamic Title */}
          <h1 className="hero-title">
            <span className="italic-purple">{firstWord}</span> {remainingTitle}
          </h1>

          {/* Subtitle */}
          <p className="hero-description">{subtitle}</p>

          {/* Action Buttons */}
          <div className="hero-btn-group">
            <a href={primaryBtnLink} className="btn">
              {primaryBtnText}
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>

            <a href={secondaryBtnLink} className="border-btn">
              {secondaryBtnText}
              <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
