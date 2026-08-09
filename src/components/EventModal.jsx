import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Calendar, MapPin, Trash2, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import api from '../services/api';

const EventModal = ({ isOpen, onClose, onSave, item = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: 'Kathmandu, Nepal',
    description: '',
    eventDate: '',
    images: [],
    sortOrder: 1,
    status: 'Active',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        location: item.location || 'Kathmandu, Nepal',
        description: item.description || '',
        eventDate: item.eventDate || '',
        images: Array.isArray(item.images) ? item.images : [],
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        title: '',
        location: 'Kathmandu, Nepal',
        description: '',
        eventDate: '',
        images: [],
        sortOrder: 1,
        status: 'Active',
      });
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

  // Multiple Image File Upload Handler with Cloudinary support
  const handleMultipleFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      try {
        const response = await api.post('/upload', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data?.imageUrl) {
          uploadedUrls.push(response.data.imageUrl);
          continue;
        }
      } catch (err) {
        console.warn('Upload fallback to base64 preview:', err.message);
      }

      // Fallback base64 read
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });
      uploadedUrls.push(base64);
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setUploading(false);
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Please upload at least 1 photo for this event.');
      return;
    }
    onSave(formData);
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
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9e4895', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Events &amp; Media Gallery
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '2px 0 0 0' }}>
              {item ? 'Edit Event & Photos' : 'Add New Event & Photos'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Multiple File Drag & Drop Box */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span>Upload Event Photos (Multiple Selection Allowed) 📸</span>
              <span style={{ fontSize: '0.8rem', color: '#9e4895', fontWeight: 800 }}>
                {formData.images.length} Photos Added
              </span>
            </label>

            <div
              style={{
                border: '2px dashed #d362c7',
                borderRadius: '14px',
                padding: '24px',
                textAlign: 'center',
                background: '#faf5ff',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {uploading ? (
                <Loader2 size={36} color="#9e4895" className="animate-spin" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              ) : (
                <UploadCloud size={36} color="#9e4895" style={{ margin: '0 auto 8px auto', display: 'block' }} />
              )}
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {uploading ? 'Uploading Multiple Photos...' : 'Click or Drag to Upload Multiple Photos'}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Select multiple JPG, PNG, WEBP files
              </p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleFilesUpload}
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

            {/* Uploaded Thumbnails Grid */}
            {formData.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '10px', marginTop: '14px' }}>
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', height: '65px', border: '1.5px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                    <img src={imgUrl} alt={`Event photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      title="Remove Photo"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              name="title"
              required
              className="form-control"
              placeholder="e.g. Nepal Health & Pharma Expo 2024"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Event Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Kathmandu, Nepal"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Event Date</label>
              <input
                type="date"
                name="eventDate"
                className="form-control"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">Event Description *</label>
            <textarea
              name="description"
              rows={4}
              required
              className="form-control"
              placeholder="e.g. Connecting with healthcare leaders and showcasing innovative pharma solutions..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Display Order</label>
              <input
                type="number"
                name="sortOrder"
                className="form-control"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1.5px solid #e2e8f0',
                background: '#ffffff',
                color: '#475569',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', borderRadius: '8px', fontWeight: 700 }}
            >
              Save Event &amp; Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
