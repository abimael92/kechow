export interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
	notes?: string;
}

export interface Order {
	id: string;
	customerName: string;
	phone: string;
	email?: string;
	address: string;
	items: OrderItem[];
	totalAmount: number;
	status:
		| 'new'
		| 'preparing'
		| 'ready'
		| 'out_for_delivery'
		| 'delivered'
		| 'declined'
		| 'cancelled';
	createdAt: string;
	updatedAt: string;
	specialInstructions?: string;
	paymentMethod: 'cash' | 'card' | 'online';
	paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface OrdersResponse {
	orders: Order[];
	total: number;
	stats: {
		new: number;
		preparing: number;
		ready: number;
		out_for_delivery: number;
		delivered: number;
		declined: number;
		total: number;
	};
}

export interface OrderStats {
	today: {
		orders: number;
		revenue: number;
		averageOrderValue: number;
	};
	weekly: {
		orders: number;
		revenue: number;
		trend: 'up' | 'down' | 'stable';
	};
	monthly: {
		orders: number;
		revenue: number;
		completionRate: number;
	};
}

export interface OrderFilters {
	status?: string;
	dateFrom?: string;
	dateTo?: string;
	customerName?: string;
	sortBy?: 'date' | 'status' | 'amount';
	sortOrder?: 'asc' | 'desc';
}

export interface OrderStatusUpdate {
	orderId: string;
	status: string;
	notes?: string;
}

export interface DashboardStats {
	totalOrders: number;
	totalRevenue: number;
	averageOrderValue: number;
	pendingOrders: number;
	completedOrders: number;
	popularItems: Array<{
		name: string;
		count: number;
		revenue: number;
	}>;
}

export interface MenuItem {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	available: boolean;
	image: string;
	ingredients?: string[];
	preparationTime?: number;
	calories?: number;
	isVegetarian?: boolean;
	isVegan?: boolean;
	isGlutenFree?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface MenuStats {
	totalItems: number;
	availableItems: number;
	outOfStockItems: number;
	averagePrice: number;
	categories: {
		name: string;
		count: number;
	}[];
}

export interface MenuItemFormData {
	name: string;
	description: string;
	price: number;
	category: string;
	available: boolean;
	image: string;
	ingredients: string[];
	preparationTime?: number;
	calories?: number;
	isVegetarian: boolean;
	isVegan: boolean;
	isGlutenFree: boolean;
}

export interface RestaurantSettings {
	name: string;
	phone: string;
	address: string;
	description: string;
	isOpen: boolean;
	operatingHours?: OperatingHours[];
}

export interface OperatingHours {
	id: string;
	day: string;
	openTime: string;
	closeTime: string;
	closed: boolean;
}

export interface MenuSettings {
	categories: string[];
	displayOptions: {
		showImages: boolean;
		showPrices: boolean;
		showDescriptions: boolean;
	};
	sorting: 'alphabetical' | 'popularity' | 'price';
	currency: string;
	taxRate: number;
}

export interface DeliverySettings {
	deliveryRadius: number;
	deliveryFee: number;
	minimumOrder: number;
	estimatedDeliveryTime: number;
	deliveryZones: DeliveryZone[];
}

export interface DeliveryZone {
	name: string;
	fee: number;
	minOrder: number;
}

export interface NotificationSettings {
	emailNotifications: boolean;
	smsNotifications: boolean;
	pushNotifications: boolean;
	orderConfirmation: boolean;
	orderStatusUpdates: boolean;
	newReviewNotification: boolean;
}

export interface PaymentSettings {
	acceptedMethods: string[];
	stripeEnabled: boolean;
	paypalEnabled: boolean;
	cashOnDelivery: boolean;
	taxRate: number;
}

export interface StaffSettings {
	staffMembers: StaffMember[];
	roles: string[];
	permissions: StaffPermissions;
}

export interface StaffMember {
	id: string;
	name: string;
	email: string;
	role: string;
	permissions: string[];
	active: boolean;
}

export interface StaffPermissions {
	canManageOrders: boolean;
	canManageMenu: boolean;
	canViewAnalytics: boolean;
	canManageStaff: boolean;
}

export interface Review {
	id: string;
	customerName: string;
	rating: number;
	comment: string;
	date: string;
	verified: boolean;
	orderItems?: string[];
	response?: string;
	helpfulCount: number;
	orderId?: string;
	customerId?: string;
}

export interface ReviewStats {
	averageRating: number;
	totalReviews: number;
	responseRate: number;
	positiveReviews: number;
	ratingDistribution: {
		stars: number;
		count: number;
		percentage: number;
	}[];
	recentReviews: Review[];
}

export interface ReviewFilters {
	rating?: number;
	dateFrom?: string;
	dateTo?: string;
	hasResponse?: boolean;
	verifiedOnly?: boolean;
}
