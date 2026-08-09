import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MilestoneModal from '../components/MilestoneModal';
import { Flag, Plus, Edit3, Trash2, RotateCcw, CheckCircle, Search, Calendar, Sparkles, GripVertical } from 'lucide-react';

const MilestonesPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [seeding, setSeeding] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const res = await api.get('/milestones');
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/milestones/${editingItem.id}`, formData);
        showToast('Milestone updated successfully! 🎉');
      } else {
        const nextOrder = items.length > 0 ? Math.max(...items.map((m) => m.sortOrder || 1)) + 1 : 1;
        await api.post('/milestones', { ...formData, sortOrder: nextOrder });
        showToast('New Milestone added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchMilestones();
    } catch (err) {
      alert('Failed to save milestone: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id, year) => {
    if (window.confirm(`Delete milestone item for "${year}"?`)) {
      try {
        await api.delete(`/milestones/${id}`);
        showToast('Milestone deleted successfully! 🗑️');
        fetchMilestones();
      } catch (err) {
        alert('Failed to delete milestone');
      }
    }
  };

  const handleSeedDocx = async () => {
    if (window.confirm('Reset and reload all 14 milestones from MILESTONES.docx file?')) {
      try {
        setSeeding(true);
        const res = await api.post('/milestones/seed');
        showToast(`Loaded ${res.data.count || 14} Milestones from Docx file! 🎉`);
        fetchMilestones();
      } catch (err) {
        alert('Failed to seed milestones');
      } finally {
        setSeeding(false);
      }
    }
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.year && item.year.toLowerCase().includes(q)) ||
      (item.date && item.date.toLowerCase().includes(q)) ||
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Live website timeline updated.</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Company History Management
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Milestones Timeline ({items.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={handleSeedDocx} disabled={seeding} title="Reload 14 milestones from Docx file">
            <RotateCcw size={16} /> {seeding ? 'Seeding...' : 'Load All Docx Milestones'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Add New Milestone
          </button>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card" style={{ margin: 0, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flag size={24} color="#c054c2" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Total Milestones</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{items.length} Events</div>
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Timeline Range</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>2009 &ndash; 2019+</div>
          </div>
        </div>

        <div className="card" style={{ margin: 0, padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle size={24} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>Status</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>All Active Live</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="card" style={{ margin: '0 0 1.5rem 0', padding: '1rem 1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '360px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search year, month, or milestone text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', borderRadius: '10px' }}
            />
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
            Showing {filteredItems.length} of {items.length} milestones
          </div>
        </div>
      </div>

      {/* Visual Timeline Cards Grid */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading company milestones...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          No milestone items matching search query.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.2rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Drag Grip Handle */}
              <div style={{ color: '#cbd5e1', cursor: 'grab' }}>
                <GripVertical size={20} />
              </div>

              {/* Year & Badge Block */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '160px' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0e0714, #260e36)',
                  border: '2px solid #c054c2', color: '#ffffff',
                  fontWeight: 900, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(192, 84, 194, 0.3)',
                }}>
                  {item.badgeText || (item.year ? item.year.slice(-2) : '00')}
                </div>

                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#c054c2', lineHeight: 1.1 }}>
                    {item.year}
                  </div>
                  {item.date && (
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>
                      {item.date}
                    </div>
                  )}
                </div>
              </div>

              {/* Description Content */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: '1.5' }}>
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
                  title="Edit Milestone"
                  style={{ background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Edit3 size={16} />
                </button>
                <button
                  className="btn-icon"
                  onClick={() => handleDelete(item.id, item.year)}
                  title="Delete Milestone"
                  style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '10px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default MilestonesPage;
