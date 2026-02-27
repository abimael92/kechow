/**
 * Driver store: compatibility layer over delivery store and stats store.
 * Use useDeliveryStore() for new code. This keeps existing components working.
 */
import { computed } from 'vue';
import { useDeliveryStore } from './delivery.store';
import { useStatsStore } from './stats.store';

export function useDriverStore() {
  const s = useDeliveryStore();
  const statsStore = useStatsStore();
  const stats = computed(() => ({
    today: {
      deliveries: statsStore.todayOrders,
      earnings: statsStore.earnings,
    },
    rating: statsStore.rating,
  }));

  const currentOrder = computed(() => s.activeOrder);
  const availableOrders = computed(() => s.availableJobs);

  return {
    ...s,
    stats,
    currentOrder,
    availableOrders,
    toggleOnline: s.toggleAvailability,
    acceptOrder: s.acceptDeliveryOrder,
    acceptOrderAction: s.acceptDeliveryOrder,
    changeOrderStatus: (status: string) => {
      if (s.activeOrder) s.updateStatus(s.activeOrder.id, status);
    },
    updateStatus: s.updateStatus,
  };
}
