import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Axios instance
export const api = axios.create({
	baseURL: API_URL,
	headers: { 'Content-Type': 'application/json' },
});

// Auth API calls
export const login = async (payload: { email: string; password: string }) => {
	const response = await api.post('/api/login', payload);
	return response.data;
};

export const register = async (payload: {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string;
}) => {
	const response = await api.post('/api/register', payload);
	return response.data;
};

export const getUser = async (token: string) => {
	const response = await api.get('api/user', {
		headers: { Authorization: `Bearer ${token}` },
	});
	return response.data;
};
