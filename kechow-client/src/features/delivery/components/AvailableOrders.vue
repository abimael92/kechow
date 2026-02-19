<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
      Pedidos disponibles
    </h2>
    <p v-if="!canAcceptOrders" class="text-sm text-yellow-600 dark:text-yellow-500">
      {{ hasActiveOrder ? 'Tienes un pedido activo' : 'Activa tu disponibilidad para recibir pedidos' }}
    </p>

    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="!availableOrders || availableOrders.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <p class="text-gray-500 dark:text-gray-400">No hay pedidos disponibles</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Los pedidos aparecerán cuando los restaurantes los marquen como listos</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="order in availableOrders"
        :key="order.id"
        class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-gray-900 dark:text-white">#{{ order.id }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {{ order.restaurant?.name || 'Restaurante' }} → {{ order.customer?.address || 'Dirección' }}
            </p>
            <p class="text-sm text-yellow-600 dark:text-yellow-500 mt-1 font-medium">
              ${{ formatPrice(order.amount) }} MXN • {{ order.distance || '—' }} km
            </p>
          </div>
          <button
            @click="handleAccept(order.id)"
            :disabled="!canAcceptOrders"
            class="flex-shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';
import { useDriverStore } from '../store/driver.store';

const driverStore = useDriverStore();
const { isOnline, hasActiveOrder, availableOrders, isLoading } = storeToRefs(driverStore);
const toast = useToast();

const canAcceptOrders = computed<boolean>(() => {
  return isOnline.value === true && hasActiveOrder.value === false;
});

function formatPrice(amount: number | undefined): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0.00';
  return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function handleAccept(orderId: string): Promise<void> {
  if (!canAcceptOrders.value) return;
  
  try {
    const result = await driverStore.acceptOrderAction(orderId) as { success: boolean; message?: string };
    if (result?.success) {
      toast.success('Pedido aceptado');
    } else {
      toast.error(result?.message || 'No se pudo aceptar el pedido');
    }
  } catch (error) {
    console.error('Error accepting order:', error);
    toast.error('Error al aceptar el pedido');
  }
}
</script>