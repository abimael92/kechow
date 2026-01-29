import { api } from '@app/lib/axios';
import type {
	DeliveryOrder,
	DeliveryJob,
	DeliveryStatus,
	GPSLocation,
	DeliveryProgress,
	EarningsSummary,
	DeliveryAvailability,
	DeliverySettings,
} from '../types';

// For development - use sample data (offline-safe simulation)
const useSampleData = import.meta.env.MODE === 'development';

// Simulated GPS: random position (fallback)
const getSimulatedGPS = (): GPSLocation => {
	const baseLat = 19.4326;
	const baseLng = -99.1332;
	const lat = baseLat + (Math.random() - 0.5) * 0.1;
	const lng = baseLng + (Math.random() - 0.5) * 0.1;
	return {
		latitude: lat,
		longitude: lng,
		timestamp: new Date().toISOString(),
		accuracy: 10 + Math.random() * 20,
	};
};

// Simulated GPS along delivery route: 0=restaurant, 1=mid, 2=customer (step 0–1 pickup, 1–2 en route)
export const getSimulatedGPSForOrder = (
	order: DeliveryOrder | null,
	currentStep: number
): GPSLocation => {
	if (!order) return getSimulatedGPS();
	const from = order.restaurant.location;
	const to = order.customer.location;
	// currentStep: 0 accepted, 1 picked_up, 2 on_the_way, 3 delivered → progress 0, 0.33, 0.66, 1
	const progress = Math.min(1, Math.max(0, currentStep / 3));
	const lat = from.latitude + (to.latitude - from.latitude) * progress;
	const lng = from.longitude + (to.longitude - from.longitude) * progress;
	// Slight jitter for realism
	const jitter = 0.0001;
	return {
		latitude: lat + (Math.random() - 0.5) * jitter,
		longitude: lng + (Math.random() - 0.5) * jitter,
		timestamp: new Date().toISOString(),
		accuracy: 8 + Math.random() * 12,
	};
};

// Sample data
const sampleOrders: DeliveryOrder[] = [
	{
		id: '1',
		orderNumber: '#12345',
		status: 'available',
		restaurant: {
			id: 'r1',
			name: 'Pizza Palace',
			address: 'Av. Reforma 123, CDMX',
			phone: '+52 55 1234 5678',
			location: { latitude: 19.4326, longitude: -99.1332, timestamp: new Date().toISOString() },
		},
		customer: {
			id: 'c1',
			name: 'Juan Pérez',
			address: 'Calle Insurgentes 456, CDMX',
			phone: '+52 55 9876 5432',
			location: { latitude: 19.4285, longitude: -99.1276, timestamp: new Date().toISOString() },
		},
		items: [
			{ id: 'i1', name: 'Pizza Margherita', quantity: 2 },
			{ id: 'i2', name: 'Coca Cola', quantity: 1 },
		],
		paymentMethod: 'Card',
		amount: 25.50,
		fee: 3.50,
		distance: 2.5,
		estimatedTime: 15,
		createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
	},
	{
		id: '2',
		orderNumber: '#12346',
		status: 'available',
		restaurant: {
			id: 'r2',
			name: 'Tacos El Rey',
			address: 'Av. Juárez 789, CDMX',
			phone: '+52 55 1111 2222',
			location: { latitude: 19.4361, longitude: -99.1419, timestamp: new Date().toISOString() },
		},
		customer: {
			id: 'c2',
			name: 'María García',
			address: 'Calle Roma 321, CDMX',
			phone: '+52 55 3333 4444',
			location: { latitude: 19.4194, longitude: -99.1619, timestamp: new Date().toISOString() },
		},
		items: [
			{ id: 'i3', name: 'Tacos al Pastor', quantity: 5 },
			{ id: 'i4', name: 'Agua', quantity: 2 },
		],
		paymentMethod: 'Cash',
		amount: 18.00,
		fee: 2.50,
		distance: 1.8,
		estimatedTime: 12,
		createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
	},
];

const sampleActiveOrder: DeliveryOrder = {
	id: '3',
	orderNumber: '#12347',
	status: 'on_the_way',
	restaurant: {
		id: 'r3',
		name: 'Burger House',
		address: 'Av. Insurgentes 456, CDMX',
		phone: '+52 55 5555 6666',
		location: { latitude: 19.4100, longitude: -99.1500, timestamp: new Date().toISOString() },
	},
	customer: {
		id: 'c3',
		name: 'Carlos López',
		address: 'Calle Condesa 789, CDMX',
		phone: '+52 55 7777 8888',
		location: { latitude: 19.4150, longitude: -99.1750, timestamp: new Date().toISOString() },
	},
	items: [
		{ id: 'i5', name: 'Hamburguesa Clásica', quantity: 1 },
		{ id: 'i6', name: 'Papas Fritas', quantity: 1 },
	],
	paymentMethod: 'Card',
	amount: 22.00,
	fee: 3.00,
	distance: 3.2,
	estimatedTime: 18,
	createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
	acceptedAt: new Date(Date.now() - 18 * 60000).toISOString(),
	pickedUpAt: new Date(Date.now() - 10 * 60000).toISOString(),
};

/* ------------------------- AVAILABILITY ------------------------- */
export const getAvailability = async (): Promise<DeliveryAvailability> => {
	if (useSampleData) {
		const stored = localStorage.getItem('delivery_availability');
		if (stored) {
			return JSON.parse(stored);
		}
		return {
			isOnline: false,
			totalOnlineHours: 0,
		};
	}

	const response = await api.get<DeliveryAvailability>('/delivery/availability');
	return response.data;
};

export const updateAvailability = async (
	isOnline: boolean
): Promise<DeliveryAvailability> => {
	if (useSampleData) {
		const availability: DeliveryAvailability = {
			isOnline,
			lastOnlineAt: isOnline ? new Date().toISOString() : undefined,
			totalOnlineHours: 0, // Would be calculated from history
		};
		localStorage.setItem('delivery_availability', JSON.stringify(availability));
		return availability;
	}

	const response = await api.patch<DeliveryAvailability>('/delivery/availability', {
		isOnline,
	});
	return response.data;
};

/* ------------------------- JOB QUEUE ------------------------- */
export const getAvailableJobs = async (): Promise<DeliveryJob[]> => {
	if (useSampleData) {
		const availableOrders = sampleOrders.filter((o) => o.status === 'available');
		return availableOrders.map((order) => ({
			id: `job-${order.id}`,
			order,
			priority: order.distance > 3 ? 'high' : order.distance > 1.5 ? 'medium' : 'low',
			expiresAt: new Date(Date.now() + 5 * 60000).toISOString(), // 5 minutes
		}));
	}

	const response = await api.get<DeliveryJob[]>('/delivery/jobs/available');
	return response.data;
};

export const getActiveOrder = async (): Promise<DeliveryOrder | null> => {
	if (useSampleData) {
		const stored = localStorage.getItem('delivery_active_order');
		if (stored) {
			return JSON.parse(stored);
		}
		// Return sample active order if available
		return sampleActiveOrder;
	}

	const response = await api.get<DeliveryOrder | null>('/delivery/orders/active');
	return response.data;
};

/* ------------------------- ORDER ACCEPTANCE ------------------------- */
export const acceptOrder = async (orderId: string): Promise<DeliveryOrder> => {
	if (useSampleData) {
		const order = sampleOrders.find((o) => o.id === orderId);
		if (!order) throw new Error('Order not found');

		const acceptedOrder: DeliveryOrder = {
			...order,
			status: 'accepted',
			acceptedAt: new Date().toISOString(),
		};

		localStorage.setItem('delivery_active_order', JSON.stringify(acceptedOrder));
		return acceptedOrder;
	}

	const response = await api.post<DeliveryOrder>(`/delivery/orders/${orderId}/accept`);
	return response.data;
};

export const rejectOrder = async (orderId: string): Promise<void> => {
	if (useSampleData) {
		// Just remove from available jobs
		return;
	}

	await api.post(`/delivery/orders/${orderId}/reject`);
};

/* ------------------------- DELIVERY PROGRESS ------------------------- */
export const updateDeliveryStatus = async (
	orderId: string,
	status: DeliveryStatus
): Promise<DeliveryOrder> => {
	if (useSampleData) {
		const stored = localStorage.getItem('delivery_active_order');
		if (!stored) throw new Error('No active order');

		const order: DeliveryOrder = JSON.parse(stored);
		const updated: DeliveryOrder = {
			...order,
			status,
			pickedUpAt: status === 'picked_up' ? new Date().toISOString() : order.pickedUpAt,
			deliveredAt: status === 'delivered' ? new Date().toISOString() : order.deliveredAt,
		};

		if (status === 'delivered') {
			localStorage.removeItem('delivery_active_order');
			// Save to completed orders
			const completed = JSON.parse(
				localStorage.getItem('delivery_completed_orders') || '[]'
			);
			completed.push(updated);
			localStorage.setItem('delivery_completed_orders', JSON.stringify(completed));
		} else {
			localStorage.setItem('delivery_active_order', JSON.stringify(updated));
		}

		return updated;
	}

	const response = await api.patch<DeliveryOrder>(
		`/delivery/orders/${orderId}/status`,
		{ status }
	);
	return response.data;
};

export const getDeliveryProgress = async (
	orderId: string
): Promise<DeliveryProgress> => {
	if (useSampleData) {
		const stored = localStorage.getItem('delivery_active_order');
		if (!stored) throw new Error('No active order');

		const order: DeliveryOrder = JSON.parse(stored);
		const statusMap: Record<DeliveryStatus, number> = {
			accepted: 0,
			picked_up: 1,
			on_the_way: 2,
			delivered: 3,
			cancelled: -1,
			available: -1,
		};

		const currentStep = statusMap[order.status] || 0;
		const steps = [
			{ label: 'accepted', completed: currentStep >= 0 },
			{ label: 'pickedUp', completed: currentStep >= 1 },
			{ label: 'onTheWay', completed: currentStep >= 2 },
			{ label: 'delivered', completed: currentStep >= 3 },
		];

		return {
			orderId,
			currentStep,
			steps,
			currentLocation: getSimulatedGPSForOrder(order, currentStep),
			estimatedArrival: new Date(Date.now() + order.estimatedTime * 60000).toISOString(),
		};
	}

	const response = await api.get<DeliveryProgress>(
		`/delivery/orders/${orderId}/progress`
	);
	return response.data;
};

export const updateLocation = async (
	orderId: string,
	location: GPSLocation
): Promise<void> => {
	if (useSampleData) {
		// Store location updates for offline sync
		const updates = JSON.parse(
			localStorage.getItem('delivery_location_updates') || '[]'
		);
		updates.push({ orderId, location, timestamp: new Date().toISOString() });
		localStorage.setItem('delivery_location_updates', JSON.stringify(updates));
		return;
	}

	await api.post(`/delivery/orders/${orderId}/location`, { location });
};

export const getCurrentLocation = (
	order?: DeliveryOrder | null,
	currentStep?: number
): GPSLocation => {
	if (order != null && typeof currentStep === 'number') {
		return getSimulatedGPSForOrder(order, currentStep);
	}
	return getSimulatedGPS();
};

/* ------------------------- EARNINGS ------------------------- */
export const getEarningsSummary = async (): Promise<EarningsSummary> => {
	if (useSampleData) {
		const completed = JSON.parse(
			localStorage.getItem('delivery_completed_orders') || '[]'
		) as DeliveryOrder[];

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const todayOrders = completed.filter(
			(o) => o.deliveredAt && new Date(o.deliveredAt) >= today
		);
		const weekOrders = completed.filter(
			(o) =>
				o.deliveredAt &&
				new Date(o.deliveredAt) >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
		);
		const monthOrders = completed.filter(
			(o) =>
				o.deliveredAt &&
				new Date(o.deliveredAt) >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
		);

		const calculate = (orders: DeliveryOrder[]) => ({
			deliveries: orders.length,
			earnings: orders.reduce((sum, o) => sum + o.fee, 0),
			distance: orders.reduce((sum, o) => sum + o.distance, 0),
			hours: orders.length * 0.5, // Mock: 30 min per delivery
		});

		const todayStats = calculate(todayOrders);
		const weekStats = calculate(weekOrders);
		const monthStats = calculate(monthOrders);
		const totalEarnings = completed.reduce((sum, o) => sum + o.fee, 0);
		const avgPerDelivery =
			completed.length > 0 ? totalEarnings / completed.length : 0;

		return {
			today: todayStats,
			week: weekStats,
			month: monthStats,
			averagePerDelivery: avgPerDelivery,
			totalEarnings,
		};
	}

	const response = await api.get<EarningsSummary>('/delivery/earnings');
	return response.data;
};

/* ------------------------- SETTINGS ------------------------- */
export const getDeliverySettings = async (): Promise<DeliverySettings> => {
	if (useSampleData) {
		const stored = localStorage.getItem('delivery_settings');
		if (stored) {
			return JSON.parse(stored);
		}
		return {
			vehicleType: 'motorcycle',
			maxDistance: 10,
			autoAccept: false,
			notificationsEnabled: true,
		};
	}

	const response = await api.get<DeliverySettings>('/delivery/settings');
	return response.data;
};

export const updateDeliverySettings = async (
	settings: Partial<DeliverySettings>
): Promise<DeliverySettings> => {
	if (useSampleData) {
		const current = await getDeliverySettings();
		const updated = { ...current, ...settings };
		localStorage.setItem('delivery_settings', JSON.stringify(updated));
		return updated;
	}

	const response = await api.patch<DeliverySettings>('/delivery/settings', settings);
	return response.data;
};
