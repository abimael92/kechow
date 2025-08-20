import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/app/store/auth/auth.store';

// * Route guards
export const authGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const authStore = useAuthStore();

	// ! Initialize auth if token exists
	if (authStore.token && !authStore.user) {
		try {
			await authStore.initialize();
		} catch {
			authStore.logout();
			return next({ name: 'login', query: { redirect: to.fullPath } });
		}
	}

	const publicRoutes = ['login', 'register', 'landing'];
	if (publicRoutes.includes(to.name as string)) return next();

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return next({ name: 'login', query: { redirect: to.fullPath } });
	}

	if (to.meta.role === 'owner' && !authStore.isOwner) {
		return next({ name: 'home' });
	}

	next();
};
