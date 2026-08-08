import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, Home, ChevronDown, ChevronRight, Image as ImageIcon, Award, Building2, Layers, Compass, Quote, Calendar, Briefcase, MessageSquare, Mail, Package } from 'lucide-react';

const homeSubTabs = ['hero-section', 'certifications', 'about-section', 'mission-vision', 'reviews'];

const Sidebar = ({ activeTab, setActiveTab }) => {
  const isHomeSubTab = homeSubTabs.includes(activeTab);
  const [homeOpen, setHomeOpen] = useState(isHomeSubTab);

  // Auto-collapse Home Section dropdown when selecting menu items outside Home Section
  useEffect(() => {
    if (isHomeSubTab) {
      setHomeOpen(true);
    } else {
      setHomeOpen(false);
    }
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
            }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>
        </li>

        {/* Products Main Menu */}
        <li className={`menu-item ${activeTab === 'products' || activeTab === 'divisions' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('products');
              setHomeOpen(false);
            }}
          >
            <Package size={20} />
            <span>Products</span>
          </button>
        </li>

        {/* Departments Menu */}
        <li className={`menu-item ${activeTab === 'departments' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('departments');
              setHomeOpen(false);
            }}
          >
            <Building2 size={20} />
            <span>Departments</span>
          </button>
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

              <li className={`menu-item ${activeTab === 'mission-vision' ? 'active' : ''}`}>
                <button
                  onClick={() => setActiveTab('mission-vision')}
                  style={{ padding: '8px 12px', fontSize: '0.88rem' }}
                >
                  <Compass size={16} />
                  <span>Mission & Vision</span>
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
            </ul>
          )}
        </li>

        {/* Standalone Events Menu Item (Outside Home Section) */}
        <li className={`menu-item ${activeTab === 'events' ? 'active' : ''}`}>
          <button
            onClick={() => {
              setActiveTab('events');
              setHomeOpen(false);
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
