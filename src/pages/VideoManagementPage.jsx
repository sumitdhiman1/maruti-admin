import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Video, UploadCloud, Save, RotateCcw, CheckCircle, Eye, EyeOff, Play, Film, Sparkles, ExternalLink } from 'lucide-react';

const VideoManagementPage = () => {
  const [videoData, setVideoData] = useState({
    title: '',
    subtitle: '',
    videoUrl: '',
    posterUrl: '',
    videoType: 'vimeo',
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchVideoSettings();
  }, []);

  const fetchVideoSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/home-video');
      if (res.data) {
        setVideoData(res.data);
      }
    } catch (err) {
      console.error('Error fetching video settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put('/home-video', videoData);
      setVideoData(res.data);
      showToast('Home video settings updated successfully! 🎬');
    } catch (err) {
      alert('Failed to update video settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset Home Page Video to standard default Vimeo overview video?')) {
      try {
        setSaving(true);
        const res = await api.post('/home-video/reset');
        setVideoData(res.data);
        showToast('Reset to default Maruti Pharma Vimeo video! 🔄');
      } catch (err) {
        alert('Failed to reset video settings');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.imageUrl) {
        setVideoData(prev => ({
          ...prev,
          videoUrl: res.data.imageUrl,
          videoType: 'mp4',
        }));
        showToast('Video file uploaded successfully! 📹');
      }
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Helper parser for live admin preview
  const getEmbedUrl = (rawUrl) => {
    if (!rawUrl) return 'https://player.vimeo.com/video/131188216?api=1';
    const url = rawUrl.trim();

    if (url.includes('youtube.com/watch') || url.includes('youtu.be') || url.includes('youtube.com/embed')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1]?.split('&')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0];
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0` : url;
    }

    if (url.includes('vimeo.com') && !url.includes('player.vimeo.com')) {
      const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=0&loop=1` : url;
    }

    return url;
  };

  const embedUrl = getEmbedUrl(videoData.videoUrl);
  const isMp4 = videoData.videoType === 'mp4' || embedUrl.endsWith('.mp4') || embedUrl.includes('/video/upload/');

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
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{toastMessage}</div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Home Page video setting active.</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#c054c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Home Page Management
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0a192f', marginTop: '2px' }}>
            Fullwidth Video Player Settings
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleReset} title="Reset to standard Vimeo video">
            <RotateCcw size={16} /> Reset Default
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Form Settings */}
        <div className="card" style={{ margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Film size={20} color="#c054c2" /> Video Configuration
            </h3>
          </div>

          <form onSubmit={handleSave}>
            {/* Status Toggle */}
            <div style={{ marginBottom: '1.2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>Video Player Visibility</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Show or hide fullwidth video on website home page</div>
              </div>

              <button
                type="button"
                onClick={() => setVideoData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`btn ${videoData.isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {videoData.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                {videoData.isActive ? 'Active on Website' : 'Hidden'}
              </button>
            </div>

            {/* Video Title */}
            <div className="form-group">
              <label className="form-label">Video Title / Name</label>
              <input
                className="form-control"
                value={videoData.title}
                onChange={e => setVideoData({ ...videoData, title: e.target.value })}
                placeholder="e.g. Maruti Pharma State-of-the-Art Facility Overview"
              />
            </div>

            {/* Video Subtitle */}
            <div className="form-group">
              <label className="form-label">Video Subtitle / Description</label>
              <textarea
                className="form-control"
                rows={2}
                value={videoData.subtitle}
                onChange={e => setVideoData({ ...videoData, subtitle: e.target.value })}
                placeholder="Brief description of video content..."
              />
            </div>

            {/* Video Source Type */}
            <div className="form-group">
              <label className="form-label">Video Source Type</label>
              <select
                className="form-control"
                value={videoData.videoType}
                onChange={e => setVideoData({ ...videoData, videoType: e.target.value })}
              >
                <option value="vimeo">Vimeo Video (e.g. https://vimeo.com/... or player.vimeo.com/...)</option>
                <option value="youtube">YouTube Video (e.g. https://youtube.com/watch?v=... or embed/...)</option>
                <option value="mp4">Direct MP4 / Cloudinary Video URL</option>
              </select>
            </div>

            {/* Video URL Input */}
            <div className="form-group">
              <label className="form-label">Video URL or Embed Link *</label>
              <input
                className="form-control"
                value={videoData.videoUrl}
                onChange={e => setVideoData({ ...videoData, videoUrl: e.target.value })}
                placeholder="e.g. https://player.vimeo.com/video/131188216 or https://www.youtube.com/watch?v=..."
                required
              />
            </div>

            {/* Upload Video Button */}
            <div className="form-group" style={{ background: '#faf5ff', padding: '1rem', borderRadius: '12px', border: '1px border #e9d5ff' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Upload Custom MP4 Video File (Cloudinary)
              </label>
              <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={18} color="#c054c2" />
                {uploading ? 'Uploading Video File...' : 'Choose MP4 Video File'}
                <input type="file" accept="video/mp4,video/*" onChange={handleVideoFileUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
              <Save size={18} /> {saving ? 'Saving...' : 'Save Video Configuration'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Player Preview */}
        <div className="card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Play size={20} color="#c054c2" /> Live Player Preview
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {videoData.videoType.toUpperCase()} Format
            </span>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              position: 'relative', width: '100%', paddingTop: '56.25%',
              borderRadius: '16px', overflow: 'hidden', background: '#0a192f',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              {isMp4 ? (
                <video
                  src={embedUrl}
                  controls
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                  }}
                />
              ) : (
                <iframe
                  src={embedUrl}
                  style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0
                  }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Admin Video Preview"
                ></iframe>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                {videoData.title || 'Untitled Video'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                {videoData.subtitle || 'No description provided'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#c054c2', fontWeight: 600, marginTop: '8px', wordBreak: 'break-all' }}>
                URL: {videoData.videoUrl}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoManagementPage;
