import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Plus, Edit, Trash2, Eye, Search, RefreshCw, CheckCircle2, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import CategoryModal from '../components/CategoryModal';
import ProductModal from '../components/ProductModal';

const ProductCategoriesPage = ({ setActiveTab }) => {
  const [categories, setCategories] = useState([]);   // from DB
  const [products, setProducts] = useState([]);       // from DB
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryObj, setEditingCategoryObj] = useState(null); // { id, name }

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalPreFill, setProductModalPreFill] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        api.get('/product-categories'),
        api.get('/products'),
      ]);
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      showToast('Failed to load categories from server', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Group products by category name
  const categoryNames = categories.map((c) => c.name);

  const categoriesData = categories.map((cat) => {
    const matchedProducts = products.filter((p) => p.category === cat.name);
    const divisions = Array.from(new Set(matchedProducts.map((p) => p.division).filter(Boolean)));

    return {
      id: cat.id,
      name: cat.name,
      sortOrder: cat.sortOrder,
      count: matchedProducts.length,
      products: matchedProducts,
      divisions: divisions.length > 0 ? divisions : [],
    };
  });

  // Filter by search and division
  const filteredCategories = categoriesData.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiv =
      divisionFilter === 'All' ||
      cat.products.some((p) => p.division === divisionFilter) ||
      cat.count === 0;
    return matchesSearch && matchesDiv;
  });

  // ---- Save / Rename Category (via DB) ----
  const handleSaveCategory = async (newName) => {
    try {
      if (!editingCategoryObj) {
        // CREATE
        await api.post('/product-categories', { name: newName });
        showToast(`Category "${newName}" created! 🎉`);
      } else {
        // UPDATE (rename)
        await api.put(`/product-categories/${editingCategoryObj.id}`, { name: newName });
        showToast(`Category renamed to "${newName}" & products updated! ✅`);
      }
      fetchAll();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      showToast(`Failed: ${errMsg}`, 'error');
      throw err;
    }
  };

  // ---- Delete Category (via DB) ----
  const handleDeleteCategory = async (cat) => {
    const catProds = cat.products;
    const confirmMsg = catProds.length > 0
      ? `Delete "${cat.name}" and reassign ${catProds.length} product(s) to "General"?`
      : `Delete empty category "${cat.name}"?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      await api.delete(`/product-categories/${cat.id}`);
      showToast(`Category "${cat.name}" deleted. Products moved to General 🗑️`);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  // ---- Save new product from category card ----
  const handleSaveProductModal = async (formData) => {
    try {
      const nextOrder = products.length > 0 ? Math.max(...products.map((p) => p.sortOrder || 1)) + 1 : 1;
      await api.post('/products', { ...formData, sortOrder: nextOrder });
      showToast(`New product created in "${formData.category}"! 🎉`);
      setIsProductModalOpen(false);
      setProductModalPreFill(null);
      fetchAll();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  // ---- Sync categories from existing products ----
  const handleSync = async () => {
    try {
      const res = await api.post('/product-categories/sync');
      showToast(res.data?.message || 'Synced successfully!');
      fetchAll();
    } catch (err) {
      showToast('Sync failed: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const topCategory = [...categoriesData].sort((a, b) => b.count - a.count)[0];
  const existingDivisions = Array.from(new Set(products.map((p) => p.division).filter(Boolean)));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: toastType === 'error' ? '#ef4444' : '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
            animation: 'slideUp 0.3s ease',
          }}
        >
          <CheckCircle2 size={18} color={toastType === 'error' ? '#fff' : '#22c55e'} />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Tag size={28} color="#9e4895" />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Product Categories
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Manage product classification categories. All changes are saved to the database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSync}
            title="Sync categories from existing products"
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <RefreshCcw size={15} /> Sync from Products
          </button>

          <button
            onClick={fetchAll}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <RefreshCw size={15} /> Refresh
          </button>

          <button
            onClick={() => {
              setEditingCategoryObj(null);
              setIsCategoryModalOpen(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(180deg, #d362c7 0%, #9e4895 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(158, 72, 149, 0.3)',
            }}
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Categories
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#9e4895', marginTop: '6px' }}>
            {categories.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>Saved in database</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Products
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {products.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>Across all categories</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Top Category
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {topCategory?.name || '—'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            {topCategory?.count || 0} products
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#ffffff', padding: '14px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Division:</span>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            style={{ padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, background: '#f8fafc' }}
          >
            <option value="All">All Divisions</option>
            {existingDivisions.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Category Cards */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <RefreshCw size={30} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
          <div>Loading categories from database...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Tag size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: 0, color: '#334155' }}>No categories found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>Try adjusting your search or click "Sync from Products" to import existing categories.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, paddingRight: '8px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: '#faf5ff', color: '#9e4895', border: '1px solid #f3e8ff', flexShrink: 0 }}>
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', wordBreak: 'break-word' }}>
                        {cat.name}
                      </h3>
                      {cat.divisions.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                          Div: {cat.divisions.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <span style={{
                    background: cat.count > 0 ? '#faf5ff' : '#f1f5f9',
                    color: cat.count > 0 ? '#9e4895' : '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '20px',
                    border: cat.count > 0 ? '1px solid #f3e8ff' : '1px solid #e2e8f0',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Sample Products Text Badges */}
                {cat.products.length > 0 && (
                  <div style={{ marginTop: '10px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '5px' }}>
                      Sample Items
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {cat.products.slice(0, 3).map((p) => (
                        <span key={p.id} style={{ fontSize: '0.72rem', fontWeight: 600, color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 7px', borderRadius: '5px' }}>
                          {p.name}
                        </span>
                      ))}
                      {cat.products.length > 3 && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9e4895', background: '#faf5ff', border: '1px solid #f3e8ff', padding: '2px 7px', borderRadius: '5px' }}>
                          +{cat.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setEditingCategoryObj({ id: cat.id, name: cat.name });
                      setIsCategoryModalOpen(true);
                    }}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px', color: '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Edit size={13} /> Rename
                  </button>

                  {setActiveTab && (
                    <button
                      onClick={() => {
                        localStorage.setItem('maruti_products_category_filter', cat.name);
                        setActiveTab('products');
                      }}
                      style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px 10px', color: '#475569', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={13} /> View
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '5px 10px', color: '#ef4444', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setProductModalPreFill({ category: cat.name, division: cat.divisions[0] || 'Derma' });
                    setIsProductModalOpen(true);
                  }}
                  style={{ background: '#faf5ff', border: '1px solid #f3e8ff', borderRadius: '8px', padding: '5px 12px', color: '#9e4895', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={13} /> Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal (Create / Edit) */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => { setIsCategoryModalOpen(false); setEditingCategoryObj(null); }}
        onSave={handleSaveCategory}
        categoryName={editingCategoryObj?.name || ''}
      />

      {/* Product Modal (Pre-filled with Category) */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => { setIsProductModalOpen(false); setProductModalPreFill(null); }}
          onSave={handleSaveProductModal}
          item={productModalPreFill}
          existingCategories={categoryNames}
          existingDivisions={existingDivisions}
        />
      )}
    </div>
  );
};

export default ProductCategoriesPage;
