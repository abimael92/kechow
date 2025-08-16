import { defineStore } from 'pinia';
import { login, register, getUser } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import axios from 'axios';

// Define a User interface including role
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

// Define API response structure
interface AuthResponse {
	user: User;
	token: string;
}

export const useAuthStore = defineStore('auth', () => {
	const router = useRouter();

	// Reactive state
	const user = ref<User | null>(null);
	const token = ref<string | null>(localStorage.getItem('token'));
	const error = ref<string | null>(null);
	const isLoading = ref(false);

	// Getters
	const isAuthenticated = computed(() => !!token.value);
	const isOwner = computed(() => user.value?.role === 'owner');

	// Actions
	const loginAction = async (credentials: {
		email: string;
		password: string;
	}) => {
		try {
			isLoading.value = true;
			error.value = null;

			const response = await login(credentials);

			// Type guard to ensure proper response structure
			if (!response || !('user' in response))
				throw new Error('Invalid response structure');

			// Update state
			user.value = response.user;
			token.value = response.token;

			// Save to localStorage
			localStorage.setItem('user', JSON.stringify(response.user));
			localStorage.setItem('token', response.token);

			// Set axios default auth header
			axios.defaults.headers.common[
				'Authorization'
			] = `Bearer ${response.token}`;

			return response;
		} catch (err) {
			// Clear auth state on error
			user.value = null;
			token.value = null;
			localStorage.removeItem('user');
			localStorage.removeItem('token');
			delete axios.defaults.headers.common['Authorization'];

			if (err instanceof Error) {
				error.value = err.message;
			} else {
				error.value = 'Login failed';
			}
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	// Register action
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

			if (!response?.user || !response?.token) {
				throw new Error('Invalid registration data');
			}

			user.value = response.user;
			token.value = response.token;
			localStorage.setItem('token', response.token);

			// Redirect based on role
			if (user.value?.role === 'owner') {
				await router.push('/owner/dashboard');
			} else {
				await router.push('/home');
			}
		} catch (err) {
			if (err instanceof Error) {
				error.value = err.message;
			} else {
				error.value = 'Registration failed';
			}
			throw err;
		} finally {
			isLoading.value = false;
		}
	};

	// Initialize auth state
	const initialize = async () => {
		if (token.value && !user.value) {
			try {
				isLoading.value = true;
				const data = await getUser(token.value);

				if (!data?.user) throw new Error('Invalid user data');

				user.value = data.user;
			} catch (err) {
				console.error('Auth initialization failed:', err);
				logout();
			} finally {
				isLoading.value = false;
			}
		}
	};

	// Logout action
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
