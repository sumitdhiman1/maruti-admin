import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ImageUploadField from '../components/ImageUploadField';
import DivisionItemModal from '../components/DivisionItemModal';
import { Layers, Plus, Edit3, Trash2, Save, CheckCircle, Search, GripVertical, Sparkles, Send, Award } from 'lucide-react';

const DivisionsPageManager = ({ setActiveTab }) => {
  // 1. Division Page Settings
  const [pageData, setPageData] = useState({
    bannerTitle: 'Our Strategic Divisions',
    bannerDesc: 'Comprehensive pharmaceutical solutions accross dermatology, everyday wellness, and specialised healthcare — built on science, quality and innovation.',
    bannerImage: '/assets/images/divisions-banner.jpg',
    stat1Number: '295+', stat1Label: 'Products',
    stat2Number: '15+', stat2Label: 'Years of Excellence',
    stat3Number: '20+', stat3Label: 'Countries Served',
    stat4Number: 'WHO-GMP', stat4Label: 'Certified',

    feature1Icon: '/assets/images/feature-icon1.jpeg',
    feature1Title: 'WHO-GMP',
    feature1Highlight: 'Certified',
    feature1Desc: 'Manufactured under internationally recognized quality standards to ensure safety and efficacy testing.',

    feature2Icon: '/assets/images/feature-icon2.jpeg',
    feature2Title: 'ISO 9001:2008',
    feature2Highlight: 'Certified',
    feature2Desc: 'We follow globally accepted quality management systems for consistent quality and improvement.',

    feature3Icon: '/assets/images/feature-icon3.jpeg',
    feature3Title: 'ISO 14001:2004',
    feature3Highlight: 'Certified',
    feature3Desc: 'Every product is developed with safety, reliability and quality at the core of everything we do.',

    sectionSubhead: 'Our Divisions',
    sectionTitle: 'Built for every healthcare need',
    ctaSubtitle: 'Science for Health',
    ctaTitle: 'Excellence in Pharmaceuticals',
    ctaDesc: 'Advanced formulations spanning prescription and OTC therapies across dermatology, everyday wellness, and specialized therapeutic categories. Built on clinical evidence, delivered with precision.',
    ctaBtn1Text: 'View all Products', ctaBtn1Url: '/products',
    ctaBtn2Text: 'Contact Us', ctaBtn2Url: '/contact',
  });

  // 2. Division Items List
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
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
    fetchPageData();
    fetchDivisionItems();
  }, []);

  const fetchPageData = async () => {
    try {
      const res = await api.get('/divisions-page');
      if (res.data) {
        const cleaned = {};
        Object.keys(res.data).forEach(k => {
          cleaned[k] = (res.data[k] === null || res.data[k] === undefined) ? '' : res.data[k];
        });
        setPageData(prev => ({ ...prev, ...cleaned }));
      }
    } catch (err) {
      console.error('Error fetching division page data:', err);
    }
  };

  const fetchDivisionItems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/division-items');
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching division items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (e) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value || '' }));
  };

  const handlePageSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingPage(true);
      const res = await api.put('/divisions-page', pageData);
      if (res.data) {
        const cleaned = {};
        Object.keys(res.data).forEach(k => {
          cleaned[k] = (res.data[k] === null || res.data[k] === undefined) ? '' : res.data[k];
        });
        setPageData(prev => ({ ...prev, ...cleaned }));
      }
      showToast('Divisions Page settings saved successfully! 🎉');
    } catch (err) {
      alert('Failed to save division page settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSavingPage(false);
    }
  };

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/division-items/${editingItem.id}`, formData);
        showToast('Division card updated successfully! 🎉');
      } else {
        const nextOrder = items.length > 0 ? Math.max(...items.map((m) => m.sortOrder || 1)) + 1 : 1;
        await api.post('/division-items', { ...formData, sortOrder: nextOrder });
        showToast('New Division card added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchDivisionItems();
    } catch (err) {
      alert('Failed to save division card: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (window.confirm(`Delete division card "${name}"?`)) {
      try {
        await api.delete(`/division-items/${id}`);
        showToast('Division card deleted! 🗑️');
        fetchDivisionItems();
      } catch (err) {
        alert('Failed to delete division item');
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
        await api.put(`/division-items/${reorderedList[i].id}`, {
          sortOrder: reorderedList[i].sortOrder,
        });
      }
      showToast('Divisions re-ordered successfully via Drag & Drop! 🎯');
    } catch (err) {
      console.error('Failed to save reordered divisions:', err);
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
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live website page updated.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Page Content &amp; Cards Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Divisions Page Management
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

      {/* SECTION 1: Page Hero & Banner Controls */}
      <form onSubmit={handlePageSubmit}>
        <div className="card" style={{ margin: '0 0 1.5rem 0' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#c054c2" /> Hero Banner &amp; Statistics Grid Settings
            </h3>
            <button type="submit" className="btn btn-primary" disabled={savingPage}>
              <Save size={16} /> {savingPage ? 'Saving...' : 'Save Banner Settings'}
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Banner Title</label>
            <input className="form-control" name="bannerTitle" value={pageData.bannerTitle || ''} onChange={handlePageChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Banner Description</label>
            <textarea className="form-control" rows={2} name="bannerDesc" value={pageData.bannerDesc || ''} onChange={handlePageChange} />
          </div>

          {/* Image Upload Field */}
          <ImageUploadField
            label="Banner Background Image (Drag & Drop or Click)"
            value={pageData.bannerImage || ''}
            onChange={(url) => setPageData(prev => ({ ...prev, bannerImage: url || '' }))}
            placeholder="Drag & Drop Banner Image Here or click to browse"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 1 Number</label>
              <input className="form-control" name="stat1Number" value={pageData.stat1Number || ''} onChange={handlePageChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 1 Label</label>
              <input className="form-control" name="stat1Label" value={pageData.stat1Label || ''} onChange={handlePageChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 2 Number</label>
              <input className="form-control" name="stat2Number" value={pageData.stat2Number || ''} onChange={handlePageChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 2 Label</label>
              <input className="form-control" name="stat2Label" value={pageData.stat2Label || ''} onChange={handlePageChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 3 Number</label>
              <input className="form-control" name="stat3Number" value={pageData.stat3Number || ''} onChange={handlePageChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 3 Label</label>
              <input className="form-control" name="stat3Label" value={pageData.stat3Label || ''} onChange={handlePageChange} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Stat 4 Number</label>
              <input className="form-control" name="stat4Number" value={pageData.stat4Number || ''} onChange={handlePageChange} />
              <label style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Stat 4 Label</label>
              <input className="form-control" name="stat4Label" value={pageData.stat4Label || ''} onChange={handlePageChange} />
            </div>
          </div>
        </div>

        {/* SECTION 1.5: Divisions Quality Standards & Badges Section */}
        <div className="card" style={{ margin: '0 0 1.5rem 0' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#c054c2" /> Quality Standards &amp; Badges (Exclusive for Divisions Page)
            </h3>
            <button type="submit" className="btn btn-primary" disabled={savingPage}>
              <Save size={16} /> {savingPage ? 'Saving...' : 'Save Quality Cards'}
            </button>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Control logo icons, titles, highlight words, and descriptions for the 3 quality cards displayed below the hero section on the Divisions page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Card 1 */}
            <div style={{ background: '#faf6fa', border: '1px solid #f3d4f5', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#c054c2" /> Quality Card 1
              </div>
              <ImageUploadField
                label="Card 1 Logo Seal Icon"
                value={pageData.feature1Icon || '/assets/images/feature-icon1.jpeg'}
                onChange={(url) => setPageData(prev => ({ ...prev, feature1Icon: url || '' }))}
              />
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" name="feature1Title" value={pageData.feature1Title || ''} onChange={handlePageChange} placeholder="e.g. WHO-GMP" />
              </div>
              <div className="form-group">
                <label className="form-label">Highlight Word (Italic Accent)</label>
                <input className="form-control" name="feature1Highlight" value={pageData.feature1Highlight || ''} onChange={handlePageChange} placeholder="e.g. Certified" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} name="feature1Desc" value={pageData.feature1Desc || ''} onChange={handlePageChange} placeholder="Card description..." />
              </div>
            </div>

            {/* Card 2 */}
            <div style={{ background: '#faf6fa', border: '1px solid #f3d4f5', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#c054c2" /> Quality Card 2
              </div>
              <ImageUploadField
                label="Card 2 Logo Seal Icon"
                value={pageData.feature2Icon || '/assets/images/feature-icon2.jpeg'}
                onChange={(url) => setPageData(prev => ({ ...prev, feature2Icon: url || '' }))}
              />
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" name="feature2Title" value={pageData.feature2Title || ''} onChange={handlePageChange} placeholder="e.g. ISO 9001:2008" />
              </div>
              <div className="form-group">
                <label className="form-label">Highlight Word (Italic Accent)</label>
                <input className="form-control" name="feature2Highlight" value={pageData.feature2Highlight || ''} onChange={handlePageChange} placeholder="e.g. Certified" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} name="feature2Desc" value={pageData.feature2Desc || ''} onChange={handlePageChange} placeholder="Card description..." />
              </div>
            </div>

            {/* Card 3 */}
            <div style={{ background: '#faf6fa', border: '1px solid #f3d4f5', padding: '1.25rem', borderRadius: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="#c054c2" /> Quality Card 3
              </div>
              <ImageUploadField
                label="Card 3 Logo Seal Icon"
                value={pageData.feature3Icon || '/assets/images/feature-icon3.jpeg'}
                onChange={(url) => setPageData(prev => ({ ...prev, feature3Icon: url || '' }))}
              />
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label className="form-label">Title</label>
                <input className="form-control" name="feature3Title" value={pageData.feature3Title || ''} onChange={handlePageChange} placeholder="e.g. ISO 14001:2004" />
              </div>
              <div className="form-group">
                <label className="form-label">Highlight Word (Italic Accent)</label>
                <input className="form-control" name="feature3Highlight" value={pageData.feature3Highlight || ''} onChange={handlePageChange} placeholder="e.g. Certified" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={3} name="feature3Desc" value={pageData.feature3Desc || ''} onChange={handlePageChange} placeholder="Card description..." />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Featured Callout Banner CTA Settings */}
        <div className="card" style={{ margin: '0 0 1.5rem 0' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send size={20} color="#c054c2" /> Bottom Callout Banner CTA Settings
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">CTA Tagline / Subtitle</label>
              <input className="form-control" name="ctaSubtitle" value={pageData.ctaSubtitle || ''} onChange={handlePageChange} />
            </div>

            <div className="form-group">
              <label className="form-label">CTA Banner Title</label>
              <input className="form-control" name="ctaTitle" value={pageData.ctaTitle || ''} onChange={handlePageChange} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">CTA Description</label>
            <textarea className="form-control" rows={2} name="ctaDesc" value={pageData.ctaDesc || ''} onChange={handlePageChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Btn 1 Text</label>
              <input className="form-control" name="ctaBtn1Text" value={pageData.ctaBtn1Text || ''} onChange={handlePageChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Btn 1 Link</label>
              <input className="form-control" name="ctaBtn1Url" value={pageData.ctaBtn1Url || ''} onChange={handlePageChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Btn 2 Text</label>
              <input className="form-control" name="ctaBtn2Text" value={pageData.ctaBtn2Text || ''} onChange={handlePageChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Btn 2 Link</label>
              <input className="form-control" name="ctaBtn2Url" value={pageData.ctaBtn2Url || ''} onChange={handlePageChange} />
            </div>
          </div>
        </div>
      </form>

      {/* SECTION 3: Division Cards List with Drag & Drop Sorting */}
      <div className="card" style={{ margin: '0 0 1.5rem 0', padding: '1rem 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search division name, subtitle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '10px' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            💡 Drag &amp; drop any division card to re-order sequence
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

export default DivisionsPageManager;
