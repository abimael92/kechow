/**
 * Customer Service - API abstraction with mock fallbacks
 * All customer-related API calls go through this service
 */

import { api } from '@app/lib/axios';
import type { Order, MenuItem, Review } from '../types';
import { sampleOrders } from '../data/sampleOrders';
import { sampleReviews } from '../data/sampleReviews';
import { restaurants } from '@shared/data/restaurants';

// Use mock data in development or when API fails
const USE_MOCK_DATA = import.meta.env.MODE === 'development' || import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Helper to handle API calls with mock fallback
 */
async function withMockFallback<T>(
	apiCall: () => Promise<T>,
	mockData: T,
	errorMessage = 'Error al cargar datos'
): Promise<T> {
	if (USE_MOCK_DATA) {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 300));
		return mockData;
	}

	try {
		return await apiCall();
	} catch (error) {
		console.warn(`${errorMessage}, usando datos de prueba:`, error);
		// Simulate network delay for mock
		await new Promise((resolve) => setTimeout(resolve, 300));
		return mockData;
	}
}

/* ------------------------- RESTAURANTS ------------------------- */

export interface Restaurant {
	id: number;
	name: string;
	description: string;
	image?: string;
	rating?: number;
	deliveryTime?: number;
	deliveryFee?: number;
	cuisine?: string;
}

export interface RestaurantFilters {
	search?: string;
	cuisine?: string;
	sortBy?: 'name' | 'rating' | 'deliveryTime';
	priceRange?: string;
}

/**
 * Get all restaurants with optional filters
 */
export const getRestaurants = async (
	filters?: RestaurantFilters
): Promise<Restaurant[]> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Restaurant[]>('/restaurants', {
				params: filters,
			});
			return response.data;
		},
		restaurants.map((r) => ({
			id: r.id,
			name: r.name,
			description: r.description,
			image: r.image,
			rating: r.rating || 4.5,
			deliveryTime: 30,
			deliveryFee: 50,
			cuisine: 'Mexicana',
		})),
		'Error al cargar restaurantes'
	);
};

/**
 * Get restaurant by ID
 */
export const getRestaurant = async (id: number): Promise<Restaurant | null> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Restaurant>(`/restaurants/${id}`);
			return response.data;
		},
		restaurants
			.find((r) => r.id === id)
			? {
					id: restaurants.find((r) => r.id === id)!.id,
					name: restaurants.find((r) => r.id === id)!.name,
					description: restaurants.find((r) => r.id === id)!.description,
					image: restaurants.find((r) => r.id === id)!.image,
					rating: 4.5,
					deliveryTime: 30,
					deliveryFee: 50,
					cuisine: 'Mexicana',
				}
			: null,
		'Error al cargar restaurante'
	);
};

/**
 * Get restaurant menu
 */
export const getRestaurantMenu = async (restaurantId: number): Promise<MenuItem[]> => {
	return withMockFallback(
		async () => {
			const response = await api.get<MenuItem[]>(
				`/restaurants/${restaurantId}/menu`
			);
			return response.data;
		},
		restaurants.find((r) => r.id === restaurantId)?.menu.map((item) => ({
			id: item.id.toString(),
			name: item.name,
			description: item.description,
			price: item.price,
			stock: item.stock,
			category: 'Plato Principal',
			available: (item.stock ?? 0) > 0,
			image: item.image,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})) || [],
		'Error al cargar menú'
	);
};

/* ------------------------- ORDERS ------------------------- */

export interface CreateOrderRequest {
	restaurantId: number;
	items: Array<{
		menuItemId: string;
		quantity: number;
		notes?: string;
	}>;
	deliveryAddress: string;
	specialInstructions?: string;
	paymentMethod: 'cash' | 'card' | 'online';
}

/**
 * Get customer orders
 */
export const getCustomerOrders = async (): Promise<Order[]> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Order[]>('/customer/orders');
			return response.data;
		},
		sampleOrders,
		'Error al cargar pedidos'
	);
};

/**
 * Get order by ID
 */
export const getOrder = async (orderId: string): Promise<Order | null> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Order>(`/customer/orders/${orderId}`);
			return response.data;
		},
		sampleOrders.find((o) => o.id === orderId) || null,
		'Error al cargar pedido'
	);
};

/**
 * Create new order (checkout)
 */
export const createOrder = async (
	orderData: CreateOrderRequest
): Promise<Order> => {
	return withMockFallback(
		async () => {
			const response = await api.post<Order>('/customer/orders', orderData);
			return response.data;
		},
		{
			id: `ORD-${Date.now()}`,
			customerName: 'Cliente',
			phone: '+52 123 456 7890',
			address: orderData.deliveryAddress,
			items: orderData.items.map((item, idx) => ({
				id: `item-${idx}`,
				name: `Item ${item.menuItemId}`,
				quantity: item.quantity,
				price: 100,
				notes: item.notes,
			})),
			totalAmount: orderData.items.reduce((sum, item) => sum + item.quantity * 100, 0),
			status: 'new',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			specialInstructions: orderData.specialInstructions,
			paymentMethod: orderData.paymentMethod,
			paymentStatus: 'pending',
		},
		'Error al crear pedido'
	);
};

/**
 * Track order status
 */
export const trackOrder = async (orderId: string): Promise<Order> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Order>(`/customer/orders/${orderId}/track`);
			return response.data;
		},
		sampleOrders.find((o) => o.id === orderId) || sampleOrders[0],
		'Error al rastrear pedido'
	);
};

/* ------------------------- REVIEWS ------------------------- */

export interface CreateReviewRequest {
	orderId: string;
	restaurantId: number;
	rating: number;
	comment: string;
}

/**
 * Get restaurant reviews
 */
export const getRestaurantReviews = async (
	restaurantId: number
): Promise<Review[]> => {
	return withMockFallback(
		async () => {
			const response = await api.get<Review[]>(
				`/restaurants/${restaurantId}/reviews`
			);
			return response.data;
		},
		sampleReviews,
		'Error al cargar reseñas'
	);
};

/**
 * Create review
 */
export const createReview = async (
	reviewData: CreateReviewRequest
): Promise<Review> => {
	return withMockFallback(
		async () => {
			const response = await api.post<Review>('/customer/reviews', reviewData);
			return response.data;
		},
		{
			id: `REV-${Date.now()}`,
			customerName: 'Cliente',
			rating: reviewData.rating,
			comment: reviewData.comment,
			date: new Date().toISOString(),
			verified: false,
			helpfulCount: 0,
			orderId: reviewData.orderId,
		},
		'Error al crear reseña'
	);
};

/* ------------------------- PROFILE & ADDRESSES ------------------------- */

export interface Address {
	id: string;
	label: string;
	street: string;
	city: string;
	state: string;
	zipCode: string;
	isDefault: boolean;
}

export interface CustomerProfile {
	id: string;
	name: string;
	email: string;
	phone: string;
	addresses: Address[];
}

/**
 * Get customer profile
 */
export const getCustomerProfile = async (): Promise<CustomerProfile> => {
	return withMockFallback(
		async () => {
			const response = await api.get<CustomerProfile>('/customer/profile');
			return response.data;
		},
		{
			id: '1',
			name: 'Juan Pérez',
			email: 'juan.perez@example.com',
			phone: '+52 123 456 7890',
			addresses: [
				{
					id: '1',
					label: 'Casa',
					street: 'Av. Principal 123',
					city: 'Ciudad',
					state: 'Estado',
					zipCode: '12345',
					isDefault: true,
				},
			],
		},
		'Error al cargar perfil'
	);
};

/**
 * Update customer profile
 */
export const updateCustomerProfile = async (
	profile: Partial<CustomerProfile>
): Promise<CustomerProfile> => {
	return withMockFallback(
		async () => {
			const response = await api.put<CustomerProfile>(
				'/customer/profile',
				profile
			);
			return response.data;
		},
		{
			id: '1',
			name: profile.name || 'Juan Pérez',
			email: profile.email || 'juan.perez@example.com',
			phone: profile.phone || '+52 123 456 7890',
			addresses: profile.addresses || [],
		},
		'Error al actualizar perfil'
	);
};

/**
 * Add address
 */
export const addAddress = async (address: Omit<Address, 'id'>): Promise<Address> => {
	return withMockFallback(
		async () => {
			const response = await api.post<Address>('/customer/addresses', address);
			return response.data;
		},
		{
			id: `addr-${Date.now()}`,
			...address,
		},
		'Error al agregar dirección'
	);
};

/**
 * Update address
 */
export const updateAddress = async (
	addressId: string,
	address: Partial<Address>
): Promise<Address> => {
	return withMockFallback(
		async () => {
			const response = await api.put<Address>(
				`/customer/addresses/${addressId}`,
				address
			);
			return response.data;
		},
		{
			id: addressId,
			label: address.label || 'Dirección',
			street: address.street || '',
			city: address.city || '',
			state: address.state || '',
			zipCode: address.zipCode || '',
			isDefault: address.isDefault || false,
		},
		'Error al actualizar dirección'
	);
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId: string): Promise<void> => {
	return withMockFallback(
		async () => {
			await api.delete(`/customer/addresses/${addressId}`);
		},
		undefined,
		'Error al eliminar dirección'
	);
};
