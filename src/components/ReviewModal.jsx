import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Star, Quote, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ReviewModal = ({ isOpen, onClose, onSave, item = null }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientDesignation: 'Chief Medical Officer, HealthCare Plus',
    reviewText: 'Maruti Pharma has consistently delivered high-quality products on time. Their commitment to excellence and compliance is truly commendable.',
    rating: 5,
    avatarUrl: '',
    sortOrder: 1,
    status: 'Active',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        clientName: item.clientName || '',
        clientDesignation: item.clientDesignation || '',
        reviewText: item.reviewText || '',
        rating: item.rating || 5,
        avatarUrl: item.avatarUrl || '',
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        clientName: '',
        clientDesignation: 'Chief Medical Officer, HealthCare Plus',
        reviewText: 'Maruti Pharma has consistently delivered high-quality products on time. Their commitment to excellence and compliance is truly commendable.',
        rating: 5,
        avatarUrl: '',
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
          avatarUrl: response.data.imageUrl,
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
        avatarUrl: event.target.result,
      }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Quote size={20} color="#ffc107" />
            {item ? 'Edit Client Review' : 'Add New Client Review'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Avatar Image Upload */}
          <div className="form-group">
            <label className="form-label">Client Photo / Avatar (Cloudinary Media Upload)</label>
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
              {formData.avatarUrl ? (
                <div>
                  <img
                    src={formData.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'}
                    alt="Avatar Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
                    }}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginBottom: '8px',
                      border: '2px solid #c054c2',
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Photo Upload Ready
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Click to select a different photo</span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={38} color="#c054c2" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploading ? 'Uploading Photo to Cloudinary...' : 'Click to Upload Client Avatar Photo'}
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
              <label className="form-label">Client Name</label>
              <input
                type="text"
                name="clientName"
                required
                className="form-control"
                placeholder="e.g. Dr. Anil Sharma"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Rating (Stars)</label>
              <select
                name="rating"
                className="form-control"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Designation & Company</label>
            <input
              type="text"
              name="clientDesignation"
              className="form-control"
              placeholder="e.g. Chief Medical Officer, HealthCare Plus"
              value={formData.clientDesignation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Review Text / Testimonial</label>
            <textarea
              name="reviewText"
              rows="3"
              required
              className="form-control"
              placeholder="e.g. Maruti Pharma has consistently delivered high-quality products..."
              value={formData.reviewText}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
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
              Save Client Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
