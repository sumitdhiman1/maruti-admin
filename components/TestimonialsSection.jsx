'use client';

import React, { useState, useEffect } from 'react';

const defaultTestimonials = [
  {
    clientName: 'Dr. Anil Sharma',
    clientDesignation: 'Chief Medical Officer, HealthCare Plus',
    reviewText: 'Maruti Pharma has consistently delivered high-quality products on time. Their commitment to excellence and compliance is truly commendable.',
    rating: 5,
    avatarUrl: '/assets/images/sample-image.jpg',
  },
  {
    clientName: 'Dr. Sunita Shrestha',
    clientDesignation: 'Senior Dermatologist, Apex Skin Hospital',
    reviewText: 'Their dermatology division products offer unmatched efficacy and patient safety. Outstanding quality and reliable formulation standards.',
    rating: 5,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
  },
  {
    clientName: 'Rajesh K. Verma',
    clientDesignation: 'Managing Director, Global Pharma Logistics',
    reviewText: 'A trusted healthcare partner in Nepal. Professional management, WHO-GMP certified manufacturing, and excellent customer support.',
    rating: 5,
    avatarUrl: '/assets/images/sample-image.jpg',
  },
];

export default function TestimonialsSection({ reviewsData: initialData }) {
  const [items, setItems] = useState(
    Array.isArray(initialData) && initialData.length > 0 ? initialData : defaultTestimonials
  );

  // Sync initial server data when props update
  useEffect(() => {
    if (Array.isArray(initialData) && initialData.length > 0) {
      setItems(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/reviews`);
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

    fetchLiveReviews();
  }, []);

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="sub-title">Testimonials</span>
          <h2 className="section-title">
            Client <span className="italic-purple">Reviews</span>
          </h2>
          <p className="section-description">
            Trusted by healthcare professionals and partners worldwide
          </p>
        </div>

        <div className="testimonials-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {items.map((review, idx) => (
            <div key={idx} className="testimonial-slide">
              <div className="testimonial-card">
                <div className="card-header-row">
                  <svg className="quote-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>

                  <div className="star-rating">
                    {[...Array(review.rating || 5)].map((_, i) => (
                      <svg key={i} className="star-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="testimonial-text">
                  "{review.reviewText}"
                </p>

                <div className="author-info">
                  <div className="author-avatar">
                    <img
                      src={review.avatarUrl || '/assets/images/sample-image.jpg'}
                      alt={review.clientName}
                      width="100"
                      height="100"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/sample-image.jpg';
                      }}
                    />
                  </div>
                  <div className="author-details">
                    <h4 className="author-name">{review.clientName}</h4>
                    <span className="author-title">{review.clientDesignation}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
