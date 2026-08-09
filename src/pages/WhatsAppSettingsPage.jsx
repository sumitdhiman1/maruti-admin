import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  MessageCircle,
  Save,
  CheckCircle,
  Phone,
  MessageSquare,
  Power,
  ExternalLink,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

const WhatsAppSettingsPage = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '9779800000000',
    welcomeMessage: 'Hello Maruti Pharma! I would like to inquire about your products and services.',
    position: 'bottom-right',
    isActive: true,
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
      const res = await api.get('/whatsapp-setting');
      if (res.data) {
        setFormData({
          phoneNumber: res.data.phoneNumber || '9779800000000',
          welcomeMessage: res.data.welcomeMessage || 'Hello Maruti Pharma!',
          position: res.data.position || 'bottom-right',
          isActive: res.data.isActive !== undefined ? res.data.isActive : true,
        });
      }
    } catch (err) {
      console.warn('Failed to load WhatsApp settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/whatsapp-setting', formData);
      showToast('WhatsApp Settings saved successfully! 🎉');
    } catch (error) {
      alert('Failed to save settings: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  // Clean phone digits for WhatsApp URL
  const cleanDigits = (formData.phoneNumber || '').replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(formData.welcomeMessage || '');
  const testWhatsAppUrl = cleanDigits ? `https://wa.me/${cleanDigits}?text=${encodedMsg}` : '#';

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
            background: 'linear-gradient(135deg, #0e0714, #123c1e)',
            color: '#ffffff',
            border: '2px solid #25D366',
            padding: '14px 22px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CheckCircle size={24} color="#25D366" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live frontend widget updated instantly.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#25D366', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageCircle size={16} /> Live Instant Chat Integration
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            WhatsApp Floating Widget Configuration
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Configure the floating WhatsApp instant chat button for your public website visitors.
          </p>
        </div>

        {cleanDigits && (
          <a
            href={testWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: '#25D366',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              padding: '12px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
            }}
          >
            <MessageCircle size={18} /> Test WhatsApp Link <ExternalLink size={14} />
          </a>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Settings Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#25D366" /> Widget Settings
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Active Toggle Switch */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px 20px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Power size={16} color={formData.isActive ? '#25D366' : '#94a3b8'} />
                  Enable WhatsApp Widget on Website
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                  When enabled, floating WhatsApp button will be shown on all public pages.
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: formData.isActive ? '#25D366' : '#cbd5e1',
                    borderRadius: '34px',
                    transition: '0.3s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      content: '""',
                      height: '18px',
                      width: '18px',
                      left: formData.isActive ? '26px' : '4px',
                      bottom: '4px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: '0.3s',
                    }}
                  />
                </span>
              </label>
            </div>

            {/* Phone Number Field */}
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} color="#25D366" /> WhatsApp Phone Number (with Country Code) *
              </label>
              <input
                type="text"
                name="phoneNumber"
                required
                className="form-control"
                placeholder="e.g. 9779800000000 or +977-9800000000"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{ fontSize: '1rem', padding: '12px 16px' }}
              />
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Enter number with country code (e.g. <strong>9779800000000</strong> for Nepal or <strong>919876543210</strong> for India).
              </div>
            </div>

            {/* Default Message Field */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={16} color="#25D366" /> Pre-filled Welcome Message *
              </label>
              <textarea
                name="welcomeMessage"
                rows={4}
                required
                className="form-control"
                placeholder="e.g. Hello Maruti Pharma! I would like to inquire about your products."
                value={formData.welcomeMessage}
                onChange={handleChange}
                style={{ lineHeight: 1.5, fontSize: '0.92rem' }}
              />
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                This pre-written message will automatically populate when a customer opens the WhatsApp chat.
              </div>
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
                background: '#25D366',
                borderColor: '#25D366',
              }}
            >
              <Save size={18} /> {saving ? 'Saving Settings...' : 'Save WhatsApp Configuration'}
            </button>
          </form>
        </div>

        {/* Live Widget Preview Card */}
        <div>
          <div className="card" style={{ padding: '24px', background: '#0a121e', color: '#ffffff', borderRadius: '18px', border: '1px solid #1e293b' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#25D366', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} /> Live Widget Preview
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
              This floating chat badge appears fixed at the bottom right corner of all public pages.
            </p>

            {/* Mock Floating Badge */}
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '20px', textAlign: 'center', border: '1px solid #334155', position: 'relative' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#ffffff',
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                }}
              >
                <MessageCircle size={32} />
              </div>

              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>
                Chat with Maruti Pharma
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: 700, marginTop: '2px' }}>
                {formData.isActive ? '● Online & Active' : '○ Widget Disabled'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '8px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                +{cleanDigits || '9779800000000'}
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '14px', borderRadius: '10px', background: 'rgba(37, 211, 102, 0.1)', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4ade80', marginBottom: '4px' }}>Pre-filled Message Preview:</div>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.4 }}>
                "{formData.welcomeMessage || 'Hello Maruti Pharma!'}"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppSettingsPage;
