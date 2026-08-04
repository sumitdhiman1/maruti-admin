'use client';

import React, { useState, useEffect } from 'react';

export default function MissionVisionSection({ mvData: initialData }) {
  const [data, setData] = useState(initialData || null);

  // Sync initial server data when props update
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  // Fetch fresh live database data on component mount (client-side)
  useEffect(() => {
    const fetchLiveMVData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/mission-vision`);
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

    fetchLiveMVData();
  }, []);

  const missionText1 = data?.missionText1 || 'To deliver high-quality, safe, and effective pharmaceutical products that improve health outcomes and are accessible to people across Nepal and international markets.';
  const missionText2 = data?.missionText2 || 'We are committed to expanding healthcare accessibility through innovation, excellence, and a strong focus on quality.';
  const visionText = data?.visionText || 'To become a leading pharmaceutical company in Nepal by providing high-quality, affordable, and innovative healthcare solutions.';

  const bulletPoints = Array.isArray(data?.visionBulletPoints) && data.visionBulletPoints.length > 0
    ? data.visionBulletPoints
    : [
        'Build a focused, technology-driven organisation with strong R&D.',
        'Establish as a leading finished dosage manufacturer in Asia.',
        'Expand as a trusted global healthcare partner.',
        'Continuously contribute to healthcare advancement.',
      ];

  return (
    <section className="mission-vision-section">
      <div className="container">
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon-badge">
              <img
                src="/assets/images/aim-arrow-icon.png"
                alt="Our Mission"
                width="100"
                height="100"
              />
            </div>
            <div className="mv-content">
              <h3 className="mv-title">
                Our <span className="italic-text">Mission</span>
              </h3>
              <p className="mv-text">{missionText1}</p>
              <p className="mv-text">{missionText2}</p>
            </div>
          </div>

          <div className="mv-card">
            <div className="mv-icon-badge">
              <img
                src="/assets/images/eye-icon.png"
                alt="Our Vision"
                width="100"
                height="100"
              />
            </div>
            <div className="mv-content">
              <h3 className="mv-title">
                Our <span className="italic-text">Vision</span>
              </h3>
              <p className="mv-text">{visionText}</p>
              <ul className="mv-bullet-list">
                {bulletPoints.map((pt, idx) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
