import React, { useState, useEffect } from 'react';
import api from '../services/api';
import HeroModal from '../components/HeroModal';
import { Sparkles, Plus, Calendar, Trash2, Edit3, Cloud, ArrowRight, CheckCircle } from 'lucide-react';

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
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0e0714, #260e36)',
            color: '#ffffff',
            border: '2px solid #c054c2',
            padding: '14px 22px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CheckCircle size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Hero Section data updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Home Section ➔ Hero Section
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Main Hero Section & Festival Events
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage the main hero banner content, Cloudinary media, and scheduled festival event banners (Diwali, Holi, etc.).
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { setEditingBanner(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Festival Event Banner
        </button>
      </div>

      {/* MAIN HERO SECTION CARD WITH LIVE PREVIEW & EDIT BUTTON */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#c054c2" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>MAIN HERO SECTION (Active Preview)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
              {activeBannerInfo?.source === 'event' ? `🎉 Active Event: ${activeBannerInfo.banner.eventName}` : '⭐ Main Hero Active'}
            </span>
            {defaultBanner && (
              <button
                className="btn btn-primary btn-sm"
                style={{ background: '#ffffff', color: '#8d348f', fontWeight: 700 }}
                onClick={() => { setEditingBanner(defaultBanner); setIsModalOpen(true); }}
              >
                <Edit3 size={14} /> Edit Main Hero Data
              </button>
            )}
          </div>
        </div>

        {livePreview ? (
          <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem', alignItems: 'center' }}>
            {/* Left Hero Content */}
            <div style={{ border: '2px solid #0099ff', padding: '1.5rem', borderRadius: '12px', background: '#ffffff' }}>
              {livePreview.badgeText && (
                <div style={{ display: 'inline-block', border: '1px solid #c054c2', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', color: '#c054c2', fontWeight: 700, marginBottom: '1.25rem' }}>
                  {livePreview.badgeText}
                </div>
              )}

              {livePreview.title && (
                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.15, marginBottom: '1rem', fontFamily: 'serif' }}>
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
                src={livePreview.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&auto=format&fit=crop&q=80'}
                alt="Hero Preview"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1000&auto=format&fit=crop&q=80';
                }}
                style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '16px' }}
              />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(14, 7, 20, 0.85)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={14} color="#c054c2" /> Cloudinary Media Active
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No main hero banner configured. Click "Edit Main Hero Data" or "Add Festival Event Banner" to create content.
          </div>
        )}
      </div>

      {/* FESTIVAL & SCHEDULED EVENTS SECTION (Diwali, Holi with Date Ranges) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#c054c2" /> Festival & Seasonal Event Banners
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Event banners automatically activate on the website during their specified Start & End Date ranges (e.g. Diwali, Holi). No text required!
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Event Image</th>
                <th>Event Name</th>
                <th>Scheduled Date Range</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading festival events...
                  </td>
                </tr>
              ) : festivalEvents.length > 0 ? (
                festivalEvents.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imageUrl}
                        alt={item.eventName}
                        style={{ width: '90px', height: '54px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {item.eventName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Festival Event Banner
                      </div>
                    </td>
                    <td>
                      {item.startDate && item.endDate ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#c054c2' }}>
                          <Calendar size={14} /> {item.startDate} ➔ {item.endDate}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Always Active</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-icon-action btn-icon-edit" onClick={() => { setEditingBanner(item); setIsModalOpen(true); }} title="Edit Banner">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-icon-action btn-icon-delete" onClick={() => handleDelete(item.id)} title="Delete Banner">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No festival event banners created yet. Click "Add Festival Event Banner" to schedule an event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
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
