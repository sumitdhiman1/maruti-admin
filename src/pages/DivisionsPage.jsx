import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import DivisionModal from '../components/DivisionModal';
import { Package, Plus, Edit3, Trash2, RotateCcw, Search, Filter, CheckCircle, Tag, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 15;

const DivisionsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [migrating, setMigrating] = useState(false);

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
      const response = await api.get('/products');
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Divisions list based on database products and defaults
  const dynamicDivisions = useMemo(() => {
    const defaultDivs = ['Derma', 'Evara', 'Elzac'];
    const dbDivs = products.map((p) => p.division).filter(Boolean);
    const combined = Array.from(new Set([...defaultDivs, ...dbDivs])).sort();
    return ['All', ...combined];
  }, [products]);

  // Dynamic Categories list based on selected division
  const availableCategories = useMemo(() => {
    const filteredByDiv = selectedDivision === 'All'
      ? products
      : products.filter((p) => p.division === selectedDivision);

    const cats = Array.from(new Set(filteredByDiv.map((p) => p.category).filter(Boolean)));
    return ['All', ...cats.sort()];
  }, [products, selectedDivision]);

  // Reset category filter if selected category is not in availableCategories
  useEffect(() => {
    if (!availableCategories.includes(selectedCategory)) {
      setSelectedCategory('All');
    }
    setCurrentPage(1);
  }, [selectedDivision, availableCategories, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filtered Products for rendering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedDivision !== 'All' && p.division !== selectedDivision) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name ? p.name.toLowerCase().includes(q) : false;
        const matchesComp = p.composition ? p.composition.toLowerCase().includes(q) : false;
        const matchesCat = p.category ? p.category.toLowerCase().includes(q) : false;
        return matchesName || matchesComp || matchesCat;
      }

      return true;
    });
  }, [products, selectedDivision, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/products/${editingItem.id}`, formData);
        showToast('Product updated successfully! 🎉');
      } else {
        await api.post('/products', formData);
        showToast('New product added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchProducts();
    } catch (error) {
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete product "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        showToast('Product deleted successfully! 🗑️');
        fetchProducts();
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSeedFromExcel = async () => {
    if (window.confirm('Reset and load all 155 products extracted from the Excel spreadsheet?')) {
      try {
        setSeeding(true);
        const res = await api.post('/products/seed');
        showToast(`Loaded ${res.data.count || 155} products from Excel! 🎉`);
        fetchProducts();
      } catch (error) {
        alert('Error seeding Excel products: ' + error.message);
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
      } catch (error) {
        alert('Migration failed: ' + (error.response?.data?.message || error.message));
      } finally {
        setMigrating(false);
      }
    }
  };

  return (
    <div>
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Product catalog updated.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Products Management
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            MPPL Products Catalog ({products.length} Items)
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleMigrateDerma} disabled={migrating} title="Rename all Derma A / Derma B → Derma in the database" style={{ borderColor: '#f59e0b', color: '#92400e', background: '#fffbeb' }}>
            {migrating ? 'Migrating...' : '🔀 Merge Derma A+B → Derma'}
          </button>
          <button className="btn btn-secondary" onClick={handleSeedFromExcel} disabled={seeding} title="Reset & Re-load all 155 Excel products">
            <RotateCcw size={16} color="#c054c2" /> {seeding ? 'Seeding...' : 'Import 155 Excel Products'}
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Division Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {dynamicDivisions.map((div) => {
          const isActive = selectedDivision === div;
          const count = div === 'All' ? products.length : products.filter((p) => p.division === div).length;
          return (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              style={{
                padding: '10px 20px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isActive ? '#c054c2' : '#e2e8f0',
                background: isActive ? 'linear-gradient(135deg, #c054c2 0%, #8d348f 100%)' : '#ffffff',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isActive ? '0 4px 12px rgba(192, 84, 194, 0.3)' : 'none',
              }}
            >
              <span>{div === 'All' ? 'All Products' : div}</span>
              <span
                style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filters Bar: Search & Category Selector */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by product name, composition formula, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Category Dropdown Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#c054c2" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Category:</span>
            <select
              className="form-control"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ minWidth: '200px' }}
            >
              {availableCategories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? `All Categories (${availableCategories.length - 1})` : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MANAGED PRODUCTS TABLE */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Package size={20} color="#c054c2" /> Structured Products List ({filteredProducts.length})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Categories highlighted in red badge theme. Product names in bold.
            </p>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            Showing {paginatedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length}
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Division</th>
                <th style={{ width: '220px' }}>Red Category</th>
                <th style={{ width: '240px' }}>Product Name</th>
                <th>Composition / Ingredients</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading products...
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td>
                      <span
                        style={{
                          background: p.division === 'Derma' ? '#faf5ff' : p.division === 'Evara' ? '#ecfeff' : '#e0e7ff',
                          color: p.division === 'Derma' ? '#a855f7' : p.division === 'Evara' ? '#0891b2' : '#4f46e5',
                          border: `1px solid ${p.division === 'Derma' ? '#e9d5ff' : p.division === 'Evara' ? '#cff4fc' : '#c7d2fe'}`,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          display: 'inline-block',
                        }}
                      >
                        {p.division}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          background: '#fef2f2',
                          color: '#dc2626',
                          border: '1px solid #fecaca',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          letterSpacing: '0.3px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Tag size={12} color="#dc2626" />
                        {p.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {p.name}
                      </div>
                      {p.packing && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          Pack: {p.packing}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                      {p.composition || <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="btn-icon-action btn-icon-edit"
                          onClick={() => {
                            setEditingItem(p);
                            setIsModalOpen(true);
                          }}
                          title="Edit Product"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="btn-icon-action btn-icon-delete"
                          onClick={() => handleDelete(p.id, p.name)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No products matching filter criteria. Click "Import 155 Excel Products" or "Add Product".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div
            style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: '6px 12px', fontSize: '0.82rem', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, i, arr) => {
                  const prevVal = arr[i - 1];
                  const showEllipsis = prevVal && p - prevVal > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span style={{ padding: '0 4px', color: '#94a3b8' }}>...</span>}
                      <button
                        onClick={() => setCurrentPage(p)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: currentPage === p ? '#c054c2' : '#cbd5e1',
                          background: currentPage === p ? '#c054c2' : '#ffffff',
                          color: currentPage === p ? '#ffffff' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                        }}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: '6px 12px', fontSize: '0.82rem', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
        existingProducts={products}
      />
    </div>
  );
};

export default DivisionsPage;
