import { defineStore } from 'pinia';
import { login, register } from './auth.service';
import { useRouter } from 'vue-router';
import { ref, reactive, computed } from 'vue';

// Define a User interface including role
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

export const useAuthStore = defineStore('auth', () => {
	const router = useRouter();

	// Reactive state
	const user = ref<User | null>(null);
	const token = ref<string | null>(localStorage.getItem('token'));

	// Getters
	const isAuthenticated = computed(() => !!user.value);
	const isOwner = computed(() => user.value?.role === 'owner');

	// Actions
	async function loginAction(payload: { email: string; password: string }) {
		const res = await login(payload);
		user.value = res.data.user;
		token.value = res.data.token;
		localStorage.setItem('token', res.data.token);

		// Redirect based on role
		if (user.value && user.value.role === 'owner')
			router.push('/owner/dashboard');
		else router.push('/home');
	}

	async function registerAction(payload: {
		name: string;
		email: string;
		password: string;
		password_confirmation: string;
		role: string;
	}) {
		const res = await register(payload);
		user.value = res.data.user;
		token.value = res.data.token;
		localStorage.setItem('token', res.data.token);

		if (user.value && user.value.role === 'owner')
			router.push('/owner/dashboard');
		else router.push('/home');
	}

	function logout() {
		user.value = null;
		token.value = null;
		localStorage.removeItem('token');
	}

	return {
		user,
		token,
		login: loginAction,
		register: registerAction,
		logout,
		isAuthenticated,
		isOwner,
	};
});
