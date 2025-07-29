<template>
	<div>
		<h2 class="text-lg font-semibold mb-4">Pedidos</h2>
		<div
			v-for="order in orders"
			:key="order.id"
			class="border p-4 rounded mb-3"
		>
			<p class="font-bold">Pedido #{{ order.id }}</p>
			<ul class="text-sm text-gray-700 ml-4 list-disc">
				<li v-for="item in order.items" :key="item.id">
					{{ item.name }} x{{ item.quantity }}
				</li>
			</ul>
			<div class="mt-2">
				<label class="text-sm text-gray-600">Estado:</label>
				<select
					v-model="order.status"
					@change="updateStatus(order)"
					class="ml-2 border p-1 rounded"
				>
					<option value="received">Recibido</option>
					<option value="preparing">Preparando</option>
					<option value="ready">Listo</option>
					<option value="on_the_way">En Camino</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const orders = ref([
	{
		id: 101,
		items: [
			{ id: 1, name: 'Tacos', quantity: 2 },
			{ id: 2, name: 'Refresco', quantity: 1 },
		],
		status: 'received',
	},
]);

function updateStatus(order: any) {
	// Send status to backend
	console.log('Updated order status:', order.id, order.status);
}
</script>
