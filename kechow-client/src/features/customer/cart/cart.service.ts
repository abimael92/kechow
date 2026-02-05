/**
 * Cart API Service - Integrates with Laravel Cart endpoints
 */

import { api } from '@app/lib/axios';

export interface CartItemDto {
	id: number;
	menu_item_id: number;
	name: string;
	description?: string;
	price: number;
	image_url?: string;
	quantity: number;
	notes?: string;
	stock?: number | null;
	is_available: boolean;
}

export interface CartResponse {
	cart: {
		id: number;
		restaurant_id: number;
		expires_at?: string;
	} | null;
	restaurant: { id: number; name: string } | null;
	items: CartItemDto[];
}

const API_PREFIX = '/api';

/**
 * Create or retrieve cart for restaurant
 */
export async function createOrGetCart(restaurantId: number): Promise<CartResponse> {
	const { data } = await api.post<CartResponse>(`${API_PREFIX}/carts`, {
		restaurant_id: restaurantId,
	});
	return data;
}

/**
 * Get current user's active cart
 */
export async function getCurrentCart(): Promise<CartResponse> {
	const { data } = await api.get<CartResponse>(`${API_PREFIX}/carts/current`);
	return data;
}

/**
 * Add or update item in cart
 */
export async function updateCartItem(
	cartId: number,
	menuItemId: number,
	quantity: number,
	notes?: string
): Promise<CartResponse> {
	const { data } = await api.put<CartResponse>(
		`${API_PREFIX}/carts/${cartId}/items`,
		{ menu_item_id: menuItemId, quantity, notes }
	);
	return data;
}

/**
 * Remove item from cart
 */
export async function removeCartItem(
	cartId: number,
	cartItemId: number
): Promise<CartResponse> {
	const { data } = await api.delete<CartResponse>(
		`${API_PREFIX}/carts/${cartId}/items/${cartItemId}`
	);
	return data;
}
