import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/store/auth/auth.store';

export const authGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const authStore = useAuthStore();

	// Initialize auth state if token exists
	if (authStore.token && !authStore.user) {
		try {
			await authStore.initialize();
		} catch (error) {
			authStore.logout();
			return next({ name: 'login', query: { redirect: to.fullPath } });
		}
	}

	// Public routes that don't require authentication
	const publicRoutes = ['login', 'register', 'landing'];
	if (publicRoutes.includes(to.name as string)) {
		return next();
	}

	// Auth required routes
	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return next({
			name: 'login',
			query: { redirect: to.fullPath },
		});
	}

	// Role-based routes
	if (to.meta.role === 'owner' && !authStore.isOwner) {
		return next({ name: 'home' });
	}

	next();
};
