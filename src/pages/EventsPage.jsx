import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventModal from '../components/EventModal';
import {
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  MapPin,
  CheckCircle,
  Image as ImageIcon,
  Search,
  X,
  Grid,
  List,
} from 'lucide-react';

const EventsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events-gallery');
      setItems(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/events-gallery/${editingItem.id}`, formData);
        showToast('Event updated successfully! 🎉');
      } else {
        await api.post('/events-gallery', formData);
        showToast('New event created successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchEvents();
    } catch (error) {
      alert('Failed to save event: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete event "${title}"?`)) {
      try {
        await api.delete(`/events-gallery/${id}`);
        showToast('Event deleted successfully! 🗑️');
        fetchEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  // Filtered Events
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPhotosCount = items.reduce((acc, item) => {
    return acc + (Array.isArray(item.images) ? item.images.length : 0);
  }, 0);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
      {/* Success Toast Notification */}
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Events gallery updated cleanly.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Enterprise Media &amp; Gallery
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Events &amp; Photo Gallery Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Manage corporate health expos, medical conferences, photo galleries, and event stories.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px' }}
        >
          <Plus size={18} /> Add New Event
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Events</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{items.length}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#faf5ff', color: '#9e4895' }}><Calendar size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Events</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{items.filter(i => i.status === 'Active').length}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a' }}><CheckCircle size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Gallery Photos</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{totalPhotosCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce' }}><ImageIcon size={26} /></div>
        </div>
      </div>

      {/* Filter, Search & View Switcher Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search event title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Status Filter Badges */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Status:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`badge ${statusFilter === 'All' ? 'badge-purple' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'All' ? '#9e4895' : '#ffffff', color: statusFilter === 'All' ? '#ffffff' : '#64748b' }}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`badge ${statusFilter === 'Active' ? 'badge-success' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'Active' ? '#16a34a' : '#ffffff', color: statusFilter === 'Active' ? '#ffffff' : '#64748b' }}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('Draft')}
              className={`badge ${statusFilter === 'Draft' ? 'badge-purple' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'Draft' ? '#64748b' : '#ffffff', color: statusFilter === 'Draft' ? '#ffffff' : '#64748b' }}
            >
              Draft
            </button>
          </div>

          {/* View Mode Switcher Toggle */}
          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px', border: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? '#9e4895' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'grid' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Grid size={16} /> Grid Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#9e4895' : '#64748b',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <List size={16} /> Table List
            </button>
          </div>
        </div>
      </div>

      {/* EVENTS SHOWCASE CONTENT */}
      {loading ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          Loading events gallery...
        </div>
      ) : filteredItems.length > 0 ? (
        viewMode === 'grid' ? (
          /* MODERN SPACIOUS GRID CARDS VIEW */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {filteredItems.map((item) => {
              const imagesList = Array.isArray(item.images) && item.images.length > 0
                ? item.images
                : ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'];

              const coverImg = imagesList[0];

              return (
                <div
                  key={item.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25 ease',
                  }}
                >
                  {/* Card Image Header */}
                  <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                    <img
                      src={coverImg}
                      alt={item.title}
                      onClick={() => setPreviewImage(coverImg)}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                      <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-purple'}`}>
                        {item.status || 'Active'}
                      </span>
                    </div>

                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(14, 7, 20, 0.82)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={14} color="#d362c7" /> {imagesList.length} Photos
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                        <MapPin size={14} color="#9e4895" /> {item.location || 'Kathmandu, Nepal'}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.3 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: '0 0 16px 0', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Card Footer Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {imagesList.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Thumb"
                            onClick={() => setPreviewImage(img)}
                            style={{ width: '32px', height: '32px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #e2e8f0', cursor: 'pointer' }}
                          />
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #f3e8ff',
                            background: '#faf5ff',
                            color: '#9e4895',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.title)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* SPACIOUS CLEAN TABLE LIST VIEW */
          <div className="card">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Cover</th>
                    <th>Event Title &amp; Location</th>
                    <th>Description</th>
                    <th>Gallery</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const imagesList = Array.isArray(item.images) && item.images.length > 0
                      ? item.images
                      : ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'];

                    const coverImg = imagesList[0];

                    return (
                      <tr key={item.id}>
                        <td style={{ padding: '16px 20px' }}>
                          <img
                            src={coverImg}
                            alt="Cover"
                            onClick={() => setPreviewImage(coverImg)}
                            style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'block' }}
                          />
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginBottom: '2px' }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} color="#9e4895" /> {item.location || 'Kathmandu, Nepal'}
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px', fontSize: '0.88rem', color: '#475569', maxWidth: '340px', lineHeight: 1.6 }}>
                          {item.description}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span className="badge badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <ImageIcon size={12} /> {imagesList.length} Photos
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span className={`badge ${item.status === 'Active' ? 'badge-success' : 'badge-purple'}`}>
                            {item.status || 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItem(item);
                                setIsModalOpen(true);
                              }}
                              title="Edit Event & Photos"
                              style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid #f3e8ff',
                                background: '#faf5ff',
                                color: '#9e4895',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.title)}
                              title="Delete Event"
                              style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid #fee2e2',
                                background: '#fef2f2',
                                color: '#ef4444',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          No events found matching search criteria. Click "Add New Event" to create one.
        </div>
      )}

      {/* Event Add/Edit Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />

      {/* Image Lightbox Popup Modal */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 15, 26, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '24px',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              border: '2px solid #c054c2',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <X size={20} />
            </button>
            <img
              src={previewImage}
              alt="Event Lightbox Full View"
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
