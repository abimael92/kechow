<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-6">Orders</h1>

		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
						>
							Order #
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
						>
							Customer
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
						>
							Status
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
						>
							Total
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
						>
							Actions
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr v-for="order in orders" :key="order.id">
						<td class="px-6 py-4 whitespace-nowrap">{{ order.id }}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							{{ order.customer_name }}
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								:class="statusClasses(order.status)"
								class="px-2 py-1 rounded-full text-xs"
							>
								{{ order.status }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">${{ order.total }}</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<router-link
								:to="`/owner/orders/${order.id}`"
								class="text-blue-600 hover:text-blue-800"
							>
								View
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useOrderStore } from '@/features/business-owner/store/orderStore';

const orderStore = useOrderStore();
const orders = ref([]);

onMounted(async () => {
	orders.value = await orderStore.fetchOrders();
});

const statusClasses = (status) => {
	const classes = {
		pending: 'bg-yellow-100 text-yellow-800',
		completed: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
	};
	return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};
</script>
