import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  Package,
  Layers,
  Building2,
  Flag,
  HardDrive,
  FileCode,
} from 'lucide-react';

const DbDumpPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingSql, setDownloadingSql] = useState(false);
  const [downloadingJson, setDownloadingJson] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dump-db/summary');
      if (res.data && res.data.counts) {
        setSummary(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to fetch DB summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSql = async () => {
    try {
      setDownloadingSql(true);
      const res = await api.get('/dump-db/export-sql', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/sql' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `maruti_pharma_dump_${new Date().toISOString().slice(0, 10)}.sql`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('MySQL (.sql) Dump File downloaded successfully! 🗄️');
    } catch (err) {
      console.error('SQL export error:', err);
      alert('Failed to download SQL dump file: ' + (err.response?.data?.message || err.message));
    } finally {
      setDownloadingSql(false);
    }
  };

  const handleDownloadJson = async () => {
    try {
      setDownloadingJson(true);
      const res = await api.get('/dump-db/export', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `maruti_pharma_db_dump_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('Database JSON Dump downloaded successfully! 💾');
    } catch (err) {
      console.error('JSON export error:', err);
      alert('Failed to download JSON database dump');
    } finally {
      setDownloadingJson(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        setRestoring(true);
        const parsed = JSON.parse(evt.target.result);
        const res = await api.post('/dump-db/restore', parsed);
        if (res.data && res.data.success) {
          showToast('Database restored successfully from backup! 🎉');
          fetchSummary();
        }
      } catch (err) {
        alert('Failed to restore database: Invalid backup JSON file structure');
      } finally {
        setRestoring(false);
      }
    };
    reader.readAsText(file);
  };

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
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Database operation completed cleanly.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={16} /> Enterprise System Operations
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Database Backup &amp; SQL Export
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={fetchSummary}
            className="btn"
            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontWeight: 700 }}
          >
            <RefreshCw size={16} /> Refresh
          </button>

          <label
            className="btn"
            style={{ background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            <Upload size={16} /> {restoring ? 'Restoring DB...' : 'Restore JSON'}
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} disabled={restoring} />
          </label>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="btn"
            disabled={downloadingJson}
            style={{ background: '#f8fafc', color: '#0f172a', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontWeight: 700 }}
          >
            <Download size={16} /> {downloadingJson ? 'Exporting JSON...' : 'Export JSON'}
          </button>

          <button
            type="button"
            onClick={handleDownloadSql}
            className="btn btn-primary"
            disabled={downloadingSql}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px' }}
          >
            <FileCode size={18} /> {downloadingSql ? 'Generating SQL Dump...' : 'Export MySQL File (.sql)'}
          </button>
        </div>
      </div>

      {/* Main Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Products Catalog</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{summary?.products || 0}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#faf5ff', color: '#9e4895' }}><Package size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Divisions Data</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{summary?.divisionItems || 0}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#f3e8ff', color: '#7e22ce' }}><Layers size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Departments</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{summary?.departments || 0}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb' }}><Building2 size={26} /></div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Milestones</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>{summary?.milestones || 0}</h2>
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a' }}><Flag size={26} /></div>
        </div>
      </div>

      {/* Database Dump Details Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={20} color="#9e4895" /> MySQL Database Tables Summary
          </h3>
          <button
            type="button"
            onClick={handleDownloadSql}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <FileCode size={14} /> Download MySQL (.sql)
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Model Name</th>
                <th>Total Records</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>products</strong></td>
                <td>ProductItem</td>
                <td><span className="badge badge-purple">{summary?.products || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>division_items</strong></td>
                <td>DivisionItem</td>
                <td><span className="badge badge-purple">{summary?.divisionItems || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>departments</strong></td>
                <td>Department</td>
                <td><span className="badge badge-purple">{summary?.departments || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>milestones</strong></td>
                <td>MilestoneItem</td>
                <td><span className="badge badge-purple">{summary?.milestones || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>hero_banners</strong></td>
                <td>HeroBanner</td>
                <td><span className="badge badge-purple">{summary?.heroBanners || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>certifications</strong></td>
                <td>Certification</td>
                <td><span className="badge badge-purple">{summary?.certifications || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>contact_messages</strong></td>
                <td>ContactMessage</td>
                <td><span className="badge badge-purple">{summary?.contactMessages || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
              <tr>
                <td><strong>career_openings</strong></td>
                <td>CareerOpening</td>
                <td><span className="badge badge-purple">{summary?.careers || 0} items</span></td>
                <td><span className="badge badge-success">Active &amp; Live</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DbDumpPage;
