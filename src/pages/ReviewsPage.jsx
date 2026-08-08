import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewModal from '../components/ReviewModal';
import { Quote, Plus, Edit3, Trash2, Sparkles, Star, CheckCircle } from 'lucide-react';

const ReviewsPage = () => {
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
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching client reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        await api.put(`/reviews/${editingItem.id}`, formData);
        showToast('Client review updated successfully! 🎉');
      } else {
        await api.post('/reviews', formData);
        showToast('New client review added successfully! 🎉');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      fetchReviews();
    } catch (error) {
      alert('Failed to save client review: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete client review from "${name}"?`)) {
      try {
        await api.delete(`/reviews/${id}`);
        showToast('Client review deleted successfully! 🗑️');
        fetchReviews();
      } catch (error) {
        alert('Failed to delete review');
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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Client reviews data updated cleanly.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Home Section ➔ Client Reviews & Testimonials
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Client Reviews Management
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage client testimonials, doctor ratings, feedback text, and avatar photos for the public website display.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
          <Plus size={18} /> Add New Review
        </button>
      </div>

      {/* LIVE REVIEWS PREVIEW CARD - Matching exact reference design from image! */}
      <div className="card" style={{ border: '2px solid #c054c2', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #0e0714, #260e36)', color: 'white', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={16} color="#c054c2" />
            LIVE CLIENT REVIEWS PREVIEW (Public Website Display)
          </div>
          <span className="badge badge-active" style={{ background: '#c054c2', color: 'white' }}>
            Testimonials Active
          </span>
        </div>

        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#faf5fa' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            Testimonials
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a192f', marginBottom: '6px' }}>
            Client{' '}
            <span style={{ color: '#c054c2', fontStyle: 'italic', fontFamily: 'serif', fontWeight: 700 }}>
              Reviews
            </span>
          </h2>

          <p style={{ color: '#64748b', fontSize: '0.92rem', marginBottom: '2.5rem' }}>
            Trusted by healthcare professionals and partners worldwide
          </p>

          {/* 3 Reviews Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            {items.map((review) => (
              <div
                key={review.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '2rem',
                  boxShadow: '0 10px 30px rgba(192, 84, 194, 0.08)',
                  border: '1px solid #f3d4f5',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Quote Icon & Stars */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                    <Quote size={28} color="#c054c2" fill="#faf0fc" />
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} color="#ffc107" fill="#ffc107" />
                      ))}
                    </div>
                  </div>

                  {/* Review Body */}
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '2rem' }}>
                    "{review.reviewText}"
                  </p>
                </div>

                {/* Reviewer Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={review.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80'}
                    alt={review.clientName}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80';
                    }}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f3d4f5' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                      {review.clientName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {review.clientDesignation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicator Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '2.5rem' }}>
            <div style={{ width: '28px', height: '10px', borderRadius: '10px', background: '#c054c2' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f3d4f5' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f3d4f5' }} />
          </div>
        </div>
      </div>

      {/* MANAGED REVIEWS TABLE */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Quote size={20} color="#c054c2" /> Client Reviews Management
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Add, edit, re-order, or change client ratings and avatar photos.
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Client Name & Designation</th>
                <th>Rating</th>
                <th>Review Text</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading client reviews...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80'}
                        alt={item.clientName}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80';
                        }}
                        style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '50%', border: '1px solid #c054c2' }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {item.clientName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {item.clientDesignation}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} color="#ffc107" fill="#ffc107" />
                        ))}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '340px' }}>
                      "{item.reviewText}"
                    </td>
                    <td>
                      <span className={`badge ${item.status === 'Active' ? 'badge-active' : 'badge-upcoming'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button className="btn-icon-action btn-icon-edit" onClick={() => { setEditingItem(item); setIsModalOpen(true); }} title="Edit Review">
                          <Edit3 size={16} />
                        </button>
                        <button className="btn-icon-action btn-icon-delete" onClick={() => handleDelete(item.id, item.clientName)} title="Delete Review">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No reviews created yet. Click "Add New Review" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />
    </div>
  );
};

export default ReviewsPage;
