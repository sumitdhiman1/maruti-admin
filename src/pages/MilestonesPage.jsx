import React, { useState, useEffect } from 'react';
import api from '../services/api';
import MilestoneModal from '../components/MilestoneModal';
import { Flag, Plus, Edit3, Trash2, RotateCcw, CheckCircle, Search, GripVertical } from 'lucide-react';

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
    if (window.confirm('Reset and load all 14 milestones from MILESTONES.docx file?')) {
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
    <div>
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Timeline updated live.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            History Timeline Management
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Company Milestones ({items.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleSeedDocx} disabled={seeding} title="Reload 14 milestones from Docx file">
            <RotateCcw size={16} /> {seeding ? 'Seeding...' : 'Load All Docx Milestones'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} /> Add New Milestone
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="search-box" style={{ position: 'relative', width: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search milestone year or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th style={{ width: '90px' }}>Year</th>
                <th style={{ width: '120px' }}>Date</th>
                <th>Description</th>
                <th style={{ width: '70px', textAlign: 'center' }}>Badge</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Status</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading milestones...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No milestone items found.</td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>
                      <GripVertical size={16} color="#94a3b8" />
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#c054c2', fontSize: '1rem' }}>{item.year}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>{item.date || '-'}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>{item.description}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{ background: '#faf5ff', color: 'var(--dark-purple)', padding: '2px 8px', borderRadius: '8px', fontWeight: 800, fontSize: '0.82rem', border: '1px solid #e0c9f5' }}>
                        {item.badgeText || item.year.slice(-2)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          title="Edit"
                        >
                          <Edit3 size={16} color="#3b82f6" />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(item.id, item.year)}
                          title="Delete"
                        >
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
