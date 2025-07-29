<template>
	<div class="space-y-4">
		<h2 class="text-xl font-bold">Resumen del Restaurante</h2>
		<div class="grid grid-cols-2 gap-4">
			<div class="p-4 bg-green-100 rounded-xl shadow">
				<p class="text-sm text-gray-600">Pedidos Nuevos</p>
				<p class="text-2xl font-bold">{{ summary.newOrders }}</p>
			</div>
			<div class="p-4 bg-yellow-100 rounded-xl shadow">
				<p class="text-sm text-gray-600">En Preparación</p>
				<p class="text-2xl font-bold">{{ summary.preparing }}</p>
			</div>
			<div class="p-4 bg-blue-100 rounded-xl shadow">
				<p class="text-sm text-gray-600">Listos</p>
				<p class="text-2xl font-bold">{{ summary.ready }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const summary = ref({
	newOrders: 0,
	preparing: 0,
	ready: 0,
});

onMounted(async () => {
	// Fetch summary from backend (mocked for now)
	summary.value = {
		newOrders: 5,
		preparing: 3,
		ready: 2,
	};
});
</script>
