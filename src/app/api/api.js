const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const parseJsonResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Request failed');
  }
  return data;
};

export const buildDownloadUrl = (videoUrl, formatId) => {
  const trimmedUrl = videoUrl?.trim();
  if (!trimmedUrl) return null;
  const params = new URLSearchParams({ url: trimmedUrl });
  if (formatId) {
    params.set('format_id', formatId);
  }
  return `${API_BASE}/download?${params.toString()}`;
};

/**
 * Search YouTube using the Laravel Backend
 */
export const searchVideos = async (query) => {
  const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return await parseJsonResponse(response);
};

export const getTrendingVideos = async () => {
  const response = await fetch(`${API_BASE}/trending`);
  return await parseJsonResponse(response);
};

export const getShorts = async (page = 1, perPage = 5) => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  const response = await fetch(`${API_BASE}/shorts?${params.toString()}`);
  return await parseJsonResponse(response);
};

/**
 * Get download links for any social media URL (YouTube, TikTok, etc.)
 */
export const getDownloadInfo = async (videoUrl) => {
  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: videoUrl }),
  });
  return await parseJsonResponse(response);
};
