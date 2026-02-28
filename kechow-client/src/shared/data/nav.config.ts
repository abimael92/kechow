/**
 * Shared navigation config per role.
 * Spanish labels only. Used by Header (mobile drawer) and RoleNavigation (desktop top nav).
 * Role is passed from layout (route), never from auth store, to avoid role leaks.
 */

export type NavRole = 'customer' | 'owner' | 'delivery' | 'admin';

export interface NavItem {
	path: string;
	label: string;
}

const adminNavItems: NavItem[] = [
	{ path: '/admin/dashboard', label: 'Centro de control' },
	{ path: '/admin/connectivity', label: 'Estado de conexión' },
	{ path: '/admin/ledger', label: 'Libro de finanzas' },
	{ path: '/admin/support', label: 'Soporte e incidencias' },
	{ path: '/admin/dispatch', label: 'Mapa de despacho' },
];

const customerNavItems: NavItem[] = [
	// { path: '/home', label: 'Inicio' },
	{ path: '/restaurants', label: 'Restaurantes' },
	{ path: '/cart', label: 'Mi Carrito' },
	{ path: '/orders', label: 'Mis Pedidos' },
	{ path: '/reviews', label: 'Reseñas' },
	{ path: '/profile', label: 'Perfil' },
];

const ownerNavItems: NavItem[] = [
	{ path: '/owner/dashboard', label: 'Panel de Control' },
	{ path: '/owner/orders', label: 'Pedidos' },
	{ path: '/owner/menu', label: 'Menú' },
	{ path: '/owner/analytics', label: 'Analíticas' },
	{ path: '/owner/reviews', label: 'Reseñas' },
	{ path: '/owner/settings', label: 'Configuración' },
];

const deliveryNavItems: NavItem[] = [
	{ path: '/delivery/dashboard', label: 'Panel de Control' },
	{ path: '/delivery/orders', label: 'Pedidos' },
	{ path: '/delivery/earnings', label: 'Ganancias' },
	{ path: '/delivery/profile', label: 'Perfil' },
];

export function getNavItemsForRole(role: NavRole | undefined | null): NavItem[] {
	switch (role) {
		case 'admin':
			return adminNavItems;
		case 'customer':
			return customerNavItems;
		case 'owner':
			return ownerNavItems;
		case 'delivery':
			return deliveryNavItems;
		default:
			return [];
	}
}

export const roleLabels: Record<NavRole, string> = {
	admin: 'Super Admin',
	customer: 'Cliente',
	owner: 'Propietario',
	delivery: 'Repartidor',
};
