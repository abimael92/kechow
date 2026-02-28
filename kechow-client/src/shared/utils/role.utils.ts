/**
 * Centralized role checking and route mapping utilities
 * Enforces strict role isolation across the application
 */

export type UserRole = 'admin' | 'owner' | 'delivery' | 'customer';

export interface RoleRouteMap {
	admin: string;
	owner: string;
	delivery: string;
	customer: string;
}

/**
 * Default dashboard routes for each role.
 * admin = Super Admin (app owner); owner = Business Owner (restaurant).
 */
export const ROLE_DASHBOARD_ROUTES: RoleRouteMap = {
	admin: '/admin/dashboard',
	owner: '/owner/dashboard',
	delivery: '/delivery/dashboard',
	customer: '/home',
} as const;

/**
 * Valid roles in the system
 */
export const VALID_ROLES: readonly UserRole[] = ['admin', 'owner', 'delivery', 'customer'] as const;

/**
 * Check if a role is valid
 */
export function isValidRole(role: string | undefined | null): role is UserRole {
	return role !== undefined && role !== null && VALID_ROLES.includes(role as UserRole);
}

/**
 * Get the dashboard route for a given role
 * Falls back to customer home if role is invalid
 */
export function getDashboardRouteForRole(role: string | undefined | null): string {
	if (!isValidRole(role)) {
		return ROLE_DASHBOARD_ROUTES.customer;
	}
	return ROLE_DASHBOARD_ROUTES[role];
}

/**
 * Check if a user role matches the required role
 */
export function hasRequiredRole(
	userRole: string | undefined | null,
	requiredRole: string | undefined | null
): boolean {
	if (!requiredRole) {
		return true; // No role requirement means accessible to all authenticated users
	}
	return isValidRole(userRole) && isValidRole(requiredRole) && userRole === requiredRole;
}

/**
 * Check if a route requires authentication
 */
export function requiresAuthentication(meta: { requiresAuth?: boolean }): boolean {
	return meta.requiresAuth === true;
}

/**
 * Check if a route requires a specific role
 */
export function requiresRole(meta: { role?: string }): string | null {
	return meta.role || null;
}
