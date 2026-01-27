import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
	DeliveryOrder,
	DeliveryJob,
	DeliveryAvailability,
	DeliveryProgress,
	EarningsSummary,
	GPSLocation,
	DeliverySettings,
} from '../types';
import {
	getAvailability,
	updateAvailability,
	getAvailableJobs,
	getActiveOrder,
	acceptOrder,
	rejectOrder,
	updateDeliveryStatus,
	getDeliveryProgress,
	updateLocation,
	getCurrentLocation,
	getEarningsSummary,
	getDeliverySettings,
	updateDeliverySettings,
} from '../services/delivery.service';

export const useDeliveryStore = defineStore('delivery', () => {
	// State
	const availability = ref<DeliveryAvailability>({
		isOnline: false,
		totalOnlineHours: 0,
	});
	const availableJobs = ref<DeliveryJob[]>([]);
	const activeOrder = ref<DeliveryOrder | null>(null);
	const deliveryProgress = ref<DeliveryProgress | null>(null);
	const earningsSummary = ref<EarningsSummary | null>(null);
	const settings = ref<DeliverySettings>({
		vehicleType: 'motorcycle',
		maxDistance: 10,
		autoAccept: false,
		notificationsEnabled: true,
	});
	const currentLocation = ref<GPSLocation | null>(null);
	const isOnline = ref(false);

	// Offline queue for actions
	const offlineQueue = ref<Array<{ type: string; payload: any; timestamp: string }>>([]);

	// Computed
	const hasActiveOrder = computed(() => activeOrder.value !== null);
	const isAvailable = computed(() => availability.value.isOnline && !hasActiveOrder.value);

	// Initialize from localStorage (offline-safe)
	const initialize = async () => {
		try {
			// Load from localStorage first (offline-safe)
			const storedAvailability = localStorage.getItem('delivery_availability');
			if (storedAvailability) {
				availability.value = JSON.parse(storedAvailability);
				isOnline.value = availability.value.isOnline;
			}

			const storedActiveOrder = localStorage.getItem('delivery_active_order');
			if (storedActiveOrder) {
				activeOrder.value = JSON.parse(storedActiveOrder);
			}

			const storedSettings = localStorage.getItem('delivery_settings');
			if (storedSettings) {
				settings.value = JSON.parse(storedSettings);
			}

			// Try to sync with server if online
			if (navigator.onLine) {
				await syncWithServer();
			}
		} catch (error) {
			console.error('Failed to initialize delivery store:', error);
		}
	};

	// Sync with server (when online)
	const syncWithServer = async () => {
		try {
			// Sync availability
			const serverAvailability = await getAvailability();
			availability.value = serverAvailability;
			isOnline.value = serverAvailability.isOnline;
			localStorage.setItem('delivery_availability', JSON.stringify(serverAvailability));

			// Sync active order
			const serverActiveOrder = await getActiveOrder();
			if (serverActiveOrder) {
				activeOrder.value = serverActiveOrder;
				localStorage.setItem('delivery_active_order', JSON.stringify(serverActiveOrder));
			}

			// Sync settings
			const serverSettings = await getDeliverySettings();
			settings.value = serverSettings;
			localStorage.setItem('delivery_settings', JSON.stringify(serverSettings));

			// Process offline queue
			await processOfflineQueue();
		} catch (error) {
			console.error('Failed to sync with server:', error);
		}
	};

	// Process offline queue
	const processOfflineQueue = async () => {
		if (offlineQueue.value.length === 0) return;

		const queue = [...offlineQueue.value];
		offlineQueue.value = [];

		for (const action of queue) {
			try {
				switch (action.type) {
					case 'UPDATE_STATUS':
						await updateDeliveryStatus(action.payload.orderId, action.payload.status);
						break;
					case 'UPDATE_LOCATION':
						await updateLocation(action.payload.orderId, action.payload.location);
						break;
					// Add more action types as needed
				}
			} catch (error) {
				console.error('Failed to process offline action:', error);
				// Re-queue if failed
				offlineQueue.value.push(action);
			}
		}
	};

	// Toggle availability
	const toggleAvailability = async () => {
		const newStatus = !availability.value.isOnline;
		try {
			availability.value = await updateAvailability(newStatus);
			isOnline.value = newStatus;
			localStorage.setItem('delivery_availability', JSON.stringify(availability.value));

			// If going online, refresh jobs
			if (newStatus) {
				await loadAvailableJobs();
			}
		} catch (error) {
			console.error('Failed to update availability:', error);
			// Revert on error
			availability.value.isOnline = !newStatus;
			isOnline.value = !newStatus;
		}
	};

	// Load available jobs
	const loadAvailableJobs = async () => {
		try {
			if (!availability.value.isOnline) return;

			availableJobs.value = await getAvailableJobs();
		} catch (error) {
			console.error('Failed to load available jobs:', error);
		}
	};

	// Accept order
	const acceptDeliveryOrder = async (orderId: string) => {
		try {
			activeOrder.value = await acceptOrder(orderId);
			localStorage.setItem('delivery_active_order', JSON.stringify(activeOrder.value));

			// Remove from available jobs
			availableJobs.value = availableJobs.value.filter(
				(job) => job.order.id !== orderId
			);

			// Load progress
			await loadDeliveryProgress(orderId);
		} catch (error) {
			console.error('Failed to accept order:', error);
			throw error;
		}
	};

	// Reject order
	const rejectDeliveryOrder = async (orderId: string) => {
		try {
			await rejectOrder(orderId);
			availableJobs.value = availableJobs.value.filter(
				(job) => job.order.id !== orderId
			);
		} catch (error) {
			console.error('Failed to reject order:', error);
		}
	};

	// Update delivery status
	const updateStatus = async (orderId: string, status: string) => {
		try {
			if (!navigator.onLine) {
				// Queue for offline processing
				offlineQueue.value.push({
					type: 'UPDATE_STATUS',
					payload: { orderId, status },
					timestamp: new Date().toISOString(),
				});
				// Update locally
				if (activeOrder.value && activeOrder.value.id === orderId) {
					activeOrder.value.status = status as any;
					localStorage.setItem('delivery_active_order', JSON.stringify(activeOrder.value));
				}
				return;
			}

			activeOrder.value = await updateDeliveryStatus(orderId, status as any);
			localStorage.setItem('delivery_active_order', JSON.stringify(activeOrder.value));

			if (status === 'delivered') {
				activeOrder.value = null;
				localStorage.removeItem('delivery_active_order');
				await loadEarningsSummary();
			} else {
				await loadDeliveryProgress(orderId);
			}
		} catch (error) {
			console.error('Failed to update status:', error);
			throw error;
		}
	};

	// Load delivery progress
	const loadDeliveryProgress = async (orderId: string) => {
		try {
			deliveryProgress.value = await getDeliveryProgress(orderId);
		} catch (error) {
			console.error('Failed to load delivery progress:', error);
		}
	};

	// Update location
	const updateCurrentLocation = async (orderId?: string) => {
		try {
			const location = getCurrentLocation();
			currentLocation.value = location;

			if (orderId && activeOrder.value) {
				if (!navigator.onLine) {
					// Queue for offline processing
					offlineQueue.value.push({
						type: 'UPDATE_LOCATION',
						payload: { orderId, location },
						timestamp: new Date().toISOString(),
					});
				} else {
					await updateLocation(orderId, location);
				}
			}
		} catch (error) {
			console.error('Failed to update location:', error);
		}
	};

	// Load earnings summary
	const loadEarningsSummary = async () => {
		try {
			earningsSummary.value = await getEarningsSummary();
		} catch (error) {
			console.error('Failed to load earnings summary:', error);
		}
	};

	// Update settings
	const updateSettings = async (newSettings: Partial<DeliverySettings>) => {
		try {
			settings.value = await updateDeliverySettings(newSettings);
			localStorage.setItem('delivery_settings', JSON.stringify(settings.value));
		} catch (error) {
			console.error('Failed to update settings:', error);
		}
	};

	// Start location tracking
	const startLocationTracking = (orderId?: string) => {
		if (!orderId && activeOrder.value) {
			orderId = activeOrder.value.id;
		}

		// Update location every 10 seconds
		const interval = setInterval(() => {
			updateCurrentLocation(orderId);
		}, 10000);

		return () => clearInterval(interval);
	};

	return {
		// State
		availability,
		availableJobs,
		activeOrder,
		deliveryProgress,
		earningsSummary,
		settings,
		currentLocation,
		isOnline,
		offlineQueue,

		// Computed
		hasActiveOrder,
		isAvailable,

		// Actions
		initialize,
		syncWithServer,
		toggleAvailability,
		loadAvailableJobs,
		acceptDeliveryOrder,
		rejectDeliveryOrder,
		updateStatus,
		loadDeliveryProgress,
		updateCurrentLocation,
		loadEarningsSummary,
		updateSettings,
		startLocationTracking,
	};
});
