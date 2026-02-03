import axios from 'axios';

// TODO: Route auth HTTP calls through `@app/lib/axios` to keep a single API entry point.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Axios instance
export const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

// Auth API calls (no logging of response/token to prevent sensitive data exposure)
export const login = async (payload: { email: string; password: string }) => {
	try {
		await api.get('/sanctum/csrf-cookie');
		const response = await api.post('/api/login', payload);
		return response.data;
	} catch (error) {
		if (import.meta.env.DEV) {
			// Log only in development; never log response/credentials
			console.error('Login failed');
		}
		throw error;
	}
};

function getApiErrorMessage(error: unknown): string {
	if (error && typeof error === 'object' && 'response' in error) {
		const err = error as { response?: { data?: { message?: string; errors?: Record<string, string[]> }; status?: number } };
		const data = err.response?.data;
		if (data?.errors && typeof data.errors === 'object') {
			const first = Object.values(data.errors).flat()[0];
			if (typeof first === 'string') return first;
		}
		if (typeof data?.message === 'string') return data.message;
	}
	if (error instanceof Error) return error.message;
	return 'Error de conexión. Intenta de nuevo.';
}

export const register = async (payload: {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string;
	restaurant_name?: string;
}) => {
	try {
		await api.get('/sanctum/csrf-cookie');
		const response = await api.post('/api/register', payload);
		return response.data;
	} catch (error) {
		if (import.meta.env.DEV) console.error('Register failed');
		throw new Error(getApiErrorMessage(error));
	}
};

export const getUser = async (token?: string) => {
	const response = await api.get('/api/user', {
		headers: token ? { Authorization: `Bearer ${token}` } : {},
	});
	return response.data;
};
