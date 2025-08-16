import axios from 'axios';
import api from '@/lib/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/';

export const login = async (payload: { email: string; password: string }) => {
	try {
		const response = await api.post('/api/login', payload);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(error.response?.data?.message || error.message);
		}
		throw error;
	}
};

export const register = async (payload: {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
	role: string;
}) => {
	try {
		const response = await axios.post(`${API_URL}/register`, payload);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw error.response?.data || error.message;
		}
		throw error;
	}
};

export const getUser = async (token: string) => {
	try {
		const response = await axios.get(`${API_URL}/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw error.response?.data || error.message;
		}
		throw error;
	}
};
