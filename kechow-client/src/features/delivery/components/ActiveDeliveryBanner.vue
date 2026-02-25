<template>
  <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
    <div class="p-5">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <i class="ri-truck-line text-white text-xl"></i>
          </div>
          <div>
            <h2 class="text-white font-semibold">{{ $t('delivery.current_delivery') }}</h2>
            <p class="text-blue-100 text-sm flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              {{ $t(`delivery.status.${order.status}`) }}
            </p>
          </div>
        </div>
        
        <span class="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
          #{{ order.orderNumber }}
        </span>
      </div>
      
      <!-- Progress -->
      <div class="mb-4">
        <div class="flex items-center justify-between text-xs text-blue-100 mb-1">
          <span>{{ $t('delivery.pickup') }}</span>
          <span>{{ $t('delivery.dropoff') }}</span>
        </div>
        <div class="relative">
          <div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              class="h-full bg-white rounded-full transition-all duration-500"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <div class="absolute top-0 left-0 w-full flex justify-between px-1">
            <div class="w-3 h-3 bg-white rounded-full -mt-0.5"></div>
            <div class="w-3 h-3 bg-white rounded-full -mt-0.5"></div>
          </div>
        </div>
      </div>
      
      <!-- Locations -->
      <div class="space-y-3 mb-4">
        <div class="flex items-start gap-2">
          <i class="ri-store-2-line text-white/80 mt-1"></i>
          <div class="flex-1">
            <p class="text-xs text-blue-100">{{ $t('delivery.pickup') }}:</p>
            <p class="text-white font-medium">{{ order.pickup.address }}</p>
          </div>
        </div>
        
        <div class="flex items-start gap-2">
          <i class="ri-map-pin-line text-white/80 mt-1"></i>
          <div class="flex-1">
            <p class="text-xs text-blue-100">{{ $t('delivery.dropoff') }}:</p>
            <p class="text-white font-medium">{{ order.dropoff.address }}</p>
          </div>
        </div>
      </div>
      
      <!-- Customer Info -->
      <div v-if="order.customerName" class="mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
        <div class="flex items-center gap-2">
          <i class="ri-user-line text-white/80"></i>
          <span class="text-white">{{ order.customerName }}</span>
          <span class="text-white/60 text-sm">{{ order.customerPhone }}</span>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button
          @click="$emit('view-details')"
          class="flex-1 bg-white/20 hover:bg-white/30 text-white font-medium py-3 rounded-lg transition-colors backdrop-blur-sm flex items-center justify-center gap-2"
        >
          <i class="ri-eye-line"></i>
          {{ $t('delivery.view_details') }}
        </button>
        
        <button
          @click="shareDelivery"
          class="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors backdrop-blur-sm flex items-center justify-center"
        >
          <i class="ri-share-line"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Order } from '../types'

const props = defineProps<{
  order: Order
}>()

defineEmits<{
  (e: 'view-details'): void
}>()

const progress = computed(() => {
  switch (props.order.status) {
    case 'accepted': return 25
    case 'picked_up': return 50
    case 'in_transit': return 75
    case 'delivered': return 100
    default: return 0
  }
})

const shareDelivery = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Entrega en curso',
      text: `Entregando pedido #${props.order.orderNumber}`,
      url: window.location.href
    })
  }
}
</script>