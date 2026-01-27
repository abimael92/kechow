<template>
	<div class="p-6 space-y-6">
		<!-- Header -->
		<div>
			<h1 class="text-2xl font-bold text-gray-900">{{ $t('orders') }}</h1>
			<p class="text-gray-600 mt-1">{{ $t('manageDeliveries') }}</p>
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
						'bg-green-100 text-green-800':
							tab.key === 'completed' && activeTab === i,
						'bg-blue-100 text-blue-800':
							tab.key === 'active' && activeTab === i,
						'bg-orange-100 text-orange-800':
							tab.key === 'available' && activeTab === i,
						'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800':
							activeTab !== i,
					}"
				>
					<i :class="getTabIcon(tab.key)" class="w-6 h-6 text-xl"></i>
					{{ $t(tab.label) }} ({{ tabCount(tab.key) }})
					<span
						v-if="activeTab === i"
						class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-2 m-1 rounded-full bg-current transition-all"
					></span>
				</button>
			</div>
		</div>

		<!-- Orders Summary -->
		<div
			class="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center"
		>
			<div class="flex items-center space-x-3 mb-3 md:mb-0">
				<i
					class="ri-notification-line text-blue-600 w-5 h-5 flex items-center justify-center"
				></i>
				<div>
					<p class="font-medium text-blue-900">{{ $t(ordersSummary.title) }}</p>
					<p class="text-sm text-blue-700">{{ $t(ordersSummary.subtitle) }}</p>
				</div>
			</div>
			<div class="text-right">
				<p class="text-sm text-blue-600">{{ $t('avgDistance') }}</p>
				<p class="font-semibold text-blue-900">
					{{ ordersSummary.avgDistance }}
				</p>
				<p class="text-xs text-blue-700 mt-1">
					{{ $t('potentialEarnings') }}: ${{ ordersSummary.totalEarnings }}
				</p>
			</div>
		</div>

		<!-- Orders List -->
		<div class="space-y-4">
			<div
				v-for="order in filteredOrders"
				:key="order.id"
				class="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
			>
				<!-- Order Header -->
				<div
					class="p-4 border-b border-gray-100 flex justify-between items-start"
				>
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
							{{ $t('to') }} {{ order.customer }}
						</p>
					</div>
					<div class="text-right">
						<p class="text-2xl font-bold text-green-600">${{ order.amount }}</p>
						<p class="text-sm text-gray-500">
							{{ order.items }} {{ $t('items') }}
						</p>
						<p class="text-xs text-gray-400">{{ order.paymentMethod }}</p>
					</div>
				</div>

				<!-- Order Details -->
				<div class="p-4">
					<div class="flex items-center justify-between text-sm mb-4">
						<div class="flex items-center space-x-4">
							<div class="flex items-center text-gray-600">
								<i
									class="ri-map-pin-distance-line mr-1 w-4 h-4 flex items-center justify-center"
								></i>
								<span>{{ order.distance }}</span>
							</div>
							<div class="flex items-center text-gray-600">
								<i
									class="ri-time-line mr-1 w-4 h-4 flex items-center justify-center"
								></i>
								<span>{{ order.eta }}</span>
							</div>
						</div>
						<button @click="toggleExpand(order.id)">
							<i
								class="ri-arrow-down-s-line w-4 h-4 flex items-center justify-center"
							></i>
						</button>
					</div>

					<div v-if="isExpanded(order.id)" class="space-y-3 mb-4">
						<!-- Pickup -->
						<div class="flex items-start space-x-3">
							<div
								class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5"
							>
								<i
									class="ri-store-2-line text-orange-600 text-xs w-3 h-3 flex items-center justify-center"
								></i>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900">
									{{ $t('pickup') }}
								</p>
								<p class="text-sm text-gray-600 truncate">{{ order.pickup }}</p>
							</div>
						</div>

						<div class="flex items-center justify-center">
							<div class="w-6 border-t border-dashed border-gray-300"></div>
						</div>

						<!-- Drop-off -->
						<div class="flex items-start space-x-3">
							<div
								class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5"
							>
								<i
									class="ri-map-pin-line text-blue-600 text-xs w-3 h-3 flex items-center justify-center"
								></i>
							</div>
							<div class="flex-1 min-w-0">
								<p class="text-sm font-medium text-gray-900">
									{{ $t('dropoff') }}
								</p>
								<p class="text-sm text-gray-600 truncate">
									{{ order.dropoff }}
								</p>
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
							{{ $t('acceptOrder') }}
						</button>
						<button
							@click="handleRejectOrder(order.id)"
							class="flex-1 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-800 transition-colors whitespace-nowrap text-white"
						>
							{{ $t('decline') }}
						</button>
					</div>
					<div v-else-if="order.status === 'active'" class="flex flex-col sm:flex-row gap-2 mt-4">
						<button
							@click="router.push(`/delivery/live/${order.id}`)"
							class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-400 transition-colors whitespace-nowrap"
						>
							{{ $t('viewDelivery') }}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDeliveryStore } from '../store/delivery.store';

const router = useRouter();
const deliveryStore = useDeliveryStore();

// Tabs
const tabs = ref([
	{ label: 'available', key: 'available' },
	{ label: 'active', key: 'active' },
	{ label: 'completed', key: 'completed' },
]);
const activeTab = ref(0);

// Orders
const orders = ref([
	{
		id: 1,
		number: '#12348',
		restaurant: 'Spice Garden',
		customer: 'Sarah Wilson',
		amount: 19.25,
		items: 2,
		paymentMethod: 'Card',
		distance: '2.5 km',
		eta: '28 min',
		pickup: '111 Spice St',
		dropoff: '222 Flavor Ave',
		status: 'available',
		statusLabel: 'Available',
	},
	{
		id: 2,
		number: '#12349',
		restaurant: 'Mario’s Pizza',
		customer: 'John Doe',
		amount: 15.5,
		items: 3,
		paymentMethod: 'Cash',
		distance: '3 km',
		eta: '35 min',
		pickup: '456 Pizza St',
		dropoff: '789 Home Ave',
		status: 'active',
		statusLabel: 'Picked Up',
	},
	{
		id: 3,
		number: '#12350',
		restaurant: 'Burger Hub',
		customer: 'Jane Smith',
		amount: 22.0,
		items: 2,
		paymentMethod: 'Card',
		distance: '4 km',
		eta: '40 min',
		pickup: '321 Burger St',
		dropoff: '654 Customer Ave',
		status: 'completed',
		statusLabel: 'Delivered',
	},
]);

// Tab counts & filtered orders
const filteredOrders = computed(() => {
	const key = tabs.value[activeTab.value].key;
	return orders.value.filter((order) => order.status === key);
});
const tabCount = (key: string) =>
	orders.value.filter((o) => o.status === key).length;

// Orders summary
const ordersSummary = ref({
	title: 'ordersWaitingPickup',
	subtitle: 'potentialEarnings',
	avgDistance: '2.4 km',
	totalEarnings: 56.75,
});
const summary = ref({
	deliveries: 3,
	earnings: 56.75,
	distance: '9.5 km',
	avgRating: 4.9,
});

// Show more / less
const expandedOrders = ref(new Set<number>());
const toggleExpand = (orderId: number) => {
	if (expandedOrders.value.has(orderId)) expandedOrders.value.delete(orderId);
	else expandedOrders.value.add(orderId);
};
const isExpanded = (orderId: number) => expandedOrders.value.has(orderId);

// Tab icons
const getTabIcon = (key: string) => {
	if (key === 'available') return 'ri-store-line';
	if (key === 'active') return 'ri-motorbike-line';
	if (key === 'completed') return 'ri-check-line';
	return '';
};

// Order actions
const handleAcceptOrder = (orderId: number) => {
	const order = orders.value.find(o => o.id === orderId);
	if (order) {
		order.status = 'active';
		order.statusLabel = 'Picked Up';
	}
};

const handleRejectOrder = (orderId: number) => {
	orders.value = orders.value.filter(o => o.id !== orderId);
};
</script>

<style>
.hide-scrollbar::-webkit-scrollbar {
	display: none;
}
.hide-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
