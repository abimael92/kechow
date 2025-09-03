import { api } from '@/app/lib/axios';
import type {
	Order,
	OrdersResponse,
	OrderStats,
	DashboardStats,
	OrderFilters,
	MenuItem,
	MenuStats,
	MenuItemFormData,
} from '../types';
import { sampleMenuItems } from '../data/sampleMenuItems';
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

export const fetchMenuItems = async (
	category?: string
): Promise<MenuItem[]> => {
	if (useSampleData) {
		let items = [...sampleMenuItems];
		if (category && category !== 'all') {
			items = items.filter((item) => item.category === category);
		}
		return items;
	}

	const response = await api.get<MenuItem[]>('/owner/menu/items', {
		params: { category },
	});
	return response.data;
};

export const createMenuItem = async (
	formData: MenuItemFormData
): Promise<MenuItem> => {
	if (useSampleData) {
		const newItem: MenuItem = {
			...formData,
			id: Math.random().toString(36).substr(2, 9),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		sampleMenuItems.push(newItem);
		return newItem;
	}

	const response = await api.post<MenuItem>('/owner/menu/items', formData);
	return response.data;
};

export const updateMenuItem = async (
	id: string,
	formData: Partial<MenuItemFormData>
): Promise<MenuItem> => {
	if (useSampleData) {
		const index = sampleMenuItems.findIndex((item) => item.id === id);
		if (index !== -1) {
			sampleMenuItems[index] = {
				...sampleMenuItems[index],
				...formData,
				updatedAt: new Date().toISOString(),
			};
			return sampleMenuItems[index];
		}
		throw new Error('Menu item not found');
	}

	const response = await api.put<MenuItem>(`/owner/menu/items/${id}`, formData);
	return response.data;
};

export const deleteMenuItem = async (id: string): Promise<void> => {
	if (useSampleData) {
		const index = sampleMenuItems.findIndex((item) => item.id === id);
		if (index !== -1) {
			sampleMenuItems.splice(index, 1);
		}
		return;
	}

	await api.delete(`/owner/menu/items/${id}`);
};

export const toggleMenuItemAvailability = async (
	id: string
): Promise<MenuItem> => {
	if (useSampleData) {
		const item = sampleMenuItems.find((item) => item.id === id);
		if (!item) throw new Error('Menu item not found');

		item.available = !item.available;
		item.updatedAt = new Date().toISOString();
		return item;
	}

	const response = await api.patch<MenuItem>(
		`/owner/menu/items/${id}/availability`
	);
	return response.data;
};

export const getMenuStats = async (): Promise<MenuStats> => {
	if (useSampleData) {
		const totalItems = sampleMenuItems.length;
		const availableItems = sampleMenuItems.filter(
			(item) => item.available
		).length;
		const outOfStockItems = totalItems - availableItems;
		const averagePrice =
			totalItems > 0
				? sampleMenuItems.reduce((sum, item) => sum + item.price, 0) /
				  totalItems
				: 0;

		// Fixed: Properly type the categories array
		const categoryCounts = new Map<string, number>();
		sampleMenuItems.forEach((item) => {
			const count = categoryCounts.get(item.category) || 0;
			categoryCounts.set(item.category, count + 1);
		});

		const categories = Array.from(categoryCounts.entries()).map(
			([name, count]) => ({
				name,
				count,
			})
		);

		return {
			totalItems,
			availableItems,
			outOfStockItems,
			averagePrice,
			categories,
		};
	}

	const response = await api.get<MenuStats>('/owner/menu/stats');
	return response.data;
};
