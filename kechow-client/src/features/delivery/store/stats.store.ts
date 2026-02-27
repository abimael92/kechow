// src/features/delivery/store/stats.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getStats as getStatsApi } from '../services/driver.service';

interface Stats {
  todayOrders: number;
  earnings: number;
  rating: number;
  completed: number;
}

export const useStatsStore = defineStore('stats', () => {
  // State
  const todayOrders = ref<number>(0);
  const earnings = ref<number>(0);
  const rating = ref<number>(0);
  const completed = ref<number>(0);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const getStats = (): Stats => ({
    todayOrders: todayOrders.value,
    earnings: earnings.value,
    rating: rating.value,
    completed: completed.value,
  });

  // Actions
  async function fetchStats() {
    loading.value = true;
    error.value = null;

    try {
      const data = await getStatsApi();
      todayOrders.value = data.todayOrders ?? 0;
      earnings.value = data.earnings ?? 0;
      rating.value = data.rating ?? 0;
      completed.value = data.completed_deliveries ?? data.completed ?? 0;

      return getStats();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al cargar estadísticas';
      console.error('Error fetching stats:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Si necesitas actualizar estadísticas (raramente usado)
  async function updateStats(statsData: Partial<Stats>) {
    loading.value = true;
    error.value = null;

    try {
      // Aquí iría la llamada a un endpoint de actualización si existe
      // Por ahora solo actualizamos localmente
      if (statsData.todayOrders !== undefined)
        todayOrders.value = statsData.todayOrders;
      if (statsData.earnings !== undefined) earnings.value = statsData.earnings;
      if (statsData.rating !== undefined) rating.value = statsData.rating;
      if (statsData.completed !== undefined)
        completed.value = statsData.completed;

      return getStats();
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Error al actualizar estadísticas';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function resetStats() {
    todayOrders.value = 0;
    earnings.value = 0;
    rating.value = 0;
    completed.value = 0;
    error.value = null;
  }

  return {
    // State
    todayOrders,
    earnings,
    rating,
    completed,
    loading,
    error,

    // Getters
    getStats,

    // Actions
    fetchStats,
    updateStats,
    resetStats,
  };
});
