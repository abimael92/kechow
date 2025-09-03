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
