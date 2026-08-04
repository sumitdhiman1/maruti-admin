import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Phone, Mail, MapPin, Calendar, Trash2, Filter } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, typeFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;

      const response = await api.get('/leads', { params });
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/leads/${id}`, { status: newStatus });
      fetchLeads();
    } catch (error) {
      alert('Failed to update lead status');
    }
  };

  const handleDelete = async (id, customerName) => {
    if (window.confirm(`Delete lead from ${customerName}?`)) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        alert('Failed to delete lead');
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0a192f' }}>
          Customer Leads & Test Drive Bookings
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Track and process customer test drives, price quote inquiries, and showroom callbacks.
        </p>
      </div>

      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Filter size={18} color="#64748b" />
            <select
              className="form-control"
              style={{ width: '180px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="form-control"
              style={{ width: '180px' }}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Request Types</option>
              <option value="Test Drive">Test Drive</option>
              <option value="Price Quote">Price Quote</option>
              <option value="General Inquiry">General Inquiry</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Details</th>
                <th>Preferred Vehicle</th>
                <th>Request Type</th>
                <th>City</th>
                <th>Status Pipeline</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading leads data...
                  </td>
                </tr>
              ) : leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>
                      {lead.customerName}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                        <Mail size={14} color="#64748b" /> {lead.customerEmail}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                        <Phone size={14} color="#64748b" /> {lead.customerPhone}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#003399' }}>
                      {lead.preferredVehicle || 'General'}
                    </td>
                    <td>
                      <span className="badge badge-active">{lead.type}</span>
                    </td>
                    <td>{lead.city || 'N/A'}</td>
                    <td>
                      <select
                        className="form-control"
                        style={{
                          padding: '4px 8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          width: '140px',
                        }}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(lead.id, lead.customerName)}
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No customer leads match the selected filter.
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

export default Leads;
