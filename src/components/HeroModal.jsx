import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Check, PartyPopper } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

const HeroModal = ({ isOpen, onClose, onSave, banner = null, modalType = 'DefaultHero' }) => {
  const isFestival = (banner?.bannerType === 'FestivalEvent') || modalType === 'FestivalEvent';

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: '',
    primaryBtnText: '',
    primaryBtnLink: '',
    secondaryBtnText: '',
    secondaryBtnLink: '',
    imageUrl: '',
    cloudinaryPublicId: '',
    isDefault: !isFestival,
    eventName: '',
    startDate: '',
    endDate: '',
    status: 'Active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        badgeText: banner.badgeText || '',
        primaryBtnText: banner.primaryBtnText || '',
        primaryBtnLink: banner.primaryBtnLink || '',
        secondaryBtnText: banner.secondaryBtnText || '',
        secondaryBtnLink: banner.secondaryBtnLink || '',
        imageUrl: banner.imageUrl || '',
        cloudinaryPublicId: banner.cloudinaryPublicId || '',
        isDefault: banner.isDefault ?? !isFestival,
        eventName: banner.eventName || '',
        startDate: banner.startDate || '',
        endDate: banner.endDate || '',
        status: banner.status || 'Active',
      });
    } else {
      if (isFestival) {
        setFormData({
          title: '',
          subtitle: '',
          badgeText: '🎉 Festive Special Offer',
          primaryBtnText: 'Explore Offers',
          primaryBtnLink: '#products',
          secondaryBtnText: 'Contact Us',
          secondaryBtnLink: '#contact',
          imageUrl: '',
          cloudinaryPublicId: '',
          isDefault: false,
          eventName: '',
          startDate: '',
          endDate: '',
          status: 'Active',
        });
      } else {
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
    }
  }, [banner, isOpen, isFestival]);

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
      alert('Please select and upload a banner image file first.');
      return;
    }

    if (isFestival) {
      if (!formData.eventName || !formData.eventName.trim()) {
        alert('Please enter the Festival / Event Name.');
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        alert('Please select both Start Date and End Date for the festival event.');
        return;
      }
      if (formData.startDate > formData.endDate) {
        alert('Event Start Date cannot be after Event End Date.');
        return;
      }
    }

    const payload = {
      ...formData,
      bannerType: isFestival ? 'FestivalEvent' : 'DefaultHero',
      isDefault: isFestival ? false : true,
      startDate: isFestival && formData.startDate ? formData.startDate : null,
      endDate: isFestival && formData.endDate ? formData.endDate : null,
      eventName: isFestival ? formData.eventName : null,
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
              {isFestival ? <PartyPopper size={20} color="#c054c2" /> : <Sparkles size={20} color="#c054c2" />}
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>
                {isFestival
                  ? (banner ? 'Edit Festival / Event Banner' : 'Add Festival Event Banner')
                  : (banner ? 'Edit Main Hero Section' : 'Create Main Hero Section')}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {isFestival
                  ? 'Configure scheduled festive banner with promotional details, dates, and media.'
                  : 'Configure main hero title, subtitle, buttons, and background image.'}
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
            
            {/* Festival / Event Specific Schedule Card (Only shown for Festival Events) */}
            {isFestival && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#faf5ff', padding: '1.2rem', borderRadius: '14px', border: '1px solid #f3e8ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#8d348f', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PartyPopper size={16} /> Festival Event Details
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', margin: 0 }}>Status:</label>
                    <select
                      name="status"
                      className="form-control"
                      value={formData.status}
                      onChange={handleChange}
                      style={{ padding: '4px 10px', fontSize: '0.82rem', width: 'auto' }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: 800, color: '#0f172a' }}>Festival / Event Name *</label>
                  <input
                    type="text"
                    name="eventName"
                    required
                    className="form-control"
                    placeholder="e.g. Diwali Mega Festival, Dashain Special, New Year Offer"
                    value={formData.eventName}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <Calendar size={16} color="#c054c2" /> Event Start Date *
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
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <Calendar size={16} color="#c054c2" /> Event End Date *
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
            )}

            {/* Banner Image Uploader */}
            <ImageUploadField
              label={isFestival ? "Festival Banner Image (Drag & Drop or Upload)" : "Main Hero Image (Drag & Drop or Upload)"}
              value={formData.imageUrl || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url || '' }))}
              placeholder={isFestival ? "Drag & drop festival banner image here or browse" : "Drag & drop hero image here or browse"}
            />

            {/* Banner Content Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{isFestival ? "Festival Top Badge / Tag" : "Top Badge Text"}</label>
                <input
                  type="text"
                  name="badgeText"
                  className="form-control"
                  placeholder={isFestival ? "e.g. 🎉 Special Festive Promotion" : "e.g. • WHO-GMP & ISO 9001:2015 Certified"}
                  value={formData.badgeText}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{isFestival ? "Festival Headline / Title" : "Hero Title / Heading"}</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder={isFestival ? "e.g. Celebrating The Festival of Lights With Maruti" : "e.g. Inspiring New Hope For Healthy Life"}
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{isFestival ? "Festival Subtitle / Description" : "Hero Subtitle / Description"}</label>
                <textarea
                  name="subtitle"
                  rows="3"
                  className="form-control"
                  placeholder={isFestival ? "e.g. Special festive greetings and healthcare wellness offers from Maruti Pharma..." : "e.g. At Maruti, we combine scientific expertise..."}
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
                    placeholder="Link (e.g. #products or /products)"
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
                    placeholder="Link (e.g. #about or /about-us)"
                    value={formData.secondaryBtnLink}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving...' : (isFestival ? (banner ? 'Update Festival Banner' : 'Add Festival Banner') : (banner ? 'Update Main Hero Section' : 'Save Main Hero Section'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroModal;
