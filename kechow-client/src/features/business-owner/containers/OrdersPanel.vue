<template>
	<div>
		<h2>Orders</h2>
		<table>
			<tr v-for="order in orders" :key="order.id">
				<td>{{ order.id }}</td>
				<td>{{ order.status }}</td>
			</tr>
		</table>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBusinessOwnerStore } from '@/features/business-owner/store/businessOwner.store';

const store = useBusinessOwnerStore();
const orders = ref([]);

onMounted(async () => (orders.value = await store.fetchOrders()));
</script>
