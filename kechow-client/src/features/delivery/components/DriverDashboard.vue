<template>
	<div class="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
			<div>
				<h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
					Tablero de repartidor
				</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">
					{{ driverStore.isOnline ? 'Listo para recibir pedidos' : 'Activa tu disponibilidad' }}
				</p>
			</div>

			<!-- Online toggle -->
			<div class="flex items-center gap-4">
				<span
					:class="[
						'text-sm font-medium',
						driverStore.isOnline ? 'text-driver-success-500' : 'text-gray-500 dark:text-gray-400',
					]"
				>
					{{ driverStore.isOnline ? 'En línea' : 'Desconectado' }}
				</span>
				<button
					role="switch"
					:aria-checked="driverStore.isOnline"
					:disabled="driverStore.hasActiveOrder"
					@click="driverStore.toggleOnline()"
					:class="[
						'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-driver-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
						driverStore.isOnline ? 'bg-driver-success-500' : 'bg-gray-300 dark:bg-gray-600',
						driverStore.hasActiveOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
					]"
				>
					<span
						:class="[
							'inline-block h-6 w-6 transform rounded-full bg-white shadow transition',
							driverStore.isOnline ? 'translate-x-7' : 'translate-x-1',
						]"
					></span>
				</button>
			</div>
		</div>

		<!-- Stats -->
		<DriverStats />

		<!-- Main content: grid for tablet/desktop -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Current delivery -->
			<div class="order-2 lg:order-1">
				<CurrentDelivery />
			</div>

			<!-- Available orders -->
			<div class="order-1 lg:order-2">
				<AvailableOrders />
			</div>
		</div>

		<!-- Offline banner -->
		<div
			v-if="!driverStore.isNetworkOnline"
			class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm p-4 rounded-xl bg-driver-warning-500 text-white shadow-lg z-50"
		>
			<p class="font-medium">Sin conexión</p>
			<p class="text-sm opacity-90">Las acciones se guardarán cuando vuelvas a tener conexión</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useDriverStore } from '../store/useDriverStore';
import { useDriverLocation } from '../composables/useDriverLocation';
import AvailableOrders from './AvailableOrders.vue';
import CurrentDelivery from './CurrentDelivery.vue';
import DriverStats from './DriverStats.vue';

const driverStore = useDriverStore();
useDriverLocation();

onMounted(async () => {
	await driverStore.initialize();
});

onUnmounted(() => {
	driverStore.stopAutoRefresh();
});
</script>
