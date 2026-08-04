import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Sparkles, UploadCloud, CheckCircle, Save, Pill, Lightbulb, Building2 } from 'lucide-react';

const AboutSectionPage = () => {
  const [formData, setFormData] = useState({
    tagline: 'ABOUT MARUTI PHARMA',
    title: 'Science. Quality.',
    highlightWord: 'Innovation.',
    description1: 'Maruti Pharma Pvt. Ltd. is a trusted pharmaceutical company committed to delivering high-quality, affordable healthcare solutions across Nepal. From our strong foundation in dermatology, we have expanded into multiple therapeutic specialties, driven by innovation, advanced manufacturing, and uncompromising quality standards.',
    description2: 'Every product we develop reflects our dedication to improving patient outcomes, supporting healthcare professionals, and building a healthier future through safe, effective, and reliable medicines.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80',
    feature1Title: 'Quality Medicines',
    feature1Description: 'Delivering safe, effective, and WHO-GMP compliant medicines across diverse therapeutic segments.',
    feature1IconUrl: '',
    feature2Title: 'Innovation Focused',
    feature2Description: 'Developing advanced pharmaceutical solutions through continuous research and scientific excellence.',
    feature2IconUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchAboutSection();
  }, []);

  const fetchAboutSection = async () => {
    try {
      setLoading(true);
      const response = await api.get('/about-section');
      if (response.data) {
        setFormData({
          tagline: response.data.tagline || 'ABOUT MARUTI PHARMA',
          title: response.data.title || 'Science. Quality.',
          highlightWord: response.data.highlightWord || 'Innovation.',
          description1: response.data.description1 || '',
          description2: response.data.description2 || '',
          imageUrl: response.data.imageUrl || '',
          feature1Title: response.data.feature1Title || 'Quality Medicines',
          feature1Description: response.data.feature1Description || '',
          feature1IconUrl: response.data.feature1IconUrl || '',
          feature2Title: response.data.feature2Title || 'Innovation Focused',
          feature2Description: response.data.feature2Description || '',
          feature2IconUrl: response.data.feature2IconUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching About Section data:', error);
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

  // Main Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data?.imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: response.data.imageUrl,
        }));
        setUploadingImage(false);
        return;
      }
    } catch (err) {
      console.warn('Backend upload note, using file preview:', err.message);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: event.target.result,
      }));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveSuccess(false);
      await api.put('/about-section', formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      alert('Failed to save About Section data: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading About Maruti Pharma section data...</div>;
  }

  return (
    <div>
      {/* Floating Success Toast Notification */}
      {saveSuccess && (
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
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Section 3 Saved Successfully! 🎉</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>About Maruti Pharma section content updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Home Section ➔ Section 3: About Maruti Pharma
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
          About Maruti Pharma Section Management
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Customize Section 3 content, medical team image, tagline, headings, paragraphs, and sub-features.
        </p>
      </div>

      {/* LIVE SECTION 3 PREVIEW CARD - Matching exact reference image from design! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE SECTION 3 PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            Section 3 Active
          </span>
        </div>

        <div style={{ padding: '2.5rem', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '2.5rem', alignItems: 'center', background: '#faf5fa' }}>
          {/* Left Side: Medical Team Image */}
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(192, 84, 194, 0.2)', border: '2px solid #f3d4f5' }}>
            <img
              src={formData.imageUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80'}
              alt="Medical Team Preview"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80';
              }}
              style={{ width: '100%', height: '360px', objectFit: 'cover', borderRadius: '20px' }}
            />
          </div>

          {/* Right Side: Content & Features */}
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              {formData.tagline || 'ABOUT MARUTI PHARMA'}
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.2, marginBottom: '1rem' }}>
              {formData.title}{' '}
              {formData.highlightWord && (
                <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
                  {formData.highlightWord}
                </span>
              )}
            </h2>

            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              {formData.description1}
            </p>

            <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {formData.description2}
            </p>

            {/* Bottom 2 Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
              {/* Feature 1 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', background: '#faf0fc', border: '1px solid #f3d4f5', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#c054c2', padding: '10px' }}>
                  <Pill size={22} color="#c054c2" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a192f', marginBottom: '4px' }}>
                    {formData.feature1Title || 'Quality Medicines'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                    {formData.feature1Description}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '42px', height: '42px', minWidth: '42px', borderRadius: '50%', background: '#faf0fc', border: '1px solid #f3d4f5', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#c054c2', padding: '10px' }}>
                  <Lightbulb size={22} color="#c054c2" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0a192f', marginBottom: '4px' }}>
                    {formData.feature2Title || 'Innovation Focused'}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45 }}>
                    {formData.feature2Description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EDITING FORM CARD */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="#c054c2" /> Edit Section 3 Data & Media
          </h3>
          {saveSuccess && (
            <span className="badge badge-active" style={{ background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={14} /> Saved Changes Successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Image Upload Box */}
          <div className="form-group">
            <label className="form-label">Medical Team Main Image (Cloudinary Media Upload)</label>
            <div
              style={{
                border: '2px dashed #c054c2',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                background: '#faf5fa',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {formData.imageUrl ? (
                <div>
                  <img
                    src={formData.imageUrl}
                    alt="Section 3 Main Image Preview"
                    style={{
                      maxHeight: '160px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      border: '2px solid #c054c2',
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Image File Active
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Click to select a different main image file</span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={40} color="#c054c2" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploadingImage ? 'Uploading Image to Cloudinary...' : 'Click to Upload Main Section Image'}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tagline (Small Subhead)</label>
              <input
                type="text"
                name="tagline"
                className="form-control"
                placeholder="ABOUT MARUTI PHARMA"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Main Heading Title</label>
              <input
                type="text"
                name="title"
                required
                className="form-control"
                placeholder="Science. Quality."
                value={formData.title}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Heading Highlight Word (Italic Magenta Accent)</label>
            <input
              type="text"
              name="highlightWord"
              className="form-control"
              placeholder="Innovation."
              value={formData.highlightWord}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraph 1</label>
            <textarea
              name="description1"
              rows="3"
              required
              className="form-control"
              placeholder="Maruti Pharma Pvt. Ltd. is a trusted pharmaceutical company..."
              value={formData.description1}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraph 2</label>
            <textarea
              name="description2"
              rows="3"
              className="form-control"
              placeholder="Every product we develop reflects our dedication..."
              value={formData.description2}
              onChange={handleChange}
            />
          </div>

          {/* Sub-Feature Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
            {/* Feature 1 Form */}
            <div style={{ background: '#faf5fa', padding: '1.25rem', borderRadius: '12px', border: '1px solid #f3d4f5' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0a192f', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Pill size={18} color="#c054c2" /> Sub-Feature 1 (Quality)
              </h4>
              <div className="form-group">
                <label className="form-label">Feature 1 Title</label>
                <input
                  type="text"
                  name="feature1Title"
                  className="form-control"
                  placeholder="Quality Medicines"
                  value={formData.feature1Title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Feature 1 Description</label>
                <textarea
                  name="feature1Description"
                  rows="2"
                  className="form-control"
                  placeholder="Delivering safe, effective, and WHO-GMP compliant medicines..."
                  value={formData.feature1Description}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Feature 2 Form */}
            <div style={{ background: '#faf5fa', padding: '1.25rem', borderRadius: '12px', border: '1px solid #f3d4f5' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0a192f', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lightbulb size={18} color="#c054c2" /> Sub-Feature 2 (Innovation)
              </h4>
              <div className="form-group">
                <label className="form-label">Feature 2 Title</label>
                <input
                  type="text"
                  name="feature2Title"
                  className="form-control"
                  placeholder="Innovation Focused"
                  value={formData.feature2Title}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Feature 2 Description</label>
                <textarea
                  name="feature2Description"
                  rows="2"
                  className="form-control"
                  placeholder="Developing advanced pharmaceutical solutions..."
                  value={formData.feature2Description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '12px 30px' }}>
              <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Section 3 Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AboutSectionPage;
