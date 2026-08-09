import React, { useState } from 'react';
import { UploadCloud, Check, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const ImageUploadField = ({ label, value, onChange, placeholder = "Drag & Drop Image Here or click to browse" }) => {
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const base64Image = event.target.result;
      try {
        // First attempt multipart upload
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.imageUrl) {
          onChange(res.data.imageUrl);
        } else {
          onChange(base64Image);
        }
      } catch (err) {
        // Fallback to base64 preview
        onChange(base64Image);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
          {label}
        </label>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: isDragOver ? '2px dashed #c054c2' : value ? '2px solid #22c55e' : '2px dashed #cbd5e1',
          background: isDragOver ? '#faf5ff' : value ? '#f0fdf4' : '#f8fafc',
          borderRadius: '12px',
          padding: '1.2rem',
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {uploading ? (
          <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Loader2 size={32} color="#c054c2" className="spin-loader" style={{ animation: 'spinSlow 1s linear infinite' }} />
            <span style={{ fontSize: '0.9rem', color: '#c054c2', fontWeight: 700 }}>Uploading &amp; Processing Image...</span>
          </div>
        ) : value ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={value}
                alt="Uploaded Preview"
                style={{
                  maxHeight: '140px',
                  maxWidth: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: '2px solid #22c55e',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChange('');
                }}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
                title="Remove Image"
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <Check size={16} /> Image Ready
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              Click or Drag &amp; Drop a new file to replace
            </div>
          </div>
        ) : (
          <div style={{ padding: '0.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#faf5ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
              <UploadCloud size={26} color="#c054c2" />
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
              {placeholder}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Supports PNG, JPG, WEBP formats (click or drag &amp; drop)
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <style>{`
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ImageUploadField;
