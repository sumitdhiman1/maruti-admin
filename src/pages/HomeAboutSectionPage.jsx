import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploadField from '../components/ImageUploadField';
import { Save, CheckCircle, Info, Sparkles, Award, Eye, RotateCcw } from 'lucide-react';

const HomeAboutSectionPage = () => {
  const [formData, setFormData] = useState({
    tagline: 'ABOUT MARUTI PHARMA',
    title: 'Science. Quality.',
    highlightWord: 'Innovation.',
    description1: 'Maruti Pharma Pvt. Ltd. is a trusted pharmaceutical company committed to delivering high-quality, affordable healthcare solutions across Nepal. From our strong foundation in dermatology, we have expanded into multiple therapeutic specialties, driven by innovation, advanced manufacturing, and uncompromising quality standards.',
    description2: 'Every product we develop reflects our dedication to improving patient outcomes, supporting healthcare professionals, and building a healthier future through safe, effective, and reliable medicines.',
    imageUrl: '/assets/images/about-img.jpeg',
    feature1Title: 'Quality Medicines',
    feature1Description: 'Delivering safe, effective, and WHO-GMP compliant medicines across diverse therapeutic segments.',
    feature2Title: 'Innovation Focused',
    feature2Description: 'Developing advanced pharmaceutical solutions through continuous research and scientific excellence.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchHomeAboutData();
  }, []);

  const fetchHomeAboutData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/about-section');
      if (res.data && Object.keys(res.data).length > 0) {
        const cleaned = {};
        Object.keys(res.data).forEach((k) => {
          cleaned[k] = res.data[k] === null || res.data[k] === undefined ? '' : res.data[k];
        });
        setFormData((prev) => ({ ...prev, ...cleaned }));
      }
    } catch (err) {
      console.error('Error fetching Home About Section data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || '' }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/about-section', formData);
      if (res.data) {
        const cleaned = {};
        Object.keys(res.data).forEach((k) => {
          cleaned[k] = res.data[k] === null || res.data[k] === undefined ? '' : res.data[k];
        });
        setFormData((prev) => ({ ...prev, ...cleaned }));
      }
      showToast('Homepage About Section content saved successfully! 🎉');
    } catch (err) {
      alert('Failed to save Home About Section settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading Homepage About Section data...</div>;
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live homepage about section updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Home Section Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Homepage About Section
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Content'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Left Column: Live Website Preview Card */}
        <div>
          <div className="card" style={{ sticky: 'top', top: '24px' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={20} color="#c054c2" /> Live Website Preview
              </h3>
              <span className="badge badge-purple">Homepage Section</span>
            </div>

            <div style={{ padding: '20px', background: '#fafafa', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ marginBottom: '16px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <img
                  src={formData.imageUrl || '/assets/images/about-img.jpeg'}
                  alt="Homepage About Section"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/about-img.jpeg';
                  }}
                />
              </div>

              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#c054c2', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {formData.tagline || 'ABOUT MARUTI PHARMA'}
              </span>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 12px 0', lineHeight: 1.3 }}>
                {formData.title} <span style={{ color: '#c054c2', fontStyle: 'italic' }}>{formData.highlightWord}</span>
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
                {formData.description1}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                {formData.description2}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Award size={20} color="#c054c2" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{formData.feature1Title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{formData.feature1Description}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Sparkles size={20} color="#c054c2" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{formData.feature2Title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{formData.feature2Description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Content Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Card 1: Headings & Text */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info size={20} color="#c054c2" /> Titles &amp; Paragraph Content
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label">Sub-Tagline Text</label>
                <input className="form-control" name="tagline" value={formData.tagline || ''} onChange={handleChange} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Main Title</label>
                  <input className="form-control" name="title" value={formData.title || ''} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Word (Italic Purple)</label>
                  <input className="form-control" name="highlightWord" value={formData.highlightWord || ''} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description Paragraph 1</label>
                <textarea className="form-control" rows={3} name="description1" value={formData.description1 || ''} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Description Paragraph 2</label>
                <textarea className="form-control" rows={3} name="description2" value={formData.description2 || ''} onChange={handleChange} />
              </div>

              {/* Section Image Uploader */}
              <ImageUploadField
                label="Homepage About Section Image (Drag & Drop or Click)"
                value={formData.imageUrl || ''}
                onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url || '' }))}
                placeholder="Drag & Drop Homepage About Section Image Here or click to browse"
              />
            </div>

            {/* Card 2: Feature Cards */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="#c054c2" /> Feature Highlights Badges
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Feature 1 */}
                <div style={{ background: '#faf5ff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#c054c2', textTransform: 'uppercase' }}>Feature Badge 1</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '8px' }}>
                    <input className="form-control" placeholder="Title" name="feature1Title" value={formData.feature1Title || ''} onChange={handleChange} />
                    <input className="form-control" placeholder="Description" name="feature1Description" value={formData.feature1Description || ''} onChange={handleChange} />
                  </div>
                </div>

                {/* Feature 2 */}
                <div style={{ background: '#faf5ff', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #f3e8ff' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#c054c2', textTransform: 'uppercase' }}>Feature Badge 2</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '8px' }}>
                    <input className="form-control" placeholder="Title" name="feature2Title" value={formData.feature2Title || ''} onChange={handleChange} />
                    <input className="form-control" placeholder="Description" name="feature2Description" value={formData.feature2Description || ''} onChange={handleChange} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px' }}
              >
                <Save size={18} /> {saving ? 'Saving...' : 'Save Content'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomeAboutSectionPage;
