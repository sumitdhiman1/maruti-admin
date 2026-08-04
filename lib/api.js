export function getApiBaseUrl() {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
}

export async function fetchApiData(endpoint) {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[API Connection] Falling back to default data for ${endpoint} (${baseUrl}):`, err.message);
    return null;
  }
}
