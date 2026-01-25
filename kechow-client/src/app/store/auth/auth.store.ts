// kechow-client/src/app/store/auth/auth.store.ts
import { defineStore } from 'pinia';
import { login, register, getUser, api } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

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
	const isDelivery = computed(() => user.value?.role === 'delivery');
	const isCustomer = computed(() => user.value?.role === 'customer');

	const setAuthHeader = () => {
		if (token.value)
			api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
		else delete api.defaults.headers.common['Authorization'];
	};
	setAuthHeader();

	const redirectByRole = () => {
		if (!user.value) return;
		const routes: Record<string, string> = {
			owner: '/owner/dashboard',
			delivery: '/delivery/dashboard',
			customer: '/home',
		};
		router.push(routes[user.value.role] || '/home');
	};

	const loginAction = async (credentials: {
		email: string;
		password: string;
	}) => {
		try {
			isLoading.value = true;
			error.value = null;

			const response = await login(credentials);
			user.value = response.user;
			token.value = response.token;

			localStorage.setItem('user', JSON.stringify(response.user));
			localStorage.setItem('token', response.token);
			setAuthHeader();

			redirectByRole();

			return response;
		} catch (err: any) {
			logout();
			error.value = err.message || 'Login failed';
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

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
			user.value = response.user;
			token.value = response.token;

			localStorage.setItem('user', JSON.stringify(response.user));
			localStorage.setItem('token', response.token);
			setAuthHeader();

			redirectByRole();

			return response;
		} catch (err: any) {
			error.value = err.message || 'Registration failed';
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	const initialize = async () => {
		if (token.value && !user.value) {
			try {
				isLoading.value = true;
				const data = await getUser();
				user.value = data.user;
				setAuthHeader();
			} catch {
				logout();
			} finally {
				isLoading.value = false;
			}
		}
	};

	const logout = () => {
		user.value = null;
		token.value = null;
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		setAuthHeader();
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
		isDelivery,
		isCustomer,
		redirectByRole,
	};
});
