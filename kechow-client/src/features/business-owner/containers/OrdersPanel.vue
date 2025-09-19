<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">{{ $t('orders') }}</h1>
				<p class="text-black font-thin text-lg mt-1">
					{{ $t('manageTrackOrders') }}
				</p>
			</div>
			<div class="flex space-x-3">
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-filter-line mr-2 w-4 h-4 flex items-center justify-center"
					></i>
					{{ $t('filter') }}
				</button>
				<button
					class="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-refresh-line mr-2 w-4 h-4 flex items-center justify-center"
					></i>
					{{ $t('refresh') }}
				</button>
			</div>
		</div>

		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
			<div class="flex space-x-2 overflow-x-auto">
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap bg-orange-100 text-orange-600"
				>
					{{ $t('allOrders') }}
					<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>5</span
					>
				</button>
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap text-gray-600 hover:bg-gray-50"
				>
					{{ $t('new') }}
					<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>1</span
					>
				</button>
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap text-gray-600 hover:bg-gray-50"
				>
					{{ $t('preparing') }}
					<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>2</span
					>
				</button>
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap text-gray-600 hover:bg-gray-50"
				>
					{{ $t('ready') }}
					<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>1</span
					>
				</button>
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap text-gray-600 hover:bg-gray-50"
				>
					{{ $t('delivered') }}
					<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>1</span
					>
				</button>
			</div>
		</div>

		<div class="space-y-4">
			<OrderCard
				v-for="order in orders"
				:key="order.id"
				:order="order"
				@update-status="handleStatusUpdate"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import OrderCard from '../components/OrderCard.vue';
import {
	fetchOrders,
	updateOrderStatus,
} from '../services/businessOwner.service';
import type { Order } from '../types/';

const orders = ref<Order[]>([]);
const loading = ref(false);

const loadOrders = async () => {
	try {
		loading.value = true;
		orders.value = await fetchOrders();
	} catch (error) {
		console.error('Failed to load orders:', error);
	} finally {
		loading.value = false;
	}
};

const handleStatusUpdate = async (orderId: string, newStatus: string) => {
	try {
		await updateOrderStatus(orderId, newStatus);
		await loadOrders();
	} catch (error) {
		console.error('Failed to update order status:', error);
	}
};

onMounted(() => {
	loadOrders();
});
</script>
