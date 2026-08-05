import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Mail, Phone, Trash2, Filter, CheckCircle, Eye, Reply, Search, RefreshCw } from 'lucide-react';

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
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
      setMessages(res.data);
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
    if (window.confirm(`Delete message from ${name}?`)) {
      try {
        await api.delete(`/contact-messages/${id}`);
        showToast('Message deleted 🗑️');
        if (expandedId === id) setExpandedId(null);
        fetchMessages();
      } catch {
        alert('Failed to delete message');
      }
    }
  };

  const statusColor = {
    'New': { background: '#fef2f2', color: '#ef4444', border: '#fecaca' },
    'Read': { background: '#eff6ff', color: '#3b82f6', border: '#bfdbfe' },
    'Replied': { background: '#f0fdf4', color: '#22c55e', border: '#bbf7d0' },
  };

  const filteredMessages = messages.filter(m => {
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

  const newCount = messages.filter(m => m.status === 'New').length;

  return (
    <div>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          background: 'linear-gradient(135deg, #0e0714, #260e36)', color: '#ffffff',
          border: '2px solid #c054c2', padding: '14px 22px', borderRadius: '14px',
          boxShadow: '0 10px 30px rgba(192, 84, 194, 0.4)',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <CheckCircle size={24} color="#4ade80" />
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Contact Us Section
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Contact Messages Inbox
            {newCount > 0 && (
              <span style={{ marginLeft: '12px', background: '#ef4444', color: 'white', borderRadius: '999px', padding: '2px 10px', fontSize: '0.85rem', fontWeight: 700 }}>
                {newCount} New
              </span>
            )}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            View and manage enquiries submitted via the website Contact Us page.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={fetchMessages} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'New Messages', value: messages.filter(m => m.status === 'New').length, color: '#ef4444' },
          { label: 'Read Messages', value: messages.filter(m => m.status === 'Read').length, color: '#3b82f6' },
          { label: 'Replied Messages', value: messages.filter(m => m.status === 'Replied').length, color: '#22c55e' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1.2rem', textAlign: 'center', margin: 0 }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table & Controls Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#c054c2" /> All Messages ({filteredMessages.length})
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px', gap: '6px' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search name, email, subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', width: '180px' }}
              />
            </div>

            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} color="#64748b" />
              <select className="form-control" style={{ width: '140px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="New">New</option>
                <option value="Read">Read</option>
                <option value="Replied">Replied</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sender Name</th>
                <th>Contact Details</th>
                <th>Subject</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading messages...</td></tr>
              ) : filteredMessages.length > 0 ? filteredMessages.map(msg => (
                <React.Fragment key={msg.id}>
                  <tr
                    style={{ cursor: 'pointer', background: expandedId === msg.id ? '#faf5fa' : 'transparent' }}
                    onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  >
                    <td style={{ fontWeight: 800, color: '#0f172a' }}>
                      {msg.name}
                      {msg.status === 'New' && (
                        <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', borderRadius: '4px', padding: '1px 6px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase' }}>NEW</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600 }}>
                        <Mail size={14} color="#64748b" /> {msg.email}
                      </div>
                      {msg.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                          <Phone size={14} color="#64748b" /> {msg.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {msg.subject || 'General Contact Enquiry'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{
                          padding: '4px 8px', fontSize: '0.8rem', fontWeight: 700, width: '110px',
                          background: statusColor[msg.status]?.background,
                          color: statusColor[msg.status]?.color,
                          border: `1px solid ${statusColor[msg.status]?.border}`,
                        }}
                        value={msg.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleStatusChange(msg.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                          title="View Message Details"
                        >
                          <Eye size={14} /> {expandedId === msg.id ? 'Close' : 'View'}
                        </button>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Enquiry to Maruti Pharma')}`}
                          className="btn btn-secondary btn-sm"
                          title="Reply via Email"
                          onClick={() => handleStatusChange(msg.id, 'Replied')}
                        >
                          <Reply size={14} /> Reply
                        </a>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(msg.id, msg.name)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === msg.id && (
                    <tr style={{ background: '#faf5fa' }}>
                      <td colSpan="6" style={{ padding: '1.2rem 2rem' }}>
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#c054c2', textTransform: 'uppercase', margin: 0 }}>Enquiry Message</p>
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              Received: {new Date(msg.createdAt).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.95rem', color: '#1e293b', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
                            {msg.message}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No messages match your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactMessagesPage;
