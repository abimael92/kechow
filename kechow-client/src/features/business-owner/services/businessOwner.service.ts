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
	RestaurantSettings,
	MenuSettings,
	DeliverySettings,
	NotificationSettings,
	PaymentSettings,
	StaffSettings,
} from '../types';
import { sampleMenuItems } from '../data/sampleMenuItems';
import { sampleOrders } from '../data/sampleOrders';

// For development - use sample data
const useSampleData = import.meta.env.MODE === 'development';

/* ------------------------- ORDERS ------------------------- */
export const fetchOrders = async (filters?: OrderFilters): Promise<Order[]> => {
	if (useSampleData) {
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

/* ------------------------- MENU ------------------------- */
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

/* ------------------------- SETTINGS ------------------------- */
export const getRestaurantSettings = async (): Promise<RestaurantSettings> => {
	if (useSampleData) {
		return {
			name: "Mario's Kitchen",
			phone: '+1 (555) 123-4567',
			address: '123 Restaurant Street, Food City, FC 12345',
			description:
				'Authentic Italian cuisine with fresh ingredients and traditional recipes. Family-owned restaurant serving delicious pizza, pasta, and more since 1985.',
			isOpen: true,
			operatingHours: [
				{
					id: 'monday',
					day: 'Monday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'tuesday',
					day: 'Tuesday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'wednesday',
					day: 'Wednesday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'thursday',
					day: 'Thursday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'friday',
					day: 'Friday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'saturday',
					day: 'Saturday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
				{
					id: 'sunday',
					day: 'Sunday',
					openTime: '10:00',
					closeTime: '22:00',
					closed: false,
				},
			],
		};
	}

	const response = await api.get<RestaurantSettings>(
		'/owner/settings/restaurant'
	);
	return response.data;
};

export const updateRestaurantSettings = async (
	settings: Partial<RestaurantSettings>
): Promise<void> => {
	if (useSampleData) {
		console.log('Updating restaurant settings:', settings);
		return new Promise((resolve) => setTimeout(resolve, 500));
	}

	await api.put('/owner/settings/restaurant', settings);
};

export const getMenuSettings = async (): Promise<MenuSettings> => {
	if (useSampleData) {
		return {
			categories: ['Pizza', 'Pasta', 'Drinks', 'Desserts'],
			displayOptions: {
				showImages: true,
				showPrices: true,
				showDescriptions: true,
			},
			sorting: 'popularity',
		};
	}

	const response = await api.get<MenuSettings>('/owner/settings/menu');
	return response.data;
};

export const updateMenuSettings = async (
	settings: Partial<MenuSettings>
): Promise<void> => {
	if (useSampleData) {
		console.log('Updating menu settings:', settings);
		return new Promise((resolve) => setTimeout(resolve, 500));
	}

	await api.put('/owner/settings/menu', settings);
};

// Stubs for other settings (expand as needed)
export const getDeliverySettings = async (): Promise<DeliverySettings> => {
	const response = await api.get<DeliverySettings>('/owner/settings/delivery');
	return response.data;
};

export const updateDeliverySettings = async (
	settings: Partial<DeliverySettings>
): Promise<void> => {
	await api.put('/owner/settings/delivery', settings);
};

export const getNotificationSettings =
	async (): Promise<NotificationSettings> => {
		const response = await api.get<NotificationSettings>(
			'/owner/settings/notifications'
		);
		return response.data;
	};

export const updateNotificationSettings = async (
	settings: Partial<NotificationSettings>
): Promise<void> => {
	await api.put('/owner/settings/notifications', settings);
};

export const getPaymentSettings = async (): Promise<PaymentSettings> => {
	const response = await api.get<PaymentSettings>('/owner/settings/payments');
	return response.data;
};

export const updatePaymentSettings = async (
	settings: Partial<PaymentSettings>
): Promise<void> => {
	await api.put('/owner/settings/payments', settings);
};

export const getStaffSettings = async (): Promise<StaffSettings> => {
	const response = await api.get<StaffSettings>('/owner/settings/staff');
	return response.data;
};

export const updateStaffSettings = async (
	settings: Partial<StaffSettings>
): Promise<void> => {
	await api.put('/owner/settings/staff', settings);
};
