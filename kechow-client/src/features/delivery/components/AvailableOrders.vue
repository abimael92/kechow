<template>
	<div class="space-y-4">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white">
			Pedidos disponibles
		</h2>
		<p v-if="!driverStore.canAcceptOrders" class="text-sm text-driver-warning-500">
			{{ driverStore.hasActiveOrder ? 'Tienes un pedido activo' : 'Activa tu disponibilidad para recibir pedidos' }}
		</p>

		<div v-if="driverStore.isLoading" class="flex justify-center py-8">
			<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-driver-primary-500"></div>
		</div>

		<div v-else-if="driverStore.availableOrders.length === 0" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
			<p class="text-gray-500 dark:text-gray-400">No hay pedidos disponibles</p>
			<p class="text-sm text-gray-400 dark:text-gray-500 mt-1">Los pedidos aparecerán cuando los restaurantes los marquen como listos</p>
		</div>

		<div v-else class="space-y-3">
			<div
				v-for="order in driverStore.availableOrders"
				:key="order.id"
				class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
			>
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div class="flex-1 min-w-0">
						<h3 class="font-bold text-gray-900 dark:text-white">#{{ order.id }}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
							{{ order.restaurant.name }} → {{ order.customer.address }}
						</p>
						<p class="text-sm text-driver-warning-500 mt-1 font-medium">
							${{ formatPrice(order.amount) }} MXN • {{ order.distance || '—' }} km
						</p>
					</div>
					<button
						@click="handleAccept(order.id)"
						:disabled="!driverStore.canAcceptOrders"
						class="flex-shrink-0 min-h-[44px] px-4 py-2 rounded-xl bg-driver-primary-500 hover:bg-driver-primary-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Aceptar
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDriverStore } from '../store/useDriverStore';
import { useToast } from 'vue-toastification';

const driverStore = useDriverStore();
const { canAcceptOrders, hasActiveOrder } = storeToRefs(driverStore);
const toast = useToast();

function formatPrice(n: number) {
	return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function handleAccept(orderId: string) {
	const result = await driverStore.acceptOrderAction(orderId);
	if (result.success) {
		toast.success('Pedido aceptado');
	} else if (result.message) {
		toast.warning(result.message);
	}
}
</script>
