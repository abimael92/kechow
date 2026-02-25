<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <!-- Left: Driver Info -->
    <div class="flex items-center gap-3">
      <!-- Avatar -->
      <div class="relative">
        <div class="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
          <img 
            v-if="driver.avatar" 
            :src="driver.avatar" 
            :alt="driver.name"
            class="w-full h-full rounded-full object-cover"
          />
          <span v-else>{{ driver.name.charAt(0) }}</span>
        </div>
        <div 
          class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800"
          :class="statusColorClass"
        ></div>
      </div>
      
      <!-- Name and Status -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          {{ driver.name }}
        </h1>
        <div class="flex items-center gap-2 mt-1">
          <span 
            class="px-2 py-0.5 text-xs font-medium rounded-full"
            :class="statusBadgeClass"
          >
            {{ statusText }}
          </span>
          <span v-if="hasActiveOrder" class="text-xs text-gray-500 dark:text-gray-400">
            • {{ $t('delivery.active_order') }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Right: Status Toggle -->
    <div class="flex items-center gap-4">
      <!-- Earnings Today (Mobile) -->
      <div class="sm:hidden">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('delivery.today') }}</p>
        <p class="text-lg font-bold text-green-600">${{ formatEarnings(stats.earnings) }}</p>
      </div>
      
      <!-- Status Toggle -->
      <button
        role="switch"
        :aria-checked="isOnline"
        :disabled="hasActiveOrder"
        @click="$emit('toggle-status')"
        :class="[
          'relative inline-flex h-9 w-16 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
          hasActiveOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105',
        ]"
        :aria-label="isOnline ? $t('delivery.go_offline') : $t('delivery.go_online')"
      >
        <span
          :class="[
            'inline-block h-7 w-7 transform rounded-full bg-white shadow-lg transition-all duration-300',
            isOnline ? 'translate-x-8' : 'translate-x-1',
          ]"
        ></span>
      </button>
    </div>
  </div>
  
  <!-- Status Message -->
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
    {{ statusMessage }}
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DriverStatus } from '../types'

const props = defineProps<{
  driver: {
    name: string
    avatar?: string
    status: DriverStatus
    settings: any
  }
  isOnline: boolean
  hasActiveOrder: boolean
  stats?: {
    earnings: number
    todayOrders: number
  }
}>()

defineEmits<{
  (e: 'toggle-status'): void
}>()

const { t } = useI18n()

const statusColorClass = computed(() => {
  if (props.hasActiveOrder) return 'bg-blue-500'
  return props.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
})

const statusBadgeClass = computed(() => {
  if (props.hasActiveOrder) {
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  }
  return props.isOnline 
    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
})

const statusText = computed(() => {
  if (props.hasActiveOrder) return t('delivery.on_delivery')
  return props.isOnline ? t('delivery.online') : t('delivery.offline')
})

const statusMessage = computed(() => {
  if (props.hasActiveOrder) {
    return t('delivery.active_delivery_message')
  }
  return props.isOnline 
    ? t('delivery.ready_for_orders') 
    : t('delivery.offline_message')
})

const formatEarnings = (value: number) => {
  return value?.toLocaleString('es-MX', { minimumFractionDigits: 2 }) || '0'
}
</script>