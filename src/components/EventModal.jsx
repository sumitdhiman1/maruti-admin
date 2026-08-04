import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Calendar, MapPin, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
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

  // Multiple Image File Upload Handler
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
        console.warn('Upload warning, fallback to base64 preview:', err.message);
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
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} color="#ffc107" />
            {item ? 'Edit Event Details & Photos' : 'Add New Event & Gallery Photos'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Multiple Image Upload Dropzone */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Event Photos Gallery (Multiple Photo Upload) 📸</span>
              <span style={{ fontSize: '0.8rem', color: '#c054c2', fontWeight: 700 }}>
                {formData.images.length} Photos Selected
              </span>
            </label>

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
              <UploadCloud size={38} color="#c054c2" style={{ marginBottom: '6px' }} />
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                {uploading ? 'Uploading Multiple Photos to Cloudinary ☁️...' : 'Click or Drag to Upload Multiple Event Photos'}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                Select multiple JPG, PNG, WEBP files simultaneously
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

            {/* Uploaded Photos Grid Preview */}
            {formData.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', marginTop: '1rem' }}>
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '70px', border: '1px solid #c054c2' }}>
                    <img src={imgUrl} alt={`Uploaded ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(227, 24, 55, 0.85)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Event Title</label>
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#c054c2" /> Location Pin
              </label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Kathmandu, Nepal"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
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

          <div className="form-group">
            <label className="form-label">Event Description</label>
            <textarea
              name="description"
              rows="3"
              required
              className="form-control"
              placeholder="e.g. Connecting with healthcare leaders and showcasing innovative pharma solutions..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                name="sortOrder"
                className="form-control"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Event & Gallery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
