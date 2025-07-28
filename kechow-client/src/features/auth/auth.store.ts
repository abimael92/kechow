import { defineStore } from 'pinia';
import { login, register } from './auth.service';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null as null | { id: number; name: string; email: string },
		token: localStorage.getItem('token'),
	}),
	actions: {
		async login(payload: { email: string; password: string }) {
			const res = await login(payload);
			this.user = res.data.user;
			this.token = res.data.token;
			localStorage.setItem('token', res.data.token);
			useRouter().push('/');
		},
		async register(payload: { name: string; email: string; password: string }) {
			const res = await register(payload);
			this.user = res.data.user;
			this.token = res.data.token;
			localStorage.setItem('token', res.data.token);
			useRouter().push('/');
		},
		logout() {
			this.user = null;
			this.token = null;
			localStorage.removeItem('token');
		},
	},
});
