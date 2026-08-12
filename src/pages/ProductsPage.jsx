import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductModal from '../components/ProductModal';
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  Search,
  Sparkles,
  Filter,
  RefreshCw,
  Database,
  Layers,
  Tag,
  X,
  ZoomIn,
} from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDivisionTab, setActiveDivisionTab] = useState('All');
  const [activeCategoryTab, setActiveCategoryTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/products/${editingItem.id}`, formData);
        showToast('Product updated successfully! 🎉');
      } else {
        const nextOrder = products.length > 0 ? Math.max(...products.map((p) => p.sortOrder || 1)) + 1 : 1;
        await api.post('/products', { ...formData, sortOrder: nextOrder });
        showToast('New Product added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete product "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        showToast('Product deleted successfully! 🗑️');
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSeedProducts = async () => {
    if (window.confirm('Reset catalog and load initial 155 Excel Products?')) {
      try {
        setSeeding(true);
        const res = await api.post('/products/seed');
        showToast(`Loaded ${res.data.count || 154} Products from catalog seed! 🎉`);
        fetchProducts();
      } catch (err) {
        alert('Failed to seed products catalog.');
      } finally {
        setSeeding(false);
      }
    }
  };

  const handleMigrateDerma = async () => {
    if (window.confirm('This will rename all existing "Derma A" and "Derma B" products in the database to just "Derma". Continue?')) {
      try {
        setMigrating(true);
        const res = await api.post('/products/migrate-derma');
        showToast(res.data.message || 'Migration complete! ✅');
        fetchProducts();
      } catch (err) {
        alert('Migration failed: ' + (err.response?.data?.message || err.message));
      } finally {
        setMigrating(false);
      }
    }
  };

  const divisionsList = ['All', 'Derma', 'Elzac', 'Evara'];
  
  // Dynamic categories based on division selection
  const categoriesList = ['All', ...Array.from(new Set(
    products
      .filter(p => activeDivisionTab === 'All' || p.division === activeDivisionTab)
      .map(p => p.category)
      .filter(Boolean)
  ))];

  const filteredProducts = products.filter((p) => {
    const matchesDiv = activeDivisionTab === 'All' || p.division === activeDivisionTab;
    const matchesCat = activeCategoryTab === 'All' || p.category === activeCategoryTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.composition?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);

    return matchesDiv && matchesCat && matchesSearch;
  });

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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live website products page updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#c054c2',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={16} /> Pharmaceutical Catalog Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Products Catalog
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleMigrateDerma}
            disabled={migrating}
            title="Rename all Derma A / Derma B → Derma in the database"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #f59e0b',
              background: '#fffbeb', color: '#92400e', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
            }}
          >
            {migrating ? '⏳ Migrating...' : '🔀 Merge Derma A+B → Derma'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Division Tabs Header */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginRight: '8px' }}>
            <Layers size={18} color="#c054c2" /> Divisions:
          </div>
          {divisionsList.map((div) => {
            const count = div === 'All' ? products.length : products.filter(p => p.division === div).length;
            const isActive = activeDivisionTab === div;

            return (
              <button
                key={div}
                onClick={() => {
                  setActiveDivisionTab(div);
                  setActiveCategoryTab('All');
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '100px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: isActive ? 'none' : '1px solid #e2e8f0',
                  background: isActive ? 'linear-gradient(180deg, #d362c7 0%, #9e4895 100%)' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(158, 72, 149, 0.25)' : 'none',
                }}
              >
                <span>{div}</span>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    background: isActive ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#64748b',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by product name, composition or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '10px' }}
            />
          </div>

          {/* Category Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={16} color="#64748b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Category:</span>
            <select
              className="form-control"
              value={activeCategoryTab}
              onChange={(e) => setActiveCategoryTab(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '10px', width: 'auto', minWidth: '180px' }}
            >
              {categoriesList.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || activeDivisionTab !== 'All' || activeCategoryTab !== 'All') && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery('');
                setActiveDivisionTab('All');
                setActiveCategoryTab('All');
              }}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#c054c2" /> Product Items ({filteredProducts.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredProducts.length} of {products.length} catalog items
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading products catalog...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            No products found matching your search filters.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Division</th>
                  <th>Category</th>
                  <th>Composition</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          onClick={() => setPreviewImage(p)}
                          title="Click to view full image"
                          style={{
                            position: 'relative',
                            cursor: 'pointer',
                            flexShrink: 0,
                            borderRadius: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={p.imageUrl || '/assets/images/default-product.png'}
                            alt={p.name}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '10px',
                              objectFit: 'cover',
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              display: 'block',
                              transition: 'transform 0.2s ease',
                            }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/assets/images/default-product.png';
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(158, 72, 149, 0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                          >
                            <ZoomIn size={18} color="#ffffff" />
                          </div>
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-purple" style={{ padding: '4px 10px', borderRadius: '12px' }}>
                        {p.division}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#334155', fontSize: '0.88rem' }}>
                        {p.category}
                      </span>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.85rem', maxWidth: '320px' }}>
                      {p.composition || '-'}
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingItem(p);
                            setIsModalOpen(true);
                          }}
                          title="Edit Product"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: '#faf5ff',
                            color: '#9e4895',
                            border: '1px solid #f3e8ff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#9e4895';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(158, 72, 149, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#faf5ff';
                            e.currentTarget.style.color = '#9e4895';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete Product"
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: '#fef2f2',
                            color: '#ef4444',
                            border: '1px solid #fee2e2',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef4444';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal Component */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        item={editingItem}
        existingCategories={Array.from(new Set(products.map(p => p.category).filter(Boolean)))}
        existingDivisions={Array.from(new Set(products.map(p => p.division).filter(Boolean)))}
      />

      {/* Image Lightbox Popup Modal */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '24px',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: 'relative',
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
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
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#e2e8f0';
                e.currentTarget.style.color = '#0f172a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={20} />
            </button>

            <img
              src={previewImage.imageUrl || '/assets/images/default-product.png'}
              alt={previewImage.name}
              style={{
                maxHeight: '380px',
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                background: '#f8fafc',
                padding: '12px',
                border: '1px solid #e2e8f0',
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/assets/images/default-product.png';
              }}
            />
            <h3 style={{ margin: '18px 0 8px 0', fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              {previewImage.name}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-purple" style={{ padding: '4px 12px', borderRadius: '12px' }}>
                {previewImage.division}
              </span>
              <span className="badge badge-secondary" style={{ padding: '4px 12px', borderRadius: '12px' }}>
                {previewImage.category}
              </span>
            </div>
            {previewImage.composition && (
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {previewImage.composition}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
