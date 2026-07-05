const normalizeBaseUrl = (value) => (value ? value.replace(/\/$/, '') : '');

const getApiBase = () => {
  const configuredBase = process.env.REACT_APP_API_URL || process.env.API_BASE || '';
  if (configuredBase) {
    return normalizeBaseUrl(configuredBase);
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5000';
    }
  }

  return '';
};

export const API_BASE = getApiBase();

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE) {
    return `${API_BASE}${normalizedPath}`;
  }

  return normalizedPath;
};

export const parseApiResponse = async (response, fallbackMessage = 'Request failed') => {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (!response.ok) {
    let message = fallbackMessage;
    if (rawText) {
      try {
        const payload = JSON.parse(rawText);
        message = payload.message || payload.error || fallbackMessage;
      } catch {
        message = rawText;
      }
    }
    throw new Error(message);
  }

  if (!rawText) {
    return null;
  }

  const trimmed = rawText.trim();
  if (contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error('The server returned an invalid JSON response.');
    }
  }

  throw new Error('The server returned an unexpected HTML response from the API endpoint.');
};

export const buildHeaders = (options = {}) => {
  const headers = {};
  const token = localStorage.getItem('authToken');

  if (token) {
    headers['auth-token'] = token;
  }

  if (options.includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};
