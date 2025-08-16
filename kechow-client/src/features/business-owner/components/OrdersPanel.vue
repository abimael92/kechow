<template>
	<div class="bg-white shadow rounded-lg overflow-hidden">
		<div
			class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center"
		>
			<h3 class="text-lg font-medium leading-6 text-gray-900">
				Órdenes Recientes
			</h3>
			<router-link
				to="/owner/orders"
				class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
			>
				Ver todas →
			</router-link>
		</div>

		<div class="divide-y divide-gray-200">
			<div
				v-for="order in orders"
				:key="order.id"
				class="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-indigo-600 truncate">
							Orden #{{ order.id }}
						</p>
						<p class="mt-1 text-sm text-gray-500">
							{{ order.customerName }} · {{ order.time }}
						</p>
					</div>
					<span
						class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
						:class="statusClasses[order.status]"
					>
						{{ statusLabels[order.status] }}
					</span>
				</div>

				<div class="mt-2">
					<div class="flex items-center text-sm text-gray-500">
						<div class="flex items-center">
							<span class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">🛍️</span>
							<p>{{ order.items.length }} artículos</p>
						</div>
						<div class="flex items-center ml-4">
							<span class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400">💵</span>
							<p>${{ order.total }}</p>
						</div>
					</div>
				</div>

				<div class="mt-3 flex justify-end space-x-3">
					<button
						@click="updateOrderStatus(order.id, 'preparing')"
						:disabled="order.status !== 'received'"
						class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Preparar
					</button>
					<button
						@click="updateOrderStatus(order.id, 'ready')"
						:disabled="order.status !== 'preparing'"
						class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Marcar como Listo
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const statusLabels = {
	received: 'Recibido',
	preparing: 'Preparando',
	ready: 'Listo',
	delivered: 'Entregado',
	cancelled: 'Cancelado',
};

const statusClasses = {
	received: 'bg-yellow-100 text-yellow-800',
	preparing: 'bg-blue-100 text-blue-800',
	ready: 'bg-green-100 text-green-800',
	delivered: 'bg-gray-100 text-gray-800',
	cancelled: 'bg-red-100 text-red-800',
};

const orders = ref([]);

onMounted(async () => {
	// Fetch orders from API
	const response = await fetch('/api/owner/orders/recent');
	orders.value = await response.json();
});

async function updateOrderStatus(orderId, newStatus) {
	try {
		const response = await fetch(`/api/owner/orders/${orderId}/status`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status: newStatus }),
		});

		if (response.ok) {
			const order = orders.value.find((o) => o.id === orderId);
			if (order) {
				order.status = newStatus;
			}
		}
	} catch (error) {
		console.error('Error updating order status:', error);
	}
}
</script>
