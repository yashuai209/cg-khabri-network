const IS_PHP_BACKEND = false; // Vercel Node.js backend

export const API_BASE = '/api';

// Generate full API URL
export const getApiUrl = (endpoint: string) => {
  // remove starting slash if present
  const cleanEndpoint = endpoint.startsWith('/')
    ? endpoint.slice(1)
    : endpoint;

  return `${API_BASE}/${cleanEndpoint}`;
};

// Fetch helper
export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = getApiUrl(endpoint);

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};