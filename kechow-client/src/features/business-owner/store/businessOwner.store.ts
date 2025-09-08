import { api } from '@app/lib/axios';
import type { Order, OrdersResponse } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
	const response = await api.get<OrdersResponse>('/owner/orders');
	return response.data.orders;
};

export const updateOrderStatus = async (
	orderId: string,
	status: string
): Promise<void> => {
	await api.patch(`/owner/orders/${orderId}/status`, { status });
};

export const getOrderStats = async (): Promise<any> => {
	const response = await api.get('/owner/orders/stats');
	return response.data;
};
