import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DivisionItemModal from '../components/DivisionItemModal';
import { Sparkles, Save, CheckCircle, Eye, Layers, Plus, Edit3, Trash2, Search, GripVertical } from 'lucide-react';

const HomeTherapeuticDivisionsPage = () => {
  // 1. Section Header Data
  const [sectionData, setSectionData] = useState({
    subTitle: 'Our Products',
    title: 'Our Therapeutic',
    highlightWord: 'Divisions',
    description: 'Comprehensive pharmaceutical solutions across dermatology, everyday wellness, and specialized healthcare.',
  });

  // 2. Division Cards Data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchSectionData();
    fetchDivisionItems();
  }, []);

  const fetchSectionData = async () => {
    try {
      const res = await api.get('/home-therapeutic-section');
      if (res.data) {
        setSectionData(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Error fetching home therapeutic section data:', err);
    }
  };

  const fetchDivisionItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/home-therapeutic-cards');
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching home therapeutic cards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handleSectionSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setSavingSection(true);
      const res = await api.put('/home-therapeutic-section', sectionData);
      if (res.data) {
        setSectionData(prev => ({ ...prev, ...res.data }));
      }
      showToast('Homepage Therapeutic Divisions section updated! 🎉');
    } catch (err) {
      alert('Failed to save section header: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingSection(false);
    }
  };

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/home-therapeutic-cards/${editingItem.id}`, formData);
        showToast('Therapeutic card updated! 🎉');
      } else {
        const nextOrder = items.length > 0 ? Math.max(...items.map((m) => m.sortOrder || 1)) + 1 : 1;
        await api.post('/home-therapeutic-cards', { ...formData, sortOrder: nextOrder });
        showToast('New Therapeutic card added! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchDivisionItems();
    } catch (err) {
      alert('Failed to save therapeutic card: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Delete therapeutic card "${name}"?`)) {
      try {
        await api.delete(`/home-therapeutic-cards/${id}`);
        showToast('Therapeutic card deleted! 🗑️');
        fetchDivisionItems();
      } catch (err) {
        alert('Failed to delete therapeutic card');
      }
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropTargetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropTargetIndex) {
      setDraggedIndex(null);
      return;
    }

    const updatedList = [...items];
    const [movedItem] = updatedList.splice(draggedIndex, 1);
    updatedList.splice(dropTargetIndex, 0, movedItem);

    const reorderedList = updatedList.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    setItems(reorderedList);
    setDraggedIndex(null);

    try {
      for (let i = 0; i < reorderedList.length; i++) {
        await api.put(`/home-therapeutic-cards/${reorderedList[i].id}`, {
          sortOrder: reorderedList[i].sortOrder,
        });
      }
      showToast('Therapeutic cards reordered via Drag & Drop! 🎯');
    } catch (err) {
      console.error('Failed to save reordered cards:', err);
    }
  };

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff',
          border: '2px solid #c054c2', padding: '14px 22px', borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <CheckCircle size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live homepage updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Home Section Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Homepage Therapeutic Divisions Section
          </h2>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add New Division Card
        </button>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', marginBottom: '1.5rem' }}>
        {/* Left Column: Live Homepage Preview */}
        <div>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={20} color="#c054c2" /> Live Homepage Section Preview
              </h3>
              <span className="badge badge-purple">Homepage Section</span>
            </div>

            <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '12px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c054c2', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {sectionData.subTitle || 'Our Products'}
              </span>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 10px 0' }}>
                {sectionData.title || 'Our Therapeutic'} <span style={{ color: '#c054c2', fontStyle: 'italic' }}>{sectionData.highlightWord || 'Divisions'}</span>
              </h3>

              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 auto 16px auto', maxWidth: '420px', lineHeight: 1.5 }}>
                {sectionData.description || 'Comprehensive pharmaceutical solutions across dermatology, everyday wellness, and specialized healthcare.'}
              </p>

              {/* Sample Cards Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '16px' }}>
                {items.slice(0, 3).map((item, idx) => (
                  <div key={idx} style={{ background: '#ffffff', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <div style={{ height: '70px', background: '#e2e8f0', backgroundImage: `url('${item.image}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ padding: '8px', textAlign: 'left' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Section Header Controls */}
        <div>
          <form onSubmit={handleSectionSubmit}>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={20} color="#c054c2" /> Section Titles &amp; Description Settings
                </h3>
                <button type="submit" className="btn btn-primary" disabled={savingSection}>
                  <Save size={16} /> {savingSection ? 'Saving...' : 'Save Section Header'}
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Sub-Title / Tagline Text</label>
                <input className="form-control" name="subTitle" value={sectionData.subTitle || ''} onChange={handleSectionChange} placeholder="e.g. Our Products" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Main Section Title</label>
                  <input className="form-control" name="title" value={sectionData.title || ''} onChange={handleSectionChange} placeholder="e.g. Our Therapeutic" />
                </div>

                <div className="form-group">
                  <label className="form-label">Highlight Word (Italic Purple)</label>
                  <input className="form-control" name="highlightWord" value={sectionData.highlightWord || ''} onChange={handleSectionChange} placeholder="e.g. Divisions" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Section Description Paragraph</label>
                <textarea className="form-control" rows={3} name="description" value={sectionData.description || ''} onChange={handleSectionChange} placeholder="Section description..." />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION 2: Division Cards List with Drag & Drop Sorting */}
      <div className="card" style={{ margin: '0 0 1.5rem 0', padding: '1rem 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search division card name, subtitle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '10px' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            💡 Drag &amp; drop any division card to re-order sequence on Homepage
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading division cards...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No division cards matching search query.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              style={{
                background: draggedIndex === index ? '#faf5ff' : '#ffffff',
                border: draggedIndex === index ? '2px dashed #c054c2' : '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.2rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                boxShadow: draggedIndex === index ? '0 10px 25px rgba(192, 84, 194, 0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                cursor: 'grab',
                opacity: draggedIndex === index ? 0.6 : 1,
              }}
            >
              {/* Drag Grip Handle */}
              <div style={{ color: '#94a3b8', cursor: 'grab', padding: '4px' }} title="Drag to reorder">
                <GripVertical size={22} />
              </div>

              {/* Division Image Preview */}
              <div style={{ width: '80px', height: '60px', borderRadius: '10px', overflow: 'hidden', background: '#f1f5f9', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                <img
                  src={item.image || '/assets/images/derma-product.jpg'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/derma-product.jpg';
                  }}
                />
              </div>

              {/* Division Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#c054c2', textTransform: 'uppercase', background: '#fdf2fc', padding: '2px 8px', borderRadius: '12px' }}>
                    {item.subtitle || 'Science for Skin'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
                    {item.productCount || 120} Products
                  </span>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {item.name}
                </div>

                <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </div>
              </div>

              {/* Status Badge */}
              <div>
                <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`} style={{ padding: '6px 14px', borderRadius: '20px' }}>
                  {item.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-icon"
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  title="Edit Division"
                  style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDeleteItem(item.id, item.name)}
                  title="Delete Division"
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DivisionItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
};

export default HomeTherapeuticDivisionsPage;
