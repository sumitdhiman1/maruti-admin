import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { Image, Calendar, Sparkles, Star, Cloud } from 'lucide-react';

const Dashboard = () => {
  const [heroBanners, setHeroBanners] = useState([]);
  const [activeHero, setActiveHero] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [bannersRes, activeRes] = await Promise.all([
        api.get('/hero-banners'),
        api.get('/hero-banners/active'),
      ]);
      setHeroBanners(bannersRes.data);
      setActiveHero(activeRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading dashboard analytics...</div>;
  }

  const festivalEvents = heroBanners.filter((b) => b.bannerType === 'FestivalEvent');
  const defaultBanner = heroBanners.find((b) => b.isDefault);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f' }}>
          Maruti Admin Portal Dashboard
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Overview of active dynamic Hero Section, scheduled festival banners, and Cloudinary media status.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Hero Banners"
          value={heroBanners.length}
          icon={Image}
        />
        <StatCard
          title="Scheduled Festival Events"
          value={festivalEvents.length}
          icon={Calendar}
          colorClass="purple"
        />
        <StatCard
          title="Default Main Hero Set"
          value={defaultBanner ? 'Yes' : 'No'}
          icon={Star}
          colorClass="green"
        />
        <StatCard
          title="Media Provider"
          value="Cloudinary"
          icon={Cloud}
          colorClass="purple"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Active Live Banner Status Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#c054c2" /> Currently Active Web Banner
            </h3>
          </div>

          {activeHero?.banner ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: '#faf5fa', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <img
                src={activeHero.banner.imageUrl}
                alt="Active Banner"
                style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #c054c2' }}
              />
              <div>
                <span className="badge badge-active" style={{ background: '#c054c2', color: 'white', marginBottom: '4px' }}>
                  {activeHero.source === 'event' ? `🎉 ${activeHero.banner.eventName}` : '⭐ Main Default Hero'}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0a192f', marginTop: '4px' }}>
                  {activeHero.banner.eventName || activeHero.banner.title || 'Dynamic Hero Banner'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {activeHero.banner.subtitle || 'Active on public site'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>
              No banner active. Configure in Home Section ➔ Hero Section.
            </div>
          )}
        </div>

        {/* Scheduled Events Quick List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#c054c2" /> Scheduled Festival Events
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {festivalEvents.length > 0 ? (
              festivalEvents.map((event) => (
                <div
                  key={event.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={event.imageUrl} alt={event.eventName} style={{ width: '40px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{event.eventName}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#c054c2' }}>
                    {event.startDate} ➔ {event.endDate}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>
                No scheduled festival events.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
