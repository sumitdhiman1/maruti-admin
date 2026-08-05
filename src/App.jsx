import React, { useState, useEffect } from 'react';
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
import ContactMessagesPage from './pages/ContactMessagesPage';
import NewsletterPage from './pages/NewsletterPage';

const VALID_TABS = [
  'dashboard', 'hero-section', 'certifications', 'about-section',
  'divisions', 'mission-vision', 'reviews', 'events',
  'contact-messages', 'newsletter-subscribers'
];

const getTabFromURL = () => {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path === '' || path === 'login') {
    return localStorage.getItem('maruti_admin_tab') || 'dashboard';
  }
  if (VALID_TABS.includes(path)) {
    return path;
  }
  return localStorage.getItem('maruti_admin_tab') || 'dashboard';
};

const MainLayout = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTabState] = useState(() => getTabFromURL());

  const changeTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem('maruti_admin_tab', tab);
    const targetPath = tab === 'dashboard' ? '/' : `/${tab}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromURL();
      setActiveTabState(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user) {
      const currentTab = getTabFromURL();
      setActiveTabState(currentTab);
      localStorage.setItem('maruti_admin_tab', currentTab);
      const targetPath = currentTab === 'dashboard' ? '/' : `/${currentTab}`;
      if (window.location.pathname !== targetPath && window.location.pathname !== '/login') {
        window.history.replaceState(null, '', targetPath);
      }
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={changeTab} />
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
          {activeTab === 'contact-messages' && <ContactMessagesPage />}
          {activeTab === 'newsletter-subscribers' && <NewsletterPage />}
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
