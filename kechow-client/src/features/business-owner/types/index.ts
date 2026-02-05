export interface OrderItem {
	id: string;
	name: string;
	quantity: number;
	price: number;
	notes?: string;
}

export interface OrderDriver {
	id?: number;
	name: string;
	phone?: string;
	email?: string;
	role?: string;
}

export interface Order {
	id: string;
	customerName: string;
	phone: string;
	email?: string;
	address: string;
	items: OrderItem[];
	totalAmount: number;
	total?: number;
	driver?: OrderDriver;
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
	[x: string]: any;
	id: string;
	name: string;
	description: string;
	price: number;
	stock?: number;
	category: string;
	available: boolean;
	image: string;
	ingredients?: string[];
	tags?: string[];
	allergens?: string[];
	preparationTime?: number;
	calories?: number;
	isSpecial?: boolean;
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
	logoUrl?: string;
	avgPrepTimeMinutes?: number | null;
	operatingHours?: OperatingHours[];
	closedDates?: string[];
	exceptionalClosedDates?: string[];
}

export interface OperatingHours {
	id: string;
	day: string;
	openTime: string;
	closeTime: string;
	closed: boolean;
	breakEnabled?: boolean;
	breakStart?: string;
	breakEnd?: string;
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

export interface SpecialDay {
	id: string;
	name: string;
	date: string; // ISO format: YYYY-MM-DD
	openTime: string; // 24h format: "HH:MM"
	closeTime: string; // 24h format: "HH:MM"
	closed: boolean;
	isHoliday: boolean;
	recurringYearly: boolean;
	description?: string;
	affectsAllDays: boolean; // Whether this special schedule overrides all regular days
	overrideType: 'closed' | 'special_hours' | 'reduced_hours'; // How this day affects operations
	customMessage?: string; // Message to show to customers on this day
	createdAt: string;
	updatedAt: string;
	notes: string;
}

export interface SpecialDayFormData {
	name: string;
	date: string;
	openTime?: string;
	closeTime?: string;
	closed: boolean;
	isHoliday: boolean;
	recurringYearly: boolean;
	description?: string;
	affectsAllDays: boolean;
	overrideType: 'closed' | 'special_hours' | 'reduced_hours';
	customMessage?: string;
}

export interface SpecialDayFilters {
	year?: number;
	month?: number; // 1-12
	upcomingOnly?: boolean;
	holidayOnly?: boolean;
	recurringOnly?: boolean;
}

export interface SpecialDayResponse {
	specialDays: SpecialDay[];
	upcomingSpecialDays: SpecialDay[];
	holidaysThisMonth: SpecialDay[];
	total: number;
}

export interface SpecialDayStats {
	totalSpecialDays: number;
	upcomingSpecialDays: number;
	holidaysCount: number;
	closedDaysCount: number;
	recurringEventsCount: number;
}

// ==================== ANALYTICS TYPES ====================
export interface AnalyticsData {
    revenue: {
        total: number;
        change: number;
        trend: RevenueTrendData[];
        chartData: ChartDataPoint[];
    };
    orders: {
        total: number;
        change: number;
        trend: OrderTrendData[];
        byHour: OrdersByHourData[];
    };
    avgOrderValue: {
        current: number;
        change: number;
        history: number[];
    };
    customerRating: {
        current: number;
        change: number;
        distribution: RatingDistribution[];
    };
    salesByCategory: SalesByCategoryData[];
    topSellingItems: TopSellingItemData[];
    customerMetrics: {
        newCustomers: number;
        returningCustomers: number;
        retentionRate: number;
        lifetimeValue: number;
    };
    peakHours: PeakHourData[];
    lastUpdated: string;
    period: AnalyticsPeriod;
}

export interface ChartDataPoint {
    date: string;
    value: number;
    label?: string;
}

export interface RevenueTrendData {
    date: string;
    revenue: number;
    orders: number;
    averageOrderValue: number;
}

export interface OrderTrendData {
    date: string;
    count: number;
    status: Order['status'];
    revenue: number;
}

export interface OrdersByHourData {
    hour: number; // 0-23
    hourLabel: string;
    orders: number;
    averageOrderValue: number;
    revenue: number;
    day: 'weekday' | 'weekend';
}

export interface SalesByCategoryData {
    id: string;
    category: string;
    sales: number;
    percentage: number;
    orders: number;
    averagePrice: number;
    color: string;
    trend: number;
}

export interface TopSellingItemData {
    id: string;
    name: string;
    category: string;
    orders: number;
    revenue: number;
    quantity: number;
    averageRating: number;
    trend: number;
    profitMargin: number;
    lastOrderDate: string;
}

export interface RatingDistribution {
    stars: number;
    count: number;
    percentage: number;
}

export interface PeakHourData {
    hour: number;
    hourLabel: string;
    orders: number;
    revenue: number;
    busyLevel: 'low' | 'medium' | 'high' | 'peak';
}

export type AnalyticsPeriod = '7days' | '30days' | '90days' | 'year' | 'custom';

export interface AnalyticsFilters {
    period: AnalyticsPeriod;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    status?: Order['status'];
    compareToPrevious?: boolean;
}

export interface AnalyticsExportOptions {
    format: 'csv' | 'pdf' | 'excel';
    includeCharts: boolean;
    includeRawData: boolean;
    dateRange: {
        from: string;
        to: string;
    };
}

// ==================== MENU MANAGEMENT TYPES ====================
export interface MenuItemFilters {
    category?: string;
    availability?: 'all' | 'available' | 'outOfStock';
    priceRange?: {
        min: number;
        max: number;
    };
    sortBy?: 'name' | 'price' | 'popularity' | 'dateAdded';
    sortOrder?: 'asc' | 'desc';
    searchQuery?: string;
    tags?: string[];
}

export interface MenuItemStats {
    total: {
        items: number;
        revenue: number;
        orders: number;
    };
    byCategory: {
        category: string;
        count: number;
        revenue: number;
        percentage: number;
    }[];
    byAvailability: {
        available: number;
        outOfStock: number;
    };
    priceDistribution: {
        range: string;
        count: number;
    }[];
    trends: {
        newItemsThisMonth: number;
        discontinuedItems: number;
        priceChanges: number;
    };
}

export interface MenuItemVariation {
    id: string;
    name: string;
    price: number;
    available: boolean;
    description?: string;
}

export interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
}

export interface MenuItemOption {
    id: string;
    name: string;
    required: boolean;
    multiple: boolean;
    minSelections?: number;
    maxSelections?: number;
    choices: MenuItemOptionChoice[];
}

export interface MenuItemOptionChoice {
    id: string;
    name: string;
    price: number;
    available: boolean;
}

// ==================== ORDERS MANAGEMENT TYPES ====================
export interface OrderFilters {
    status?: Order['status'][];
    dateFrom?: string;
    dateTo?: string;
    customerName?: string;
    searchQuery?: string;
    sortBy?: 'date' | 'status' | 'amount' | 'customer';
    sortOrder?: 'asc' | 'desc';
    minAmount?: number;
    maxAmount?: number;
}

export interface OrdersPaginatedResponse {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    stats: {
        new: number;
        preparing: number;
        ready: number;
        out_for_delivery: number;
        delivered: number;
        declined: number;
        cancelled: number;
        total: number;
        totalRevenue: number;
        averageOrderValue: number;
    };
}

export interface OrderTimelineEvent {
    id: string;
    orderId: string;
    status: Order['status'];
    timestamp: string;
    notes?: string;
    performedBy?: string;
    actorType: 'system' | 'staff' | 'customer' | 'delivery';
}

// ==================== CHART COMPONENT PROPS ====================
export interface RevenueChartProps {
    data: ChartDataPoint[];
    type: 'line' | 'bar' | 'area';
    height?: number;
    showTooltip?: boolean;
    showGrid?: boolean;
    showLegend?: boolean;
}

export interface OrdersByHourChartProps {
    data: OrdersByHourData[];
    view: 'day' | 'week';
    height?: number;
    showAverage?: boolean;
    showPeakHours?: boolean;
}

export interface SalesByCategoryChartProps {
    data: SalesByCategoryData[];
    type?: 'pie' | 'donut' | 'bar';
    height?: number;
    showLabels?: boolean;
    showPercentages?: boolean;
}

// ==================== CARD COMPONENT PROPS ====================
export interface AnalyticsCardProps {
    title: string;
    value: string | number;
    change?: string;
    icon?: string;
    positive?: boolean;
    loading?: boolean;
    trendData?: number[];
    onClick?: () => void;
}

export interface TopSellingItemProps {
    rank: number;
    name: string;
    orders: number;
    revenue: string;
    trend?: number;
    category?: string;
    onClick?: () => void;
}

// ==================== MODAL TYPES ====================
export interface MenuModalProps {
    mode: 'add' | 'edit';
    item?: MenuItem | null;
    categories: string[];
}

export interface MenuModalEmits {
    (e: 'close'): void;
    (e: 'save', data: MenuItemFormData): void;
}

// ==================== UTILITY TYPES ====================
export interface TimePeriod {
    value: string;
    label: string;
    days?: number;
}

export interface TabItem {
    id: string;
    label: string;
    icon: string;
    badge?: string | number;
}

export interface StatItem {
    label: string;
    value: string | number;
    displayValue: string;
    icon: string;
    color: string;
    bgColor: string;
    trend?: number;
    trendIcon?: string;
    highlight?: boolean;
}

export interface CategoryTab {
    value: string;
    translationKey: string;
    icon: string;
    color: string;
}

// ==================== SERVICE TYPES ====================
export interface GetAnalyticsParams {
    period: AnalyticsPeriod;
    dateFrom?: string;
    dateTo?: string;
    compare?: boolean;
}

export interface GetMenuItemsParams {
    filters?: MenuItemFilters;
    page?: number;
    limit?: number;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
}

export interface GetOrdersParams {
    filters?: OrderFilters;
    page?: number;
    limit?: number;
}

// ==================== EVENT TYPES ====================
export interface QuickEditEvent {
    item: MenuItem;
    field: string;
    value: any;
}

export interface StatusUpdateEvent {
    orderId: string;
    status: Order['status'];
    notes?: string;
}

// ==================== FILTER STATE TYPES ====================
export interface OrdersFilterState {
    searchQuery: string;
    selectedStatuses: Order['status'][];
    sortBy: string;
    activeTab: string;
    currentPage: number;
}

export interface MenuFilterState {
    searchQuery: string;
    activeCategory: string;
    sortBy: string;
    currentPage: number;
}

export interface AnalyticsFilterState {
    selectedPeriod: AnalyticsPeriod;
    activeTab: string;
    revenueChartType: 'line' | 'bar' | 'area';
    orderHourView: 'day' | 'week';
    topItemsView: 'revenue' | 'orders';
}