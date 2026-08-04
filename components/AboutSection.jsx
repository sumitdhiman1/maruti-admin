'use client';

import React, { useState, useEffect } from 'react';

export default function AboutSection({ aboutData: initialData }) {
  const [data, setData] = useState(initialData || null);

  // Sync initial server data when props update
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchLiveAboutData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/about-section`);
        if (res.ok) {
          const json = await res.json();
          if (json && Object.keys(json).length > 0) {
            setData(json);
          }
        }
      } catch (err) {
        // Fallback silently
      }
    };

    fetchLiveAboutData();
  }, []);

  const imageUrl = data?.imageUrl || '/assets/images/about-img.jpeg';
  const subTitle = data?.tagline || data?.subTitle || 'About Maruti Pharma';
  const title = data?.title || 'Science. Quality.';
  const highlightWord = data?.highlightWord || 'Innovation.';
  const paragraph1 = data?.description1 || data?.paragraph1 || 'Maruti Pharma Pvt. Ltd. is a trusted pharmaceutical company committed to delivering high-quality, affordable healthcare solutions across Nepal. From our strong foundation in dermatology, we have expanded into multiple therapeutic specialties, driven by innovation, advanced manufacturing, and uncompromising quality standards.';
  const paragraph2 = data?.description2 || data?.paragraph2 || 'Every product we develop reflects our dedication to improving patient outcomes, supporting healthcare professionals, and building a healthier future through safe, effective, and reliable medicines.';

  const feature1Title = data?.feature1Title || 'Quality Medicines';
  const feature1Desc = data?.feature1Description || 'Delivering safe, effective, and WHO-GMP compliant medicines across diverse therapeutic segments.';
  const feature2Title = data?.feature2Title || 'Innovation Focused';
  const feature2Desc = data?.feature2Description || 'Developing advanced pharmaceutical solutions through continuous research and scientific excellence.';

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <img
              src={imageUrl}
              alt="Maruti Pharma Medical Team"
              className="about-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/about-img.jpeg';
              }}
            />
          </div>

          <div className="about-content">
            <span className="sub-title">{subTitle}</span>

            <h2 className="section-title">
              {title} <span className="italic-purple">{highlightWord}</span>
            </h2>

            <p className="description-paragraph">{paragraph1}</p>

            <p className="description-paragraph">{paragraph2}</p>

            <div className="about-features-grid">
              <div className="about-feature-item">
                <div className="about-feature-icon-badge">
                  <svg className="about-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                    <path d="m8.5 8.5 7 7"></path>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <h3 className="about-feature-title">{feature1Title}</h3>
                  <p className="about-feature-desc">{feature1Desc}</p>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-feature-icon-badge">
                  <svg className="about-feature-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                    <path d="M9 18h6"></path>
                    <path d="M10 22h4"></path>
                  </svg>
                </div>
                <div className="about-feature-text">
                  <h3 className="about-feature-title">{feature2Title}</h3>
                  <p className="about-feature-desc">{feature2Desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
