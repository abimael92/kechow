<template>
		<div class="space-y-6 mb-4">
		<!-- Header Section -->
            <div class="flex items-center gap-3 space-y-2 ">
                <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
                    <i class="ri-shopping-cart-line text-white text-lg sm:text-xl md:text-2xl"></i>
                </div>
                <div>
                    <h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Tablero de repartidor
					</h1>
                  	<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
						{{ driverStore.isOnline ? 'Listo para recibir pedidos' : 'Activa tu disponibilidad' }}
						
                    </p>
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
