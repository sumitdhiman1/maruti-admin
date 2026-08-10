import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, Upload, Trash2, Plus, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

const ProductBrandModal = ({ brand, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    badgeTitle: '1st Brand in Nepal',
    title: 'Dermatology Brands',
    images: [],
    orderIndex: 0,
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (brand) {
      setFormData({
        badgeTitle: brand.badgeTitle || '1st Brand in Nepal',
        title: brand.title || '',
        images: Array.isArray(brand.images) ? brand.images : [],
        orderIndex: brand.orderIndex || 0,
        isActive: brand.isActive !== undefined ? brand.isActive : true,
      });
    } else {
      setFormData({
        badgeTitle: '1st Brand in Nepal',
        title: '',
        images: [],
        orderIndex: 0,
        isActive: true,
      });
    }
  }, [brand, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Upload multiple images to Cloudinary
  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    try {
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const res = await api.post('/upload', body, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data && res.data.imageUrl) {
          uploadedUrls.push(res.data.imageUrl);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      alert('Failed to upload brand images to Cloudinary: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Please upload at least one brand image.');
      return;
    }

    setSaving(true);
    try {
      if (brand && brand.id) {
        await api.put(`/product-brands/${brand.id}`, formData);
      } else {
        await api.post('/product-brands', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      alert('Failed to save product brand category: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 15, 26, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '28px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={22} color="#9e4895" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {brand ? 'Edit Product Brand Category' : 'Add New Product Brand Category'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Badge Title Input */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label" style={{ fontWeight: 800 }}>Brand Badge Header Title *</label>
            <input
              type="text"
              name="badgeTitle"
              required
              className="form-control"
              placeholder="e.g. 1st Brand in Nepal"
              value={formData.badgeTitle}
              onChange={handleInputChange}
            />
          </div>

          {/* Section Sub-Title Input */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontWeight: 800 }}>Category Title / Description</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Derma Products Brand Collection"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Multiple Cloudinary Images Upload */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Upload Brand Images to Cloudinary *</span>
              <span style={{ fontSize: '0.8rem', color: '#9e4895', fontWeight: 700 }}>
                {formData.images.length} Image(s) Uploaded
              </span>
            </label>

            {/* Drag & Drop Upload Zone */}
            <div
              style={{
                border: '2px dashed #c054c2',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                background: '#faf5ff',
                cursor: 'pointer',
                position: 'relative',
                marginBottom: '16px',
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleUpload}
                disabled={uploading}
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
              <Upload size={32} color="#9e4895" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                {uploading ? 'Uploading Images to Cloudinary...' : 'Click or Drag & Drop Multiple Brand Images'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                Supports JPG, PNG, WEBP, SVG images. Multiple file selection allowed.
              </div>
            </div>

            {/* Grid Preview of Uploaded Images */}
            {formData.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      height: '90px',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Brand ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Remove Image"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Switch */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="isActiveBrand"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="isActiveBrand" style={{ fontWeight: 700, color: '#0f172a', cursor: 'pointer', fontSize: '0.92rem' }}>
              Active (Show in website products page)
            </label>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: '10px', fontWeight: 800 }}>
              {saving ? 'Saving...' : 'Save Product Brand Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductBrandModal;
