import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploadField from '../components/ImageUploadField';
import { UserCheck, Save, RotateCcw, CheckCircle, Eye, EyeOff, Sparkles, MessageSquare } from 'lucide-react';

const MdMessageManager = () => {
  const [mdData, setMdData] = useState({
    subhead: 'Leadership',
    title: "MD's Message",
    paragraph1: '"When we founded Maruti Pharma in 2009, our vision was clear — to make high-quality, affordable healthcare accessible to every Nepali. We started with dermatology, driven by a simple observation: people were suffering from treatable conditions because quality medicines were either unavailable or out of reach.',
    paragraph2: 'Over fifteen years, that conviction has only deepened. Today, across our three divisions — Derma, Ezera, and Elixir — we manufacture over 500 products that touch millions of lives. Every product we release carries the weight of our WHO-GMP and ISO 9001:2015 certifications, and more importantly, the trust of the healthcare professionals who recommend them.',
    paragraph3: 'Our journey has been one of continuous learning and relentless improvement. I am immensely proud of our team, our partners, and the communities we serve. As we look ahead, we remain committed to innovation, scientific rigour, and the unwavering belief that a healthier Nepal is within reach."',
    authorName: 'Mr. [MD Name]',
    authorDesignation: 'Managing Director, Maruti Pharma Pvt. Ltd.',
    authorImage: '',
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
    fetchMdSettings();
  }, []);

  const fetchMdSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/md-message');
      if (res.data) {
        setMdData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error("Error fetching MD's Message settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/md-message', mdData);
      setMdData(res.data);
      showToast("MD's Message updated successfully! 👨‍💼");
    } catch (err) {
      alert('Failed to update MD message settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset MD's Message to default initial text?")) {
      try {
        setSaving(true);
        const res = await api.post('/md-message/reset');
        setMdData(res.data);
        showToast("MD's Message reset to default! 🔄");
      } catch (err) {
        alert('Failed to reset message settings');
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff',
          border: '2px solid #c054c2', padding: '14px 22px', borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <CheckCircle size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live home page updated.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Home Section Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            MD's Message Section Settings
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleReset} title="Reset to standard default text" disabled={saving}>
            <RotateCcw size={16} /> Reset Default
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Form Controls */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={20} color="#c054c2" /> Content Configuration
            </h3>
          </div>

          <form onSubmit={handleSave}>
            {/* Status Toggle */}
            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Section Visibility</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Show or hide MD's Message section on home page</div>
              </div>

              <button
                type="button"
                onClick={() => setMdData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`btn ${mdData.isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {mdData.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                {mdData.isActive ? 'Active on Website' : 'Hidden'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Subhead</label>
                <input
                  className="form-control"
                  value={mdData.subhead || ''}
                  onChange={e => setMdData({ ...mdData, subhead: e.target.value })}
                  placeholder="e.g. Leadership"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Section Title</label>
                <input
                  className="form-control"
                  value={mdData.title || ''}
                  onChange={e => setMdData({ ...mdData, title: e.target.value })}
                  placeholder="e.g. MD's Message"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Paragraph 1 *</label>
              <textarea
                className="form-control"
                rows={3}
                value={mdData.paragraph1 || ''}
                onChange={e => setMdData({ ...mdData, paragraph1: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paragraph 2</label>
              <textarea
                className="form-control"
                rows={3}
                value={mdData.paragraph2 || ''}
                onChange={e => setMdData({ ...mdData, paragraph2: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Paragraph 3</label>
              <textarea
                className="form-control"
                rows={3}
                value={mdData.paragraph3 || ''}
                onChange={e => setMdData({ ...mdData, paragraph3: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  className="form-control"
                  value={mdData.authorName || ''}
                  onChange={e => setMdData({ ...mdData, authorName: e.target.value })}
                  placeholder="e.g. Mr. [MD Name]"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author Designation</label>
                <input
                  className="form-control"
                  value={mdData.authorDesignation || ''}
                  onChange={e => setMdData({ ...mdData, authorDesignation: e.target.value })}
                  placeholder="e.g. Managing Director, Maruti Pharma Pvt. Ltd."
                />
              </div>
            </div>

            <ImageUploadField
              label="Author Signature / Photo (Optional Cloudinary Upload)"
              value={mdData.authorImage || ''}
              onChange={(url) => setMdData(prev => ({ ...prev, authorImage: url || '' }))}
              placeholder="Drag & Drop Author Photo or Signature Image"
            />

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : "Save MD's Message Settings"}
            </button>
          </form>
        </div>

        {/* Right Column: Live Website Preview matching index.html */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="#c054c2" /> Live Preview
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Index.html Match</span>
          </div>

          <div style={{
            background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px',
            padding: '2rem 1.5rem', textAlign: 'center', flexGrow: 1, boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
              {mdData.subhead || 'Leadership'}
            </div>
            
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#000000', marginBottom: '24px' }}>
              {mdData.title ? (
                mdData.title.includes('Message') ? (
                  <>
                    {mdData.title.replace('Message', '')} <span style={{ color: '#c054c2', fontStyle: 'italic' }}>Message</span>
                  </>
                ) : (
                  mdData.title
                )
              ) : (
                <>MD's <span style={{ color: '#c054c2', fontStyle: 'italic' }}>Message</span></>
              )}
            </h3>

            <div style={{ fontSize: '0.92rem', lineHeight: 1.7, color: '#475569', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mdData.paragraph1 && <p style={{ margin: 0 }}>{mdData.paragraph1}</p>}
              {mdData.paragraph2 && <p style={{ margin: 0 }}>{mdData.paragraph2}</p>}
              {mdData.paragraph3 && <p style={{ margin: 0 }}>{mdData.paragraph3}</p>}
            </div>

            <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {mdData.authorImage && (
                <img
                  src={mdData.authorImage}
                  alt={mdData.authorName}
                  style={{ maxHeight: '60px', marginBottom: '12px', objectFit: 'contain' }}
                />
              )}

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#000000', margin: '0 0 8px 0' }}>
                {mdData.authorName || 'Mr. [MD Name]'}
              </h4>

              <div style={{ width: '280px', maxWidth: '100%', height: '1px', background: '#f2e9f1', marginBottom: '8px' }}></div>

              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>
                {mdData.authorDesignation || 'Managing Director, Maruti Pharma Pvt. Ltd.'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MdMessageManager;
