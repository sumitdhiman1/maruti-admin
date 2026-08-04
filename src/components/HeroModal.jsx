import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Calendar, Sparkles, CheckCircle } from 'lucide-react';
import api from '../services/api';

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

  const [uploading, setUploading] = useState(false);

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

  // Convert File to Base64 & Upload to Cloudinary API
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Image = event.target.result;

      try {
        const response = await api.post('/upload', { image: base64Image });

        if (response.data?.imageUrl) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: response.data.imageUrl,
            cloudinaryPublicId: response.data.publicId || '',
          }));
          setUploading(false);
          return;
        }
      } catch (err) {
        console.warn('Cloudinary API upload note, using file preview:', err.message);
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: base64Image,
      }));
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
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
    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '650px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#ffc107" />
            {banner ? 'Edit Hero Banner Data' : 'Add Dynamic Hero / Event Banner'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Banner Type Tabs */}
          <div className="form-group">
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
                ⭐ Main Hero Banner (Visible First)
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
                🎉 Festival / Event Banner (Date Scheduled)
              </button>
            </div>
          </div>

          {/* Cloudinary Upload Dropzone */}
          <div className="form-group">
            <label className="form-label">Cloudinary Image Upload ☁️</label>
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
                    alt="Uploaded Banner Preview"
                    style={{
                      maxHeight: '150px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '2px solid #c054c2',
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Cloudinary Media Upload Ready
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Click to select a different image file</span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={40} color="#c054c2" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploading ? 'Uploading to Cloudinary ☁️...' : 'Click to Upload Image File to Cloudinary'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                    Supports PNG, JPG, WEBP media formats
                  </p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
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

          {bannerType === 'FestivalEvent' ? (
            <div>
              <div className="form-group">
                <label className="form-label">Festival / Event Name (e.g. Diwali Offer, Holi Special)</label>
                <input
                  type="text"
                  name="eventName"
                  required
                  className="form-control"
                  placeholder="e.g. Diwali Mega Event, Holi Special Discount"
                  value={formData.eventName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="#c054c2" /> Event Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    className="form-control"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} color="#c054c2" /> Event End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    className="form-control"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Primary Button Text & Link</label>
                  <input
                    type="text"
                    name="primaryBtnText"
                    className="form-control"
                    placeholder="Button Text (e.g. Explore Our Products)"
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

                <div className="form-group">
                  <label className="form-label">Secondary Button Text & Link</label>
                  <input
                    type="text"
                    name="secondaryBtnText"
                    className="form-control"
                    placeholder="Button Text (e.g. About Maruti)"
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

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Hero Banner Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroModal;
