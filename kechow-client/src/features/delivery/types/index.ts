// Delivery feature types — match backend /api/v1/delivery/* response shapes (after axios unwrap)

/** Backend success wrapper; axios interceptor unwraps to `data` */
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface AvailabilityData {
  isOnline: boolean;
  totalOnlineHours?: number;
  currentSessionStart?: string | null;
  hasActiveOrder?: boolean;
}

export interface JobItem {
  id: number;
  pickup: string;
  dropoff: string;
  amount: number;
  restaurant: { name: string };
  items?: Array<{ id?: number; name?: string; quantity?: number }>;
}

export interface ActiveOrderData {
  id: number;
  orderNumber?: string;
  status: string;
  pickup: string;
  dropoff: string;
  amount: number;
  fee?: number;
  paymentMethod?: string;
  restaurant: { name: string; address?: string; phone?: string };
  customer?: { name: string; address?: string; phone?: string };
  items?: Array<{ id?: number; name?: string; quantity?: number }>;
  distance?: number | null;
  estimatedTime?: number;
}

export interface EarningsData {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface StatsData {
  todayOrders: number;
  earnings: number;
  completed_deliveries: number;
  rating: number;
}

export interface DeliverySettingsData {
  language: string;
}

/** Completed order item from GET /orders/completed */
export interface CompletedOrderItem {
  id: number;
  status: string;
  pickup?: string;
  dropoff?: string;
  amount?: number;
  restaurant?: { name: string };
  items?: unknown[];
  delivered_at?: string;
}

export type DeliveryStatus =
	| 'available'
	| 'accepted'
	| 'picked_up'
	| 'on_the_way'
	| 'delivered'
	| 'cancelled';

export interface GPSLocation {
	latitude: number;
	longitude: number;
	timestamp: string;
	accuracy?: number;
}

export interface DeliveryOrder {
	id: string;
	orderNumber: string;
	status: DeliveryStatus;
	restaurant: {
		id: string;
		name: string;
		address: string;
		phone: string;
		location: GPSLocation;
	};
	customer: {
		id: string;
		name: string;
		address: string;
		phone: string;
		location: GPSLocation;
	};
	items: Array<{
		id: string;
		name: string;
		quantity: number;
	}>;
	paymentMethod: string;
	amount: number;
	fee: number;
	distance: number; // in km
	estimatedTime: number; // in minutes
	createdAt: string;
	acceptedAt?: string;
	pickedUpAt?: string;
	deliveredAt?: string;
	specialInstructions?: string;
}

export interface DeliveryJob {
	id: string;
	order: DeliveryOrder;
	priority: 'high' | 'medium' | 'low';
	expiresAt: string;
}

export interface DeliveryProgress {
	orderId: string;
	currentStep: number;
	steps: Array<{
		label: string;
		completed: boolean;
		timestamp?: string;
	}>;
	currentLocation?: GPSLocation;
	estimatedArrival?: string;
}

export interface EarningsSummary {
	today: {
		deliveries: number;
		earnings: number;
		distance: number;
		hours: number;
	};
	week: {
		deliveries: number;
		earnings: number;
		distance: number;
		hours: number;
	};
	month: {
		deliveries: number;
		earnings: number;
		distance: number;
		hours: number;
	};
	averagePerDelivery: number;
	totalEarnings: number;
}

export interface DeliveryAvailability {
	isOnline: boolean;
	lastOnlineAt?: string;
	totalOnlineHours: number;
}

export interface DeliverySettings {
	vehicleType: 'bike' | 'motorcycle' | 'car';
	licensePlate?: string;
	maxDistance: number; // in km
	autoAccept: boolean;
	notificationsEnabled: boolean;
}
