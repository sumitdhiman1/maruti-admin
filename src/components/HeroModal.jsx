import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Check } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

const HeroModal = ({ isOpen, onClose, onSave, banner = null }) => {
  const [bannerType, setBannerType] = useState('DefaultHero');
  const [formData, setFormData] = useState({
    title: 'Inspiring New Hope For Healthy Life',
    subtitle: 'At Maruti, we combine scientific expertise, quality manufacturing and innovative ideas to create healthcare solutions that make a meaningful difference in people\'s lives.',
    badgeText: '• WHO-GMP & ISO 9001:2015 Certified',
    primaryBtnText: 'Explore Our Products',
    primaryBtnLink: '#products',
    secondaryBtnText: 'About Maruti',
    secondaryBtnLink: '#about',
    imageUrl: '',
    cloudinaryPublicId: '',
    isDefault: true,
    eventName: '',
    startDate: '',
    endDate: '',
    status: 'Active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (banner) {
      setBannerType(banner.bannerType || 'DefaultHero');
      setFormData({
        title: banner.title || 'Inspiring New Hope For Healthy Life',
        subtitle: banner.subtitle || 'At Maruti, we combine scientific expertise, quality manufacturing and innovative ideas to create healthcare solutions that make a meaningful difference in people\'s lives.',
        badgeText: banner.badgeText || '• WHO-GMP & ISO 9001:2015 Certified',
        primaryBtnText: banner.primaryBtnText || 'Explore Our Products',
        primaryBtnLink: banner.primaryBtnLink || '#products',
        secondaryBtnText: banner.secondaryBtnText || 'About Maruti',
        secondaryBtnLink: banner.secondaryBtnLink || '#about',
        imageUrl: banner.imageUrl || '',
        cloudinaryPublicId: banner.cloudinaryPublicId || '',
        isDefault: banner.isDefault || false,
        eventName: banner.eventName || '',
        startDate: banner.startDate || '',
        endDate: banner.endDate || '',
        status: banner.status || 'Active',
      });
    } else {
      setBannerType('DefaultHero');
      setFormData({
        title: 'Inspiring New Hope For Healthy Life',
        subtitle: 'At Maruti, we combine scientific expertise, quality manufacturing and innovative ideas to create healthcare solutions that make a meaningful difference in people\'s lives.',
        badgeText: '• WHO-GMP & ISO 9001:2015 Certified',
        primaryBtnText: 'Explore Our Products',
        primaryBtnLink: '#products',
        secondaryBtnText: 'About Maruti',
        secondaryBtnLink: '#about',
        imageUrl: '',
        cloudinaryPublicId: '',
        isDefault: true,
        eventName: '',
        startDate: '',
        endDate: '',
        status: 'Active',
      });
    }
  }, [banner, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please select and upload an image file first.');
      return;
    }
    const payload = {
      ...formData,
      bannerType,
      startDate: formData.startDate && formData.startDate !== '' ? formData.startDate : null,
      endDate: formData.endDate && formData.endDate !== '' ? formData.endDate : null,
    };
    try {
      setIsSubmitting(true);
      await onSave(payload);
    } catch (err) {
      console.error('Failed saving hero banner:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(192, 84, 194, 0.2)', border: '1px solid #c054c2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#c054c2" />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>
                {banner ? 'Edit Hero Banner Popup' : 'Add Hero / Festival Banner'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                Configure title, subtitle, dates, and Cloudinary media in this popup
              </div>
            </div>
          </div>

          <button className="btn-close" onClick={onClose} style={{ color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '1.5rem' }}>
            
            {/* Banner Type Selection */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Banner Classification</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className={`btn ${bannerType === 'DefaultHero' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setBannerType('DefaultHero');
                    setFormData((prev) => ({ ...prev, isDefault: true }));
                  }}
                >
                  ⭐ Main Hero Banner (Always Visible)
                </button>
                <button
                  type="button"
                  className={`btn ${bannerType === 'FestivalEvent' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    setBannerType('FestivalEvent');
                    setFormData((prev) => ({ ...prev, isDefault: false }));
                  }}
                >
                  🎉 Festival / Event Banner (Scheduled)
                </button>
              </div>
            </div>

            {/* Department-Style Common Drag & Drop Image Uploader */}
            <ImageUploadField
              label="Banner Image (Drag & Drop or Click to Upload)"
              value={formData.imageUrl || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
              placeholder="Drag & drop banner image here or browse"
            />

            {bannerType === 'FestivalEvent' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Festival / Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    required
                    className="form-control"
                    placeholder="e.g. Diwali Mega Festival, Dashain Special"
                    value={formData.eventName}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} color="#c054c2" /> Event Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      className="form-control"
                      value={formData.startDate || ''}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={16} color="#c054c2" /> Event End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      className="form-control"
                      value={formData.endDate || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Top Badge Text</label>
                  <input
                    type="text"
                    name="badgeText"
                    className="form-control"
                    placeholder="e.g. • WHO-GMP & ISO 9001:2015 Certified"
                    value={formData.badgeText}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Hero Title / Heading</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="e.g. Inspiring New Hope For Healthy Life"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Hero Subtitle / Description</label>
                  <textarea
                    name="subtitle"
                    rows="3"
                    className="form-control"
                    placeholder="e.g. At Maruti, we combine scientific expertise..."
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Primary Button Text &amp; Link</label>
                    <input
                      type="text"
                      name="primaryBtnText"
                      className="form-control"
                      placeholder="Text (e.g. Explore Our Products)"
                      value={formData.primaryBtnText}
                      onChange={handleChange}
                      style={{ marginBottom: '6px' }}
                    />
                    <input
                      type="text"
                      name="primaryBtnLink"
                      className="form-control"
                      placeholder="Link (e.g. #products)"
                      value={formData.primaryBtnLink}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Secondary Button Text &amp; Link</label>
                    <input
                      type="text"
                      name="secondaryBtnText"
                      className="form-control"
                      placeholder="Text (e.g. About Maruti)"
                      value={formData.secondaryBtnText}
                      onChange={handleChange}
                      style={{ marginBottom: '6px' }}
                    />
                    <input
                      type="text"
                      name="secondaryBtnLink"
                      className="form-control"
                      placeholder="Link (e.g. #about)"
                      value={formData.secondaryBtnLink}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              <label htmlFor="isDefault" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: 700 }}>
                Set as Default Banner (Visible First on Site)
              </label>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving...' : banner ? 'Update Hero Banner' : 'Add Hero Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroModal;
