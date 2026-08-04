import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, Eye, Sparkles, CheckCircle, Save, Compass } from 'lucide-react';

const MissionVisionPage = () => {
  const [formData, setFormData] = useState({
    missionTitle: 'Our',
    missionHighlight: 'Mission',
    missionText1: 'To deliver high-quality, safe, and effective pharmaceutical products that improve health outcomes and are accessible to people across Nepal and international markets.',
    missionText2: 'We are committed to expanding healthcare accessibility through innovation, excellence, and a strong focus on quality.',
    visionTitle: 'Our',
    visionHighlight: 'Vision',
    visionText: 'To become a leading pharmaceutical company in Nepal by providing high-quality, affordable, and innovative healthcare solutions.',
    visionBullet1: 'Build a focused, technology-driven organisation with strong R&D.',
    visionBullet2: 'Establish as a leading finished dosage manufacturer in Asia.',
    visionBullet3: 'Expand as a trusted global healthcare partner.',
    visionBullet4: 'Continuously contribute to healthcare advancement.',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/mission-vision');
      if (response.data) {
        setFormData({
          missionTitle: response.data.missionTitle || 'Our',
          missionHighlight: response.data.missionHighlight || 'Mission',
          missionText1: response.data.missionText1 || '',
          missionText2: response.data.missionText2 || '',
          visionTitle: response.data.visionTitle || 'Our',
          visionHighlight: response.data.visionHighlight || 'Vision',
          visionText: response.data.visionText || '',
          visionBullet1: response.data.visionBullet1 || '',
          visionBullet2: response.data.visionBullet2 || '',
          visionBullet3: response.data.visionBullet3 || '',
          visionBullet4: response.data.visionBullet4 || '',
        });
      }
    } catch (error) {
      console.error('Error fetching Mission & Vision data:', error);
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
    try {
      setSaving(true);
      await api.put('/mission-vision', formData);
      showToast('Mission & Vision Section saved successfully! 🎉');
    } catch (error) {
      alert('Failed to save Mission & Vision data: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading Mission & Vision data...</div>;
  }

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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Mission & Vision content updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Home Section ➔ Section 5: Mission & Vision Cards
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
          Our Mission & Vision Management
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Customize Section 5 Mission & Vision cards, descriptions, and strategic bullet points.
        </p>
      </div>

      {/* LIVE SECTION 5 PREVIEW CARD - Matching exact 2-card layout from reference image! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE SECTION 5 PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            Section 5 Active
          </span>
        </div>

        <div style={{ padding: '3rem 2rem', background: '#faf5fa' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Card 1: Our Mission */}
            <div
              style={{
                background: '#fdfbfe',
                borderRadius: '24px',
                padding: '2.25rem',
                border: '1px solid #f3d4f5',
                boxShadow: '0 8px 25px rgba(192, 84, 194, 0.08)',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
              }}
            >
              {/* Circular Target Icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '50%',
                  background: '#faf0fc',
                  border: '1px solid #f3d4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Target size={28} color="#c054c2" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f', marginBottom: '1rem' }}>
                  {formData.missionTitle}{' '}
                  <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
                    {formData.missionHighlight}
                  </span>
                </h3>

                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {formData.missionText1}
                </p>

                {formData.missionText2 && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {formData.missionText2}
                  </p>
                )}
              </div>
            </div>

            {/* Card 2: Our Vision */}
            <div
              style={{
                background: '#fdfbfe',
                borderRadius: '24px',
                padding: '2.25rem',
                border: '1px solid #f3d4f5',
                boxShadow: '0 8px 25px rgba(192, 84, 194, 0.08)',
                display: 'flex',
                gap: '1.5rem',
                alignItems: 'flex-start',
              }}
            >
              {/* Circular Eye Icon */}
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  minWidth: '56px',
                  borderRadius: '50%',
                  background: '#faf0fc',
                  border: '1px solid #f3d4f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Eye size={28} color="#c054c2" />
              </div>

              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f', marginBottom: '1rem' }}>
                  {formData.visionTitle}{' '}
                  <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
                    {formData.visionHighlight}
                  </span>
                </h3>

                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {formData.visionText}
                </p>

                <ul style={{ paddingLeft: '1.2rem', color: '#64748b', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {formData.visionBullet1 && <li>{formData.visionBullet1}</li>}
                  {formData.visionBullet2 && <li>{formData.visionBullet2}</li>}
                  {formData.visionBullet3 && <li>{formData.visionBullet3}</li>}
                  {formData.visionBullet4 && <li>{formData.visionBullet4}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FORM CARD FOR EDITING CONTENT */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} color="#c054c2" /> Edit Mission & Vision Cards Data
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Our Mission Form */}
            <div style={{ background: '#faf5fa', padding: '1.5rem', borderRadius: '14px', border: '1px solid #f3d4f5' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a192f', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={20} color="#c054c2" /> Our Mission Section
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Mission Title</label>
                  <input
                    type="text"
                    name="missionTitle"
                    className="form-control"
                    placeholder="Our"
                    value={formData.missionTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Word (Italic)</label>
                  <input
                    type="text"
                    name="missionHighlight"
                    className="form-control"
                    placeholder="Mission"
                    value={formData.missionHighlight}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mission Paragraph 1</label>
                <textarea
                  name="missionText1"
                  rows="3"
                  required
                  className="form-control"
                  placeholder="To deliver high-quality, safe, and effective pharmaceutical products..."
                  value={formData.missionText1}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mission Paragraph 2</label>
                <textarea
                  name="missionText2"
                  rows="3"
                  className="form-control"
                  placeholder="We are committed to expanding healthcare accessibility..."
                  value={formData.missionText2}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right Column: Our Vision Form */}
            <div style={{ background: '#faf5fa', padding: '1.5rem', borderRadius: '14px', border: '1px solid #f3d4f5' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a192f', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={20} color="#c054c2" /> Our Vision Section
              </h4>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Vision Title</label>
                  <input
                    type="text"
                    name="visionTitle"
                    className="form-control"
                    placeholder="Our"
                    value={formData.visionTitle}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Word (Italic)</label>
                  <input
                    type="text"
                    name="visionHighlight"
                    className="form-control"
                    placeholder="Vision"
                    value={formData.visionHighlight}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Vision Sub-description</label>
                <textarea
                  name="visionText"
                  rows="2"
                  required
                  className="form-control"
                  placeholder="To become a leading pharmaceutical company in Nepal..."
                  value={formData.visionText}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bullet Point 1</label>
                <input
                  type="text"
                  name="visionBullet1"
                  className="form-control"
                  placeholder="Build a focused, technology-driven organisation..."
                  value={formData.visionBullet1}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bullet Point 2</label>
                <input
                  type="text"
                  name="visionBullet2"
                  className="form-control"
                  placeholder="Establish as a leading finished dosage manufacturer in Asia."
                  value={formData.visionBullet2}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bullet Point 3</label>
                <input
                  type="text"
                  name="visionBullet3"
                  className="form-control"
                  placeholder="Expand as a trusted global healthcare partner."
                  value={formData.visionBullet3}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bullet Point 4</label>
                <input
                  type="text"
                  name="visionBullet4"
                  className="form-control"
                  placeholder="Continuously contribute to healthcare advancement."
                  value={formData.visionBullet4}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '12px 30px' }}>
              <Save size={18} /> {saving ? 'Saving Changes...' : 'Save Mission & Vision Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionVisionPage;
