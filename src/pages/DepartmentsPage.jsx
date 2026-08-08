import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DepartmentModal from '../components/DepartmentModal';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  RotateCcw,
  CheckCircle,
  Search,
  ShieldCheck,
  Award,
  Factory,
  TrendingUp,
  Layers,
  Wrench,
  GripVertical,
} from 'lucide-react';

const iconMap = {
  TrendingUp: TrendingUp,
  ShieldCheck: ShieldCheck,
  Award: Award,
  Factory: Factory,
  Layers: Layers,
  Wrench: Wrench,
  Building2: Building2,
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [seeding, setSeeding] = useState(false);

  // Drag & Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments');
      setDepartments(response.data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/departments/${editingItem.id}`, formData);
        showToast('Department updated successfully! 🎉');
      } else {
        const nextOrder = departments.length > 0 ? Math.max(...departments.map((d) => d.sortOrder || 1)) + 1 : 1;
        await api.post('/departments', { ...formData, sortOrder: nextOrder });
        showToast('New Department added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchDepartments();
    } catch (error) {
      alert('Failed to save department: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete department "${name}"?`)) {
      try {
        await api.delete(`/departments/${id}`);
        showToast('Department deleted successfully! 🗑️');
        fetchDepartments();
      } catch (error) {
        alert('Failed to delete department');
      }
    }
  };

  const handleSeedFromDocx = async () => {
    if (window.confirm('Reset and load all 6 extracted Maruti Pharma department docx files?')) {
      try {
        setSeeding(true);
        const res = await api.post('/departments/seed');
        showToast(`Loaded ${res.data.count || 6} Departments from Docx files! 🎉`);
        fetchDepartments();
      } catch (error) {
        alert('Error seeding departments: ' + error.message);
      } finally {
        setSeeding(false);
      }
    }
  };

  // Drag and Drop Event Handlers
  const handleDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, dropTargetIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropTargetIndex) {
      setDraggedItemIndex(null);
      return;
    }

    const updatedList = [...departments];
    const [movedItem] = updatedList.splice(draggedItemIndex, 1);
    updatedList.splice(dropTargetIndex, 0, movedItem);

    // Reassign sortOrder sequentially
    const reorderedList = updatedList.map((item, idx) => ({
      ...item,
      sortOrder: idx + 1,
    }));

    setDepartments(reorderedList);
    setDraggedItemIndex(null);

    // Persist new order to backend database
    try {
      for (let i = 0; i < reorderedList.length; i++) {
        await api.put(`/departments/${reorderedList[i].id}`, {
          sortOrder: reorderedList[i].sortOrder,
        });
      }
      showToast('Departments re-ordered successfully via Drag & Drop! 🎯');
    } catch (err) {
      console.error('Failed to persist drag-and-drop order:', err);
    }
  };

  const filteredDepartments = departments.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.overview && d.overview.toLowerCase().includes(q));
  });

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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Department details updated.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Operations & Departments
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Maruti Pharma Departments ({departments.length})
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={handleSeedFromDocx} disabled={seeding} title="Reset & Re-load all 6 extracted docx files">
            <RotateCcw size={16} color="#c054c2" /> {seeding ? 'Loading...' : 'Import 6 Docx Departments'}
          </button>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            <Plus size={18} /> Add Department
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search departments by name, overview, objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* DEPARTMENTS TABLE WITH DRAG & DROP SORTING */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={20} color="#c054c2" /> Dynamic Departments Listing
          </h3>
          <div style={{ fontSize: '0.82rem', color: '#c054c2', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GripVertical size={16} /> Drag & Drop any row to re-order departments for the public site
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Drag</th>
                <th style={{ width: '100px' }}>Banner</th>
                <th style={{ width: '240px' }}>Department</th>
                <th>Overview & Core Scope</th>
                <th style={{ width: '90px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '110px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                    Loading departments...
                  </td>
                </tr>
              ) : filteredDepartments.length > 0 ? (
                filteredDepartments.map((d, index) => {
                  const IconComp = iconMap[d.icon] || Building2;
                  const isBeingDragged = draggedItemIndex === index;

                  return (
                    <tr
                      key={d.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{
                        cursor: 'grab',
                        background: isBeingDragged ? '#faf5ff' : 'transparent',
                        opacity: isBeingDragged ? 0.5 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'grab' }}>
                          <GripVertical size={18} color="#c054c2" />
                          <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.85rem' }}>
                            #{index + 1}
                          </span>
                        </div>
                      </td>
                      <td>
                        <img
                          src={getImageUrl(d.imageUrl)}
                          alt={d.name}
                          style={{ width: '64px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc' }}
                          onError={(e) => handleImageError(e)}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ padding: '8px', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
                            <IconComp size={20} color="#c054c2" />
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{d.name}</div>
                            {d.subtitle && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{d.subtitle}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                        <div style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {d.overview}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${d.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                          {d.status || 'Active'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon-action btn-icon-edit"
                            onClick={() => {
                              setEditingItem(d);
                              setIsModalOpen(true);
                            }}
                            title="Edit Department"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            className="btn-icon-action btn-icon-delete"
                            onClick={() => handleDelete(d.id, d.name)}
                            title="Delete Department"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No departments found. Click "Import 6 Docx Departments" to load.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default DepartmentsPage;
