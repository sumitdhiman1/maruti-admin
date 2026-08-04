import React, { useState, useEffect } from 'react';
import { X, UploadCloud, Award, CheckCircle } from 'lucide-react';
import api from '../services/api';

const CertificationModal = ({ isOpen, onClose, onSave, item = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    highlightWord: 'Certified',
    description: '',
    iconUrl: '',
    sortOrder: 1,
    status: 'Active',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        highlightWord: item.highlightWord || 'Certified',
        description: item.description || '',
        iconUrl: item.iconUrl || '',
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        title: '',
        highlightWord: 'Certified',
        description: '',
        iconUrl: '',
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
          iconUrl: response.data.imageUrl,
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
        iconUrl: event.target.result,
      }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.iconUrl) {
      alert('Please upload a badge icon image.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="#ffc107" />
            {item ? 'Edit Quality Highlight' : 'Add Certification / Quality Highlight'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Badge Icon Upload Dropzone */}
          <div className="form-group">
            <label className="form-label">Badge Icon / Seal Image Upload</label>
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
              {formData.iconUrl ? (
                <div>
                  <img
                    src={formData.iconUrl}
                    alt="Icon Badge Preview"
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'contain',
                      borderRadius: '50%',
                      padding: '6px',
                      background: 'white',
                      border: '2px solid #c054c2',
                      marginBottom: '8px',
                      boxShadow: '0 4px 15px rgba(192, 84, 194, 0.25)',
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Icon Uploaded Successfully
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Click to select a different icon file</span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={36} color="#c054c2" style={{ marginBottom: '6px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploading ? 'Uploading Icon Image...' : 'Click to Upload Badge Icon File'}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    Supports PNG, SVG, WEBP seal & badge icons
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
              <label className="form-label">Title (Main Text)</label>
              <input
                type="text"
                name="title"
                required
                className="form-control"
                placeholder="e.g. WHO-GMP, ISO 9001:2015, or Quality"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Accent Word (Italic Styled)</label>
              <input
                type="text"
                name="highlightWord"
                className="form-control"
                placeholder="e.g. Certified or Assurance"
                value={formData.highlightWord}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description Paragraph</label>
            <textarea
              name="description"
              rows="3"
              required
              className="form-control"
              placeholder="e.g. Manufactured under internationally recognized quality standards..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Display Sort Order</label>
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
              Save Highlight Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;
