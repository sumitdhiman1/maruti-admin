const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&q=80';

export const getImageUrl = (url, customFallback = DEFAULT_FALLBACK_IMAGE) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return customFallback;
  }
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://') || cleanUrl.startsWith('data:image')) {
    return cleanUrl;
  }
  if (cleanUrl.startsWith('/assets/')) {
    return `http://localhost:3000${cleanUrl}`;
  }
  if (cleanUrl.startsWith('assets/')) {
    return `http://localhost:3000/${cleanUrl}`;
  }
  return cleanUrl;
};

export const handleImageError = (e, fallback = DEFAULT_FALLBACK_IMAGE) => {
  if (e && e.target) {
    e.target.onerror = null;
    e.target.src = fallback;
  }
};
