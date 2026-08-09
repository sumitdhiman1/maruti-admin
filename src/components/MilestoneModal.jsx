import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

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
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 className="modal-title">{item ? 'Edit Milestone' : 'Add New Milestone'}</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input
                  className="form-control"
                  value={formData.year}
                  onChange={e => setFormData({ ...formData, year: e.target.value, badgeText: e.target.value.slice(-2) })}
                  placeholder="e.g. 2017"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Month / Date</label>
                <input
                  className="form-control"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g. 12 May or April"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Text</label>
                <input
                  className="form-control"
                  value={formData.badgeText}
                  onChange={e => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="e.g. 17"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Milestone Description *</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter milestone details..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.sortOrder}
                  onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={18} /> {isSubmitting ? 'Saving...' : item ? 'Update Milestone' : 'Add Milestone'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MilestoneModal;
