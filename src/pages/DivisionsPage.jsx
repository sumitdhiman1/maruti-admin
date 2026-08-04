import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DivisionModal from '../components/DivisionModal';
import { Layers, Plus, Edit3, Trash2, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const DivisionsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  const fetchDivisions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/divisions');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching strategic divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/divisions/${editingItem.id}`, formData);
        showToast('Strategic division card updated successfully! 🎉');
      } else {
        await api.post('/divisions', formData);
        showToast('New strategic division card added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchDivisions();
    } catch (error) {
      alert('Failed to save division card: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete division card "${name}"?`)) {
      try {
        await api.delete(`/divisions/${id}`);
        showToast('Division card deleted successfully! 🗑️');
        fetchDivisions();
      } catch (error) {
        alert('Failed to delete division card');
      }
    }
  };

  const handleSeedDefaults = async () => {
    if (window.confirm('Populate all 3 design cards (Derma, Evara, Elzac)?')) {
      try {
        const defaultCards = [
          {
            name: 'Derma Division',
            subtitle: 'Science-Backed Skin Solutions',
            description: 'Advanced skincare and dermatological products for healthier skin and better life.',
            imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80',
            themeColor: '#a855f7',
            btnText: 'Explore Products',
            btnLink: '#products',
            sortOrder: 1,
            status: 'Active',
          },
          {
            name: 'Evara Division',
            subtitle: 'Everyday Health & Wellness',
            description: 'Science-backed pharmaceuticals for everyday health and wellness needs.',
            imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
            themeColor: '#06b6d4',
            btnText: 'Explore Products',
            btnLink: '#products',
            sortOrder: 2,
            status: 'Active',
          },
          {
            name: 'Elzac Division',
            subtitle: 'Reliable Effective Solutions',
            description: 'Reliable and effective pharmaceuticals for a healthier and stronger tomorrow.',
            imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop&q=80',
            themeColor: '#6366f1',
            btnText: 'Explore Products',
            btnLink: '#products',
            sortOrder: 3,
            status: 'Active',
          },
        ];

        for (const card of defaultCards) {
          await api.post('/divisions', card);
        }

        showToast('All 3 Strategic Division cards populated! 🎉');
        fetchDivisions();
      } catch (error) {
        alert('Error populating default cards: ' + error.message);
      }
    }
  };

  return (
    <div>
      {/* Floating Success Toast Notification */}
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Strategic divisions data updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Home Section ➔ Section 4: Strategic Divisions
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Our Strategic Divisions Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage Section 4 division cards (Derma, Evara, Elzac), colors, images, descriptions, and product links.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleSeedDefaults}>
            <Sparkles size={16} color="#c054c2" /> Auto-Populate All 3 Cards
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Strategic Division
          </button>
        </div>
      </div>

      {/* LIVE SECTION 4 PREVIEW CARD - Matching exact 3-column reference design from image! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE SECTION 4 PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            Strategic Divisions Active
          </span>
        </div>

        <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#faf5fa' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            Our Products
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a192f', marginBottom: '8px' }}>
            Our Strategic{' '}
            <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
              divisions
            </span>
          </h2>

          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.5 }}>
            Comprehensive pharmaceutical solutions across dermatology, everyday wellness, and specialized healthcare.
          </p>

          {/* 3 Division Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* Banner Top Image with Colored Overlay & Title */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: item.themeColor ? `linear-gradient(180deg, ${item.themeColor}aa 0%, ${item.themeColor}dd 100%)` : 'linear-gradient(180deg, rgba(192,84,194,0.7) 0%, rgba(141,52,143,0.9) 100%)',
                      backdropFilter: 'blur(2px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1.5rem',
                      color: 'white',
                    }}
                  >
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'serif', fontStyle: 'italic', color: 'white', marginBottom: '2px' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: 500 }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Card Content & Action Button */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c054c2', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}>
                    <span>{item.btnText || 'Explore Products'}</span>
                    <ArrowRight size={16} color="#c054c2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MANAGED DIVISIONS TABLE */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#c054c2" /> Strategic Divisions Management
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Add, edit, re-order, or change theme colors for your Strategic Divisions cards.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Banner Image</th>
                <th>Division Name & Subtitle</th>
                <th>Theme Accent</th>
                <th>Description Text</th>
                <th>Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading division cards...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {item.subtitle}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: item.themeColor, border: '1px solid #cbd5e1' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>{item.themeColor}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '340px' }}>
                      {item.description}
                    </td>
                    <td style={{ fontWeight: 700 }}>#{item.sortOrder}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                          <Edit3 size={14} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.name)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No division cards found. Click "Add Strategic Division" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DivisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default DivisionsPage;
