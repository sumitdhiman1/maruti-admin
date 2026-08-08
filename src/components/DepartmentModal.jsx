import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const DepartmentModal = ({ isOpen, onClose, onSave, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    overview: '',
    objectives: '',
    responsibilities: '',
    icon: 'Building2',
    sortOrder: 1,
    status: 'Active',
  });

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
        sortOrder: 1,
        status: 'Active',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
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

    onSave({
      ...formData,
      objectives: JSON.stringify(objArray),
      responsibilities: JSON.stringify(respArray),
    });
  };

  return (
    <div className="modal-backdrop">
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                <label className="form-label">Sort Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                />
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

          <div className="modal-footer" style={{ marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Check size={16} /> Save Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentModal;
