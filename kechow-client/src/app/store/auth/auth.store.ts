// kechow-client/src/app/store/auth/auth.store.ts
import { defineStore } from 'pinia';
import { login, register, getUser, api } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { getDashboardRouteForRole } from '@shared/utils/role.utils';
import { useCartStore } from '@features/customer/cart/cart.store';
import { useUserStore } from '@app/store/user.store';
import { useMenuStore } from '@features/business-owner/store/menuStore';

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
		const dashboardRoute = getDashboardRouteForRole(user.value.role);
		router.push(dashboardRoute);
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
				const data = await getUser(token.value);
				user.value = data.user;
				setAuthHeader();
			} catch {
				logout();
			} finally {
				isLoading.value = false;
			}
		}
	};

	/**
	 * Comprehensive logout that clears all auth, role, and cached data
	 * - Clears auth store state
	 * - Clears all Pinia stores (cart, user, menu)
	 * - Removes all localStorage items (auth, theme, preferences, settings)
	 * - Resets axios authorization headers
	 * - Redirects to login
	 */
	const logout = () => {
		// Clear auth store state
		user.value = null;
		token.value = null;
		error.value = null;

		// Clear all Pinia stores
		try {
			// Clear cart store
			const cartStore = useCartStore();
			if (cartStore && typeof cartStore.clearCart === 'function') {
				cartStore.clearCart();
			}
		} catch (err) {
			// Store might not be initialized, continue
		}

		try {
			// Clear user store (legacy)
			const userStore = useUserStore();
			if (userStore && typeof userStore.logout === 'function') {
				userStore.logout();
			}
		} catch (err) {
			// Store might not be initialized, continue
		}

		try {
			// Clear menu store
			const menuStore = useMenuStore();
			if (menuStore && typeof menuStore.$reset === 'function') {
				menuStore.$reset();
			}
		} catch (err) {
			// Store might not be initialized, continue
		}

		// Clear all localStorage items
		// Auth-related
		localStorage.removeItem('user');
		localStorage.removeItem('token');

		// UI preferences (clearing for complete logout)
		localStorage.removeItem('theme');
		localStorage.removeItem('preferredLanguage');
		localStorage.removeItem('darkMode');

		// Role-specific settings
		localStorage.removeItem('deliverySettings');

		// Reset axios authorization header
		setAuthHeader();

		// Redirect to login
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
