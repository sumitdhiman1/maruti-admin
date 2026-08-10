import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import HeroSection from './pages/HeroSection';
import Certifications from './pages/Certifications';
import AboutSectionPage from './pages/AboutSectionPage';
import HomeAboutSectionPage from './pages/HomeAboutSectionPage';
import DivisionsPageManager from './pages/DivisionsPageManager';
import MdMessageManager from './pages/MdMessageManager';
import ReviewsPage from './pages/ReviewsPage';
import EventsPage from './pages/EventsPage';
import ContactMessagesPage from './pages/ContactMessagesPage';
import NewsletterPage from './pages/NewsletterPage';
import CareersPage from './pages/CareersPage';
import DepartmentsPage from './pages/DepartmentsPage';
import VideoManagementPage from './pages/VideoManagementPage';
import MilestonesPage from './pages/MilestonesPage';
import DbDumpPage from './pages/DbDumpPage';
import WhatsAppSettingsPage from './pages/WhatsAppSettingsPage';
import SocialSettingsPage from './pages/SocialSettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProductBrandsPage from './pages/ProductBrandsPage';

const VALID_TABS = [
  'dashboard', 'products', 'product-brands', 'departments', 'about-us', 'milestones', 'divisions', 'divisions-page', 'hero-section', 'certifications', 'about-section',
  'md-message', 'mission-vision', 'reviews', 'events', 'careers',
  'contact-messages', 'newsletter-subscribers', 'home-video', 'whatsapp', 'social-links', 'dump-db'
];

const TAB_ALIASES = {
  'brands': 'product-brands',
  'product-brand': 'product-brands',
  'division': 'divisions-page',
  'divisions': 'divisions-page',
  'about': 'about-us',
  'contact': 'contact-messages',
  'newsletter': 'newsletter-subscribers',
  'video': 'home-video',
  'social': 'social-links',
};

const getTabFromURL = () => {
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const path = TAB_ALIASES[rawPath] || rawPath;
  if (path !== '' && path !== 'login' && VALID_TABS.includes(path)) {
    return path;
  }
  const saved = localStorage.getItem('maruti_admin_tab');
  const resolvedSaved = TAB_ALIASES[saved] || saved;
  if (resolvedSaved && VALID_TABS.includes(resolvedSaved)) {
    return resolvedSaved;
  }
  return 'dashboard';
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
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'product-brands' && <ProductBrandsPage />}
          {activeTab === 'hero-section' && <HeroSection />}
          {activeTab === 'certifications' && <Certifications />}
          {activeTab === 'about-section' && <HomeAboutSectionPage />}
          {activeTab === 'about-us' && <AboutSectionPage />}
          {(activeTab === 'divisions-page' || activeTab === 'divisions') && <DivisionsPageManager setActiveTab={changeTab} />}
          {activeTab === 'departments' && <DepartmentsPage />}
          {activeTab === 'milestones' && <MilestonesPage />}
          {(activeTab === 'md-message' || activeTab === 'mission-vision') && <MdMessageManager />}
          {activeTab === 'reviews' && <ReviewsPage />}
          {activeTab === 'events' && <EventsPage />}
          {activeTab === 'careers' && <CareersPage />}
          {activeTab === 'contact-messages' && <ContactMessagesPage />}
          {activeTab === 'newsletter-subscribers' && <NewsletterPage />}
          {activeTab === 'home-video' && <VideoManagementPage />}
          {activeTab === 'whatsapp' && <WhatsAppSettingsPage />}
          {activeTab === 'social-links' && <SocialSettingsPage />}
          {activeTab === 'dump-db' && <DbDumpPage />}
          {!VALID_TABS.includes(activeTab) && <NotFoundPage onGoDashboard={() => changeTab('dashboard')} />}
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
