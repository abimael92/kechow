// src/app/lib/axios.ts
import axios from 'axios';
import { getEnv } from './env';

// Add /api to the base URL
const API_URL = getEnv('VITE_API_URL', 'http://127.0.0.1:8000/api'); // ← Added /api

export const apiBaseUrl = API_URL.replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request: attach token only; do not log URL/body in production
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let the browser set Content-Type with boundary for FormData (e.g. file uploads)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response: 401 → clear auth and redirect; never log response data (may contain sensitive data)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
      // Redirect to login without exposing internal error details
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.startsWith('/login')
      ) {
        window.location.href = '/login';
      }
    }
    if (import.meta.env.DEV) {
      console.error('API error', status ?? err.message);
    }
    return Promise.reject(err);
  },
);

export default api;
