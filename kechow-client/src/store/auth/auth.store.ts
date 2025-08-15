import { defineStore } from 'pinia';
import { login, register, getUser } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, reactive, computed } from 'vue';

// Define a User interface including role
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

// Define API response structure
interface AuthResponse {
	data?: {
		user: User;
		token: string;
		error?: string;
	};
	response?: {
		data?: {
			message?: string;
		};
	};
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
	async function loginAction(payload: { email: string; password: string }) {
		try {
			error.value = null;
			isLoading.value = true;

			const res = (await login(payload)) as AuthResponse;
			console.log('Full login response:', JSON.stringify(res, null, 2));

			// Validate response structure
			if (!res?.data) throw new Error('Invalid response from server');
			if (res.data.error) {
				error.value = res.data.error;
				return;
			}
			if (!res.data.user || !res.data.token) {
				error.value = 'Login failed. Please check your credentials.';
				return;
			}

			// Set user and token - type-safe assignment
			user.value = res.data.user;
			token.value = res.data.token;
			localStorage.setItem('token', res.data.token);

			// Debug logging for development
			console.log('Login successful, user role:', user.value?.role);

			// Redirect based on role - using optional chaining
			if (isOwner.value) {
				await router.push('/owner/dashboard');
			} else {
				await router.push('/home');
			}
		} catch (err: unknown) {
			// Type-safe error handling
			if (typeof err === 'object' && err !== null && 'response' in err) {
				const errorObj = err as { response?: { data?: { message?: string } } };
				error.value =
					errorObj.response?.data?.message || 'Login failed. Please try again.';
			} else {
				error.value = 'Login failed. Please try again.';
			}
			throw err; // Re-throw to allow component to handle
		} finally {
			isLoading.value = false;
		}
	}

	// Register action
	async function registerAction(payload: {
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
		role: string;
	}) {
		try {
			isLoading.value = true;
			error.value = null;

			const res = (await register(payload)) as AuthResponse;

			if (!res?.data) throw new Error('Invalid server response');
			if (res.data.error) {
				error.value = res.data.error;
				return;
			}

			// Type-safe assignment
			if (!res.data.user || !res.data.token) {
				throw new Error('Invalid registration data');
			}

			user.value = res.data.user;
			token.value = res.data.token;
			localStorage.setItem('token', res.data.token);

			// Redirect based on role - using optional chaining
			if (user.value?.role === 'owner') {
				await router.push('/owner/dashboard');
			} else {
				await router.push('/home');
			}
		} catch (err: unknown) {
			// Type-safe error handling
			if (typeof err === 'object' && err !== null && 'response' in err) {
				const errorObj = err as { response?: { data?: { message?: string } } };
				error.value = errorObj.response?.data?.message || 'Registration failed';
			} else {
				error.value = 'Registration failed';
			}
			throw err;
		} finally {
			isLoading.value = false;
		}
	}

	// Initialize auth state
	async function initialize() {
		if (token.value && !user.value) {
			try {
				isLoading.value = true;
				const data = await getUser(token.value);

				if (!data.user) throw new Error('Invalid user data');

				user.value = data.user;

				// Debug logging
				console.log('Initialized user:', user.value);
				console.log('Is owner:', isOwner.value);
			} catch (err) {
				console.error('Auth initialization failed:', err);
				logout();
			} finally {
				isLoading.value = false;
			}
		}
	}

	// Logout action
	function logout() {
		user.value = null;
		token.value = null;
		localStorage.removeItem('token');
		router.push('/login');
	}

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
