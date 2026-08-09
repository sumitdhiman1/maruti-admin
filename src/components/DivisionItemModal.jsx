import React, { useState, useEffect } from 'react';
import { X, Check, Layers } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

const DivisionItemModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: 'Science for Skin',
    description: '',
    image: '',
    productCount: 120,
    categoryTags: 'Acne Care, Anti-Aging, Pigmentation, Dermatitis',
    metaTags: '120+ SKUs, Prescription & OTC, Clinically Proven',
    exploreUrl: '/products',
    status: 'Active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        subtitle: item.subtitle || 'Science for Skin',
        description: item.description || '',
        image: item.image || '',
        productCount: item.productCount || 120,
        categoryTags: item.categoryTags || 'Acne Care, Anti-Aging, Pigmentation, Dermatitis',
        metaTags: item.metaTags || '120+ SKUs, Prescription & OTC, Clinically Proven',
        exploreUrl: item.exploreUrl || '/products',
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        subtitle: 'Science for Skin',
        description: '',
        image: '',
        productCount: 120,
        categoryTags: 'Acne Care, Anti-Aging, Pigmentation, Dermatitis',
        metaTags: '120+ SKUs, Prescription & OTC, Clinically Proven',
        exploreUrl: '/products',
        status: 'Active',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter Division Name.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(formData);
    } catch (err) {
      console.error('Error saving division:', err);
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
              <Layers size={20} color="#c054c2" />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>
                {item ? 'Edit Division Card' : 'Add New Division Card'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {item ? `Updating division #${item.id}` : 'Create a new strategic division section on /divisions page'}
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Division Name *</label>
                <input
                  className="form-control"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Derma Division or Enova Division"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Subhead / Tagline</label>
                <input
                  className="form-control"
                  value={formData.subtitle || ''}
                  onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Science for Skin"
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Division Description *</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed overview of therapies, formulations, and specialization..."
                required
              />
            </div>

            {/* Department-Style Common Drag & Drop Image Uploader */}
            <ImageUploadField
              label="Division Image (Drag & Drop or Click to Upload)"
              value={formData.image || ''}
              onChange={(url) => setFormData(prev => ({ ...prev, image: url || '' }))}
              placeholder="Drag & drop division photo here or browse"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Total Product Badge Count</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.productCount || 0}
                  onChange={e => setFormData({ ...formData, productCount: parseInt(e.target.value) || 0 })}
                  placeholder="e.g. 120"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status || 'Active'}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active (Visible on website)</option>
                  <option value="Disabled">Disabled (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Category Tags (comma separated)</label>
              <input
                className="form-control"
                value={formData.categoryTags || ''}
                onChange={e => setFormData({ ...formData, categoryTags: e.target.value })}
                placeholder="e.g. Acne Care, Anti-Aging, Pigmentation, Dermatitis"
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Footer Meta Info Items (comma separated)</label>
              <input
                className="form-control"
                value={formData.metaTags || ''}
                onChange={e => setFormData({ ...formData, metaTags: e.target.value })}
                placeholder="e.g. 120+ SKUs, Prescription & OTC, Clinically Proven"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving...' : item ? 'Update Division' : 'Add Division'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionItemModal;
