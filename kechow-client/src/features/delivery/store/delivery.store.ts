// src/features/delivery/stores/delivery.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
  const availability = ref({
    isOnline: false,
    totalOnlineHours: 0,
  });
  const availableJobs = ref<any[]>([]);
  const activeOrder = ref<any | null>(null);
  const deliveryProgress = ref<any | null>(null);
  const earningsSummary = ref<any | null>(null);
  const settings = ref({
    vehicleType: 'motorcycle',
    maxDistance: 10,
    autoAccept: false,
    notificationsEnabled: true,
  });
  const currentLocation = ref<any | null>(null);
  const isOnline = ref(false);
  const completedOrders = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasActiveOrder = computed(() => !!activeOrder.value);
  const isAvailable = computed(
    () => availability.value.isOnline && !hasActiveOrder.value,
  );

  // Initialize
  const initialize = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [availabilityData, activeData, settingsData] = await Promise.all([
        getAvailability(),
        getActiveOrder(),
        getDeliverySettings(),
      ]);

      availability.value = availabilityData;
      isOnline.value = availabilityData.isOnline;
      activeOrder.value = activeData;
      settings.value = settingsData;

      if (isOnline.value) {
        await loadAvailableJobs();
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Initialize error:', err);
    } finally {
      loading.value = false;
    }
  };

  // Load available jobs
  const loadAvailableJobs = async () => {
    try {
      if (!availability.value.isOnline) return;

      loading.value = true;
      error.value = null;

      const jobs = await getAvailableJobs();
      availableJobs.value = Array.isArray(jobs) ? jobs : [];
    } catch (err: any) {
      error.value = err.message;
      availableJobs.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Toggle availability
  const toggleAvailability = async () => {
    try {
      loading.value = true;
      error.value = null;

      const newStatus = !availability.value.isOnline;
      const data = await updateAvailability(newStatus);

      availability.value = data;
      isOnline.value = data.isOnline;

      if (newStatus) {
        await loadAvailableJobs();
      } else {
        availableJobs.value = [];
        activeOrder.value = null;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Accept order
  const acceptDeliveryOrder = async (orderId: string) => {
    try {
      loading.value = true;
      error.value = null;

      const order = await acceptOrder(orderId);

      if (order) {
        activeOrder.value = order;
        availableJobs.value = availableJobs.value.filter(
          (j) => j.id !== orderId,
        );
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Reject order
  const rejectDeliveryOrder = async (orderId: string) => {
    try {
      loading.value = true;
      error.value = null;

      await rejectOrder(orderId);
      availableJobs.value = availableJobs.value.filter((j) => j.id !== orderId);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Update status
  const updateStatus = async (orderId: string, status: string) => {
    try {
      loading.value = true;
      error.value = null;

      const updatedOrder = await updateDeliveryStatus(orderId, status);
      activeOrder.value = updatedOrder;

      if (status === 'delivered') {
        if (activeOrder.value) {
          completedOrders.value.push(activeOrder.value);
        }
        activeOrder.value = null;
        await loadEarningsSummary();
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Load delivery progress
  const loadDeliveryProgress = async (orderId: string) => {
    try {
      loading.value = true;
      error.value = null;

      deliveryProgress.value = await getDeliveryProgress(orderId);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Update location
  const updateCurrentLocation = async (orderId?: string) => {
    try {
      const order = activeOrder.value;
      const step = currentStepForGPS.value;
      const location = getCurrentLocation(order, step);
      currentLocation.value = location;

      if (orderId && activeOrder.value) {
        await updateLocation(orderId, location);
      }
    } catch (err: any) {
      error.value = err.message;
    }
  };

  // Load earnings
  const loadEarningsSummary = async () => {
    try {
      loading.value = true;
      error.value = null;

      earningsSummary.value = await getEarningsSummary();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<any>) => {
    try {
      loading.value = true;
      error.value = null;

      settings.value = await updateDeliverySettings(newSettings);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // GPS step
  const currentStepForGPS = computed(() => {
    if (!activeOrder.value) return 0;
    const map: Record<string, number> = {
      accepted: 0,
      picked_up: 1,
      on_the_way: 2,
      delivered: 3,
      cancelled: 0,
    };
    return map[activeOrder.value.status] ?? 0;
  });

  // Start tracking
  const startLocationTracking = (orderId?: string) => {
    if (!orderId && activeOrder.value) {
      orderId = activeOrder.value.id;
    }

    const interval = setInterval(() => {
      updateCurrentLocation(orderId);
    }, 10000);

    return () => clearInterval(interval);
  };

  // Reset
  const $reset = () => {
    availability.value = { isOnline: false, totalOnlineHours: 0 };
    availableJobs.value = [];
    activeOrder.value = null;
    deliveryProgress.value = null;
    earningsSummary.value = null;
    settings.value = {
      vehicleType: 'motorcycle',
      maxDistance: 10,
      autoAccept: false,
      notificationsEnabled: true,
    };
    currentLocation.value = null;
    isOnline.value = false;
    completedOrders.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    availability,
    availableJobs,
    activeOrder,
    deliveryProgress,
    earningsSummary,
    settings,
    currentLocation,
    isOnline,
    completedOrders,
    loading,
    error,
    hasActiveOrder,
    isAvailable,
    currentStepForGPS,
    initialize,
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
    $reset,
  };
});
