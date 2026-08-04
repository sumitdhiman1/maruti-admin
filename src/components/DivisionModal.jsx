import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Layers, CheckCircle, Sparkles } from 'lucide-react';
import api from '../services/api';

const PRESETS = {
  derma: {
    name: 'Derma Division',
    subtitle: 'Science-Backed Skin Solutions',
    description: 'Advanced skincare and dermatological products for healthier skin and better life.',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
    themeColor: '#a855f7',
    btnText: 'Explore Products',
    btnLink: '#products',
    sortOrder: 1,
    status: 'Active',
  },
  evara: {
    name: 'Evara Division',
    subtitle: 'Everyday Health & Wellness',
    description: 'Science-backed pharmaceuticals for everyday health and wellness needs.',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
    themeColor: '#06b6d4',
    btnText: 'Explore Products',
    btnLink: '#products',
    sortOrder: 2,
    status: 'Active',
  },
  elzac: {
    name: 'Elzac Division',
    subtitle: 'Reliable Effective Solutions',
    description: 'Reliable and effective pharmaceuticals for a healthier and stronger tomorrow.',
    imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80',
    themeColor: '#6366f1',
    btnText: 'Explore Products',
    btnLink: '#products',
    sortOrder: 3,
    status: 'Active',
  },
};

const DivisionModal = ({ isOpen, onClose, onSave, item = null }) => {
  const [formData, setFormData] = useState(PRESETS.derma);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
        themeColor: item.themeColor || '#c054c2',
        btnText: item.btnText || 'Explore Products',
        btnLink: item.btnLink || '#products',
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData(PRESETS.derma);
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyPreset = (key) => {
    if (PRESETS[key]) {
      setFormData(PRESETS[key]);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
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
        setUploading(false);
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
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please upload a division image file first.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#ffc107" />
            {item ? 'Edit Strategic Division Card' : 'Add Strategic Division Card'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Quick Fill Presets */}
          {!item && (
            <div className="form-group" style={{ background: '#faf5fa', padding: '10px 14px', borderRadius: '10px', border: '1px solid #f3d4f5' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', marginBottom: '8px' }}>
                <Sparkles size={14} color="#c054c2" /> Quick Auto-Fill Preset Contents:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', border: '1px solid #a855f7', color: '#a855f7', fontWeight: 700 }}
                  onClick={() => applyPreset('derma')}
                >
                  Fill Derma Division
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', border: '1px solid #06b6d4', color: '#06b6d4', fontWeight: 700 }}
                  onClick={() => applyPreset('evara')}
                >
                  Fill Evara Division
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{ background: '#ffffff', border: '1px solid #6366f1', color: '#6366f1', fontWeight: 700 }}
                  onClick={() => applyPreset('elzac')}
                >
                  Fill Elzac Division
                </button>
              </div>
            </div>
          )}

          {/* Card Banner Image Upload */}
          <div className="form-group">
            <label className="form-label">Division Card Banner Image (Cloudinary Media Upload)</label>
            <div
              style={{
                border: '2px dashed #c054c2',
                borderRadius: '12px',
                padding: '1.25rem',
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
                    alt="Division Preview"
                    style={{
                      maxHeight: '140px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      border: '2px solid #c054c2',
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Division Banner Image Ready
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Click to select a different banner image file</span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={38} color="#c054c2" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploading ? 'Uploading Image to Cloudinary...' : 'Click to Upload Division Image File'}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    Supports PNG, JPG, WEBP formats
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Division Name</label>
              <input
                type="text"
                name="name"
                required
                className="form-control"
                placeholder="e.g. Derma Division, Evara Division"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subtitle Overlay Text</label>
              <input
                type="text"
                name="subtitle"
                className="form-control"
                placeholder="e.g. Science-Backed Skin Solutions"
                value={formData.subtitle}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Card Body Description</label>
            <textarea
              name="description"
              rows="3"
              required
              className="form-control"
              placeholder="e.g. Advanced skincare and dermatological products for healthier skin..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Theme Color Accent</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  name="themeColor"
                  value={formData.themeColor}
                  onChange={handleChange}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  name="themeColor"
                  className="form-control"
                  placeholder="#a855f7"
                  value={formData.themeColor}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                className="form-control"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Link Button Text</label>
              <input
                type="text"
                name="btnText"
                className="form-control"
                placeholder="Explore Products"
                value={formData.btnText}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link Destination URL</label>
              <input
                type="text"
                name="btnLink"
                className="form-control"
                placeholder="#products"
                value={formData.btnLink}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Division Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionModal;
