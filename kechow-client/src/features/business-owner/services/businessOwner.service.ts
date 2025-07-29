import api from '@/lib/axios';

export const fetchMenuItems = (restaurantId: number) =>
	api.get(`/restaurants/${restaurantId}/menu-items`);

export const createMenuItem = (data: any) => api.post('/menu-items', data);

export const updateMenuItem = (id: number, data: any) =>
	api.put(`/menu-items/${id}`, data);

export const deleteMenuItem = (id: number) => api.delete(`/menu-items/${id}`);

export const fetchOrders = (restaurantId: number) =>
	api.get(`/restaurants/${restaurantId}/orders`);

export const updateOrderStatus = (orderId: number, status: string) =>
	api.post(`/orders/${orderId}/status`, { status });
