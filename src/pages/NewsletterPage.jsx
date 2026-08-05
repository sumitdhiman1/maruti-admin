import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Mail, Trash2, Filter, Search, RefreshCw, CheckCircle, Download, UserCheck } from 'lucide-react';

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
      setSubscribers(res.data);
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
        showToast('Subscriber removed 🗑️');
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
    const rows = filteredSubscribers.map(s => [
      s.id,
      `"${s.email}"`,
      s.status,
      `"${new Date(s.createdAt).toISOString()}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maruti_newsletter_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Subscribers list exported as CSV! 📥');
  };

  const filteredSubscribers = subscribers.filter(s => {
    if (!searchQuery) return true;
    return s.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activeCount = subscribers.filter(s => s.status === 'Active').length;

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
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Marketing & Communications
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Newsletter Subscribers
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Manage email subscribers collected via the website Newsletter signup form.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchSubscribers}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={exportToCSV}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Subscribers', value: subscribers.length, color: '#c054c2' },
          { label: 'Active Subscribers', value: activeCount, color: '#4ade80' },
          { label: 'Unsubscribed', value: subscribers.filter(s => s.status === 'Unsubscribed').length, color: '#f59e0b' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1.2rem', textAlign: 'center', margin: 0 }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subscribers Table Card */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={20} color="#c054c2" /> Subscriber List ({filteredSubscribers.length})
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px 10px', gap: '6px' }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search email address..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.86rem', width: '200px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={16} color="#64748b" />
              <select className="form-control" style={{ width: '140px' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Unsubscribed">Unsubscribed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Subscriber Email</th>
                <th>Status</th>
                <th>Subscribed On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>Loading subscribers...</td></tr>
              ) : filteredSubscribers.length > 0 ? filteredSubscribers.map(sub => (
                <tr key={sub.id}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} color="#c054c2" />
                      {sub.email}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px',
                      borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800,
                      background: sub.status === 'Active' ? '#f0fdf4' : '#fef2f2',
                      color: sub.status === 'Active' ? '#16a34a' : '#ef4444',
                      border: `1px solid ${sub.status === 'Active' ? '#bbf7d0' : '#fecaca'}`,
                    }}>
                      <UserCheck size={12} /> {sub.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.84rem', color: '#64748b' }}>
                    {new Date(sub.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sub.id, sub.email)} title="Remove Subscriber">
                      <Trash2 size={14} /> Remove
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No newsletter subscribers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsletterPage;
