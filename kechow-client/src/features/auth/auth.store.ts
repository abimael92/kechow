import { defineStore } from 'pinia';
import { login, register } from './auth.service';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
	const router = useRouter();

	const state = {
		user: null as null | { id: number; name: string; email: string },
		token: localStorage.getItem('token'),
	};

	async function loginAction(payload: { email: string; password: string }) {
		const res = await login(payload);
		state.user = res.data.user;
		state.token = res.data.token;
		localStorage.setItem('token', res.data.token);
		router.push('/');
	}

	async function registerAction(payload: {
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
	}) {
		const res = await register(payload);
		state.user = res.data.user;
		state.token = res.data.token;
		localStorage.setItem('token', res.data.token);
		router.push('/');
	}

	function logout() {
		state.user = null;
		state.token = null;
		localStorage.removeItem('token');
	}

	return { ...state, login: loginAction, register: registerAction, logout };
});
