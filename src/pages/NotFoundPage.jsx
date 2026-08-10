import React from 'react';
import { ArrowLeft, AlertTriangle, ShieldAlert, Home, RefreshCw } from 'lucide-react';

const NotFoundPage = ({ onGoDashboard }) => {
  return (
    <div
      style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '560px',
          width: '100%',
          padding: '48px 36px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            border: '2px solid #fecaca',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)',
          }}
        >
          <ShieldAlert size={42} />
        </div>

        <div
          style={{
            display: 'inline-block',
            background: '#faf5ff',
            color: '#9e4895',
            fontWeight: 800,
            fontSize: '0.85rem',
            padding: '6px 16px',
            borderRadius: '20px',
            letterSpacing: '1px',
            marginBottom: '16px',
            border: '1px solid #f3e8ff',
          }}
        >
          404 PAGE NOT FOUND
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.2 }}>
          Oops! Page <span style={{ fontStyle: 'italic', color: '#9e4895' }}>Not Found</span>
        </h1>

        <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The admin route or resource you are looking for might have been moved, deleted, or does not exist.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => onGoDashboard ? onGoDashboard() : (window.location.href = '/dashboard')}
            className="btn btn-primary"
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Home size={18} /> Back to Dashboard
          </button>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-secondary"
            style={{
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
