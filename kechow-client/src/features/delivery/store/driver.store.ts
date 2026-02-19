// src/features/delivery/stores/driver.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getAvailableJobs,
  getActiveOrder,
  getAvailability,
  updateAvailability,
  acceptJob,
  updateOrderStatus,
} from '../services/driver.service';

export const useDriverStore = defineStore('driver', () => {
  // State
  const isOnline = ref(false);
  const availability = ref({
    isOnline: false,
    totalOnlineHours: 0,
  });
  const availableJobs = ref<any[]>([]);
  const activeOrder = ref<any | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const hasActiveOrder = computed(() => !!activeOrder.value);

  // Initialize
  const initialize = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [availabilityData, activeData] = await Promise.all([
        getAvailability(),
        getActiveOrder(),
      ]);

      availability.value = availabilityData;
      isOnline.value = availabilityData.isOnline;
      activeOrder.value = activeData;

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
      if (!isOnline.value) return;

      loading.value = true;
      error.value = null;

      const data = await getAvailableJobs();
      availableJobs.value = data.jobs || [];
    } catch (err: any) {
      error.value = err.message;
      availableJobs.value = [];
    } finally {
      loading.value = false;
    }
  };

  // toggleOnline en driver.store.ts
  const toggleOnline = async () => {
    try {
      loading.value = true;
      const newStatus = !isOnline.value;
      const data = await updateAvailability(newStatus); // Esto ahora recibirá el JSON correcto

      availability.value = data;
      isOnline.value = data.isOnline; // Se actualiza el ref local

      if (isOnline.value) {
        await loadAvailableJobs();
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Accept order
  const acceptOrder = async (orderId: number) => {
    try {
      loading.value = true;
      error.value = null;

      const data = await acceptJob(orderId);

      if (data) {
        activeOrder.value = data;
        availableJobs.value = [];
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Change order status
  const changeOrderStatus = async (status: string) => {
    if (!activeOrder.value) return;

    try {
      loading.value = true;
      error.value = null;

      const data = await updateOrderStatus(activeOrder.value.id, status);

      if (data) {
        activeOrder.value = data;
      }

      if (status === 'delivered') {
        activeOrder.value = null;
        await loadAvailableJobs();
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Reset
  const $reset = () => {
    isOnline.value = false;
    availability.value = { isOnline: false, totalOnlineHours: 0 };
    availableJobs.value = [];
    activeOrder.value = null;
    loading.value = false;
    error.value = null;
  };

  return {
    isOnline,
    availability,
    availableJobs,
    activeOrder,
    loading,
    error,
    hasActiveOrder,
    initialize,
    toggleOnline,
    loadAvailableJobs,
    acceptOrder,
    changeOrderStatus,
    $reset,
  };
});
