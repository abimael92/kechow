// src/app/lib/axios.ts
import axios from 'axios';

const API_URL = String(
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
).replace(/\/$/, '');
// Avoid double /api: if URL already has /api/v1 use it; if it ends with /api append only /v1; else append /api/v1
let baseURL: string;
if (API_URL.endsWith('/api/v1')) {
  baseURL = API_URL;
} else if (API_URL.endsWith('/api')) {
  baseURL = `${API_URL}/v1`;
} else {
  baseURL = `${API_URL}/api/v1`;
}

/** Server origin only (for Sanctum CSRF cookie), e.g. http://127.0.0.1:8000 */
export const serverBaseUrl =
  API_URL.replace(/\/api(\/v1)?\/?$/i, '') ||
  API_URL.split('/').slice(0, 3).join('/');
export const apiBaseUrl = baseURL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor: add Bearer token when present (or rely on session cookie when using session-based auth)
// Add CSRF Token Handling
api.interceptors.request.use(
  (config) => {
    // 1. Attach Bearer token if you still use it for non-cookie routes
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. AUTOMATIC CSRF: Extract 'XSRF-TOKEN' from cookie and add to headers
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(name) === 0) {
        config.headers['X-XSRF-TOKEN'] = c.substring(name.length, c.length);
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Unwrap centralized API response: { success, data } -> response.data = data
api.interceptors.response.use(
  (response) => {
    const d = response.data;
    if (d && typeof d === 'object' && d.success === true && 'data' in d) {
      response.data = d.data;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
