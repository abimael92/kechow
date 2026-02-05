/**
 * Cart Store (Pinia) - Production-ready cart with backend sync and localStorage persistence
 */

import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import {
	createOrGetCart,
	getCurrentCart,
	updateCartItem,
	removeCartItem,
	type CartResponse,
	type CartItemDto,
} from './cart.service';
import { useOnline } from '@/shared/composables/useOnline';

const STORAGE_KEY = 'kechow_cart';
const TAX_RATE = 0.08;
const DELIVERY_FEE = 50;
const FREE_DELIVERY_THRESHOLD = 250;
const MAX_QUANTITY_PER_ITEM = 20;

export interface CartItemLocal {
	id: number | string;
	menu_item_id: number;
	name: string;
	price: number;
	quantity: number;
	image_url?: string;
	notes?: string;
	stock?: number | null;
	is_available?: boolean;
}

export interface MenuItemForCart {
	id: number;
	name: string;
	price: number;
	image_url?: string;
	stock?: number | null;
	is_available?: boolean;
}

function loadFromStorage(): { items: CartItemLocal[]; restaurantId?: number } {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return { items: [] };
		const parsed = JSON.parse(raw);
		if (parsed?.items && Array.isArray(parsed.items)) {
			return { items: parsed.items, restaurantId: parsed.restaurantId ?? undefined };
		}
		return { items: [] };
	} catch {
		return { items: [] };
	}
}

function saveToStorage(items: CartItemLocal[], restaurantId?: number) {
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ items, restaurantId, updatedAt: Date.now() })
		);
	} catch {
		// ignore
	}
}

export const useCartStore = defineStore('cart', () => {
	const items = ref<CartItemLocal[]>([]);
	const restaurantId = ref<number | null>(null);
	const cartId = ref<number | null>(null);
	const expiresAt = ref<string | null>(null);
	const isLoading = ref(false);
	const error = ref<string | null>(null);
	const lastSyncedAt = ref<number | null>(null);

	const { isOnline } = useOnline();

	// Restore from localStorage on init (for offline/guest)
	const stored = loadFromStorage();
	if (stored.items.length) {
		items.value = stored.items;
		restaurantId.value = stored.restaurantId ?? null;
	}

	const itemCount = computed(() =>
		items.value.reduce((sum, i) => sum + i.quantity, 0)
	);

	const subtotal = computed(() =>
		items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
	);

	const deliveryFee = computed(() =>
		subtotal.value >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
	);

	const tax = computed(() => subtotal.value * TAX_RATE);

	const total = computed(() => subtotal.value + deliveryFee.value + tax.value);

	const deliveryProgress = computed(() =>
		Math.min((subtotal.value / FREE_DELIVERY_THRESHOLD) * 100, 100)
	);

	const amountToFreeDelivery = computed(() =>
		Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal.value)
	);

	function getCartTotal() {
		return {
			subtotal: subtotal.value,
			tax: tax.value,
			deliveryFee: deliveryFee.value,
			total: total.value,
		};
	}

	function applyCartResponse(res: CartResponse) {
		if (!res.cart) {
			items.value = [];
			restaurantId.value = null;
			cartId.value = null;
			expiresAt.value = null;
			persistLocal();
			return;
		}
		cartId.value = res.cart.id;
		restaurantId.value = res.cart.restaurant_id;
		expiresAt.value = res.cart.expires_at ?? null;
		items.value = (res.items ?? []).map((i: CartItemDto) => ({
			id: i.id,
			menu_item_id: i.menu_item_id,
			name: i.name,
			price: i.price,
			quantity: i.quantity,
			image_url: i.image_url,
			notes: i.notes,
			stock: i.stock,
			is_available: i.is_available,
		}));
		lastSyncedAt.value = Date.now();
		persistLocal();
	}

	function persistLocal() {
		saveToStorage(items.value, restaurantId.value ?? undefined);
	}

	async function addItem(
		restaurantIdParam: number,
		menuItem: MenuItemForCart,
		quantity: number
	): Promise<{ success: boolean; message?: string }> {
		const qty = Math.min(Math.max(1, quantity), MAX_QUANTITY_PER_ITEM);
		const maxQty =
			menuItem.stock == null ? MAX_QUANTITY_PER_ITEM : Math.min(MAX_QUANTITY_PER_ITEM, menuItem.stock);
		if (qty > maxQty) {
			return {
				success: false,
				message: `Cantidad máxima: ${maxQty}. ${menuItem.stock != null ? 'Stock limitado.' : ''}`,
			};
		}
		if (!menuItem.is_available && menuItem.is_available !== undefined) {
			return { success: false, message: 'El artículo ya no está disponible.' };
		}

		// One cart per restaurant
		if (restaurantId.value != null && restaurantId.value !== restaurantIdParam) {
			return {
				success: false,
				message: 'Solo puedes tener un restaurante a la vez. Vacía el carrito para cambiar.',
			};
		}

		error.value = null;

		if (isOnline.value) {
			try {
				isLoading.value = true;
				let res: CartResponse;
				if (cartId.value) {
					const existing = items.value.find((i) => i.menu_item_id === menuItem.id);
					const newQty = (existing?.quantity ?? 0) + qty;
					res = await updateCartItem(cartId.value, menuItem.id, newQty);
				} else {
					res = await createOrGetCart(restaurantIdParam);
					applyCartResponse(res);
					const existing = items.value.find((i) => i.menu_item_id === menuItem.id);
					const newQty = (existing?.quantity ?? 0) + qty;
					res = await updateCartItem(cartId.value!, menuItem.id, newQty);
				}
				applyCartResponse(res);
				return { success: true };
			} catch (e: unknown) {
				const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
				error.value = msg || 'Error al agregar al carrito.';
				return { success: false, message: error.value };
			} finally {
				isLoading.value = false;
			}
		}

		// Offline: local only
		restaurantId.value = restaurantIdParam;
		const existing = items.value.find((i) => i.menu_item_id === menuItem.id);
		if (existing) {
			existing.quantity = Math.min(existing.quantity + qty, maxQty);
		} else {
			items.value.push({
				id: `local-${menuItem.id}`,
				menu_item_id: menuItem.id,
				name: menuItem.name,
				price: menuItem.price,
				quantity: qty,
				image_url: menuItem.image_url,
				stock: menuItem.stock,
				is_available: menuItem.is_available,
			});
		}
		persistLocal();
		return { success: true };
	}

	function removeItem(itemId: number | string) {
		const idx = items.value.findIndex((i) => i.id === itemId);
		if (idx === -1) return;

		if (isOnline.value && cartId.value && typeof itemId === 'number') {
			removeCartItem(cartId.value, itemId)
				.then(applyCartResponse)
				.catch(() => {
					items.value.splice(idx, 1);
					persistLocal();
				});
		} else {
			items.value.splice(idx, 1);
			if (items.value.length === 0) restaurantId.value = null;
			persistLocal();
		}
	}

	async function updateQuantity(
		itemId: number | string,
		quantity: number
	): Promise<{ success: boolean; message?: string }> {
		const item = items.value.find((i) => i.id === itemId);
		if (!item) return { success: false, message: 'Artículo no encontrado.' };

		const qty = Math.max(0, Math.min(quantity, MAX_QUANTITY_PER_ITEM));
		const maxQty =
			item.stock == null ? MAX_QUANTITY_PER_ITEM : Math.min(MAX_QUANTITY_PER_ITEM, item.stock);
		if (qty > maxQty) {
			return {
				success: false,
				message: `Cantidad máxima: ${maxQty}.`,
			};
		}

		if (qty === 0) {
			removeItem(itemId);
			return { success: true };
		}

		if (isOnline.value && cartId.value && typeof itemId === 'number') {
			try {
				isLoading.value = true;
				const res = await updateCartItem(cartId.value, item.menu_item_id, qty);
				applyCartResponse(res);
				return { success: true };
			} catch (e: unknown) {
				const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
				return { success: false, message: msg || 'Error al actualizar.' };
			} finally {
				isLoading.value = false;
			}
		}

		item.quantity = qty;
		persistLocal();
		return { success: true };
	}

	async function clearCart() {
		items.value = [];
		restaurantId.value = null;
		cartId.value = null;
		expiresAt.value = null;
		persistLocal();
	}

	async function syncFromBackend() {
		if (!isOnline.value) return;
		try {
			isLoading.value = true;
			const res = await getCurrentCart();
			applyCartResponse(res);
		} catch {
			// Keep local state on error
		} finally {
			isLoading.value = false;
		}
	}

	// Persist to localStorage on changes
	watch(
		[items, restaurantId],
		() => persistLocal(),
		{ deep: true }
	);

	// Cross-tab sync: when another tab changes localStorage, reflect it here
	if (typeof window !== 'undefined') {
		window.addEventListener('storage', (e) => {
			if (e.key === STORAGE_KEY && e.newValue) {
				try {
					const data = JSON.parse(e.newValue);
					if (data?.items) {
						items.value = data.items;
						restaurantId.value = data.restaurantId ?? null;
					}
				} catch {
					// ignore
				}
			}
		});
	}

	return {
		items,
		restaurantId,
		cartId,
		expiresAt,
		isLoading,
		error,
		itemCount,
		subtotal,
		deliveryFee,
		tax,
		total,
		deliveryProgress,
		amountToFreeDelivery,
		getCartTotal,
		addItem,
		removeItem,
		updateQuantity,
		clearCart,
		syncFromBackend,
		applyCartResponse,
		isOnline,
	};
});
