import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventModal from '../components/EventModal';
import { Calendar, Plus, Edit3, Trash2, Sparkles, MapPin, ArrowRight, ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';

const EventsPage = () => {
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
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events-gallery');
      setItems(response.data);
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Events gallery updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Events Management Section
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Events & Photo Gallery Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage events, health expos, and multiple photo uploads per event for the public website carousel.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add New Event
        </button>
      </div>

      {/* LIVE EVENTS PREVIEW CARD - Matching exact reference design from image! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE EVENTS SECTION PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            Events Section Active
          </span>
        </div>

        <div style={{ padding: '3rem 2rem', background: '#faf5fa' }}>
          {/* Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                Events
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a192f', marginBottom: '4px' }}>
                Our{' '}
                <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
                  Events
                </span>
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem' }}>
                Participating, Connecting & Contributing to a Healthier Tomorrow
              </p>
            </div>

            <button className="btn" style={{ borderRadius: '9999px', border: '1px solid #0f172a', background: 'transparent', padding: '8px 20px', fontWeight: 700, fontSize: '0.85rem' }}>
              View All Events ➔
            </button>
          </div>

          {/* Events Carousel Cards Grid */}
          <div style={{ position: 'relative' }}>
            {/* Left Nav Arrow */}
            <div
              style={{
                position: 'absolute',
                left: '-18px',
                top: '40%',
                transform: 'translateY(-50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#c054c2',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(192,84,194,0.3)',
                zIndex: 10,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={20} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {items.map((event) => {
                const coverImg = Array.isArray(event.images) && event.images.length > 0
                  ? event.images[0]
                  : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

                return (
                  <div
                    key={event.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Cover Photo */}
                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                      <img
                        src={coverImg}
                        alt={event.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {Array.isArray(event.images) && event.images.length > 1 && (
                        <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(14, 7, 20, 0.8)', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ImageIcon size={12} color="#c054c2" /> +{event.images.length - 1} Photos
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0a192f', marginBottom: '6px' }}>
                          {event.title}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, marginBottom: '12px' }}>
                          <MapPin size={14} color="#94a3b8" /> {event.location || 'Kathmandu, Nepal'}
                        </div>

                        <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.55 }}>
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* EVENTS MANAGEMENT TABLE */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="#c054c2" /> Events & Photos Management
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Add events, upload multiple photos per event, edit locations and descriptions.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Photo Gallery</th>
                <th>Event Title & Location</th>
                <th>Description</th>
                <th>Photos Count</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading events...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        {Array.isArray(item.images) && item.images.slice(0, 3).map((imgUrl, idx) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            alt="Event thumbnail"
                            style={{ width: '45px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} color="#c054c2" /> {item.location}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '300px' }}>
                      {item.description}
                    </td>
                    <td>
                      <span className="badge badge-active" style={{ background: '#faf5fa', color: '#c054c2', border: '1px solid #f3d4f5' }}>
                        {Array.isArray(item.images) ? item.images.length : 0} Photos
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
                          <Edit3 size={14} /> Edit & Photos
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id, item.title)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No events created yet. Click "Add New Event" to create your first event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default EventsPage;
