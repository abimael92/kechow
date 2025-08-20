import { defineStore } from 'pinia';
import { login, register, getUser } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import axios from 'axios';

// ! User type including role
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

// * Auth store
export const useAuthStore = defineStore('auth', () => {
	const router = useRouter();

	const user = ref<User | null>(
		JSON.parse(localStorage.getItem('user') || 'null')
	);
	const token = ref(localStorage.getItem('token'));
	const error = ref<string | null>(null);
	const isLoading = ref(false);

	const isAuthenticated = computed(() => !!token.value);
	const isOwner = computed(() => user.value?.role === 'owner');

	// * Login
	const loginAction = async (credentials: {
		email: string;
		password: string;
	}) => {
		try {
			isLoading.value = true;
			error.value = null;
			const response = await login(credentials);

			if (!response || !response.user || !response.token)
				throw new Error('Invalid response');

			user.value = response.user;
			token.value = response.token;

			localStorage.setItem('user', JSON.stringify(response.user));
			localStorage.setItem('token', response.token);
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${response.token}`;

			return response;
		} catch (err: any) {
			logout();
			error.value = err.message || 'Login failed';
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	// * Register
	const registerAction = async (payload: {
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
		role: string;
	}) => {
		try {
			isLoading.value = true;
			error.value = null;
			const response = await register(payload);

			if (!response.user || !response.token)
				throw new Error('Invalid registration');

			user.value = response.user;
			token.value = response.token;

			localStorage.setItem('user', JSON.stringify(response.user));
			localStorage.setItem('token', response.token);
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${response.token}`;

			if (user.value?.role === 'owner') router.push('/owner/dashboard');
			else router.push('/home');
		} catch (err: any) {
			error.value = err.message || 'Registration failed';
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	// * Initialize user
	const initialize = async () => {
		if (token.value && !user.value) {
			try {
				isLoading.value = true;
				const data = await getUser(token.value);
				user.value = data.user;
				axios.defaults.headers.common[
					'Authorization'
				] = `Bearer ${token.value}`;
			} catch {
				logout();
			} finally {
				isLoading.value = false;
			}
		}
	};

	// * Logout
	const logout = () => {
		user.value = null;
		token.value = null;
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		delete axios.defaults.headers.common['Authorization'];
		router.push('/login');
	};

	return {
		user,
		token,
		error,
		isLoading,
		login: loginAction,
		register: registerAction,
		logout,
		initialize,
		isAuthenticated,
		isOwner,
	};
});
