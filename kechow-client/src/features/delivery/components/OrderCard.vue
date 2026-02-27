<template>
  <div 
    class="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
    :class="{ 'opacity-75': loading }"
  >
    <!-- Order Header -->
    <div class="p-5">
      <div class="flex justify-between items-start mb-3">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <h3 class="font-semibold text-gray-900 dark:text-white">
              {{ order.restaurant.name }}
            </h3>
            <span class="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
              #{{ order.orderNumber }}
            </span>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1">
            <i class="ri-time-line"></i>
            {{ formatDistance(order.distance) }} • {{ order.estimatedTime }} min
          </p>
        </div>
        
        <!-- Amount -->
        <div class="text-right">
          <p class="text-xs text-gray-500">Ganancias</p>
          <p class="text-xl font-bold text-green-600">${{ formatAmount(order.amount, order.tip) }}</p>
          <p v-if="order.tip" class="text-xs text-green-500">
            +${{ order.tip }} propina
          </p>
        </div>
      </div>
      
      <!-- Locations -->
      <div class="space-y-3 mb-4">
        <!-- Pickup -->
        <div class="flex items-start gap-2">
          <div class="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="ri-store-2-line text-orange-600 dark:text-orange-400 text-xs"></i>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500">Recogida:</p>
            <p class="text-sm text-gray-800 dark:text-gray-200">{{ order.pickup.address }}</p>
          </div>
        </div>
        
        <!-- Arrow -->
        <div class="flex items-center ml-2">
          <div class="w-6 flex justify-center">
            <i class="ri-arrow-down-line text-gray-400"></i>
          </div>
        </div>
        
        <!-- Dropoff -->
        <div class="flex items-start gap-2">
          <div class="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <i class="ri-map-pin-line text-green-600 dark:text-green-400 text-xs"></i>
          </div>
          <div class="flex-1">
            <p class="text-xs text-gray-500">Entrega:</p>
            <p class="text-sm text-gray-800 dark:text-gray-200">{{ order.dropoff.address }}</p>
          </div>
        </div>
      </div>
      
      <!-- Items Preview -->
      <div v-if="order.items?.length" class="mb-4">
        <p class="text-xs text-gray-500 mb-2">Artículos:</p>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="item in order.items.slice(0, 3)"
            :key="item.id"
            class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-700 dark:text-gray-300"
          >
            {{ item.quantity }}x {{ item.name }}
          </span>
          <span 
            v-if="order.items.length > 3" 
            class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-500"
          >
            +{{ order.items.length - 3 }} más
          </span>
        </div>
      </div>
      
      <!-- Special Instructions -->
      <div 
        v-if="order.specialInstructions" 
        class="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
      >
        <p class="text-xs text-yellow-800 dark:text-yellow-200 flex items-center gap-1">
          <i class="ri-information-line"></i>
          {{ order.specialInstructions }}
        </p>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          @click="$emit('view', order)"
          class="flex-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <i class="ri-eye-line mr-1"></i>
          Ver
        </button>
        
        <button
          @click="$emit('accept', order.id)"
          :disabled="loading"
          class="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
        >
          <i class="ri-check-line"></i>
          Aceptar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '../types'

const props = defineProps<{
  order: Order
  loading?: boolean
}>()

defineEmits<{
  (e: 'accept', orderId: number): void
  (e: 'view', order: Order): void
}>()

const formatDistance = (distance?: number) => {
  if (!distance) return '? km'
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`
}

const formatAmount = (amount: number, tip?: number) => {
  const total = amount + (tip || 0)
  return total.toFixed(2)
}
</script>