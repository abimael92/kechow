<template>
	<div class="p-4 md:p-6 max-w-2xl mx-auto">
		<div v-if="orderDetailLoading" class="flex justify-center py-12">
			<i class="ri-loader-4-line animate-spin text-3xl text-primary-500"></i>
		</div>
		<div v-else-if="orderDetailError" class="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-red-700 dark:text-red-300">
			{{ orderDetailError }}
		</div>
		<div v-else-if="order" class="space-y-4">
			<h1 class="text-xl font-bold text-gray-900 dark:text-white">
				Detalle del pedido #{{ order.id }}
			</h1>
			<div class="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
				<p><span class="font-medium text-gray-600 dark:text-gray-400">Estado:</span> {{ order.status }}</p>
				<p><span class="font-medium text-gray-600 dark:text-gray-400">Recogida:</span> {{ order.pickup }}</p>
				<p><span class="font-medium text-gray-600 dark:text-gray-400">Entrega:</span> {{ order.dropoff }}</p>
				<p><span class="font-medium text-gray-600 dark:text-gray-400">Monto:</span> ${{ order.amount?.toFixed(2) }}</p>
				<p v-if="order.delivery_notes"><span class="font-medium text-gray-600 dark:text-gray-400">Notas:</span> {{ order.delivery_notes }}</p>
			</div>
			<div class="flex gap-2">
				<router-link
					:to="`/delivery/live/${order.id}`"
					class="px-4 py-2 bg-primary-600 text-white rounded-lg"
				>
					Ver entrega en vivo
				</router-link>
				<router-link to="/delivery/orders" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
					Volver a pedidos
				</router-link>
			</div>
		</div>
		<div v-else class="text-center py-12 text-gray-500">No se encontró el pedido.</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDeliveryStore } from '../store/delivery.store';

const route = useRoute();
const deliveryStore = useDeliveryStore();
const { orderDetail: order, orderDetailLoading, orderDetailError } = storeToRefs(deliveryStore);

const orderId = computed(() => Number(route.params.id));

onMounted(() => {
	deliveryStore.fetchOrderDetail(orderId.value);
});
</script>
