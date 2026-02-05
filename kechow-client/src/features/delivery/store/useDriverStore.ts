/**
 * Driver Store (Pinia) - Production-ready delivery driver state
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
	getAvailableOrders,
	getCurrentOrder,
	acceptOrder,
	startDelivery,
	completeDelivery,
	updateDriverLocation,
	toggleDriverStatus,
	getDriverStats,
	type DriverOrderDto,
	type DriverStatsDto,
} from '../services/driver.service';
import { useOnline } from '@/shared/composables/useOnline';

const STORAGE_KEY = 'kechow_driver';

export const useDriverStore = defineStore('driver', () => {
	const availableOrders = ref<DriverOrderDto[]>([]);
	const currentOrder = ref<DriverOrderDto | null>(null);
	const stats = ref<DriverStatsDto | null>(null);
	const isOnline = ref(false);
	const isLoading = ref(false);
	const error = ref<string | null>(null);

	const { isOnline: isNetworkOnline } = useOnline();

	const hasActiveOrder = computed(() => currentOrder.value !== null);
	const canAcceptOrders = computed(() => isOnline.value && !hasActiveOrder.value);

	// Load from localStorage (offline persistence)
	function loadFromStorage() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const data = JSON.parse(raw);
			isOnline.value = data.isOnline ?? false;
			if (data.currentOrder) currentOrder.value = data.currentOrder;
		} catch {
			// ignore
		}
	}

	function persistToStorage() {
		try {
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					isOnline: isOnline.value,
					currentOrder: currentOrder.value,
					updatedAt: Date.now(),
				})
			);
		} catch {
			// ignore
		}
	}

	async function fetchAvailableOrders() {
		if (!isOnline.value || !isNetworkOnline.value) return;
		try {
			isLoading.value = true;
			error.value = null;
			availableOrders.value = await getAvailableOrders();
		} catch (e: unknown) {
			const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
			error.value = msg || 'Error al cargar pedidos';
		} finally {
			isLoading.value = false;
		}
	}

	async function fetchCurrentOrder() {
		if (!isNetworkOnline.value) return;
		try {
			currentOrder.value = await getCurrentOrder();
			persistToStorage();
		} catch {
			// keep local state
		}
	}

	async function fetchStats() {
		if (!isNetworkOnline.value) return;
		try {
			const data = await getDriverStats();
			stats.value = data;
			if (data.isOnline !== undefined) {
				isOnline.value = data.isOnline;
				persistToStorage();
			}
		} catch {
			// keep previous stats
		}
	}

	async function toggleOnline() {
		if (!isNetworkOnline.value) {
			isOnline.value = !isOnline.value;
			persistToStorage();
			if (isOnline.value) await fetchAvailableOrders();
			return;
		}
		try {
			const res = await toggleDriverStatus();
			isOnline.value = res.isOnline;
			persistToStorage();
			if (isOnline.value) await fetchAvailableOrders();
		} catch {
			isOnline.value = !isOnline.value;
			persistToStorage();
		}
	}

	async function acceptOrderAction(orderId: string): Promise<{ success: boolean; message?: string }> {
		if (!isNetworkOnline.value) {
			return { success: false, message: 'Sin conexión' };
		}
		if (hasActiveOrder.value) {
			return { success: false, message: 'Ya tienes un pedido activo' };
		}
		try {
			await acceptOrder(orderId);
			await fetchCurrentOrder();
			await fetchAvailableOrders();
			return { success: true };
		} catch (e: unknown) {
			const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
			return { success: false, message: msg || 'Error al aceptar' };
		}
	}

	async function startDeliveryAction(orderId: string): Promise<{ success: boolean; message?: string }> {
		if (!isNetworkOnline.value) {
			return { success: false, message: 'Sin conexión' };
		}
		try {
			await startDelivery(orderId);
			await fetchCurrentOrder();
			return { success: true };
		} catch (e: unknown) {
			const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
			return { success: false, message: msg || 'Error al iniciar entrega' };
		}
	}

	async function completeDeliveryAction(orderId: string): Promise<{ success: boolean; message?: string }> {
		if (!isNetworkOnline.value) {
			return { success: false, message: 'Sin conexión' };
		}
		try {
			await completeDelivery(orderId);
			currentOrder.value = null;
			persistToStorage();
			await fetchStats();
			await fetchAvailableOrders();
			return { success: true };
		} catch (e: unknown) {
			const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
			return { success: false, message: msg || 'Error al completar entrega' };
		}
	}

	async function sendLocation(lat: number, lng: number) {
		if (!isNetworkOnline.value) return;
		try {
			await updateDriverLocation(lat, lng);
		} catch {
			// silent fail for location updates
		}
	}

	function setCurrentOrder(order: DriverOrderDto | null) {
		currentOrder.value = order;
		persistToStorage();
	}

	// Auto-refresh available orders every 30s when online
	let refreshInterval: ReturnType<typeof setInterval> | null = null;

	function startAutoRefresh() {
		refreshInterval = setInterval(() => {
			if (isOnline.value && !hasActiveOrder.value) fetchAvailableOrders();
		}, 30000);
	}

	function stopAutoRefresh() {
		if (refreshInterval) {
			clearInterval(refreshInterval);
			refreshInterval = null;
		}
	}

	async function initialize() {
		loadFromStorage();
		if (isNetworkOnline.value) {
			await Promise.all([fetchCurrentOrder(), fetchStats()]);
			if (isOnline.value) await fetchAvailableOrders();
		}
		startAutoRefresh();
	}

	return {
		availableOrders,
		currentOrder,
		stats,
		isOnline,
		isLoading,
		error,
		hasActiveOrder,
		canAcceptOrders,
		fetchAvailableOrders,
		fetchCurrentOrder,
		fetchStats,
		toggleOnline,
		acceptOrderAction,
		startDeliveryAction,
		completeDeliveryAction,
		sendLocation,
		setCurrentOrder,
		startAutoRefresh,
		stopAutoRefresh,
		initialize,
		loadFromStorage,
		isNetworkOnline,
	};
});
