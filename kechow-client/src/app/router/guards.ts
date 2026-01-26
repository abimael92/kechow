import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@app/store/auth/auth.store';
import {
	getDashboardRouteForRole,
	hasRequiredRole,
	requiresAuthentication,
	requiresRole,
} from '@shared/utils/role.utils';

/**
 * Public pages that don't require authentication
 */
const PUBLIC_PAGES = ['Login', 'Register', 'Landing'] as const;

/**
 * Strict route guard that enforces role isolation
 * Prevents cross-role access and URL manipulation
 */
export const authGuard = async (
	to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext
) => {
	const auth = useAuthStore();
	await auth.initialize();

	const user = auth.user;
	const userRole = user?.role;
	const isAuthenticated = auth.isAuthenticated;
	const routeName = to.name as string;
	const routeMeta = to.meta;

	// 1️⃣ Redirect authenticated users away from public pages
	if (isAuthenticated && user && PUBLIC_PAGES.includes(routeName as any)) {
		const dashboardRoute = getDashboardRouteForRole(userRole);
		return next(dashboardRoute);
	}

	// 2️⃣ Block unauthenticated access to protected routes
	const authRequired = requiresAuthentication(routeMeta);
	if (authRequired && !isAuthenticated) {
		return next('/login');
	}

	// 3️⃣ Strict role-based access control
	// If route requires a role, user MUST have that exact role
	const requiredRole = requiresRole(routeMeta);
	if (requiredRole) {
		// If user is not authenticated, redirect to login
		if (!isAuthenticated || !user) {
			return next('/login');
		}

		// If user role doesn't match required role, redirect to their dashboard
		// This prevents cross-role access via URL manipulation
		if (!hasRequiredRole(userRole, requiredRole)) {
			const dashboardRoute = getDashboardRouteForRole(userRole);
			return next(dashboardRoute);
		}
	}

	// 4️⃣ Additional safety: If route requires auth but no role specified,
	// ensure user is authenticated (already checked above, but explicit for clarity)
	if (authRequired && !isAuthenticated) {
		return next('/login');
	}

	// All checks passed, allow navigation
	next();
};
