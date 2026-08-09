import React, { useState, useEffect } from 'react';
import { UploadCloud, Check, X, Loader2 } from 'lucide-react';
import api from '../services/api';

const MediaUploadField = ({ label, value, onChange, placeholder = "Drag & Drop Video or Image File Here (or click to browse)", accept = "video/*,image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file) => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        },
      });

      if (res.data?.imageUrl) {
        onChange(res.data.imageUrl);
      } else {
        alert('Server did not return a valid file URL. Please try again.');
      }
    } catch (err) {
      console.error('File upload failed:', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message || 'Server error'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
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

  const hasValidValue = Boolean(
    value &&
    typeof value === 'string' &&
    value.trim().length > 0 &&
    value !== 'null' &&
    value !== 'undefined'
  );

  const isVideo = hasValidValue && (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov') || value.includes('/video/upload/') || value.includes('/uploads/') || value.startsWith('data:video'));

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
          border: isDragOver ? '2px dashed #c054c2' : hasValidValue ? '2px solid #22c55e' : '2px dashed #cbd5e1',
          background: isDragOver ? '#faf5ff' : hasValidValue ? '#f0fdf4' : '#f8fafc',
          borderRadius: '12px',
          padding: '1.2rem',
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        {uploading ? (
          <div style={{ padding: '0.8rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', maxWidth: '340px', margin: '0 auto' }}>
            <Loader2 size={32} color="#c054c2" style={{ animation: 'spinSlow 1s linear infinite' }} />
            <div style={{ fontSize: '0.9rem', color: '#c054c2', fontWeight: 800 }}>
              {uploadProgress < 100
                ? `Uploading Media: ${uploadProgress}%`
                : `100% - Finalizing Media on Server...`}
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #c054c2, #8b5cf6)', transition: 'width 0.2s ease-out' }}></div>
            </div>
          </div>
        ) : hasValidValue ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
              {isVideo ? (
                <video
                  src={value}
                  controls
                  style={{
                    maxHeight: '160px',
                    maxWidth: '100%',
                    borderRadius: '10px',
                    border: '2px solid #22c55e',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
              ) : (
                <img
                  src={value}
                  alt="Media Preview"
                  style={{
                    maxHeight: '140px',
                    maxWidth: '100%',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '2px solid #22c55e',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
              )}

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
                title="Remove Media"
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <Check size={16} /> Media File Ready
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
              Supports MP4, WEBM, MOV, PNG, JPG (click or drag &amp; drop)
            </div>
          </div>
        )}

        <input
          type="file"
          accept={accept}
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

export default MediaUploadField;
