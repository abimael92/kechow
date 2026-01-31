/**
 * Shared navigation config per role.
 * Spanish labels only. Used by Header (mobile drawer) and RoleNavigation (desktop top nav).
 * Role is passed from layout (route), never from auth store, to avoid role leaks.
 */

export type NavRole = 'customer' | 'owner' | 'delivery';

export interface NavItem {
	path: string;
	label: string;
}

const customerNavItems: NavItem[] = [
	{ path: '/home', label: 'Inicio' },
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
	customer: 'Cliente',
	owner: 'Propietario',
	delivery: 'Repartidor',
};
