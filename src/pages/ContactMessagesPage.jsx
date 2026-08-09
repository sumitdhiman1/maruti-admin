import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  MessageSquare,
  Mail,
  Phone,
  Trash2,
  CheckCircle,
  Eye,
  Search,
  RefreshCw,
  Clock,
  X,
  Sparkles,
} from 'lucide-react';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/contact-messages', { params });
      setMessages(res.data || []);
    } catch (err) {
      console.error('Failed to fetch contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/contact-messages/${id}`, { status: newStatus });
      fetchMessages();
      showToast(`Status updated to "${newStatus}"`);
    } catch {
      alert('Failed to update message status');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete message from "${name}"?`)) {
      try {
        await api.delete(`/contact-messages/${id}`);
        showToast('Message deleted successfully 🗑️');
        if (selectedMessage?.id === id) setSelectedMessage(null);
        fetchMessages();
      } catch {
        alert('Failed to delete message');
      }
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.subject && m.subject.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q)) ||
      (m.phone && m.phone.includes(q))
    );
  });

  const newCount = messages.filter((m) => m.status === 'New').length;
  const readCount = messages.filter((m) => m.status === 'Read').length;

  const getInitials = (name) => {
    if (!name) return 'N/A';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
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
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#9e4895', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> Contact Us Section
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Contact Messages List
            {newCount > 0 && (
              <span style={{ background: '#ef4444', color: 'white', borderRadius: '20px', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 800 }}>
                {newCount} New
              </span>
            )}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            View and manage all customer contact form submissions.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchMessages}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}
        >
          <RefreshCw size={16} /> Refresh List
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Submissions</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{messages.length}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#faf5ff', color: '#9e4895' }}><MessageSquare size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>New Messages</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', margin: '4px 0 0 0' }}>{newCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', color: '#ef4444' }}><Mail size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Read Messages</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', margin: '4px 0 0 0' }}>{readCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6' }}><Eye size={26} /></div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search sender name, email, phone, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Filter Status:</span>
            <button
              onClick={() => setStatusFilter('')}
              className={`badge ${statusFilter === '' ? 'badge-purple' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === '' ? '#9e4895' : '#ffffff', color: statusFilter === '' ? '#ffffff' : '#64748b' }}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setStatusFilter('New')}
              className={`badge ${statusFilter === 'New' ? 'badge-danger' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'New' ? '#ef4444' : '#ffffff', color: statusFilter === 'New' ? '#ffffff' : '#64748b' }}
            >
              New ({newCount})
            </button>
            <button
              onClick={() => setStatusFilter('Read')}
              className={`badge ${statusFilter === 'Read' ? 'badge-purple' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'Read' ? '#3b82f6' : '#ffffff', color: statusFilter === 'Read' ? '#ffffff' : '#64748b' }}
            >
              Read
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES DATA TABLE WITH FULL RESPONSIVE OVERFLOW CONTROL */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table
            className="data-table"
            style={{
              width: '100%',
              minWidth: '900px',
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
            }}
          >
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ width: '50px', padding: '14px 16px', textAlign: 'center' }}>#</th>
                <th style={{ width: '240px', padding: '14px 16px' }}>Sender Details</th>
                <th style={{ width: '320px', padding: '14px 16px' }}>Subject &amp; Message</th>
                <th style={{ width: '150px', padding: '14px 16px' }}>Date Received</th>
                <th style={{ width: '130px', padding: '14px 16px' }}>Status</th>
                <th style={{ width: '140px', padding: '14px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading contact messages list...
                  </td>
                </tr>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((msg, index) => (
                  <tr
                    key={msg.id}
                    style={{
                      background: msg.status === 'New' ? '#faf5ff' : 'transparent',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: '#94a3b8' }}>
                      {index + 1}
                    </td>

                    <td style={{ padding: '16px', wordBreak: 'break-word' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: msg.status === 'New' ? '#9e4895' : '#e2e8f0',
                            color: msg.status === 'New' ? '#ffffff' : '#475569',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(msg.name)}
                        </div>

                        <div style={{ minWidth: 0, flexGrow: 1 }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{msg.name}</span>
                            {msg.status === 'New' && (
                              <span style={{ background: '#ef4444', color: '#ffffff', borderRadius: '4px', padding: '1px 6px', fontSize: '0.62rem', fontWeight: 800 }}>NEW</span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#9e4895', fontWeight: 700, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <a href={`mailto:${msg.email}`} style={{ color: '#9e4895', textDecoration: 'none' }}>
                              {msg.email}
                            </a>
                          </div>
                          {msg.phone && (
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} color="#94a3b8" /> {msg.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '16px', wordBreak: 'break-word' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {msg.subject || 'General Enquiry'}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#475569', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                        {msg.message}
                      </div>
                    </td>

                    <td style={{ padding: '16px', fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#94a3b8" />
                        {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>

                    <td style={{ padding: '16px' }}>
                      <select
                        value={msg.status}
                        onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          outline: 'none',
                          cursor: 'pointer',
                          border: '1.5px solid #e2e8f0',
                          background: msg.status === 'New' ? '#fef2f2' : msg.status === 'Replied' ? '#f0fdf4' : '#eff6ff',
                          color: msg.status === 'New' ? '#ef4444' : msg.status === 'Replied' ? '#16a34a' : '#3b82f6',
                          width: '100%',
                        }}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (msg.status === 'New') {
                              handleStatusChange(msg.id, 'Read');
                            }
                          }}
                          title="View Full Message"
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #f3e8ff',
                            background: '#faf5ff',
                            color: '#9e4895',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                          }}
                        >
                          <Eye size={14} /> View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(msg.id, msg.name)}
                          title="Delete Message"
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No contact messages found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Lightbox Popup Modal */}
      {selectedMessage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 15, 26, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
          }}
          onClick={() => setSelectedMessage(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              width: '100%',
              maxWidth: '620px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#faf5ff', color: '#9e4895', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', border: '1px solid #f3e8ff' }}>
                  {getInitials(selectedMessage.name)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {selectedMessage.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                    {selectedMessage.email} {selectedMessage.phone ? `| ${selectedMessage.phone}` : ''}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                style={{ background: '#f1f5f9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Subject</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                {selectedMessage.subject || 'General Contact Enquiry'}
              </h4>

              <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>Message Content</div>
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedMessage.message}
              </div>

              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '12px' }}>
                Received on {new Date(selectedMessage.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} /> Delete Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
