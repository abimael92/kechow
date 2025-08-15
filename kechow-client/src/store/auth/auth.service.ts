import axios from '@/lib/axios';

export const login = (payload: { email: string; password: string }) =>
	axios.post('/login', payload);

export const register = (payload: {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}) => axios.post('/register', payload);
