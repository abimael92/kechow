import { api } from '@/app/lib/axios';
import type {
	Order,
	OrdersResponse,
	OrderStats,
	DashboardStats,
	OrderFilters,
} from '../types';
import { sampleOrders } from '../data/sampleOrders';

// For development - use sample data
const useSampleData = import.meta.env.MODE === 'development';

export const fetchOrders = async (filters?: OrderFilters): Promise<Order[]> => {
	if (useSampleData) {
		// Apply basic filtering for sample data
		let filteredOrders = [...sampleOrders];

		if (filters?.status) {
			filteredOrders = filteredOrders.filter(
				(order) => order.status === filters.status
			);
		}

		if (filters?.customerName) {
			filteredOrders = filteredOrders.filter((order) =>
				order.customerName
					.toLowerCase()
					.includes(filters.customerName!.toLowerCase())
			);
		}

		// Sort by date (newest first)
		filteredOrders.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);

		return filteredOrders;
	}

	const response = await api.get<OrdersResponse>('/owner/orders', {
		params: filters,
	});
	return response.data.orders;
};

export const updateOrderStatus = async (
	orderId: string,
	status: string,
	notes?: string
): Promise<void> => {
	if (useSampleData) {
		// Simulate API call and update local sample data
		const order = sampleOrders.find((o) => o.id === orderId);
		if (order) {
			order.status = status as any;
			order.updatedAt = new Date().toISOString();
		}
		return new Promise((resolve) => setTimeout(resolve, 500));
	}

	await api.patch(`/owner/orders/${orderId}/status`, { status, notes });
};

export const getOrderStats = async (): Promise<OrderStats> => {
	if (useSampleData) {
		return {
			today: {
				orders: sampleOrders.filter(
					(o) =>
						new Date(o.createdAt).toDateString() === new Date().toDateString()
				).length,
				revenue: sampleOrders
					.filter(
						(o) =>
							new Date(o.createdAt).toDateString() === new Date().toDateString()
					)
					.reduce((sum, order) => sum + order.totalAmount, 0),
				averageOrderValue: 28.5,
			},
			weekly: {
				orders: sampleOrders.length,
				revenue: sampleOrders.reduce(
					(sum, order) => sum + order.totalAmount,
					0
				),
				trend: 'up',
			},
			monthly: {
				orders: sampleOrders.length,
				revenue: sampleOrders.reduce(
					(sum, order) => sum + order.totalAmount,
					0
				),
				completionRate: 80,
			},
		};
	}

	const response = await api.get<OrderStats>('/owner/orders/stats');
	return response.data;
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
	if (useSampleData) {
		return {
			totalOrders: sampleOrders.length,
			totalRevenue: sampleOrders.reduce(
				(sum, order) => sum + order.totalAmount,
				0
			),
			averageOrderValue:
				sampleOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
				sampleOrders.length,
			pendingOrders: sampleOrders.filter((o) =>
				['new', 'preparing', 'ready'].includes(o.status)
			).length,
			completedOrders: sampleOrders.filter((o) => o.status === 'delivered')
				.length,
			popularItems: [
				{ name: 'Margherita Pizza', count: 3, revenue: 38.97 },
				{ name: 'Pepperoni Pizza', count: 2, revenue: 29.98 },
				{ name: 'Garlic Bread', count: 3, revenue: 14.97 },
			],
		};
	}

	const response = await api.get<DashboardStats>('/owner/dashboard/stats');
	return response.data;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
	if (useSampleData) {
		const order = sampleOrders.find((o) => o.id === orderId);
		if (!order) throw new Error('Order not found');
		return order;
	}

	const response = await api.get<Order>(`/owner/orders/${orderId}`);
	return response.data;
};
