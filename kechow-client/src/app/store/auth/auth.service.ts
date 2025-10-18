import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Axios instance
export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

// Auth API calls
export const login = async (payload: { email: string; password: string }) => {
	try {
		// First, get the CSRF cookie
		await api.get('/sanctum/csrf-cookie');
		console.log('CSRF cookie obtained');

		// Then, attempt login
		const response = await api.post('/api/login', payload);
		console.log('Login response:', response);
		return response.data;
	} catch (error) {
		console.error('Login error:', error);
		throw error; // Re-throw the error after logging it
	}
};

export const register = async (payload: {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string;
}) => {
	await api.get('/sanctum/csrf-cookie');
	const response = await api.post('/api/register', payload);
	return response.data;
};

export const getUser = async () => {
	const response = await api.get('/api/user'); // no Authorization header
	return response.data;
};
