'use client';

import React, { useState, useEffect } from 'react';

const defaultEvents = [
  {
    title: 'Nepal Health & Pharma Expo 2024',
    location: 'Kathmandu, Nepal',
    description: 'Connecting with healthcare leaders and showcasing innovative pharma solutions for a healthier Nepal.',
    image: '/assets/images/event--1.jpg',
  },
  {
    title: 'Asia Pharma Summit 2024',
    location: 'Pokhara, Nepal',
    description: 'Gathering top pharmaceutical pioneers, medical researchers, and global healthcare partners.',
    image: '/assets/images/event--2.jpg',
  },
  {
    title: 'HealthCare Innovation Forum 2024',
    location: 'Kathmandu, Nepal',
    description: 'Showcasing advanced medicine formulations and sustainable healthcare technologies.',
    image: '/assets/images/event--3.webp',
  },
];

export default function EventsSection({ eventsData: initialData }) {
  const [items, setItems] = useState(
    Array.isArray(initialData) && initialData.length > 0 ? initialData : defaultEvents
  );

  // Sync initial server data when props update
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setItems(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchLiveEvents = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/events-gallery`);
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

    fetchLiveEvents();
  }, []);

  return (
    <section className="events-section">
      <div className="container">
        <div className="events-header">
          <div className="header-left">
            <span className="sub-title">Events</span>
            <h2 className="section-title">
              Our <span className="italic-purple">Events</span>
            </h2>
            <p className="section-description">
              Participating, Connecting &amp; Contributing to a Healthier Tomorrow
            </p>
          </div>
          <div className="header-right">
            <a href="#" className="view-all-btn">
              View All Events
              <svg className="btn-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        <div className="events-slider-wrapper">
          <div className="events-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {items.map((event, idx) => {
              const coverImg = Array.isArray(event.images) && event.images.length > 0
                ? event.images[0]
                : (event.image || defaultEvents[idx % 3].image);

              return (
                <div key={idx} className="slider-item">
                  <div className="event-card">
                    <div className="event-image">
                      <img
                        src={coverImg}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultEvents[idx % 3].image;
                        }}
                      />
                    </div>
                    <div className="event-body">
                      <h3 className="event-title">{event.title}</h3>
                      <div className="event-location">
                        <svg className="pin-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <span>{event.location || 'Kathmandu, Nepal'}</span>
                      </div>
                      <p className="event-desc">{event.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
