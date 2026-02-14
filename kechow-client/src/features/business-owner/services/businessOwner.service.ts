import { api, apiBaseUrl } from '@app/lib/axios';

/** Ensures logo URL is absolute and uses API route (avoids 403 on direct storage). */
function ensureAbsoluteLogoUrl(url: string | null | undefined): string {
	if (!url || typeof url !== 'string') return '';
	const abs = url.startsWith('http://') || url.startsWith('https://') ? url : apiBaseUrl + (url.startsWith('/') ? url : '/' + url);
	// Rewrite old /storage/restaurant-logos/X to /restaurants/logo/X (avoids 403)
	const m = abs.match(/\/storage\/restaurant-logos\/([a-zA-Z0-9._-]+)(?:\?|$)/);
	if (m) return apiBaseUrl + '/restaurants/logo/' + m[1];
	return abs;
}
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
	Review,
	ReviewStats,
	ReviewFilters,
	AnalyticsData,
	OrdersByHourData,
	SalesByCategoryData,
	TopSellingItemData,
	ChartDataPoint,
	RevenueTrendData,
	OrderTrendData,
	PeakHourData,
	RatingDistribution,
	AnalyticsPeriod,
	AnalyticsFilters,
	OrdersPaginatedResponse,
	MenuItemFilters,
	GetMenuItemsParams,
	GetOrdersParams,
	MenuItemStats,
} from '../types';
import { sampleMenuItems } from '../data/sampleMenuItems';
import { sampleOrders } from '../data/sampleOrders';
import { sampleReviews } from '../data/sampleReviews';

// Fetch real data only - mock disabled. Set true to use sample data in dev if needed.
// const useSampleData = import.meta.env.MODE === 'development';
const useSampleData = false;

interface GetAnalyticsParams {
	period?: string;
	compare?: boolean;
	dateFrom?: string;
	dateTo?: string;
}

// Add this helper function
const getRestaurantId = async (): Promise<number> => {
  try {
    const response = await api.get('/restaurants/owner/my-restaurants');
    const restaurants = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
    
    if (restaurants.length === 0) {
      throw new Error('No restaurant found');
    }
    
    return restaurants[0].id;
  } catch (error) {
    console.error('Error getting restaurant ID:', error);
    throw error;
  }
};

/* ------------------------- ORDERS ------------------------- */
export const fetchOrders = async (filters?: OrderFilters): Promise<Order[]> => {
	if (useSampleData) {
		let filteredOrders = [...sampleOrders];

		if (filters?.status && filters.status.length > 0) {
			filteredOrders = filteredOrders.filter(
				(order) => filters.status!.includes(order.status)
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
	return response.data.orders ?? [];
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
// UPDATE fetchMenuItems
export const fetchMenuItems = async (category?: string): Promise<MenuItem[]> => {
  if (useSampleData) {
    let items = [...sampleMenuItems];
    if (category && category !== 'all') {
      items = items.filter((item) => item.category === category);
    }
    return items;
  }

  try {
    const restaurantId = await getRestaurantId();
    const response = await api.get<MenuItem[]>(`/restaurants/${restaurantId}/menu-items`, {
      params: { category },
    });
     return response.data.map((item) => ({
       ...item,
       id: String(item.id),
     }));
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

// UPDATE createMenuItem
export const createMenuItem = async (formData: MenuItemFormData): Promise<MenuItem> => {
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

  const restaurantId = await getRestaurantId();
  const response = await api.post<MenuItem>(`/restaurants/${restaurantId}/menu-items`, formData);
  return {
    ...response.data,
    id: String(response.data.id), // Convert number to string
  };
};

// UPDATE updateMenuItem
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

  const restaurantId = await getRestaurantId();
  const response = await api.put<MenuItem>(`/restaurants/${restaurantId}/menu-items/${id}`, formData);
  return {
    ...response.data,
    id: String(response.data.id),
  };
};

// UPDATE deleteMenuItem
export const deleteMenuItem = async (id: string): Promise<void> => {
  if (useSampleData) {
    const index = sampleMenuItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      sampleMenuItems.splice(index, 1);
    }
    return;
  }

  const restaurantId = await getRestaurantId();
  await api.delete(`/restaurants/${restaurantId}/menu-items/${id}`);
};

// UPDATE toggleMenuItemAvailability
export const toggleMenuItemAvailability = async (id: string): Promise<MenuItem> => {
  if (useSampleData) {
    const item = sampleMenuItems.find((item) => item.id === id);
    if (!item) throw new Error('Menu item not found');

    item.available = !item.available;
    item.updatedAt = new Date().toISOString();
    return item;
  }

  const restaurantId = await getRestaurantId();
  const response = await api.patch<MenuItem>(
    `/restaurants/${restaurantId}/menu-items/${id}/toggle-availability`
  );
  return {
    ...response.data,
    id: String(response.data.id),
  };
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

	  const restaurantId = await getRestaurantId();
    const response = await api.get<MenuStats>(
      `/restaurants/${restaurantId}/menu-items/stats`,
    );
    return response.data;
};

/* ------------------------- SETTINGS ------------------------- */

/** Backend API restaurant shape from GET /restaurants/owner/my-restaurants */
interface ApiRestaurant {
	id: number;
	name: string;
	description?: string | null;
	address?: string | null;
	city?: string | null;
	state?: string | null;
	zip_code?: string | null;
	phone?: string | null;
	email?: string | null;
	opening_time?: string | null;
	closing_time?: string | null;
	schedule_json?: Record<string, { enabled?: boolean; open?: string; close?: string; breakEnabled?: boolean; breakStart?: string; breakEnd?: string }> | null;
	closed_dates?: string[] | null;
	exceptional_closed_dates?: string[] | null;
	logo_url?: string | null;
	avg_prep_time_minutes?: number | null;
	is_active?: boolean;
}

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Normalize time to H:i format (HH:mm) - backend validation requires this */
function toHiFormat(t: string | null | undefined, fallback: string): string {
	if (!t || typeof t !== 'string') return fallback;
	const trimmed = t.trim();
	if (!trimmed) return fallback;
	const parts = trimmed.split(':');
	if (parts.length >= 2) {
		const h = parts[0].padStart(2, '0');
		const m = parts[1].padStart(2, '0');
		return `${h}:${m}`;
	}
	return fallback;
}

/** Treat "Por definir" as empty so we only show stored values. */
function emptyIfPorDefinir(v: string | null | undefined): string {
	if (!v || typeof v !== 'string') return '';
	const t = v.trim();
	return t.toLowerCase() === 'por definir' ? '' : t;
}

function mapApiRestaurantToSettings(r: ApiRestaurant): RestaurantSettings {
	const schedule = r.schedule_json ?? {};
	const address = emptyIfPorDefinir(r.address) || '';
	const operatingHours = DAY_NAMES.map((day, i) => {
		const key = String(i);
		const s = schedule[key];
		return {
			id: `day-${i}`,
			day,
			openTime: toHiFormat(s?.open ?? r.opening_time, '10:00'),
			closeTime: toHiFormat(s?.close ?? r.closing_time, '22:00'),
			closed: s?.enabled === false,
			breakEnabled: s?.breakEnabled ?? false,
			breakStart: toHiFormat(s?.breakStart, '14:00'),
			breakEnd: toHiFormat(s?.breakEnd, '16:00'),
		};
	});
	return {
		name: r.name ?? '',
		phone: r.phone ?? '',
		address,
		description: r.description ?? '',
		isOpen: r.is_active ?? true,
		logoUrl: ensureAbsoluteLogoUrl(r.logo_url) || '',
		avgPrepTimeMinutes: r.avg_prep_time_minutes ?? null,
		operatingHours,
		closedDates: Array.isArray(r.closed_dates) ? r.closed_dates : [],
		exceptionalClosedDates: Array.isArray(r.exceptional_closed_dates) ? r.exceptional_closed_dates : [],
	};
}

function mapSettingsToApiPayload(settings: Partial<RestaurantSettings>): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	if (settings.name !== undefined) payload.name = settings.name;
	if (settings.phone !== undefined) payload.phone = settings.phone;
	if (settings.address !== undefined) payload.address = settings.address;
	if (settings.description !== undefined) payload.description = settings.description;
	if (settings.isOpen !== undefined) payload.is_active = settings.isOpen;
	if (settings.closedDates !== undefined) payload.closed_dates = settings.closedDates;
	if (settings.exceptionalClosedDates !== undefined) payload.exceptional_closed_dates = settings.exceptionalClosedDates;
	if (settings.logoUrl !== undefined) payload.logo_url = settings.logoUrl || null;
	if (settings.avgPrepTimeMinutes !== undefined) payload.avg_prep_time_minutes = settings.avgPrepTimeMinutes;
	if (settings.operatingHours?.length) {
		const firstOpen = settings.operatingHours.find((oh) => !oh.closed);
		if (firstOpen) {
			payload.opening_time = toHiFormat(firstOpen.openTime, '10:00');
			payload.closing_time = toHiFormat(firstOpen.closeTime, '22:00');
		}
		const scheduleJson: Record<string, Record<string, unknown>> = {};
		settings.operatingHours.forEach((oh, i) => {
			scheduleJson[String(i)] = {
				enabled: !oh.closed,
				open: toHiFormat(oh.openTime, '10:00'),
				close: toHiFormat(oh.closeTime, '22:00'),
				breakEnabled: !!oh.breakEnabled,
				breakStart: toHiFormat(oh.breakStart, '14:00'),
				breakEnd: toHiFormat(oh.breakEnd, '16:00'),
			};
		});
		payload.schedule_json = scheduleJson;
	}
	return payload;
}

export const getRestaurantSettings = async (): Promise<RestaurantSettings> => {
	if (useSampleData) {
		return {
			name: "Mario's Kitchen",
			phone: '+1 (555) 123-4567',
			address: '123 Restaurant Street, Food City, FC 12345',
			description:
				'Authentic Italian cuisine with fresh ingredients and traditional recipes. Family-owned restaurant serving delicious pizza, pasta, and more since 1985.',
			isOpen: true,
			operatingHours: DAY_NAMES.map((day, i) => ({
				id: `day-${i}`,
				day,
				openTime: '10:00',
				closeTime: '22:00',
				closed: false,
				breakEnabled: false,
				breakStart: '14:00',
				breakEnd: '16:00',
			})),
			closedDates: [],
			exceptionalClosedDates: [],
			logoUrl: '',
			avgPrepTimeMinutes: null,
		};
	}

	const res = await api.get<{ data?: ApiRestaurant[] } | ApiRestaurant[]>('/restaurants/owner/my-restaurants');
	const raw = res.data;
	const restaurants = Array.isArray(raw) ? raw : (raw?.data ?? []);
	if (restaurants.length === 0) {
		return {
			name: '',
			phone: '',
			address: '',
			description: '',
			isOpen: true,
			operatingHours: DAY_NAMES.map((day, i) => ({
				id: `day-${i}`,
				day,
				openTime: '10:00',
				closeTime: '22:00',
				closed: false,
				breakEnabled: false,
				breakStart: '14:00',
				breakEnd: '16:00',
			})),
			closedDates: [],
			exceptionalClosedDates: [],
			logoUrl: '',
			avgPrepTimeMinutes: null,
		};
	}
	return mapApiRestaurantToSettings(restaurants[0]);
};

/** Upload restaurant logo (image file). Returns the logo URL. */
export const uploadRestaurantLogo = async (file: File): Promise<string> => {
	if (useSampleData) {
		return URL.createObjectURL(file);
	}
	const res = await api.get<{ data?: ApiRestaurant[] } | ApiRestaurant[]>('/restaurants/owner/my-restaurants');
	const raw = res.data;
	const restaurants = Array.isArray(raw) ? raw : (raw?.data ?? []);
	if (restaurants.length === 0) {
		throw new Error('No restaurant found. Create a restaurant first.');
	}
	const restaurantId = restaurants[0].id;
	const formData = new FormData();
	formData.append('logo', file, file.name);
	const uploadRes = await api.post<{ logo_url: string }>(
		`/restaurants/${restaurantId}/logo`,
		formData
	);
	return ensureAbsoluteLogoUrl(uploadRes.data.logo_url) || uploadRes.data.logo_url;
};

export const updateRestaurantSettings = async (
	settings: Partial<RestaurantSettings>
): Promise<void> => {
	if (useSampleData) {
		console.log('Updating restaurant settings:', settings);
		return new Promise((resolve) => setTimeout(resolve, 500));
	}

	const res = await api.get<{ data?: ApiRestaurant[] } | ApiRestaurant[]>('/restaurants/owner/my-restaurants');
	const raw = res.data;
	const restaurants = Array.isArray(raw) ? raw : (raw?.data ?? []);
	if (restaurants.length === 0) {
		throw new Error('No restaurant found. Create a restaurant first.');
	}
	const restaurantId = restaurants[0].id;
	const payload = mapSettingsToApiPayload(settings);
	if (Object.keys(payload).length === 0) return;
	await api.put(`/restaurants/${restaurantId}`, payload);
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
			currency: 'USD',
			taxRate: 8.5,
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

/* ------------------------- REVIEWS ------------------------- */
export const fetchReviews = async (
	filters?: ReviewFilters
): Promise<Review[]> => {
	if (useSampleData) {
		let filteredReviews = [...sampleReviews];

		if (filters?.rating) {
			filteredReviews = filteredReviews.filter(
				(review) => review.rating === filters.rating
			);
		}

		if (filters?.hasResponse !== undefined) {
			filteredReviews = filteredReviews.filter((review) =>
				filters.hasResponse
					? review.response !== undefined
					: review.response === undefined
			);
		}

		if (filters?.verifiedOnly) {
			filteredReviews = filteredReviews.filter((review) => review.verified);
		}

		filteredReviews.sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);

		return filteredReviews;
	}

	const response = await api.get<Review[]>('/owner/reviews', {
		params: filters,
	});
	return response.data;
};

export const getReviewStats = async (): Promise<ReviewStats> => {
	if (useSampleData) {
		const totalReviews = sampleReviews.length;
		const averageRating =
			sampleReviews.reduce(
				(sum: any, review: { rating: any }) => sum + review.rating,
				0
			) / totalReviews;
		const responseRate =
			(sampleReviews.filter((review) => review.response !== undefined).length /
				totalReviews) *
			100;
		const positiveReviews = sampleReviews.filter(
			(review: { rating: number }) => review.rating >= 4
		).length;

		const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
			stars,
			count: sampleReviews.filter(
				(review: { rating: number }) => review.rating === stars
			).length,
			percentage:
				(sampleReviews.filter(
					(review: { rating: number }) => review.rating === stars
				).length /
					totalReviews) *
				100,
		}));

		return {
			averageRating,
			totalReviews,
			responseRate,
			positiveReviews,
			ratingDistribution,
			recentReviews: sampleReviews.slice(0, 5),
		};
	}

	const response = await api.get<ReviewStats>('/owner/reviews/stats');
	return response.data;
};

export const addReviewResponse = async (
	reviewId: string,
	response: string
): Promise<void> => {
	if (useSampleData) {
		const review = sampleReviews.find((r: { id: string }) => r.id === reviewId);
		if (review) {
			review.response = response;
		}
		return new Promise((resolve) => setTimeout(resolve, 500));
	}

	await api.post(`/owner/reviews/${reviewId}/response`, { response });
};

export const markReviewHelpful = async (reviewId: string): Promise<void> => {
	if (useSampleData) {
		const review = sampleReviews.find((r: { id: string }) => r.id === reviewId);
		if (review) {
			review.helpfulCount += 1;
		}
		return new Promise((resolve) => setTimeout(resolve, 300));
	}

	await api.post(`/owner/reviews/${reviewId}/helpful`);
};

export const flagReview = async (
	reviewId: string,
	reason: string
): Promise<void> => {
	if (useSampleData) {
		console.log(`Flagging review ${reviewId} for reason: ${reason}`);
		return new Promise((resolve) => setTimeout(resolve, 300));
	}

	await api.post(`/owner/reviews/${reviewId}/flag`, { reason });
};

export const getAnalyticsData = async (
	params?: GetAnalyticsParams
): Promise<AnalyticsData> => {
	const period = (params?.period || '30days') as AnalyticsPeriod;
	const compare = params?.compare || false;

	if (useSampleData) {
		const data = generateSampleAnalyticsData(period);

		if (compare) {
			// Add comparison data
			const previousPeriodData = generateSampleAnalyticsData(period, true);
			return {
				...data,
				// Add comparison fields
				revenue: {
					...data.revenue,
					previousPeriod: previousPeriodData.revenue.total,
				},
				orders: {
					...data.orders,
					previousPeriod: previousPeriodData.orders.total,
				},
			} as any; // Type cast for sample data
		}

		return data;
	}

	const response = await api.get<AnalyticsData>('/owner/analytics', {
		params: {
			period,
			compare,
			dateFrom: params?.dateFrom,
			dateTo: params?.dateTo,
		},
	});
	return response.data;
};

const generateSampleAnalyticsData = (
	period: AnalyticsPeriod,
	isPrevious = false
): AnalyticsData => {
	const baseDate = isPrevious
		? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
		: new Date();

	const days = getDaysForPeriod(period);
	const now = new Date();

	// Generate revenue trend data
	const revenueTrend: RevenueTrendData[] = [];
	const orderTrend: OrderTrendData[] = [];
	const chartData: ChartDataPoint[] = [];

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(baseDate);
		date.setDate(date.getDate() - i);
		const dateStr = formatDate(date, period);

		// Random but realistic data
		const dailyRevenue = Math.floor(Math.random() * 5000) + 1000;
		const dailyOrders = Math.floor(Math.random() * 30) + 10;
		const avgOrderValue = dailyRevenue / dailyOrders;

		revenueTrend.push({
			date: dateStr,
			revenue: dailyRevenue,
			orders: dailyOrders,
			averageOrderValue: avgOrderValue,
		});

		// Generate order trend by status
		const statuses: Order['status'][] = [
			'new',
			'preparing',
			'ready',
			'delivered',
		];
		statuses.forEach((status) => {
			orderTrend.push({
				date: dateStr,
				count: Math.floor(Math.random() * 8) + 2,
				status,
				revenue: Math.floor(Math.random() * 1000) + 200,
			});
		});

		chartData.push({
			date: dateStr,
			value: dailyRevenue,
			label: `$${dailyRevenue.toLocaleString()}`,
		});
	}

	// Generate orders by hour data
	const ordersByHour: OrdersByHourData[] = [];
	for (let hour = 6; hour <= 22; hour++) {
		const hourLabel = `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
		const isPeakHour = hour >= 18 && hour <= 20; // Dinner rush
		const orders = isPeakHour
			? Math.floor(Math.random() * 40) + 30
			: Math.floor(Math.random() * 20) + 5;
		const avgOrderValue = Math.floor(Math.random() * 10) + 25;

		ordersByHour.push({
			hour,
			hourLabel,
			orders,
			averageOrderValue: avgOrderValue,
			revenue: orders * avgOrderValue,
			day: hour < 17 ? 'weekday' : 'weekend',
		});
	}

	// Sales by category
	const salesByCategory: SalesByCategoryData[] = [
		{
			id: '1',
			category: 'Pizza',
			sales: 6750,
			percentage: 35,
			orders: 450,
			averagePrice: 15,
			color: '#EF4444',
			trend: 12,
		},
		{
			id: '2',
			category: 'Pasta',
			sales: 4825,
			percentage: 25,
			orders: 320,
			averagePrice: 15.5,
			color: '#F59E0B',
			trend: 8,
		},
		{
			id: '3',
			category: 'Salads',
			sales: 3850,
			percentage: 20,
			orders: 385,
			averagePrice: 10,
			color: '#10B981',
			trend: 15,
		},
		{
			id: '4',
			category: 'Desserts',
			sales: 2310,
			percentage: 12,
			orders: 210,
			averagePrice: 11,
			color: '#EC4899',
			trend: 5,
		},
		{
			id: '5',
			category: 'Drinks',
			sales: 1540,
			percentage: 8,
			orders: 385,
			averagePrice: 4,
			color: '#3B82F6',
			trend: 3,
		},
	];

	// Top selling items
	const topSellingItems: TopSellingItemData[] = [
		{
			id: '1',
			name: 'Margherita Pizza',
			category: 'Pizza',
			orders: 142,
			revenue: 2130,
			quantity: 142,
			averageRating: 4.8,
			trend: 15,
			profitMargin: 65,
			lastOrderDate: now.toISOString(),
		},
		{
			id: '2',
			name: 'Chicken Alfredo',
			category: 'Pasta',
			orders: 98,
			revenue: 1666,
			quantity: 98,
			averageRating: 4.6,
			trend: 8,
			profitMargin: 60,
			lastOrderDate: now.toISOString(),
		},
		{
			id: '3',
			name: 'Caesar Salad',
			category: 'Salads',
			orders: 87,
			revenue: 869,
			quantity: 87,
			averageRating: 4.5,
			trend: 22,
			profitMargin: 70,
			lastOrderDate: now.toISOString(),
		},
		{
			id: '4',
			name: 'Pepperoni Pizza',
			category: 'Pizza',
			orders: 76,
			revenue: 1291,
			quantity: 76,
			averageRating: 4.7,
			trend: 10,
			profitMargin: 62,
			lastOrderDate: now.toISOString(),
		},
		{
			id: '5',
			name: 'Tiramisu',
			category: 'Desserts',
			orders: 65,
			revenue: 454,
			quantity: 65,
			averageRating: 4.9,
			trend: 5,
			profitMargin: 75,
			lastOrderDate: now.toISOString(),
		},
	];

	// Peak hours
	const peakHours: PeakHourData[] = [
		{
			hour: 18,
			hourLabel: '6PM',
			orders: 72,
			revenue: 1800,
			busyLevel: 'peak',
		},
		{
			hour: 19,
			hourLabel: '7PM',
			orders: 68,
			revenue: 1700,
			busyLevel: 'peak',
		},
		{
			hour: 20,
			hourLabel: '8PM',
			orders: 55,
			revenue: 1375,
			busyLevel: 'high',
		},
		{
			hour: 12,
			hourLabel: '12PM',
			orders: 45,
			revenue: 1125,
			busyLevel: 'medium',
		},
		{
			hour: 13,
			hourLabel: '1PM',
			orders: 40,
			revenue: 1000,
			busyLevel: 'medium',
		},
	];

	// Rating distribution
	const ratingDistribution: RatingDistribution[] = [
		{ stars: 5, count: 450, percentage: 65 },
		{ stars: 4, count: 180, percentage: 26 },
		{ stars: 3, count: 40, percentage: 6 },
		{ stars: 2, count: 15, percentage: 2 },
		{ stars: 1, count: 5, percentage: 1 },
	];

	// Calculate totals
	const totalRevenue = salesByCategory.reduce((sum, cat) => sum + cat.sales, 0);
	const totalOrders = topSellingItems.reduce(
		(sum, item) => sum + item.orders,
		0
	);
	const avgOrderValue = totalRevenue / totalOrders;
	const customerRating = 4.8;

	return {
		revenue: {
			total: totalRevenue,
			change: Math.random() > 0.5 ? 15.3 : -8.2,
			trend: revenueTrend,
			chartData,
		},
		orders: {
			total: totalOrders,
			change: Math.random() > 0.5 ? 12.1 : -5.4,
			trend: orderTrend,
			byHour: ordersByHour,
		},
		avgOrderValue: {
			current: avgOrderValue,
			change: Math.random() > 0.5 ? 8.2 : -3.1,
			history: [25.5, 26.2, 27.8, 28.3, 28.5],
		},
		customerRating: {
			current: customerRating,
			change: Math.random() > 0.5 ? 0.3 : -0.1,
			distribution: ratingDistribution,
		},
		salesByCategory,
		topSellingItems,
		customerMetrics: {
			newCustomers: 142,
			returningCustomers: 650,
			retentionRate: 78,
			lifetimeValue: 425,
		},
		peakHours,
		lastUpdated: now.toISOString(),
		period,
	};
};

const getDaysForPeriod = (period: AnalyticsPeriod): number => {
	switch (period) {
		case '7days':
			return 7;
		case '30days':
			return 30;
		case '90days':
			return 90;
		case 'year':
			return 365;
		default:
			return 30;
	}
};

const formatDate = (date: Date, period: AnalyticsPeriod): string => {
	switch (period) {
		case '7days':
		case '30days':
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});
		case '90days':
		case 'year':
			return date.toLocaleDateString('en-US', { month: 'short' });
		default:
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
			});
	}
};

// Enhanced export function
export const exportAnalyticsData = async (
	format: 'csv' | 'excel' | 'pdf' = 'csv',
	options?: {
		includeCharts?: boolean;
		includeRawData?: boolean;
		dateRange?: { from: string; to: string };
	}
): Promise<void> => {
	if (useSampleData) {
		// Simulate export
		console.log(`Exporting analytics data as ${format}`, options);
		return new Promise((resolve) => setTimeout(resolve, 1500));
	}

	const response = await api.get(`/owner/analytics/export`, {
		params: {
			format,
			includeCharts: options?.includeCharts,
			includeRawData: options?.includeRawData,
			dateFrom: options?.dateRange?.from,
			dateTo: options?.dateRange?.to,
		},
		responseType: 'blob',
	});

	// Handle file download
	const url = window.URL.createObjectURL(new Blob([response.data]));
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute(
		'download',
		`analytics-export-${new Date().toISOString().split('T')[0]}.${format}`
	);
	document.body.appendChild(link);
	link.click();
	link.remove();
};

// Enhanced orders fetch with pagination
export const fetchOrdersPaginated = async (
	params?: GetOrdersParams
): Promise<OrdersPaginatedResponse> => {
	const page = params?.page || 1;
	const limit = params?.limit || 10;
	const filters = params?.filters || {};

	if (useSampleData) {
		let filteredOrders = [...sampleOrders];

		// Apply filters
		if (filters.status?.length) {
			filteredOrders = filteredOrders.filter((order) =>
				filters.status!.includes(order.status)
			);
		}

		if (filters.customerName) {
			filteredOrders = filteredOrders.filter((order) =>
				order.customerName
					.toLowerCase()
					.includes(filters.customerName!.toLowerCase())
			);
		}

		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			filteredOrders = filteredOrders.filter(
				(order) =>
					order.customerName.toLowerCase().includes(query) ||
					order.id.toLowerCase().includes(query) ||
					order.items.some((item) => item.name.toLowerCase().includes(query))
			);
		}

		// Sort
		const sortedOrders = [...filteredOrders].sort((a, b) => {
			if (filters.sortBy === 'date') {
				return filters.sortOrder === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
			if (filters.sortBy === 'amount') {
				return filters.sortOrder === 'asc'
					? a.totalAmount - b.totalAmount
					: b.totalAmount - a.totalAmount;
			}
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
		});

		// Paginate
		const start = (page - 1) * limit;
		const end = start + limit;
		const paginatedOrders = sortedOrders.slice(start, end);

		// Calculate stats
		const stats = {
			new: filteredOrders.filter((o) => o.status === 'new').length,
			preparing: filteredOrders.filter((o) => o.status === 'preparing').length,
			ready: filteredOrders.filter((o) => o.status === 'ready').length,
			out_for_delivery: filteredOrders.filter(
				(o) => o.status === 'out_for_delivery'
			).length,
			delivered: filteredOrders.filter((o) => o.status === 'delivered').length,
			declined: filteredOrders.filter((o) => o.status === 'declined').length,
			cancelled: filteredOrders.filter((o) => o.status === 'cancelled').length,
			total: filteredOrders.length,
			totalRevenue: filteredOrders.reduce(
				(sum, order) => sum + order.totalAmount,
				0
			),
			averageOrderValue:
				filteredOrders.length > 0
					? filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0) /
						filteredOrders.length
					: 0,
		};

		return {
			orders: paginatedOrders,
			total: filteredOrders.length,
			page,
			limit,
			totalPages: Math.ceil(filteredOrders.length / limit),
			stats,
		};
	}

	const response = await api.get<OrdersPaginatedResponse>(
		'/owner/orders/paginated',
		{
			params: {
				page,
				limit,
				...filters,
			},
		}
	);
	return response.data;
};

// Enhanced menu items fetch with filters
export const fetchMenuItemsFiltered = async (
	params?: GetMenuItemsParams
): Promise<{
	items: MenuItem[];
	total: number;
	stats: MenuItemStats;
}> => {
	if (useSampleData) {
		let filteredItems = [...sampleMenuItems];
		const filters = params?.filters;

		// Apply category filter
		if (filters?.category && filters.category !== 'all') {
			filteredItems = filteredItems.filter(
				(item) => item.category === filters.category
			);
		}

		// Apply availability filter
		if (filters?.availability === 'available') {
			filteredItems = filteredItems.filter((item) => item.available);
		} else if (filters?.availability === 'outOfStock') {
			filteredItems = filteredItems.filter((item) => !item.available);
		}

		// Apply price range filter
		if (filters?.priceRange) {
			filteredItems = filteredItems.filter(
				(item) =>
					item.price >= filters.priceRange!.min &&
					item.price <= filters.priceRange!.max
			);
		}

		// Apply search query
		if (filters?.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			filteredItems = filteredItems.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.description.toLowerCase().includes(query) ||
					item.tags?.some((tag) => tag.toLowerCase().includes(query))
			);
		}

		// Sort
		if (params?.sort) {
			filteredItems.sort((a, b) => {
				if (params.sort!.field === 'price') {
					return params.sort!.order === 'asc'
						? a.price - b.price
						: b.price - a.price;
				}
				if (params.sort!.field === 'name') {
					return params.sort!.order === 'asc'
						? a.name.localeCompare(b.name)
						: b.name.localeCompare(a.name);
				}
				return 0;
			});
		}

		// Calculate stats
		const stats = {
			total: {
				items: filteredItems.length,
				revenue: calculateTotalRevenue(filteredItems),
				orders: calculateTotalOrders(filteredItems),
			},
			byCategory: calculateCategoryStats(filteredItems),
			byAvailability: {
				available: filteredItems.filter((item) => item.available).length,
				outOfStock: filteredItems.filter((item) => !item.available).length,
			},
			priceDistribution: calculatePriceDistribution(filteredItems),
			trends: {
				newItemsThisMonth: Math.floor(Math.random() * 10) + 1,
				discontinuedItems: Math.floor(Math.random() * 3),
				priceChanges: Math.floor(Math.random() * 5),
			},
		};

		return {
			items: filteredItems,
			total: filteredItems.length,
			stats,
		};
	}

	  const restaurantId = await getRestaurantId();
    const response = await api.get(
      `/restaurants/${restaurantId}/menu-items/filtered`,
      { params },
    );
    return response.data;
};

// Helper functions for menu stats
const calculateTotalRevenue = (items: MenuItem[]): number => {
	// In a real app, this would come from actual order data
	return items.reduce((sum, item) => sum + item.price * 10, 0); // Mock: 10 orders per item
};

const calculateTotalOrders = (items: MenuItem[]): number => {
	return items.length * 10; // Mock: 10 orders per item
};

const calculateCategoryStats = (items: MenuItem[]) => {
	const categoryMap = new Map<string, { count: number; revenue: number }>();

	items.forEach((item) => {
		const existing = categoryMap.get(item.category) || { count: 0, revenue: 0 };
		categoryMap.set(item.category, {
			count: existing.count + 1,
			revenue: existing.revenue + item.price * 10, // Mock revenue
		});
	});

	const totalRevenue = Array.from(categoryMap.values()).reduce(
		(sum, cat) => sum + cat.revenue,
		0
	);

	return Array.from(categoryMap.entries()).map(([category, data]) => ({
		category,
		count: data.count,
		revenue: data.revenue,
		percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0,
	}));
};

const calculatePriceDistribution = (items: MenuItem[]) => {
	const ranges = [
		{ range: '$0-$10', min: 0, max: 10 },
		{ range: '$10-$20', min: 10, max: 20 },
		{ range: '$20-$30', min: 20, max: 30 },
		{ range: '$30+', min: 30, max: Infinity },
	];

	return ranges.map((range) => ({
		range: range.range,
		count: items.filter(
			(item) => item.price >= range.min && item.price < range.max
		).length,
	}));
};







