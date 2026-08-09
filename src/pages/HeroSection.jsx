import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HeroModal from '../components/HeroModal';
import { Sparkles, Plus, Calendar, Trash2, Edit3, Cloud, ArrowRight, CheckCircle, PartyPopper } from 'lucide-react';

const HeroSection = () => {
  const [banners, setBanners] = useState([]);
  const [activeBannerInfo, setActiveBannerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchBanners();
    fetchActiveHero();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hero-banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching hero banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveHero = async () => {
    try {
      const response = await api.get('/hero-banners/active');
      setActiveBannerInfo(response.data);
    } catch (error) {
      console.error('Error fetching active hero banner:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingBanner) {
        await api.put(`/hero-banners/${editingBanner.id}`, formData);
        showToast('Hero banner updated successfully! 🎉');
      } else {
        await api.post('/hero-banners', formData);
        showToast('New hero banner created successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingBanner(null);
      fetchBanners();
      fetchActiveHero();
    } catch (error) {
      alert('Failed to save hero banner: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this festival / event banner?')) {
      try {
        await api.delete(`/hero-banners/${id}`);
        showToast('Hero banner deleted successfully! 🗑️');
        fetchBanners();
        fetchActiveHero();
      } catch (error) {
        alert('Failed to delete hero banner');
      }
    }
  };

  const defaultBanner = banners.find((b) => b.isDefault || b.bannerType === 'DefaultHero') || banners[0];
  const festivalEvents = banners.filter((b) => b.bannerType === 'FestivalEvent');

  // Currently live banner to show in Live Preview card
  const livePreview = activeBannerInfo?.banner || defaultBanner;

  return (
    <div>
      {/* Floating Success Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
            background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff',
            border: '2px solid #c054c2', padding: '14px 22px', borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}
        >
          <CheckCircle size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Hero Section data updated cleanly.</div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Home Section ➔ Hero Section
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Main Hero Section &amp; Festival Banners
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage the main hero banner content, Cloudinary media, and scheduled festival event banners (Diwali, Dashain, Tihar, etc.).
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { setEditingBanner(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Festival Event Banner
        </button>
      </div>

      {/* MAIN HERO SECTION CARD WITH LIVE PREVIEW & EDIT POPUP BUTTON */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="#c054c2" />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>MAIN HERO SECTION (Active Preview)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-active" style={{ background: '#c054c2', color: 'white', padding: '6px 14px', borderRadius: '20px' }}>
              {activeBannerInfo?.source === 'event' ? `🎉 Active Event: ${activeBannerInfo.banner.eventName}` : '⭐ Main Hero Active'}
            </span>
            {defaultBanner && (
              <button
                className="btn btn-primary btn-sm"
                style={{ background: '#ffffff', color: '#8d348f', fontWeight: 700, padding: '8px 16px' }}
                onClick={() => { setEditingBanner(defaultBanner); setIsModalOpen(true); }}
              >
                <Edit3 size={16} /> Edit Main Hero Data (Popup)
              </button>
            )}
          </div>
        </div>

        {livePreview ? (
          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left Hero Content */}
            <div style={{ border: '2px solid #0099ff', padding: '1.5rem', borderRadius: '14px', background: '#ffffff' }}>
              {livePreview.badgeText && (
                <div style={{ display: 'inline-block', border: '1px solid #c054c2', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', color: '#c054c2', fontWeight: 700, marginBottom: '1.25rem' }}>
                  {livePreview.badgeText}
                </div>
              )}

              {livePreview.title && (
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.15, marginBottom: '1rem' }}>
                  <span style={{ color: '#c054c2', fontStyle: 'italic' }}>
                    {livePreview.title.split(' ')[0]}
                  </span>{' '}
                  {livePreview.title.split(' ').slice(1).join(' ')}
                </h1>
              )}

              {livePreview.subtitle && (
                <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {livePreview.subtitle}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {livePreview.primaryBtnText && (
                  <button className="btn btn-primary">
                    {livePreview.primaryBtnText} <ArrowRight size={16} />
                  </button>
                )}
                {livePreview.secondaryBtnText && (
                  <button className="btn" style={{ borderRadius: '9999px', border: '1px solid #cbd5e1', background: 'transparent', padding: '10px 20px', color: '#0f172a', fontWeight: 600 }}>
                    {livePreview.secondaryBtnText} <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Right Hero Image */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
              <img
                src={livePreview.imageUrl || '/assets/images/banner-3.png'}
                alt="Hero Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/assets/images/banner-3.png';
                }}
                style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(14, 7, 20, 0.85)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={14} color="#c054c2" /> Cloudinary Media Active
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No main hero banner configured. Click "Edit Main Hero Data (Popup)" to configure.
          </div>
        )}
      </div>

      {/* FESTIVAL & SCHEDULED EVENTS SECTION - REDESIGNED BEAUTIFUL GRID LISTING */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <PartyPopper size={22} color="#c054c2" /> Scheduled Festival &amp; Seasonal Event Banners
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Scheduled banners automatically activate on the public website during their configured start and end date ranges.
            </p>
          </div>

          <button className="btn btn-primary" onClick={() => { setEditingBanner(null); setIsModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Festival Banner
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading festival banners...
          </div>
        ) : festivalEvents.length === 0 ? (
          <div style={{ background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
            <PartyPopper size={40} color="#c054c2" style={{ marginBottom: '12px' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>No Festival Banners Scheduled</div>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px', maxWidth: '460px', margin: '4px auto 16px' }}>
              Schedule festival event banners (Diwali, Dashain, Holi, New Year) to automatically take over the hero banner on specific dates.
            </p>
            <button className="btn btn-primary" onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}>
              <Plus size={16} /> Create Festival Event Banner
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {festivalEvents.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Banner Thumbnail */}
                <div style={{ position: 'relative', height: '160px', background: '#f1f5f9' }}>
                  <img
                    src={item.imageUrl || '/assets/images/banner-3.png'}
                    alt={item.eventName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/banner-3.png';
                    }}
                  />
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '4px 12px', borderRadius: '20px', fontWeight: 700 }}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Banner Details */}
                <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      {item.eventName || 'Unnamed Festival Event'}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#c054c2', fontWeight: 700, background: '#faf5ff', padding: '6px 12px', borderRadius: '10px', width: 'fit-content', marginBottom: '12px' }}>
                      <Calendar size={14} />
                      {item.startDate && item.endDate ? (
                        <span>{item.startDate} ➔ {item.endDate}</span>
                      ) : (
                        <span>Always Scheduled</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '12px', justifyContent: 'flex-end' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => { setEditingBanner(item); setIsModalOpen(true); }}
                      style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Edit3 size={14} /> Edit Popup
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(item.id)}
                      style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Dialog Popup */}
      <HeroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        banner={editingBanner}
      />
    </div>
  );
};

export default HeroSection;
