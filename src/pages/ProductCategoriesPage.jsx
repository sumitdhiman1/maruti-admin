import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit, Trash2, Eye, Package, Search, Layers, RefreshCw, CheckCircle2, Layers3 } from 'lucide-react';
import api from '../services/api';
import CategoryModal from '../components/CategoryModal';
import ProductModal from '../components/ProductModal';

const DEFAULT_CATEGORIES = [
  'General', 'ANTIFUNGALS', 'ANTIBACTERIALS', 'CORTICOSTEROIDS', 'ANTI-ACNE',
  'ANTIALLERGICS', 'EMOLLEINTS AND SKIN NOURISHERS / MOISTURIZERS', 'SUNSCREENS',
  'ANTI-DANDRUFF AND HAIR CARE', 'CLEANSING LOTIONS / SOAPS', 'IMMUNOMODULATORS',
  'SCABICIDES / PEDICULICIDES', 'ANTI PERSPIRENT', 'DEPIGMENTING AGENT',
  'ANTI ULCERANT', 'PAIN MANAGEMENT / ANALGESICS'
];

const ProductCategoriesPage = ({ setActiveTab }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // String category name if editing

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalPreFill, setProductModalPreFill] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Calculate unique categories from products + defaults
  const dbCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const customCreatedCats = JSON.parse(localStorage.getItem('maruti_custom_categories') || '[]');
  const allCategoryNames = Array.from(new Set([...dbCategories, ...DEFAULT_CATEGORIES, ...customCreatedCats])).sort();

  // Group products by category
  const categoriesData = allCategoryNames.map((catName) => {
    const matchedProducts = products.filter((p) => p.category === catName);
    const divisions = Array.from(new Set(matchedProducts.map((p) => p.division).filter(Boolean)));

    return {
      name: catName,
      count: matchedProducts.length,
      products: matchedProducts,
      divisions: divisions.length > 0 ? divisions : ['Derma A'],
    };
  });

  // Filter Categories by search and division
  const filteredCategories = categoriesData.filter((cat) => {
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiv =
      divisionFilter === 'All' ||
      cat.products.some((p) => p.division === divisionFilter) ||
      cat.count === 0;

    return matchesSearch && matchesDiv;
  });

  // Save / Rename Category
  const handleSaveCategory = async (newName) => {
    if (!editingCategory) {
      // Adding new custom category
      const saved = JSON.parse(localStorage.getItem('maruti_custom_categories') || '[]');
      if (!saved.includes(newName)) {
        saved.push(newName);
        localStorage.setItem('maruti_custom_categories', JSON.stringify(saved));
      }
      showToast(`Category "${newName}" created successfully! 🎉`);
      fetchProducts();
      return;
    }

    // Renaming existing category
    const oldName = editingCategory;
    const affectedProducts = products.filter((p) => p.category === oldName);

    if (affectedProducts.length > 0) {
      showToast(`Updating ${affectedProducts.length} products to category "${newName}"...`);
      for (const prod of affectedProducts) {
        try {
          await api.put(`/products/${prod.id}`, { category: newName });
        } catch (err) {
          console.error(`Failed to update product #${prod.id}:`, err);
        }
      }
    }

    // Update custom created categories list in localStorage
    let saved = JSON.parse(localStorage.getItem('maruti_custom_categories') || '[]');
    saved = saved.map((c) => (c === oldName ? newName : c));
    if (!saved.includes(newName)) saved.push(newName);
    localStorage.setItem('maruti_custom_categories', JSON.stringify(saved));

    showToast(`Category "${oldName}" renamed to "${newName}"! 🎉`);
    fetchProducts();
  };

  // Delete Category (Reassign items to General)
  const handleDeleteCategory = async (catName) => {
    const catProds = products.filter((p) => p.category === catName);
    const confirmMsg = catProds.length > 0
      ? `Reassign ${catProds.length} product(s) from "${catName}" to "General" category?`
      : `Remove empty category "${catName}"?`;

    if (window.confirm(confirmMsg)) {
      for (const prod of catProds) {
        try {
          await api.put(`/products/${prod.id}`, { category: 'General' });
        } catch (err) {
          console.error(`Failed to update product #${prod.id}:`, err);
        }
      }

      let saved = JSON.parse(localStorage.getItem('maruti_custom_categories') || '[]');
      saved = saved.filter((c) => c !== catName);
      localStorage.setItem('maruti_custom_categories', JSON.stringify(saved));

      showToast(`Category "${catName}" removed successfully 🗑️`);
      fetchProducts();
    }
  };

  // Save new product created from category card "+ Add Product"
  const handleSaveProductModal = async (formData) => {
    try {
      const nextOrder = products.length > 0 ? Math.max(...products.map((p) => p.sortOrder || 1)) + 1 : 1;
      await api.post('/products', { ...formData, sortOrder: nextOrder });
      showToast(`New product created in "${formData.category}" category! 🎉`);
      setIsProductModalOpen(false);
      setProductModalPreFill(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product: ' + (err.response?.data?.message || err.message));
    }
  };

  // Find most populated category
  const topCategory = [...categoriesData].sort((a, b) => b.count - a.count)[0];

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
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
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Tag size={28} color="#9e4895" />
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Product Categories
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b' }}>
            Organize, create, rename, and manage all product classification categories in your catalog
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={fetchProducts}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} /> Refresh
          </button>

          <button
            onClick={() => {
              setEditingCategory(null);
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
            <Plus size={18} /> Add New Category
          </button>
        </div>
      </div>

      {/* Stats Summary Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Categories
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#9e4895', marginTop: '6px' }}>
            {allCategoryNames.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            Active classifications in database
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Catalog Products
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
            {products.length}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
            Assigned across all categories
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Top Category
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {topCategory?.name || 'General'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
            {topCategory?.count || 0} products tagged
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 42px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#475569' }}>Division Filter:</span>
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              fontWeight: 600,
              background: '#f8fafc',
            }}
          >
            <option value="All">All Divisions</option>
            <option value="Derma A">Derma A</option>
            <option value="Derma B">Derma B</option>
            <option value="Elzac">Elzac</option>
            <option value="Evara">Evara</option>
          </select>
        </div>
      </div>

      {/* Categories Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <RefreshCw size={32} style={{ animation: 'spinSlow 1s linear infinite', marginBottom: '12px' }} />
          <div>Loading Product Categories...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <Tag size={40} color="#cbd5e1" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: 0, color: '#334155' }}>No categories found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '6px' }}>
            No product category matches your search filter query.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredCategories.map((cat) => (
            <div
              key={cat.name}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div>
                {/* Category Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, paddingRight: '8px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: '#faf5ff', color: '#9e4895', border: '1px solid #f3e8ff' }}>
                      <Tag size={18} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        {cat.name}
                      </h3>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Divisions: {cat.divisions.join(', ')}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      background: cat.count > 0 ? '#faf5ff' : '#f1f5f9',
                      color: cat.count > 0 ? '#9e4895' : '#64748b',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: cat.count > 0 ? '1px solid #f3e8ff' : '1px solid #e2e8f0',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                  </span>
                </div>

                {/* Sample Products Text Badges (No Images) */}
                {cat.products.length > 0 && (
                  <div style={{ marginTop: '10px', marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Sample Items
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {cat.products.slice(0, 3).map((p) => (
                        <span
                          key={p.id}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#334155',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                      {cat.products.length > 3 && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9e4895', background: '#faf5ff', border: '1px solid #f3e8ff', padding: '3px 8px', borderRadius: '6px' }}>
                          +{cat.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => {
                      setEditingCategory(cat.name);
                      setIsCategoryModalOpen(true);
                    }}
                    title="Rename Category"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      color: '#475569',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Edit size={14} /> Rename
                  </button>

                  {setActiveTab && (
                    <button
                      onClick={() => {
                        localStorage.setItem('maruti_products_category_filter', cat.name);
                        setActiveTab('products');
                      }}
                      title="View Products in catalog"
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '6px 10px',
                        color: '#475569',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} /> View
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCategory(cat.name)}
                    title="Delete Category"
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      color: '#ef4444',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setProductModalPreFill({ category: cat.name, division: cat.divisions[0] || 'Derma A' });
                    setIsProductModalOpen(true);
                  }}
                  style={{
                    background: '#faf5ff',
                    border: '1px solid #f3e8ff',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#9e4895',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Plus size={14} /> Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal (Create / Edit) */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryName={editingCategory}
      />

      {/* Product Modal (Pre-filled with Category) */}
      {isProductModalOpen && (
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => {
            setIsProductModalOpen(false);
            setProductModalPreFill(null);
          }}
          onSave={handleSaveProductModal}
          item={productModalPreFill}
          existingCategories={allCategoryNames}
          existingDivisions={Array.from(new Set(products.map((p) => p.division).filter(Boolean)))}
        />
      )}
    </div>
  );
};

export default ProductCategoriesPage;
