import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, Home, ChevronDown, ChevronRight, Image as ImageIcon, Award, Building2, Quote, Calendar, Briefcase, MessageSquare, Mail, Package, Film, Info, Flag, Layers, UserCheck } from 'lucide-react';

const homeSubTabs = ['hero-section', 'certifications', 'about-section', 'md-message', 'reviews', 'home-video'];
const aboutSubTabs = ['about-us', 'milestones'];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const isHomeSubTab = homeSubTabs.includes(activeTab);
  const isAboutSubTab = aboutSubTabs.includes(activeTab);

  const [homeOpen, setHomeOpen] = useState(isHomeSubTab);
  const [aboutOpen, setAboutOpen] = useState(isAboutSubTab);

  useEffect(() => {
    if (isHomeSubTab) setHomeOpen(true);
    if (isAboutSubTab) setAboutOpen(true);
  }, [activeTab]);

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Shield size={24} color="#c054c2" />
        <span className="sidebar-logo-text">MARUTI ADMIN</span>
      </div>

      <ul className="sidebar-menu">
        {/* Dashboard */}
        <li className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
        </li>

        {/* Products Main Menu */}
        <li className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('products');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
        </li>

        {/* Divisions Page Menu */}
        <li className={`menu-item ${activeTab === 'divisions-page' || activeTab === 'divisions' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('divisions-page');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Layers size={20} />
            <span>Divisions</span>
          </button>
        </li>

        {/* Departments Menu */}
        <li className={`menu-item ${activeTab === 'departments' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('departments');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Building2 size={20} />
            <span>Departments</span>
          </button>
        </li>

        {/* About Us Dropdown Menu */}
        <li className="menu-item">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Info size={20} />
              <span>About Us</span>
            </div>
            {aboutOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {aboutOpen && (
            <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li className={`menu-item ${activeTab === 'about-us' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('about-us')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Info size={16} />
                  <span>About Page Content</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'milestones' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('milestones')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Flag size={16} />
                  <span>Milestones</span>
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Home Section Dropdown */}
        <li className="menu-item">
          <button
            onClick={() => setHomeOpen(!homeOpen)}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Home size={20} />
              <span>Home Section</span>
            </div>
            {homeOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {homeOpen && (
            <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li className={`menu-item ${activeTab === 'hero-section' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('hero-section')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <ImageIcon size={16} />
                  <span>Hero Section</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'certifications' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('certifications')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Award size={16} />
                  <span>Certifications</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'about-section' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('about-section')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Building2 size={16} />
                  <span>About Section</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'md-message' || activeTab === 'mission-vision' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('md-message')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <UserCheck size={16} />
                  <span>MD's Message</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'reviews' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('reviews')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Quote size={16} />
                  <span>Client Reviews</span>
                </button>
              </li>

              <li className={`menu-item ${activeTab === 'home-video' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('home-video')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Film size={16} />
                  <span>Home Video</span>
                </button>
              </li>
            </ul>
          )}
        </li>

        {/* Standalone Events Menu Item */}
        <li className={`menu-item ${activeTab === 'events' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('events');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Calendar size={20} />
            <span>Events</span>
          </button>
        </li>

        {/* Careers */}
        <li className={`menu-item ${activeTab === 'careers' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('careers');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Briefcase size={20} />
            <span>Careers</span>
          </button>
        </li>

        {/* Contact Messages */}
        <li className={`menu-item ${activeTab === 'contact-messages' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('contact-messages');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <MessageSquare size={20} />
            <span>Contact Messages</span>
          </button>
        </li>

        {/* Newsletter Subscribers */}
        <li className={`menu-item ${activeTab === 'newsletter-subscribers' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('newsletter-subscribers');
              setHomeOpen(false);
              setAboutOpen(false);
            }}
          >
            <Mail size={20} />
            <span>Newsletter</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
