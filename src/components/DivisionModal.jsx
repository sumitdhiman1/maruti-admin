import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { X, UploadCloud, CheckCircle, Package, Plus, Layers, Tag } from 'lucide-react';

const DEFAULT_DIVISIONS = ['Derma', 'Evara', 'Elzac'];

const emptyForm = {
  division: 'Derma',
  customDivision: '',
  isCustomDivision: false,
  category: 'CORTICOSTEROIDS',
  customCategory: '',
  isCustomCategory: false,
  name: '',
  composition: '',
  packing: '',
  imageUrl: '',
  themeColor: '#c054c2',
  status: 'Active',
};

const DivisionModal = ({ isOpen, onClose, onSave, item = null, existingProducts = [] }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  // Compute all available Divisions dynamically from database & defaults
  const divisionOptions = useMemo(() => {
    const dbDivisions = existingProducts.map((p) => p.division).filter(Boolean);
    const combined = Array.from(new Set([...DEFAULT_DIVISIONS, ...dbDivisions])).sort();
    return combined;
  }, [existingProducts]);

  // Compute all available Categories dynamically for the selected division
  const currentDivisionName = formData.isCustomDivision
    ? formData.customDivision
    : formData.division;

  const categoryOptions = useMemo(() => {
    const dbCats = existingProducts
      .filter((p) => p.division === currentDivisionName)
      .map((p) => p.category)
      .filter(Boolean);

    const combined = Array.from(new Set(dbCats)).sort();
    return combined.length > 0 ? combined : ['General'];
  }, [currentDivisionName, existingProducts]);

  useEffect(() => {
    if (item) {
      const isCustomDiv = !divisionOptions.includes(item.division);
      const isCustomCat = !categoryOptions.includes(item.category);

      setFormData({
        division: isCustomDiv ? '__CUSTOM_DIV__' : item.division || 'Derma',
        customDivision: isCustomDiv ? item.division : '',
        isCustomDivision: isCustomDiv,
        category: isCustomCat ? '__CUSTOM_CAT__' : item.category || 'General',
        customCategory: isCustomCat ? item.category : '',
        isCustomCategory: isCustomCat,
        name: item.name || '',
        composition: item.composition || '',
        packing: item.packing || '',
        imageUrl: item.imageUrl || '',
        themeColor: item.themeColor || '#c054c2',
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        ...emptyForm,
        division: divisionOptions[0] || 'Derma',
        category: categoryOptions[0] || 'General',
      });
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleDivisionSelect = (e) => {
    const val = e.target.value;
    if (val === '__CUSTOM_DIV__') {
      setFormData((prev) => ({
        ...prev,
        division: '__CUSTOM_DIV__',
        isCustomDivision: true,
        customDivision: '',
        category: '__CUSTOM_CAT__',
        isCustomCategory: true,
        customCategory: '',
      }));
    } else {
      const dbCats = existingProducts
        .filter((p) => p.division === val)
        .map((p) => p.category)
        .filter(Boolean);
      const cats = Array.from(new Set(dbCats)).sort();

      setFormData((prev) => ({
        ...prev,
        division: val,
        isCustomDivision: false,
        customDivision: '',
        category: cats[0] || 'General',
        isCustomCategory: false,
        customCategory: '',
      }));
    }
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === '__CUSTOM_CAT__') {
      setFormData((prev) => ({
        ...prev,
        category: '__CUSTOM_CAT__',
        isCustomCategory: true,
        customCategory: '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        category: val,
        isCustomCategory: false,
        customCategory: '',
      }));
    }
  };

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
          imageUrl: response.data.imageUrl,
        }));
        setUploading(false);
        return;
      }
    } catch (err) {
      console.warn('Backend upload note:', err.message);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: event.target.result,
      }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalDivision = formData.isCustomDivision
      ? formData.customDivision.trim()
      : formData.division;

    const finalCategory = formData.isCustomCategory
      ? formData.customCategory.trim().toUpperCase()
      : formData.category;

    if (!finalDivision) {
      alert('Please select or enter a Division name.');
      return;
    }

    if (!finalCategory) {
      alert('Please select or enter a Category name.');
      return;
    }

    if (!formData.name.trim()) {
      alert('Please enter a Product name.');
      return;
    }

    onSave({
      ...formData,
      division: finalDivision,
      category: finalCategory,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#c054c2" />
            {item ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Division Select */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Division / Product Line *</label>
              <select
                className="form-control"
                value={formData.isCustomDivision ? '__CUSTOM_DIV__' : formData.division}
                onChange={handleDivisionSelect}
                required
              >
                {divisionOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
                <option value="__CUSTOM_DIV__">+ Create New Division...</option>
              </select>
            </div>

            {/* Category Select */}
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category *</label>
              <select
                className="form-control"
                value={formData.isCustomCategory ? '__CUSTOM_CAT__' : formData.category}
                onChange={handleCategorySelect}
                required
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="__CUSTOM_CAT__">+ Create New Category...</option>
              </select>
            </div>
          </div>

          {/* Inputs for Custom Division or Category */}
          {formData.isCustomDivision && (
            <div className="form-group" style={{ background: '#faf5ff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <label className="form-label" style={{ color: '#a855f7', fontWeight: 700 }}>
                New Division Name *
              </label>
              <input
                type="text"
                name="customDivision"
                className="form-control"
                placeholder="e.g. Derma C, Cardiology, Pediatrics"
                value={formData.customDivision}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
          )}

          {formData.isCustomCategory && (
            <div className="form-group" style={{ background: '#fef2f2', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
              <label className="form-label" style={{ color: '#dc2626', fontWeight: 700 }}>
                New Category Name *
              </label>
              <input
                type="text"
                name="customCategory"
                className="form-control"
                placeholder="e.g. CORTICOSTEROIDS, VACCINES, SYRUPS"
                value={formData.customCategory}
                onChange={handleChange}
                required
                autoFocus={!formData.isCustomDivision}
              />
            </div>
          )}

          {/* Product Name */}
          <div className="form-group">
            <label className="form-label">Product Name (Bold Header) *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. HALOBET CREAM, PYRONIL TABLET"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Composition Formula */}
          <div className="form-group">
            <label className="form-label">Composition / Formula / Ingredients</label>
            <textarea
              name="composition"
              className="form-control"
              rows={3}
              placeholder="e.g. HALOBETASOL PROPIONATE USP 0.05%w/w 15/30g"
              value={formData.composition}
              onChange={handleChange}
            />
          </div>

          {/* Packing & Display Status */}
          <div className="form-row">
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Packing / Unit Size (Optional)</label>
              <input
                type="text"
                name="packing"
                className="form-control"
                placeholder="e.g. 10x10 Tablets, 15g Tube"
                value={formData.packing}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Display Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active (Visible)</option>
                <option value="Hidden">Hidden</option>
              </select>
            </div>
          </div>

          {/* Product Image (Optional) */}
          <div className="form-group">
            <label className="form-label">Product Image / Banner (Optional)</label>
            <div
              style={{
                border: '2px dashed #c054c2',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                background: '#faf5fa',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {formData.imageUrl ? (
                <div>
                  <img
                    src={formData.imageUrl}
                    alt="Product Preview"
                    style={{
                      maxHeight: '120px',
                      maxWidth: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '6px',
                      border: '2px solid #c054c2',
                    }}
                  />
                  <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <CheckCircle size={16} /> Image Selected
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud size={32} color="#c054c2" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    {uploading ? 'Uploading Image...' : 'Click to Upload Product Image (Optional)'}
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  cursor: 'pointer',
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {item ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DivisionModal;
