import React, { useState, useEffect } from 'react';
import { X, Check, UploadCloud, Loader2 } from 'lucide-react';
import api from '../services/api';

const DepartmentModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    overview: '',
    objectives: '',
    responsibilities: '',
    icon: 'Building2',
    imageUrl: '',
    sortOrder: 1,
    status: 'Active',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      let objStr = item.objectives;
      if (Array.isArray(item.objectives)) {
        objStr = item.objectives.join('\n');
      } else if (typeof item.objectives === 'string' && item.objectives.startsWith('[')) {
        try {
          objStr = JSON.parse(item.objectives).join('\n');
        } catch {
          objStr = item.objectives;
        }
      }

      let respStr = item.responsibilities;
      if (Array.isArray(item.responsibilities)) {
        respStr = item.responsibilities.join('\n');
      } else if (typeof item.responsibilities === 'string' && item.responsibilities.startsWith('[')) {
        try {
          respStr = JSON.parse(item.responsibilities).join('\n');
        } catch {
          respStr = item.responsibilities;
        }
      }

      setFormData({
        name: item.name || '',
        subtitle: item.subtitle || '',
        overview: item.overview || '',
        objectives: objStr || '',
        responsibilities: respStr || '',
        icon: item.icon || 'Building2',
        imageUrl: item.imageUrl || '',
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        subtitle: '',
        overview: '',
        objectives: '',
        responsibilities: '',
        icon: 'Building2',
        imageUrl: '',
        sortOrder: 1,
        status: 'Active',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Image = event.target.result;
      try {
        const response = await api.post('/upload', { image: base64Image });
        if (response.data && response.data.imageUrl) {
          setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
        }
      } catch (err) {
        console.warn('Cloudinary upload fallback to image preview:', err.message);
        setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.overview.trim()) {
      alert('Please fill in Department Name and Overview.');
      return;
    }

    const objArray = formData.objectives
      ? formData.objectives.split('\n').map((line) => line.trim()).filter(Boolean)
      : [];
    const respArray = formData.responsibilities
      ? formData.responsibilities.split('\n').map((line) => line.trim()).filter(Boolean)
      : [];

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        objectives: JSON.stringify(objArray),
        responsibilities: JSON.stringify(respArray),
      });
    } catch (err) {
      console.error('Error saving department:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div className="modal-content" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3 className="modal-title">{item ? 'Edit Department' : 'Add New Department'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Quality Control (QC)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label">Subtitle / Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rigorous Testing & Standardized Quality"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Department Overview & Description *</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Comprehensive overview of department functions and standards..."
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Key Objectives (One item per line)</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Establish desired quality standards&#10;Discover flaws in raw materials&#10;Evaluate production methods"
                value={formData.objectives}
                onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Core Responsibilities (One item per line)</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Analyze all incoming raw materials as per IP, BP, USP&#10;Monitor stability of products throughout shelf life&#10;Ensure cGMP and WHO compliance"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              />
            </div>

            {/* Premium Department Image Drag & Drop Dropzone */}
            <div>
              <label className="form-label" style={{ fontWeight: 700, color: '#0f172a' }}>Department Banner Image</label>
              <div
                style={{
                  border: uploadingImage
                    ? '2px dashed #c054c2'
                    : formData.imageUrl
                    ? '2px solid #22c55e'
                    : '2px dashed #cbd5e1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  textAlign: 'center',
                  background: uploadingImage ? '#fdf4ff' : formData.imageUrl ? '#f0fdf4' : '#fafafa',
                  cursor: uploadingImage ? 'wait' : 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '140px',
                }}
              >
                {uploadingImage ? (
                  <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <Loader2 size={38} color="#c054c2" style={{ animation: 'spinSlow 1s linear infinite' }} />
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#c054c2' }}>
                      Uploading Image to Cloudinary...
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Please wait a moment while your image is saved to the cloud
                    </div>
                  </div>
                ) : formData.imageUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={formData.imageUrl}
                        alt="Department Banner Preview"
                        style={{
                          maxHeight: '130px',
                          maxWidth: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #22c55e',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setFormData((prev) => ({ ...prev, imageUrl: '' }));
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          background: '#ef4444',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                        title="Remove Image"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                      <Check size={16} /> Cloudinary Image Ready
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                      Click or Drag & Drop a new image to replace
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
                      <UploadCloud size={26} color="#c054c2" />
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                      Drag & Drop Department Image Here
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      or click to browse from computer (PNG, JPG, WEBP)
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: uploadingImage ? 'wait' : 'pointer',
                    width: '100%',
                    height: '100%',
                    zIndex: 2,
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label">Icon Name</label>
                <select
                  className="form-control"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                >
                  <option value="Building2">Building2</option>
                  <option value="TrendingUp">TrendingUp (Marketing)</option>
                  <option value="ShieldCheck">ShieldCheck (QC)</option>
                  <option value="Award">Award (QA)</option>
                  <option value="Factory">Factory (Production)</option>
                  <option value="Layers">Layers (PMT)</option>
                  <option value="Wrench">Wrench (Engineering)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className="modal-footer"
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                margin: 0,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || uploadingImage}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: isSubmitting || uploadingImage ? 'wait' : 'pointer',
                background: 'linear-gradient(135deg, #c054c2, #8b318d)',
                border: 'none',
                color: '#ffffff',
                margin: 0,
                minWidth: '160px',
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spinSlow 1s linear infinite' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Save Department</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
