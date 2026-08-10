import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Share2,
  Save,
  CheckCircle,
  Globe,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Twitter,
} from 'lucide-react';

const SocialSettingsPage = () => {
  const [formData, setFormData] = useState({
    facebookUrl: 'https://facebook.com',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    twitterUrl: 'https://twitter.com',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social-settings');
      if (res.data) {
        setFormData({
          facebookUrl: res.data.facebookUrl || 'https://facebook.com',
          linkedinUrl: res.data.linkedinUrl || 'https://linkedin.com',
          instagramUrl: res.data.instagramUrl || 'https://instagram.com',
          youtubeUrl: res.data.youtubeUrl || 'https://youtube.com',
          twitterUrl: res.data.twitterUrl || 'https://twitter.com',
        });
      }
    } catch (err) {
      console.warn('Failed to load social settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/social-settings', formData);
      showToast('Social Media links updated successfully! 🎉');
    } catch (error) {
      alert('Failed to save settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Toast Notification */}
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Website footer links updated live.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#9e4895', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Share2 size={16} /> Footer Social Links Configuration
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Social Media Links Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Control social media profile URLs displayed in the website footer.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#9e4895" /> Social Profile URLs
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Facebook Field */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Facebook size={18} color="#1877F2" /> Facebook Page URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                className="form-control"
                placeholder="https://facebook.com/marutipharma"
                value={formData.facebookUrl}
                onChange={handleChange}
                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
              />
            </div>

            {/* LinkedIn Field */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Linkedin size={18} color="#0A66C2" /> LinkedIn Company Page URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                className="form-control"
                placeholder="https://linkedin.com/company/marutipharma"
                value={formData.linkedinUrl}
                onChange={handleChange}
                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
              />
            </div>

            {/* Instagram Field */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Instagram size={18} color="#E4405F" /> Instagram Profile URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                className="form-control"
                placeholder="https://instagram.com/marutipharma"
                value={formData.instagramUrl}
                onChange={handleChange}
                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
              />
            </div>

            {/* YouTube Field */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Youtube size={18} color="#FF0000" /> YouTube Channel URL
              </label>
              <input
                type="url"
                name="youtubeUrl"
                className="form-control"
                placeholder="https://youtube.com/@marutipharma"
                value={formData.youtubeUrl}
                onChange={handleChange}
                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
              />
            </div>

            {/* Twitter/X Field */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Twitter size={18} color="#1DA1F2" /> Twitter / X Profile URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                className="form-control"
                placeholder="https://twitter.com/marutipharma"
                value={formData.twitterUrl}
                onChange={handleChange}
                style={{ fontSize: '0.95rem', padding: '12px 16px' }}
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Save size={18} /> {saving ? 'Saving Links...' : 'Save Social Media Links'}
            </button>
          </form>
        </div>

        {/* Live Preview Card */}
        <div>
          <div className="card" style={{ padding: '24px', background: '#0a121e', color: '#ffffff', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#c054c2', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Website Footer Live Links
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
              These social icons are rendered in the footer of all public website pages.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.facebookUrl && (
                <a
                  href={formData.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(24, 119, 242, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Facebook size={16} color="#1877F2" /> Facebook
                  </span>
                  <ExternalLink size={14} color="#94a3b8" />
                </a>
              )}

              {formData.linkedinUrl && (
                <a
                  href={formData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(10, 102, 194, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Linkedin size={16} color="#0A66C2" /> LinkedIn
                  </span>
                  <ExternalLink size={14} color="#94a3b8" />
                </a>
              )}

              {formData.instagramUrl && (
                <a
                  href={formData.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(228, 64, 95, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Instagram size={16} color="#E4405F" /> Instagram
                  </span>
                  <ExternalLink size={14} color="#94a3b8" />
                </a>
              )}

              {formData.youtubeUrl && (
                <a
                  href={formData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255, 0, 0, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Youtube size={16} color="#FF0000" /> YouTube
                  </span>
                  <ExternalLink size={14} color="#94a3b8" />
                </a>
              )}

              {formData.twitterUrl && (
                <a
                  href={formData.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(29, 161, 242, 0.15)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Twitter size={16} color="#1DA1F2" /> Twitter / X
                  </span>
                  <ExternalLink size={14} color="#94a3b8" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSettingsPage;
