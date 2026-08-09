import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Mail,
  Trash2,
  Search,
  RefreshCw,
  CheckCircle,
  Download,
  UserCheck,
  Sparkles,
  Clock,
} from 'lucide-react';

const NewsletterPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [statusFilter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/newsletter/subscribers', { params });
      setSubscribers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (window.confirm(`Remove subscriber "${email}"?`)) {
      try {
        await api.delete(`/newsletter/subscribers/${id}`);
        showToast('Subscriber removed successfully 🗑️');
        fetchSubscribers();
      } catch {
        alert('Failed to remove subscriber');
      }
    }
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      alert('No subscribers available to export.');
      return;
    }
    const headers = ['ID', 'Email', 'Status', 'Date Subscribed'];
    const rows = filteredSubscribers.map((s) => [
      s.id,
      `"${s.email}"`,
      s.status || 'Active',
      `"${new Date(s.createdAt).toISOString()}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `maruti_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers list exported as CSV! 📥');
  };

  const filteredSubscribers = subscribers.filter((s) => {
    if (!searchQuery) return true;
    return s.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeCount = subscribers.filter((s) => s.status === 'Active').length;
  const unsubscribedCount = subscribers.filter((s) => s.status === 'Unsubscribed').length;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
            <Sparkles size={16} /> Marketing &amp; Communications
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Newsletter Subscribers List
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Manage email subscribers collected via the public website newsletter subscription form.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary"
            onClick={fetchSubscribers}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            className="btn btn-primary"
            onClick={exportToCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Subscribers</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{subscribers.length}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#faf5ff', color: '#9e4895' }}><Mail size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Subscribers</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', margin: '4px 0 0 0' }}>{activeCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a' }}><UserCheck size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Unsubscribed</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', margin: '4px 0 0 0' }}>{unsubscribedCount}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#fffbeb', color: '#d97706' }}><Mail size={26} /></div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search subscriber email address..."
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
              All ({subscribers.length})
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`badge ${statusFilter === 'Active' ? 'badge-success' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'Active' ? '#16a34a' : '#ffffff', color: statusFilter === 'Active' ? '#ffffff' : '#64748b' }}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('Unsubscribed')}
              className={`badge ${statusFilter === 'Unsubscribed' ? 'badge-purple' : ''}`}
              style={{ cursor: 'pointer', padding: '6px 14px', border: '1px solid #e2e8f0', background: statusFilter === 'Unsubscribed' ? '#d97706' : '#ffffff', color: statusFilter === 'Unsubscribed' ? '#ffffff' : '#64748b' }}
            >
              Unsubscribed ({unsubscribedCount})
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={20} color="#9e4895" /> Subscribers List ({filteredSubscribers.length})
          </h3>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Subscriber Email Address</th>
                <th>Status</th>
                <th>Subscribed Date &amp; Time</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                    Loading subscribers catalog...
                  </td>
                </tr>
              ) : filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((sub, index) => (
                  <tr key={sub.id}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#94a3b8' }}>
                      {index + 1}
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#faf5ff',
                            color: '#9e4895',
                            border: '1px solid #f3e8ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Mail size={16} />
                        </div>
                        <a
                          href={`mailto:${sub.email}`}
                          style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.96rem', textDecoration: 'none' }}
                        >
                          {sub.email}
                        </a>
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px' }}>
                      <span
                        className={`badge ${sub.status === 'Active' ? 'badge-success' : 'badge-purple'}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <UserCheck size={13} /> {sub.status || 'Active'}
                      </span>
                    </td>

                    <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#94a3b8" />
                        {new Date(sub.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleDelete(sub.id, sub.email)}
                          title="Remove Subscriber"
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#ef4444',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                          }}
                        >
                          <Trash2 size={15} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No newsletter subscribers found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
