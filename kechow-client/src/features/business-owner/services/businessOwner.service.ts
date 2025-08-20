// businessOwner.service.ts
import axios from '@/app/lib/axios';

export const BusinessOwnerService = {
	getDashboard: () => axios.get('/owner/dashboard'),
	getOrders: () => axios.get('/owner/orders'),
	getMenuItems: (restaurantId: number) =>
		axios.get(`/restaurants/${restaurantId}/menu-items`),
	createMenuItem: (item: any) => axios.post('/menu-items', item),
	updateMenuItem: (id: number, item: any) =>
		axios.put(`/menu-items/${id}`, item),
	deleteMenuItem: (id: number) => axios.delete(`/menu-items/${id}`),
};

export async function fetchOwnerDashboard() {
	const res = await fetch('/api/owner/dashboard');
	return await res.json();
}
