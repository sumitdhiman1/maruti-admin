import React, { useState, useEffect } from 'react';
import { X, Check, Flag, Sparkles } from 'lucide-react';

const MilestoneModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    year: '',
    date: '',
    description: '',
    badgeText: '',
    sortOrder: 1,
    status: 'Active',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        year: item.year || '',
        date: item.date || '',
        description: item.description || '',
        badgeText: item.badgeText || (item.year ? item.year.slice(-2) : ''),
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        year: '',
        date: '',
        description: '',
        badgeText: '',
        sortOrder: 1,
        status: 'Active',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.year.trim() || !formData.description.trim()) {
      alert('Please fill in Year and Description.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave({
        ...formData,
        badgeText: formData.badgeText || formData.year.slice(-2),
      });
    } catch (err) {
      console.error('Error saving milestone:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(192, 84, 194, 0.2)', border: '1px solid #c054c2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag size={20} color="#c054c2" />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0 }}>
                {item ? 'Edit Milestone Item' : 'Add New Milestone Item'}
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                {item ? `Updating record #${item.id}` : 'Create a new milestone on the company history timeline'}
              </div>
            </div>
          </div>
          
          <button className="btn-close" onClick={onClose} style={{ color: '#ffffff', background: 'rgba(255,255,255,0.1)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '1.5rem' }}>
            
            {/* Year, Date, Badge Input Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Year *</label>
                <input
                  className="form-control"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value, badgeText: e.target.value.slice(-2) })}
                  placeholder="e.g. 2017"
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Month / Date</label>
                <input
                  className="form-control"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 12 May or April"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Badge Circle Text</label>
                <input
                  className="form-control"
                  value={formData.badgeText}
                  onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. 17"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Milestone Description *</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter milestone accomplishment details..."
                required
              />
            </div>

            {/* Sort Order & Status Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Sort Order Index</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active (Visible on website)</option>
                  <option value="Disabled">Disabled (Hidden)</option>
                </select>
              </div>
            </div>

            {/* Badge Live Preview Card */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #0e0714, #260e36)',
                border: '2px solid #c054c2', color: '#ffffff',
                fontWeight: 900, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {formData.badgeText || (formData.year ? formData.year.slice(-2) : '00')}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c054c2', textTransform: 'uppercase' }}>Live Badge Preview</div>
                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600 }}>
                  {formData.year || 'YEAR'} &bull; {formData.date || 'DATE'}
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving Changes...' : item ? 'Update Milestone' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
