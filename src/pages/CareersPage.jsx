import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Layers, Plus, Edit3, Trash2, CheckCircle, ToggleLeft, ToggleRight,
  UploadCloud, RotateCcw, Users, GraduationCap, Award, Send, Heart, Target, Star, Briefcase
} from 'lucide-react';

const ICON_OPTIONS = [
  { value: 'users', label: 'Users / Team (Working at Maruti)', icon: Users },
  { value: 'graduation-cap', label: 'Graduation Cap (Learning & Dev)', icon: GraduationCap },
  { value: 'award', label: 'Award / Trophy (Performance)', icon: Award },
  { value: 'send', label: 'Send / Rocket (Join Our Team)', icon: Send },
  { value: 'briefcase', label: 'Briefcase (Careers)', icon: Briefcase },
  { value: 'heart', label: 'Heart (Culture)', icon: Heart },
  { value: 'target', label: 'Target (Goals)', icon: Target },
  { value: 'star', label: 'Star (Excellence)', icon: Star },
];

const emptySectionForm = {
  title: '',
  description: '',
  imageUrl: '',
  iconName: 'users',
  btnText: '',
  btnLink: '',
  isCtaCard: false,
  sortOrder: 1,
  isActive: true,
};

const CareersPage = () => {
  // State for Culture / Career Sections
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptySectionForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/career-sections');
      setSections(res.data);
    } catch (err) {
      console.error('Error fetching career sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setForm({
      ...emptySectionForm,
      sortOrder: sections.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      iconName: item.iconName || 'users',
      btnText: item.btnText || '',
      btnLink: item.btnLink || '',
      isCtaCard: item.isCtaCard || false,
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) {
      alert('Section Title is required.');
      return;
    }
    try {
      setSaving(true);
      if (editingItem) {
        await api.put(`/career-sections/${editingItem.id}`, form);
        showToast('Career section updated successfully! ✅');
      } else {
        await api.post('/career-sections', form);
        showToast('New career section created! 🎉');
      }
      setIsModalOpen(false);
      fetchSections();
    } catch (err) {
      alert('Failed to save section: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete career section "${title}"?`)) {
      try {
        await api.delete(`/career-sections/${id}`);
        showToast('Section deleted successfully 🗑️');
        fetchSections();
      } catch {
        alert('Failed to delete section');
      }
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await api.put(`/career-sections/${item.id}`, { isActive: !item.isActive });
      fetchSections();
    } catch {
      alert('Failed to update status');
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all 4 culture cards ("Working at Maruti Pharma", "Learning & Development", "Performance & Recognition", "Join Our Team") to default design?')) {
      try {
        await api.post('/career-sections/reset');
        showToast('Reset to standard design cards! 🔄');
        fetchSections();
      } catch {
        alert('Failed to reset sections');
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await api.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data?.imageUrl) {
        setForm(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
        setUploadingImage(false);
        return;
      }
    } catch (err) {
      console.warn('Upload fallback to data URL:', err.message);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm(prev => ({ ...prev, imageUrl: event.target.result }));
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const renderIconComponent = (iconName) => {
    const matched = ICON_OPTIONS.find(o => o.value === iconName);
    const IconComp = matched ? matched.icon : Users;
    return <IconComp size={20} color="#c054c2" />;
  };

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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Careers page updated.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Careers Page Management
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Working at Maruti Pharma & Culture Sections
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage "Working at Maruti Pharma", "Learning & Development", "Performance & Recognition", and "Join Our Team" sections.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleResetDefaults} title="Restore standard 4 design cards">
            <RotateCcw size={16} /> Reset Defaults
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Career Section
          </button>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Career Sections', value: sections.length, color: '#c054c2' },
          { label: 'Active on Website', value: sections.filter(s => s.isActive).length, color: '#4ade80' },
          { label: 'Hidden Sections', value: sections.filter(s => !s.isActive).length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1.2rem', textAlign: 'center', margin: 0 }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Sections Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading career sections...
          </div>
        ) : sections.length > 0 ? sections.map((sec) => (
          <div key={sec.id} className="card" style={{
            margin: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem',
            border: sec.isCtaCard ? '2px solid #c054c2' : '1px solid #e2e8f0',
            background: sec.isCtaCard ? 'linear-gradient(135deg, #ffffff, #faf4fc)' : '#ffffff',
            position: 'relative', overflow: 'hidden'
          }}>
            {sec.isCtaCard && (
              <span style={{
                position: 'absolute', top: '12px', right: '12px', background: '#c054c2', color: 'white',
                padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase'
              }}>
                CTA Card
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', background: '#f5eeff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {renderIconComponent(sec.iconName)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{sec.title}</h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Order: #{sec.sortOrder}</div>
              </div>
            </div>

            {sec.imageUrl && (
              <div style={{ height: '150px', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9' }}>
                <img src={sec.imageUrl} alt={sec.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.6, flexGrow: 1, margin: 0 }}>
              {sec.description}
            </p>

            {sec.btnText && (
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#c054c2', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Button: "{sec.btnText}" ({sec.btnLink || '#apply'})
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => handleToggleActive(sec)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: sec.isActive ? '#4ade80' : '#94a3b8' }}
              >
                {sec.isActive ? <ToggleRight size={22} color="#4ade80" /> : <ToggleLeft size={22} color="#94a3b8" />}
                {sec.isActive ? 'Active' : 'Hidden'}
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(sec)}>
                  <Edit3 size={14} /> Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sec.id, sec.title)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            No career sections found. Click "Reset Defaults" to load the standard cards.
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT CULTURE SECTION */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 10000,
          background: 'rgba(10,25,47,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)', padding: '1rem',
        }}>
          <div style={{
            background: '#ffffff', borderRadius: '20px', padding: '2.5rem',
            width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a192f', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="#c054c2" />
              {editingItem ? 'Edit Career Section' : 'Add New Career Section'}
            </h3>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Section Title *</label>
                  <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Working at Maruti Pharma" required />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Card Icon</label>
                  <select className="form-control" value={form.iconName} onChange={e => setForm({ ...form, iconName: e.target.value })}>
                    {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Display Order</label>
                  <input className="form-control" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Section Description *</label>
                <textarea className="form-control" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe the culture or section..." required style={{ resize: 'vertical' }} />
              </div>

              {/* Image Upload & URL */}
              <div style={{ marginBottom: '1.2rem', background: '#f8fafc', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>
                  Section Image
                </label>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flexGrow: 1 }}>
                    <input className="form-control" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="/assets/images/working-at-maruti.jpg or https://..." style={{ marginBottom: '8px' }} />
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f1f5f9', border: '1px solid #cbd5e1',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: '#334155'
                    }}>
                      <UploadCloud size={16} color="#c054c2" />
                      {uploadingImage ? 'Uploading Image...' : 'Upload Image File'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {form.imageUrl && (
                    <div style={{ width: '100px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', flexShrink: 0 }}>
                      <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Optional CTA Button Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Button Text (Optional)</label>
                  <input className="form-control" value={form.btnText} onChange={e => setForm({ ...form, btnText: e.target.value })} placeholder="e.g. Apply Now" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Button Link (Optional)</label>
                  <input className="form-control" value={form.btnLink} onChange={e => setForm({ ...form, btnLink: e.target.value })} placeholder="e.g. #apply" />
                </div>
              </div>

              <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="isCtaCard" checked={form.isCtaCard} onChange={e => setForm({ ...form, isCtaCard: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="isCtaCard" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                    Style as CTA Card (Highlight with gradient like "Join Our Team")
                  </label>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="secIsActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="secIsActive" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
                    Active — Visible on public Careers page
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : (editingItem ? 'Update Section' : 'Create Section')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
