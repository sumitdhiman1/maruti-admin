'use client';

import React from 'react';

export default function VideoSection() {
  return (
    <section className="fullwidth-video-section">
      <iframe
        src="https://player.vimeo.com/video/131188216?api=1"
        width="500"
        height="281"
        frameBorder="0"
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Maruti Pharma Overview"
      ></iframe>
    </section>
  );
}
