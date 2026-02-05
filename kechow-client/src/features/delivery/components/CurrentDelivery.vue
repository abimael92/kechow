<template>
	<div v-if="driverStore.currentOrder" class="space-y-6">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white">
			Pedido actual
		</h2>

		<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
			<div class="flex justify-between items-start">
				<div>
					<h3 class="font-bold text-lg text-gray-900 dark:text-white">#{{ driverStore.currentOrder.id }}</h3>
					<p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
						{{ driverStore.currentOrder.restaurant.name }} → {{ driverStore.currentOrder.customer.name }}
					</p>
				</div>
				<p class="text-lg font-bold text-driver-success-500">
					${{ formatPrice(driverStore.currentOrder.amount + driverStore.currentOrder.fee) }} MXN
				</p>
			</div>

			<!-- Items -->
			<div>
				<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Artículos</p>
				<ul class="space-y-1 text-sm text-gray-600 dark:text-gray-400">
					<li v-for="item in driverStore.currentOrder.items" :key="item.id">
						{{ item.name }} x{{ item.quantity }}
					</li>
				</ul>
			</div>

			<!-- Address -->
			<div>
				<p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección de entrega</p>
				<p class="text-gray-900 dark:text-white">{{ driverStore.currentOrder.customer.address }}</p>
				<p v-if="driverStore.currentOrder.delivery_notes" class="text-sm text-driver-warning-500 mt-1">
					Notas: {{ driverStore.currentOrder.delivery_notes }}
				</p>
			</div>

			<!-- Actions -->
			<div class="flex flex-col sm:flex-row gap-3 pt-4">
				<a
					:href="`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(driverStore.currentOrder.customer.address)}`"
					target="_blank"
					rel="noopener noreferrer"
					class="flex-1 min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-driver-primary-500 hover:bg-driver-primary-600 text-white font-semibold transition-colors"
				>
					<i class="ri-map-pin-line text-xl"></i>
					Abrir en Maps
				</a>
				<a
					:href="`tel:${driverStore.currentOrder.customer.phone}`"
					class="min-h-[44px] flex items-center justify-center gap-2 px-6 rounded-xl border border-driver-primary-500 text-driver-primary-500 hover:bg-driver-primary-50 dark:hover:bg-driver-primary-900/20 font-semibold transition-colors"
				>
					<i class="ri-phone-line text-xl"></i>
					Llamar
				</a>
			</div>

			<!-- Delivery buttons -->
			<div class="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
				<button
					@click="handleStart"
					class="w-full min-h-[44px] py-3 rounded-xl bg-driver-success-500 hover:bg-driver-success-600 text-white font-semibold transition-colors"
				>
					Iniciar entrega
				</button>
				<button
					@click="handleComplete"
					class="w-full min-h-[44px] py-3 rounded-xl bg-driver-primary-500 hover:bg-driver-primary-600 text-white font-semibold transition-colors"
				>
					Marcar como entregado
				</button>
			</div>
		</div>
	</div>
	<div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
		<i class="ri-inbox-line text-4xl text-gray-400 dark:text-gray-500"></i>
		<p class="text-gray-500 dark:text-gray-400 mt-2">No tienes un pedido activo</p>
	</div>
</template>

<script setup lang="ts">
import { useDriverStore } from '../store/useDriverStore';
import { useToast } from 'vue-toastification';

const driverStore = useDriverStore();
const toast = useToast();

function formatPrice(n: number) {
	return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function handleStart() {
	if (!driverStore.currentOrder) return;
	const result = await driverStore.startDeliveryAction(driverStore.currentOrder.id);
	if (result.success) {
		toast.success('Entrega iniciada');
	} else if (result.message) {
		toast.warning(result.message);
	}
}

async function handleComplete() {
	if (!driverStore.currentOrder) return;
	const result = await driverStore.completeDeliveryAction(driverStore.currentOrder.id);
	if (result.success) {
		toast.success('¡Entrega completada!');
	} else if (result.message) {
		toast.warning(result.message);
	}
}
</script>
