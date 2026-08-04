import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import DivisionsSection from '@/components/DivisionsSection';
import VideoSection from '@/components/VideoSection';
import MissionVisionSection from '@/components/MissionVisionSection';
import TimelineSection from '@/components/TimelineSection';
import EventsSection from '@/components/EventsSection';
import CareerCtaSection from '@/components/CareerCtaSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import { fetchApiData } from '@/lib/api';

export default async function Home() {
  // Fetch dynamic sections from backend API (with graceful fallback defaults)
  const [heroData, certsData, aboutData, divisionsData, mvData, eventsData, reviewsData] =
    await Promise.all([
      fetchApiData('/hero-banners'),
      fetchApiData('/certifications'),
      fetchApiData('/about-section'),
      fetchApiData('/divisions'),
      fetchApiData('/mission-vision'),
      fetchApiData('/events-gallery'),
      fetchApiData('/reviews'),
    ]);

  return (
    <>
      <Header />
      <main>
        <HeroSection heroData={heroData} />
        <FeaturesSection certsData={certsData} />
        <AboutSection aboutData={aboutData} />
        <DivisionsSection divisionsData={divisionsData} />
        <VideoSection />
        <MissionVisionSection mvData={mvData} />
        <TimelineSection />
        <EventsSection eventsData={eventsData} />
        <CareerCtaSection />
        <TestimonialsSection reviewsData={reviewsData} />
      </main>
      <NewsletterSection />
      <Footer />
    </>
  );
}
