import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getRestaurant, getRestaurantMenu } from '../services/customer.service';
import type { Restaurant, MenuItem } from '../types';

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Record<number, Restaurant>>({});
  const loading = ref(false);
  const error = ref<string | null>(null);
  const offlineActions = ref<any[]>([]);

  const getRestaurantById = (id: number) => restaurants.value[id];

  const fetchRestaurant = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const restaurant = await getRestaurant(id);
      if (restaurant) {
        const menu = await getRestaurantMenu(id);
        restaurants.value[id] = {
          ...restaurant,
          menu: menu as MenuItem[],
        };
      } else {
        error.value = 'Restaurant not found';
      }
    } catch (err) {
      error.value = 'Error loading restaurant';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const refreshRestaurant = async (id: number) => {
    await fetchRestaurant(id);
  };

  const queueOfflineAction = (action: any) => {
    offlineActions.value.push(action);
    localStorage.setItem(
      'offlineActions',
      JSON.stringify(offlineActions.value),
    );
  };

  return {
    restaurants,
    loading,
    error,
    getRestaurantById,
    fetchRestaurant,
    refreshRestaurant,
    queueOfflineAction,
  };
});
