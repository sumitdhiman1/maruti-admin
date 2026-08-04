import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HeroSection from './pages/HeroSection';
import Certifications from './pages/Certifications';
import AboutSectionPage from './pages/AboutSectionPage';
import DivisionsPage from './pages/DivisionsPage';
import MissionVisionPage from './pages/MissionVisionPage';
import ReviewsPage from './pages/ReviewsPage';
import EventsPage from './pages/EventsPage';

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reviews');

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'hero-section' && <HeroSection />}
          {activeTab === 'certifications' && <Certifications />}
          {activeTab === 'about-section' && <AboutSectionPage />}
          {activeTab === 'divisions' && <DivisionsPage />}
          {activeTab === 'mission-vision' && <MissionVisionPage />}
          {activeTab === 'reviews' && <ReviewsPage />}
          {activeTab === 'events' && <EventsPage />}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
