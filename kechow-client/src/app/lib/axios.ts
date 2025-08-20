// src/app/lib/axios.ts
import axios from 'axios';
import { getEnv } from './env';

const API_URL = getEnv('VITE_API_URL', 'http://localhost:8000');

export const api = axios.create({
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' },
});

// Optional interceptors
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res,
	(err) => {
		console.error('API error:', err);
		return Promise.reject(err);
	}
);

export default api; // <-- add default export if you want `import api from ...`
