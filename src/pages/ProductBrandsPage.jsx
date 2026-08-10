import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductBrandModal from '../components/ProductBrandModal';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  RefreshCw,
  Image as ImageIcon,
  Layers,
  Power,
} from 'lucide-react';

const ProductBrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get('/product-brands');
      setBrands(res.data || []);
    } catch (err) {
      console.error('Failed to fetch product brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBrand(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete product brand category "${title || id}"?`)) {
      try {
        await api.delete(`/product-brands/${id}`);
        showToast('Brand category deleted successfully 🗑️');
        fetchBrands();
      } catch (err) {
        alert('Failed to delete brand category');
      }
    }
  };

  const handleToggleActive = async (brand) => {
    try {
      await api.put(`/product-brands/${brand.id}`, {
        isActive: !brand.isActive,
      });
      showToast(`Status updated to ${!brand.isActive ? 'Active' : 'Inactive'}`);
      fetchBrands();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #0e0714, #260e36)',
            color: '#ffffff',
            border: '2px solid #c054c2',
            padding: '14px 22px',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <CheckCircle size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Website products page updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#9e4895', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Products Page Slider &amp; Brands
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            MPPL Product Brands Manager
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Manage brand categories, Cloudinary uploaded logos &amp; product brand sliders on the website products page.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchBrands} style={{ padding: '10px 18px', borderRadius: '10px' }}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={handleOpenAddModal} style={{ padding: '10px 22px', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} /> Add New Brand Category
          </button>
        </div>
      </div>

      {/* Brands Category Grid */}
      {loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          Loading product brands...
        </div>
      ) : brands.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
          {brands.map((brand) => {
            const images = Array.isArray(brand.images) ? brand.images : [];

            return (
              <div
                key={brand.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  {/* Badge Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #efc2e9, #d362c7)',
                        color: '#9e4895',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        padding: '4px 14px',
                        borderRadius: '20px',
                      }}
                    >
                      {brand.badgeTitle || '1st Brand in Nepal'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(brand)}
                      style={{
                        border: 'none',
                        background: brand.isActive ? '#f0fdf4' : '#fef2f2',
                        color: brand.isActive ? '#16a34a' : '#ef4444',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Power size={13} /> {brand.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
                    {brand.title || 'Product Brands Group'}
                  </h3>

                  {/* Images Grid Showcase */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '10px', background: '#faf5ff', padding: '14px', borderRadius: '14px', border: '1px solid #f3e8ff' }}>
                    {images.length > 0 ? (
                      images.map((imgUrl, idx) => (
                        <div key={idx} style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                          <img src={imgUrl} alt={`Brand ${idx + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', padding: '4px' }} />
                        </div>
                      ))
                    ) : (
                      <div style={{ gridColumn: '1 / -1', textStyle: 'center', color: '#94a3b8', fontSize: '0.82rem', padding: '10px' }}>
                        No brand images uploaded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                    {images.length} Brand Logo(s)
                  </span>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenEditModal(brand)}
                      style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(brand.id, brand.title)}
                      style={{ padding: '6px 12px', borderRadius: '8px' }}
                      title="Delete Category"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          No product brand categories found. Click "Add New Brand Category" to create one.
        </div>
      )}

      {/* Product Brand Modal */}
      <ProductBrandModal
        brand={editingBrand}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {
          fetchBrands();
          showToast('Product brands updated successfully! 🎉');
        }}
      />
    </div>
  );
};

export default ProductBrandsPage;
