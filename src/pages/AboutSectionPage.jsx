import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploadField from '../components/ImageUploadField';
import { Save, CheckCircle, Info, Sparkles, Award, Users, TrendingUp } from 'lucide-react';

const AboutSectionPage = () => {
  const [formData, setFormData] = useState({
    // Hero Banner
    bannerTitle: 'Science. Quality. Innovation.',
    bannerDesc: 'Committed to delivering high-quality, affordable pharmaceutical solutions that make a meaningful difference in people\'s lives across Nepal and beyond.',
    bannerImage: '/assets/images/about-banner.jpg',
    stat1Number: '500+', stat1Label: 'Products',
    stat2Number: '15+', stat2Label: 'Years of Excellence',
    stat3Number: '20+', stat3Label: 'Countries Served',
    stat4Number: 'WHO-GMP', stat4Label: 'Certified',

    // Story Section
    storySubhead: 'About Maruti Pharma',
    storyTitle: 'Our Story of Healing & Hope',
    storyDesc1: 'Maruti Pharma Pvt. Ltd. (MPPL), recognized as a pioneer in the dermatology-focused pharmaceutical sector of Nepal, has evolved into a diversified multispecialty pharmaceutical company offering science-driven branded generic medicines across various therapeutic segments.',
    storyDesc2: 'A WHO-GMP and ISO-certified prescription-based pharmaceutical company, MPPL operates with the vision of "Inspiring New Hope for Healthy Life". These words reflect our deep commitment to improving healthcare outcomes and enhancing the quality of life for people.',
    storyImage: '/assets/images/our-story-img.jpg',
    certBadgeTitle: 'WHO-GMP Certified',
    certBadgeSub: 'ISO 9001:2015',

    // Features
    feature1Text: 'Quality Medicines',
    feature2Text: 'Innovation Focused',
    feature3Text: 'WHO-GMP Compliant',
    feature4Text: 'Patient Centered',

    // Winning Behaviors
    behavior1Title: 'Our Challenge',
    behavior1Desc: 'We continuously seek innovative ways to work faster, smarter, and better while maintaining highest quality standards.',
    behavior2Title: 'Our Connectivity',
    behavior2Desc: 'We work together as ONE team, sharing knowledge, expertise, and best practices across all departments.',
    behavior3Title: 'Our Commitment',
    behavior3Desc: 'We deliver on our promises and go beyond expectations to earn the trust of our partners.',
    behavior4Title: 'Our Expertise',
    behavior4Desc: 'We deliver on our promises and go beyond expectations to earn the trust of our customers and stakeholders.',

    // Sales & Marketing Department
    deptIntro: 'At Maruti Pharma Pvt. Ltd., Sales and Marketing work together as two interconnected functions with a shared objective of delivering value to healthcare professionals, patients, and society.',
    mktSubtitle: 'Building Brands & Creating Value',
    salesSubtitle: 'Connecting Healthcare Solutions with Customers',
    approachSubtitle: 'Integrated Sales & Marketing Approach',
    standardsSubtitle: 'Pharmaceutical Sales & Marketing Excellence',

    // Leadership
    leadershipSubhead: 'The People Behind Our Success',
    leadershipTitle: 'Vision that shapes tomorrow\'s healthcare',
    leadershipDesc1: 'The leadership team at Maruti Pharma Pvt. Ltd. is committed to achieving our vision of delivering high-quality healthcare solutions through innovation, advanced technology, and excellence in pharmaceutical practices.',
    leadershipDesc2: 'Our Board of Directors provides strategic direction, strong governance, and visionary leadership to ensure sustainable growth while strengthening our commitment to serving the healthcare needs of the nation.',
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchAboutSection();
  }, []);

  const fetchAboutSection = async () => {
    try {
      const res = await api.get('/about-section');
      if (res.data) {
        setFormData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Error fetching About Section data:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/about-section', formData);
      setFormData(prev => ({ ...prev, ...res.data }));
      showToast('About Us Page updated successfully! 🎉');
    } catch (err) {
      alert('Failed to save changes: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live frontend page updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Page Content Management
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            About Us Page Settings
          </h2>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* 1. Hero Banner */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#c054c2" /> Hero Banner &amp; Statistics Grid
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Main Banner Title</label>
            <input className="form-control" name="bannerTitle" value={formData.bannerTitle} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Banner Description</label>
            <textarea className="form-control" rows={2} name="bannerDesc" value={formData.bannerDesc} onChange={handleChange} />
          </div>

          {/* Common Department-Style Drag & Drop Image Uploader */}
          <ImageUploadField
            label="Banner Background Image (Drag & Drop or Click)"
            value={formData.bannerImage}
            onChange={(url) => setFormData(prev => ({ ...prev, bannerImage: url }))}
            placeholder="Drag & Drop Banner Image Here or click to browse"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 1 Number</label>
              <input className="form-control" name="stat1Number" value={formData.stat1Number} onChange={handleChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 1 Label</label>
              <input className="form-control" name="stat1Label" value={formData.stat1Label} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 2 Number</label>
              <input className="form-control" name="stat2Number" value={formData.stat2Number} onChange={handleChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 2 Label</label>
              <input className="form-control" name="stat2Label" value={formData.stat2Label} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 3 Number</label>
              <input className="form-control" name="stat3Number" value={formData.stat3Number} onChange={handleChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 3 Label</label>
              <input className="form-control" name="stat3Label" value={formData.stat3Label} onChange={handleChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 4 Number</label>
              <input className="form-control" name="stat4Number" value={formData.stat4Number} onChange={handleChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 4 Label</label>
              <input className="form-control" name="stat4Label" value={formData.stat4Label} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* 2. Our Story */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={20} color="#c054c2" /> Our Story Section
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subhead</label>
              <input className="form-control" name="storySubhead" value={formData.storySubhead} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Story Section Title</label>
              <input className="form-control" name="storyTitle" value={formData.storyTitle} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Story Paragraph 1</label>
            <textarea className="form-control" rows={3} name="storyDesc1" value={formData.storyDesc1} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Story Paragraph 2</label>
            <textarea className="form-control" rows={3} name="storyDesc2" value={formData.storyDesc2} onChange={handleChange} />
          </div>

          {/* Common Department-Style Drag & Drop Image Uploader */}
          <ImageUploadField
            label="Story Image (Drag & Drop or Click)"
            value={formData.storyImage}
            onChange={(url) => setFormData(prev => ({ ...prev, storyImage: url }))}
            placeholder="Drag & Drop Story Image Here or click to browse"
          />

          {/* Key Features */}
          <div style={{ marginTop: '1rem', background: '#faf5ff', padding: '1rem', borderRadius: '12px', border: '1px solid #e9d5ff' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: '8px' }}>Key Feature Bullet Points</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <input className="form-control" name="feature1Text" value={formData.feature1Text} onChange={handleChange} placeholder="Feature 1" />
              <input className="form-control" name="feature2Text" value={formData.feature2Text} onChange={handleChange} placeholder="Feature 2" />
              <input className="form-control" name="feature3Text" value={formData.feature3Text} onChange={handleChange} placeholder="Feature 3" />
              <input className="form-control" name="feature4Text" value={formData.feature4Text} onChange={handleChange} placeholder="Feature 4" />
            </div>
          </div>
        </div>

        {/* 3. Winning Behaviors */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#c054c2" /> Winning Behaviors
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ fontWeight: 700 }}>Card 1 Title</label>
              <input className="form-control" name="behavior1Title" value={formData.behavior1Title} onChange={handleChange} style={{ marginBottom: '8px' }} />
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Card 1 Description</label>
              <textarea className="form-control" rows={2} name="behavior1Desc" value={formData.behavior1Desc} onChange={handleChange} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ fontWeight: 700 }}>Card 2 Title</label>
              <input className="form-control" name="behavior2Title" value={formData.behavior2Title} onChange={handleChange} style={{ marginBottom: '8px' }} />
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Card 2 Description</label>
              <textarea className="form-control" rows={2} name="behavior2Desc" value={formData.behavior2Desc} onChange={handleChange} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ fontWeight: 700 }}>Card 3 Title</label>
              <input className="form-control" name="behavior3Title" value={formData.behavior3Title} onChange={handleChange} style={{ marginBottom: '8px' }} />
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Card 3 Description</label>
              <textarea className="form-control" rows={2} name="behavior3Desc" value={formData.behavior3Desc} onChange={handleChange} />
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ fontWeight: 700 }}>Card 4 Title</label>
              <input className="form-control" name="behavior4Title" value={formData.behavior4Title} onChange={handleChange} style={{ marginBottom: '8px' }} />
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Card 4 Description</label>
              <textarea className="form-control" rows={2} name="behavior4Desc" value={formData.behavior4Desc} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* 4. Sales & Marketing Department Section */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#c054c2" /> Sales &amp; Marketing Department Section
            </h3>
          </div>

          <div className="form-group">
            <label className="form-label">Department Introduction Text</label>
            <textarea className="form-control" rows={2} name="deptIntro" value={formData.deptIntro} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Marketing Card Subtitle</label>
              <input className="form-control" name="mktSubtitle" value={formData.mktSubtitle} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Sales Card Subtitle</label>
              <input className="form-control" name="salesSubtitle" value={formData.salesSubtitle} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Approach Card Subtitle</label>
              <input className="form-control" name="approachSubtitle" value={formData.approachSubtitle} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Standards Card Subtitle</label>
              <input className="form-control" name="standardsSubtitle" value={formData.standardsSubtitle} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* 5. Leadership & Governance */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} color="#c054c2" /> Leadership &amp; Governance
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Subhead</label>
              <input className="form-control" name="leadershipSubhead" value={formData.leadershipSubhead} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Leadership Title</label>
              <input className="form-control" name="leadershipTitle" value={formData.leadershipTitle} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Leadership Paragraph 1</label>
            <textarea className="form-control" rows={2} name="leadershipDesc1" value={formData.leadershipDesc1} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Leadership Paragraph 2</label>
            <textarea className="form-control" rows={2} name="leadershipDesc2" value={formData.leadershipDesc2} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Leadership Paragraph 3</label>
            <textarea className="form-control" rows={2} name="leadershipDesc3" value={formData.leadershipDesc3} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }} disabled={saving}>
          <Save size={20} /> {saving ? 'Saving Changes...' : 'Save All About Page Changes'}
        </button>

      </form>
    </div>
  );
};

export default AboutSectionPage;
