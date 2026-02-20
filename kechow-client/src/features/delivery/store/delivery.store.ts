// src/features/delivery/stores/delivery.store.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getAvailability,
  updateAvailability,
  getAvailableJobs,
  getActiveOrder,
  acceptJob,
  updateOrderStatus,
} from '../services/driver.service';

export const useDeliveryStore = defineStore('delivery', () => {
  // State
  const availability = ref({
    isOnline: false,
    totalOnlineHours: 0,
  });
  const availableJobs = ref<any[]>([]);
  const activeOrder = ref<any | null>(null);
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
  // Initialize
  const initialize = async () => {
    try {
      loading.value = true;
      error.value = null;

      const [availabilityData, activeData] = await Promise.allSettled([
        getAvailability(),
        getActiveOrder(),
      ]);

      if (availabilityData.status === 'fulfilled') {
        availability.value = availabilityData.value;
        isOnline.value = availabilityData.value.isOnline;
      }

      if (activeData.status === 'fulfilled') {
        // Solo asignar si no es null y no es objeto vacío
        if (activeData.value && Object.keys(activeData.value).length > 0) {
          activeOrder.value = activeData.value;
        } else {
          activeOrder.value = null;
        }
      }

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

      const data = await getAvailableJobs();
      availableJobs.value = data.jobs || [];
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

  // Accept job
  // Accept job
  const acceptDeliveryOrder = async (orderId: number) => {
    try {
      loading.value = true;
      error.value = null;

      const order = await acceptJob(orderId);
      console.log('📦 Order accepted response:', order);

      // Buscar la orden completa en availableJobs
      const fullOrder = availableJobs.value.find((j) => j.id === orderId);
      console.log('📦 Full order from availableJobs:', fullOrder);

      // ASIGNAR CORRECTAMENTE activeOrder
      activeOrder.value = {
        id: orderId,
        pickup: fullOrder?.pickup || 'Sin dirección',
        dropoff: fullOrder?.dropoff || 'Sin dirección',
        amount: fullOrder?.amount || 0,
        status: 'accepted',
        restaurant: fullOrder?.restaurant || { name: 'Restaurante' },
        items: fullOrder?.items || [],
        distance: fullOrder?.distance || 2.5,
        estimatedTime: fullOrder?.estimatedTime || 15,
      };

      console.log('✅ activeOrder asignado:', activeOrder.value);

      // Eliminar de availableJobs
      availableJobs.value = availableJobs.value.filter((j) => j.id !== orderId);

      // También actualizar en el backend que ahora hay una orden activa
      // Esto no es necesario pero ayuda a mantener consistencia
    } catch (err: any) {
      error.value = err.message;
      console.error('Error accepting order:', err);
    } finally {
      loading.value = false;
    }
  };

  // Update status
  const updateStatus = async (orderId: number, status: string) => {
    try {
      loading.value = true;
      error.value = null;

      const updatedOrder = await updateOrderStatus(orderId, status);
      activeOrder.value = updatedOrder;

      if (status === 'delivered') {
        if (activeOrder.value) {
          completedOrders.value.push(activeOrder.value);
        }
        activeOrder.value = null;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Reset
  const $reset = () => {
    availability.value = { isOnline: false, totalOnlineHours: 0 };
    availableJobs.value = [];
    activeOrder.value = null;
    isOnline.value = false;
    completedOrders.value = [];
    loading.value = false;
    error.value = null;
  };

  return {
    availability,
    availableJobs,
    activeOrder,
    isOnline,
    completedOrders,
    loading,
    error,
    hasActiveOrder,
    isAvailable,
    initialize,
    toggleAvailability,
    loadAvailableJobs,
    acceptDeliveryOrder,
    updateStatus,
    $reset,
  };
});
