<template>
	<div class="p-6 space-y-6">
		<!-- Header -->
		<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
			<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
				<i class="ri-bike-line text-white text-lg sm:text-xl md:text-2xl"></i>
			</div>
			<div class="min-w-0 flex-1">
				<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Pedidos
				</h1>
				<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
					Gestiona tus entregas y haz seguimiento
				</p>
			</div>
		</div>

		<!-- Tabs -->
		<div class="sticky top-0 z-10 py-3 px-4 shadow-sm">
			<div class="flex gap-3 overflow-x-auto hide-scrollbar">
				<button
					v-for="(tab, i) in tabs"
					:key="i"
					@click="activeTab = i"
					class="relative px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 flex-shrink-0 transition-colors"
					:class="{
						'bg-green-100 text-green-800': tab.key === 'completed' && activeTab === i,
						'bg-blue-100 text-blue-800': tab.key === 'active' && activeTab === i,
						'bg-orange-100 text-orange-800': tab.key === 'available' && activeTab === i,
						'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800': activeTab !== i,
					}"
				>
					<i :class="getTabIcon(tab.key)" class="w-6 h-6 text-xl"></i>
					{{ tab.label }} ({{ tabCount(tab.key) }})
					<span
						v-if="activeTab === i"
						class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 m-1 rounded-full bg-current transition-all"
					></span>
				</button>
			</div>
		</div>

		<!-- Orders Summary (when online) -->
		<div
			v-if="deliveryStore.isOnline"
			class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center"
		>
			<div class="flex items-center space-x-3 mb-3 md:mb-0">
				<i class="ri-notification-line text-blue-600 dark:text-blue-400 w-5 h-5 flex items-center justify-center"></i>
				<div>
					<p class="font-medium text-blue-900 dark:text-blue-200">{{ ordersSummary.title }}</p>
					<p class="text-sm text-blue-700 dark:text-blue-300">{{ ordersSummary.subtitle }}</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-sm text-blue-600 dark:text-blue-400">Distancia promedio</p>
				<p class="font-semibold text-blue-900 dark:text-blue-200">{{ ordersSummary.avgDistance }}</p>
				<p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
					Ganancias potenciales: ${{ ordersSummary.totalEarnings }}
				</p>
			</div>
		</div>
		<div v-else class="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-4 text-center text-neutral-600 dark:text-neutral-400 text-sm">
			Activa tu disponibilidad en el panel para ver pedidos disponibles.
		</div>

		<!-- Orders List -->
		<div class="space-y-4">
			<div
				v-for="order in filteredOrders"
				:key="order.id"
				class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
			>
				<!-- Order Header -->
				<div class="p-4 border-b border-gray-100 flex justify-between items-start">
					<div class="flex-1">
						<div class="flex items-center space-x-2 mb-1">
							<h4 class="font-bold text-lg text-gray-900">
								{{ order.number }}
							</h4>
							<span
								class="px-2 py-1 rounded-full text-xs font-medium"
								:class="{
									'bg-green-100 text-green-800': order.status === 'completed',
									'bg-blue-100 text-blue-800': order.status === 'active',
									'bg-orange-100 text-orange-800': order.status === 'available',
								}"
							>
								{{ order.statusLabel }}
							</span>
						</div>
						<p class="text-gray-600 font-medium">{{ order.restaurant }}</p>
						<p class="text-sm text-gray-500">
							Para {{ order.customer }}
						</p>
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold text-green-600">${{ order.amount }}</p>
						<p class="text-sm text-gray-500">
							{{ order.items }} artículos
						</p>
						<p class="text-xs text-gray-400">{{ order.paymentMethod }}</p>
					</div>
				</div>

				<!-- Order Details -->
				<div class="p-4">
					<div class="flex items-center justify-between text-sm mb-4">
						<div class="flex items-center space-x-4">
							<div class="flex items-center text-gray-600">
								<i class="ri-map-pin-distance-line mr-1 w-4 h-4 flex items-center justify-center"></i>
								<span>{{ order.distance }}</span>
							</div>
							<div class="flex items-center text-gray-600">
								<i class="ri-time-line mr-1 w-4 h-4 flex items-center justify-center"></i>
								<span>{{ order.eta }}</span>
							</div>
						</div>
						<button @click="toggleExpand(order.id)">
							<i class="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"></i>
						</button>
					</div>

					<div v-if="isExpanded(order.id)" class="space-y-3 mb-4">
						<!-- Pickup -->
						<div class="flex items-start space-x-3">
							<div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
								<i class="ri-store-2-line text-orange-600 text-xs w-3 h-3 flex items-center justify-center"></i>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900">Recogida</p>
								<p class="text-sm text-gray-600 truncate">{{ order.pickup }}</p>
							</div>
						</div>

						<div class="flex items-center justify-center">
							<div class="w-6 border-t border-dashed border-gray-300"></div>
						</div>

						<!-- Drop-off -->
						<div class="flex items-start space-x-3">
							<div class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
								<i class="ri-map-pin-line text-blue-600 text-xs w-3 h-3 flex items-center justify-center"></i>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900">Entrega</p>
								<p class="text-sm text-gray-600 truncate">{{ order.dropoff }}</p>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div v-if="order.status === 'available'" class="flex flex-col sm:flex-row gap-2 mt-4">
						<button
							@click="handleAcceptOrder(order.id)"
							:disabled="deliveryStore.hasActiveOrder"
							class="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-400 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Aceptar pedido
						</button>
						<button
							@click="handleRejectOrder(order.id)"
							class="flex-1 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-800 transition-colors whitespace-nowrap text-white"
						>
							Rechazar
						</button>
					</div>
					<div v-else-if="order.status === 'active'" class="flex flex-col sm:flex-row gap-2 mt-4">
						<button
							@click="router.push(`/delivery/live/${order.id}`)"
							class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors whitespace-nowrap"
						>
							Ver entrega
						</button>
					</div>
				</div>
			</div>
			<div v-if="filteredOrders.length === 0" class="text-center py-12 text-gray-500 dark:text-gray-400">
				<i class="ri-inbox-line text-4xl mb-2"></i>
				<p>{{ emptyMessage }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDeliveryStore } from '../store/delivery.store';

type TabKey = 'available' | 'active' | 'completed';
type OrderStatus = 'available' | 'active' | 'completed';

interface Tab {
	label: string;
	key: TabKey;
}

interface Order {
	id: string;
	number: string;
	restaurant: string;
	customer: string;
	amount: string;
	items: number;
	paymentMethod: string;
	distance: string;
	eta: string;
	pickup: string;
	dropoff: string;
	status: OrderStatus;
	statusLabel: string;
}

interface OrdersSummary {
	title: string;
	subtitle: string;
	avgDistance: string;
	totalEarnings: string;
}

const router = useRouter();
const deliveryStore = useDeliveryStore();

// Tabs
const tabs = ref<Tab[]>([
	{ label: 'Disponibles', key: 'available' },
	{ label: 'Activos', key: 'active' },
	{ label: 'Completados', key: 'completed' },
]);
const activeTab = ref<number>(0);

// Data from store - CORREGIDO para usar las propiedades correctas del store
const availableOrders = computed<Order[]>(() => 
	deliveryStore.availableJobs?.map((job: any) => ({
		id: String(job.id || ''),
		number: `#${job.id || ''}`,
		restaurant: job.pickup?.split(',')[0] || 'Restaurante',
		customer: job.dropoff?.split(',')[0] || 'Cliente',
		amount: job.amount?.toFixed(2) || '0.00',
		items: job.items?.length || 1,
		paymentMethod: 'Tarjeta',
		distance: job.distance ? `${job.distance} km` : '2.5 km',
		eta: job.estimatedTime ? `${job.estimatedTime} min` : '15 min',
		pickup: job.pickup || 'Dirección de recogida',
		dropoff: job.dropoff || 'Dirección de entrega',
		status: 'available' as const,
		statusLabel: 'Disponible',
	})) || []
);

const activeOrders = computed<Order[]>(() => {
	const order = deliveryStore.activeOrder;
	if (!order) return [];
	return [{
		id: String(order.id || ''),
		number: `#${order.id || ''}`,
		restaurant: order.pickup?.split(',')[0] || 'Restaurante',
		customer: order.dropoff?.split(',')[0] || 'Cliente',
		amount: order.amount?.toFixed(2) || '0.00',
		items: order.items?.length || 1,
		paymentMethod: 'Tarjeta',
		distance: order.distance ? `${order.distance} km` : '2.5 km',
		eta: order.estimatedTime ? `${order.estimatedTime} min` : '15 min',
		pickup: order.pickup || 'Dirección de recogida',
		dropoff: order.dropoff || 'Dirección de entrega',
		status: 'active' as const,
		statusLabel: 'Activo',
	}];
});

const completedOrdersList = computed<Order[]>(() => 
	deliveryStore.completedOrders?.map((order: any) => ({
		id: String(order.id || ''),
		number: `#${order.id || ''}`,
		restaurant: order.pickup?.split(',')[0] || 'Restaurante',
		customer: order.dropoff?.split(',')[0] || 'Cliente',
		amount: order.amount?.toFixed(2) || '0.00',
		items: order.items?.length || 1,
		paymentMethod: 'Tarjeta',
		distance: order.distance ? `${order.distance} km` : '2.5 km',
		eta: order.estimatedTime ? `${order.estimatedTime} min` : '15 min',
		pickup: order.pickup || 'Dirección de recogida',
		dropoff: order.dropoff || 'Dirección de entrega',
		status: 'completed' as const,
		statusLabel: 'Completado',
	})) || []
);

const filteredOrders = computed<Order[]>(() => {
	const key = tabs.value[activeTab.value].key;
	if (key === 'available') return availableOrders.value;
	if (key === 'active') return activeOrders.value;
	return completedOrdersList.value;
});

const tabCount = (key: TabKey): number => {
	if (key === 'available') return availableOrders.value.length;
	if (key === 'active') return activeOrders.value.length;
	return completedOrdersList.value.length;
};

const emptyMessage = computed<string>(() => {
	const key = tabs.value[activeTab.value].key;
	if (key === 'available') return 'No hay pedidos disponibles. Activa el modo en línea para ver pedidos.';
	if (key === 'active') return 'No tienes entregas activas.';
	return 'No hay entregas completadas aún.';
});

// Orders summary
const ordersSummary = computed<OrdersSummary>(() => {
	const available = deliveryStore.availableJobs || [];
	const totalEarnings = available.reduce((sum: number, job: any) => sum + (job.amount || 0), 0);
	const avgDist = available.length 
		? (available.reduce((s: number, job: any) => s + (job.distance || 2.5), 0) / available.length).toFixed(1) 
		: '0';
	return {
		title: `${available.length} pedido${available.length !== 1 ? 's' : ''} disponible${available.length !== 1 ? 's' : ''}`,
		subtitle: 'Ganancias potenciales',
		avgDistance: `${avgDist} km`,
		totalEarnings: totalEarnings.toFixed(2),
	};
});

// Show more / less
const expandedOrders = ref<Set<string>>(new Set<string>());
const toggleExpand = (orderId: string): void => {
	if (expandedOrders.value.has(orderId)) {
		expandedOrders.value.delete(orderId);
	} else {
		expandedOrders.value.add(orderId);
	}
};
const isExpanded = (orderId: string): boolean => expandedOrders.value.has(orderId);

// Tab icons
const getTabIcon = (key: TabKey): string => {
	if (key === 'available') return 'ri-store-line';
	if (key === 'active') return 'ri-motorbike-line';
	return 'ri-check-line';
};

// Order actions
const handleAcceptOrder = async (orderId: string): Promise<void> => {
	try {
		await deliveryStore.acceptDeliveryOrder(Number(orderId));
		router.push(`/delivery/live/${orderId}`);
	} catch (e) {
		console.error('Accept order failed', e);
	}
};

const handleRejectOrder = async (orderId: string): Promise<void> => {
	try {
		// Implementar si existe en el store
		console.log('Reject order', orderId);
	} catch (e) {
		console.error('Reject order failed', e);
	}
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
	display: none;
}
.hide-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>