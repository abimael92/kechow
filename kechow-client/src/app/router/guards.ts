import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@app/store/auth/auth.store';

export const authGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const auth = useAuthStore();
	await auth.initialize();

	const publicPages = ['Login', 'Register', 'Landing'];
	const authRequired = to.meta.requiresAuth;
	const user = auth.user;

	// 1️⃣ Redirect logged-in users away from login/register
	if (user && publicPages.includes(to.name as string)) {
		const routes: Record<string, string> = {
			owner: '/owner/dashboard',
			delivery: '/delivery/dashboard',
			customer: '/home',
		};
		return next(routes[user.role] || '/home');
	}

	// 2️⃣ Block access if not logged in
	if (authRequired && !auth.isAuthenticated) {
		return next('/login');
	}

	// 3️⃣ Role-based route protection
	const requiredRole = to.meta.role as string | undefined;
	if (requiredRole && user?.role !== requiredRole) {
		const routes: Record<string, string> = {
			owner: '/owner/dashboard',
			delivery: '/delivery/dashboard',
			customer: '/home',
		};
		return next(routes[user?.role || 'customer']);
	}

	next();
};
