import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CertificationModal from '../components/CertificationModal';
import { Award, Plus, Edit3, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

const Certifications = () => {
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
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/certifications');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/certifications/${editingItem.id}`, formData);
        showToast('Quality highlight updated successfully! 🎉');
      } else {
        await api.post('/certifications', formData);
        showToast('New quality highlight added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchCertifications();
    } catch (error) {
      alert('Failed to save certification item: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete quality highlight "${title}"?`)) {
      try {
        await api.delete(`/certifications/${id}`);
        fetchCertifications();
      } catch (error) {
        alert('Failed to delete item');
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
          <CheckCircle2 size={24} color="#4ade80" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Certifications data updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Home Section ➔ Certifications & Highlights
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Quality Certifications & Trust Badges
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage the 3-column quality assurance banner right below the Hero section (WHO-GMP, ISO 9001, Quality Assurance).
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add Quality Highlight
        </button>
      </div>

      {/* LIVE BANNER PREVIEW CARD - Matching exact 3-column reference design from image! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#faf6fa', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE CERTIFICATION BANNER PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            3-Column Banner Active
          </span>
        </div>

        <div style={{ padding: '2.5rem 1.5rem', background: '#fdf8fd' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 4px 15px rgba(192, 84, 194, 0.08)',
                  border: '1px solid rgba(192, 84, 194, 0.15)',
                }}
              >
                {/* Circular Glowing Icon Seal */}
                <div
                  style={{
                    width: '75px',
                    height: '75px',
                    minWidth: '75px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ffffff 50%, #fcf2fc 100%)',
                    border: '3px solid #f3d4f5',
                    boxShadow: '0 6px 16px rgba(192, 84, 194, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <img
                    src={item.iconUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%' }}
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0a192f', lineHeight: 1.25, marginBottom: '6px' }}>
                    {item.title}{' '}
                    {item.highlightWord && (
                      <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
                        {item.highlightWord}
                      </span>
                    )}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MANAGED CERTIFICATIONS TABLE */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#c054c2" /> Quality Highlights Management
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Add, edit, re-order, or upload badge icon seals for your quality assurance section.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Icon Seal</th>
                <th>Title & Accent Highlight</th>
                <th>Description Text</th>
                <th>Order</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading certification highlights...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.iconUrl}
                        alt={item.title}
                        style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '50%', padding: '2px', border: '1px solid #c054c2' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {item.title}{' '}
                        <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif' }}>
                          {item.highlightWord}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '380px' }}>
                      {item.description}
                    </td>
                    <td style={{ fontWeight: 700 }}>#{item.sortOrder}</td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-icon-action btn-icon-edit" onClick={() => { setEditingItem(item); setIsModalOpen(true); }} title="Edit Highlight">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-icon-action btn-icon-delete" onClick={() => handleDelete(item.id, item.title)} title="Delete Highlight">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No quality highlights found. Click "Add Quality Highlight" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CertificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default Certifications;
