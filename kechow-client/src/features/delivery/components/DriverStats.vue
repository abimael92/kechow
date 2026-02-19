<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Entregas hoy</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.today?.deliveries || 0 }}</p>
        </div>
        <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <i class="ri-bike-line text-blue-600 dark:text-blue-400"></i>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ganancias hoy</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">${{ formatEarnings(stats?.today?.earnings || 0) }}</p>
        </div>
        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <i class="ri-money-dollar-circle-line text-green-600 dark:text-green-400"></i>
        </div>
      </div>
    </div>
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Calificación</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats?.rating || 5.0 }} ⭐</p>
        </div>
        <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
          <i class="ri-star-line text-yellow-600 dark:text-yellow-400"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDriverStore } from '../store/driver.store';

const driverStore = useDriverStore();
const { stats } = storeToRefs(driverStore);

function formatEarnings(amount: number): string {
  return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
</script>