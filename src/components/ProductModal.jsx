import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Package, UploadCloud, Loader2, ChevronDown, Search } from 'lucide-react';
import api from '../services/api';

const DEFAULT_DIVISIONS = ['Derma A', 'Derma B', 'Elzac', 'Evara'];

const ProductModal = ({ isOpen, onClose, onSave, item, existingCategories = [], existingDivisions = [] }) => {
  const [formData, setFormData] = useState({
    division: 'Derma A',
    category: 'General',
    name: '',
    composition: '',
    packing: '',
    imageUrl: '',
    sortOrder: 1,
    status: 'Active',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // DB-fetched categories
  const [dbCategories, setDbCategories] = useState([]);

  // Custom Category Dropdown State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const dropdownRef = useRef(null);

  // Fetch categories from DB whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setIsCatOpen(false);
      setCatSearch('');
      api.get('/product-categories')
        .then((res) => setDbCategories((res.data || []).map((c) => c.name)))
        .catch(() => setDbCategories([]));
    }
  }, [isOpen]);

  useEffect(() => {
    if (item) {
      setFormData({
        division: item.division || 'Derma A',
        category: item.category || 'General',
        name: item.name || '',
        composition: item.composition || '',
        packing: item.packing || '',
        imageUrl: item.imageUrl || '',
        sortOrder: item.sortOrder || 1,
        status: item.status || 'Active',
      });
    } else {
      setFormData({
        division: 'Derma A',
        category: 'General',
        name: '',
        composition: '',
        packing: '',
        imageUrl: '',
        sortOrder: 1,
        status: 'Active',
      });
    }
  }, [item, isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        if (response.data && (response.data.imageUrl || response.data.url)) {
          setFormData((prev) => ({ ...prev, imageUrl: response.data.imageUrl || response.data.url }));
        } else {
          setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
        }
      } catch (err) {
        console.warn('Upload fallback to local preview:', err.message);
        setFormData((prev) => ({ ...prev, imageUrl: base64Image }));
      } finally {
        setUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.category.trim()) {
      alert('Category name is required');
      return;
    }

    if (!formData.division || !formData.division.trim()) {
      alert('Division name is required');
      return;
    }

    if (!formData.name.trim()) {
      alert('Product name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        category: formData.category.trim(),
        division: formData.division.trim(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use DB-fetched categories, fall back to passed existingCategories prop
  const allCategories = Array.from(new Set(
    [...(dbCategories.length > 0 ? dbCategories : existingCategories)].filter(Boolean)
  )).sort();
  const categoryOptions = allCategories.map((cat) => ({ value: cat, label: cat }));

  const filteredCategoryOptions = categoryOptions.filter((opt) =>
    opt.label.toLowerCase().includes(catSearch.toLowerCase()) ||
    opt.value.toLowerCase().includes(catSearch.toLowerCase())
  );

  const allDivisions = Array.from(new Set([...existingDivisions, ...DEFAULT_DIVISIONS].filter(Boolean)));

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
          position: 'relative',
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '12px', background: '#faf5ff', color: '#9e4895', border: '1px solid #f3e8ff' }}>
              <Package size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                {item ? 'Edit Product Details' : 'Add New Product'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                {item ? `Updating SKU ID: #${item.id}` : 'Create a new pharmaceutical product entry in catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Division & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Division *
              </label>
              <select
                className="form-control"
                value={formData.division}
                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                required
                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              >
                {allDivisions.map((div) => (
                  <option key={div} value={div}>{div}</option>
                ))}
              </select>
            </div>

            {/* Custom Searchable Interactive Category Dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Category *
              </label>
              <div
                onClick={() => setIsCatOpen(!isCatOpen)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: isCatOpen ? '1px solid #9e4895' : '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: isCatOpen ? '0 0 0 3px rgba(158, 72, 149, 0.15)' : 'none',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {formData.category || 'Select Category...'}
                </span>
                <ChevronDown size={18} color="#64748b" style={{ transition: 'transform 0.2s ease', transform: isCatOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
              </div>

              {isCatOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    right: 0,
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '12px',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                    zIndex: 1000,
                    padding: '8px',
                  }}
                >
                  {/* Category Search Input */}
                  <div style={{ position: 'relative', marginBottom: '6px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Search category..."
                      value={catSearch}
                      onChange={(e) => setCatSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '100%',
                        paddingLeft: '30px',
                        paddingRight: '10px',
                        paddingTop: '6px',
                        paddingBottom: '6px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.82rem',
                      }}
                    />
                  </div>

                  {/* Scrollable Category List Container */}
                  <div
                    style={{
                      maxHeight: '190px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#c054c2 #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    {filteredCategoryOptions.length > 0 ? (
                      filteredCategoryOptions.map((opt) => {
                        const isSelected = formData.category.toLowerCase() === opt.value.toLowerCase();
                        return (
                          <div
                            key={opt.value}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, category: opt.value }));
                              setIsCatOpen(false);
                            }}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? '#9e4895' : '#334155',
                              background: isSelected ? '#faf5ff' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'background 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check size={16} color="#9e4895" />}
                          </div>
                        );
                      })
                    ) : (
                      <div
                        style={{
                          padding: '12px',
                          textAlign: 'center',
                          fontSize: '0.84rem',
                          color: '#64748b',
                          fontWeight: 600,
                          background: '#f8fafc',
                          borderRadius: '8px',
                        }}
                      >
                        No matching category found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Product Name *
            </label>
            <input
              className="form-control"
              type="text"
              placeholder="e.g. Ketomar Soap"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            />
          </div>

          {/* Composition */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Active Composition / Formula
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Ketoconazole 2% w/w & Cetrimide 0.5% w/w"
              value={formData.composition}
              onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'inherit' }}
            />
          </div>

          {/* Publication Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Publication Status
            </label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
            >
              <option value="Active">Active (Visible on website)</option>
              <option value="Disabled">Disabled (Hidden)</option>
            </select>
          </div>

          {/* Department-Style File Uploader */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Product Image Upload
            </label>
            <div
              style={{
                border: uploadingImage
                  ? '2px dashed #9e4895'
                  : formData.imageUrl
                  ? '2px solid #22c55e'
                  : '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center',
                background: uploadingImage ? '#faf5ff' : formData.imageUrl ? '#f0fdf4' : '#fafafa',
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
                  <Loader2 size={36} color="#9e4895" style={{ animation: 'spinSlow 1s linear infinite' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#9e4895' }}>
                    Uploading Image to Cloud...
                  </div>
                </div>
              ) : formData.imageUrl ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={formData.imageUrl}
                      alt="Product Preview"
                      style={{
                        maxHeight: '130px',
                        maxWidth: '100%',
                        objectFit: 'contain',
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
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    Image uploaded successfully! Click below to change.
                  </div>
                </div>
              ) : (
                <label style={{ width: '100%', height: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <UploadCloud size={40} color="#94a3b8" style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                    Drag &amp; Drop Product Image Here
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
                    or <span style={{ color: '#9e4895', fontWeight: 700 }}>click to browse files</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              )}
            </div>

            {/* Optional Direct URL Fallback */}
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                placeholder="Or paste direct image URL here..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', color: '#475569' }}
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(180deg, #d362c7 0%, #9e4895 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(158, 72, 149, 0.25)',
              }}
            >
              <Check size={18} />
              {isSubmitting ? 'Saving...' : item ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
