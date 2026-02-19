<template>
  <div v-if="currentOrder" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-900 dark:text-white">Entrega actual</h3>
      <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
        En progreso
      </span>
    </div>
    <div class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <i class="ri-store-2-line text-orange-600 dark:text-orange-400"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Recoger en</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ currentOrder.restaurant?.name || 'Restaurante' }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <i class="ri-map-pin-line text-green-600 dark:text-green-400"></i>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Entregar en</p>
          <p class="font-medium text-gray-900 dark:text-white">{{ currentOrder.customer?.name || 'Cliente' }}</p>
          <p class="text-xs text-gray-500">{{ currentOrder.customer?.address }}</p>
        </div>
      </div>
      <button class="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Ver detalles
      </button>
    </div>
  </div>
  <div v-else class="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
    <p class="text-gray-500 dark:text-gray-400">No hay entrega activa</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDriverStore } from '../store/driver.store';

const driverStore = useDriverStore();
const { currentOrder } = storeToRefs(driverStore);
</script>