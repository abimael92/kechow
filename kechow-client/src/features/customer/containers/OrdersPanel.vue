<script setup lang="ts">
import { ref, onMounted } from 'vue';

const orders = ref<any[]>([]);

onMounted(() => {
	// fetch from backend later
	orders.value = [
		{ id: 1, status: 'Delivered', total: 250, date: '2025-09-01' },
		{ id: 2, status: 'On the way', total: 180, date: '2025-09-05' },
	];
});
</script>

<template>
	<div class="p-4">
		<h1 class="text-xl font-bold mb-4">📦 My Orders</h1>
		<div v-if="orders.length" class="space-y-3">
			<div
				v-for="o in orders"
				:key="o.id"
				class="p-4 border rounded-lg shadow-sm"
			>
				<div class="flex justify-between">
					<span class="font-medium">Order #{{ o.id }}</span>
					<span class="text-sm text-gray-500">{{ o.date }}</span>
				</div>
				<div class="flex justify-between mt-2">
					<span
						>Status: <b>{{ o.status }}</b></span
					>
					<span>Total: ${{ o.total }}</span>
				</div>
			</div>
		</div>
		<p v-else>No orders yet.</p>
	</div>
</template>
