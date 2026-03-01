// src/lib/api.ts
// This file centralizes all API calls and allows switching between Node.js and PHP backends.

const IS_PHP_BACKEND = false; // Set to false for Vercel (Node.js)

export const API_BASE = IS_PHP_BACKEND ? '/api' : '/api';

export const getApiUrl = (endpoint: string) => {
  const [path, query] = endpoint.split('?');
  const queryString = query ? `?${query}` : '';

  if (!IS_PHP_BACKEND) return `/api/${path}${queryString}`;

  // Mapping for PHP backend
  let phpPath = '';
  switch (path) {
    case 'admin/login':
      phpPath = 'admin.php?action=login';
      break;
    case 'admin/stats':
      phpPath = 'admin.php?action=stats';
      break;
    case 'posts':
      phpPath = 'posts.php';
      break;
    case 'manage_posts':
      phpPath = 'manage_posts.php';
      break;
    default:
      if (path.startsWith('posts/')) {
        const parts = path.split('/');
        if (parts.length === 2) {
          // It's a slug or ID
          phpPath = `posts.php?slug=${parts[1]}`;
        } else if (parts.length === 3) {
          // It's an action like posts/1/comments
          const id = parts[1];
          const action = parts[2];
          phpPath = `${action}.php?post_id=${id}`;
        }
      } else {
        phpPath = `${path}.php`;
      }
  }

  const separator = phpPath.includes('?') ? '&' : '?';
  return `${API_BASE}/${phpPath}${query ? separator + query : ''}`;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, options);
  return response;
};
