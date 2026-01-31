<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-4 sm:px-6 lg:px-8">
		<div class="max-w-4xl mx-auto">
			<div v-if="loading" class="text-center py-12">
				<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
				<p class="mt-4 text-gray-600 dark:text-gray-400">Cargando pedido...</p>
			</div>

			<div v-else-if="order" class="space-y-6">
				<!-- Header -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<div class="flex items-center justify-between">
						<div>
							<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
								Pedido #{{ order.id }}
							</h1>
							<p class="text-gray-600 dark:text-gray-400 mt-1">
								Realizado el {{ formatDate(order.createdAt) }}
							</p>
						</div>
						<span
							class="px-4 py-2 rounded-full text-sm font-semibold"
							:class="statusClasses[order.status]"
						>
							{{ statusLabels[order.status] }}
						</span>
					</div>
				</div>

				<!-- Order Status Timeline -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
						Estado del Pedido
					</h2>
					<div class="space-y-4">
						<div
							v-for="(status, index) in orderStatuses"
							:key="status.value"
							class="flex items-start gap-4"
						>
							<div class="flex flex-col items-center">
								<div
									class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
									:class="
										getStatusIndex(order.status) >= index
											? 'bg-purple-600'
											: 'bg-gray-300 dark:bg-gray-600'
									"
								>
									<i
										v-if="getStatusIndex(order.status) >= index"
										class="ri-check-line text-xl"
									></i>
									<span v-else class="text-gray-600 dark:text-gray-400">
										{{ index + 1 }}
									</span>
								</div>
								<div
									v-if="index < orderStatuses.length - 1"
									class="w-0.5 h-12 mt-2"
									:class="
										getStatusIndex(order.status) > index
											? 'bg-purple-600'
											: 'bg-gray-300 dark:bg-gray-600'
									"
								></div>
							</div>
							<div class="flex-1 pt-1">
								<p
									class="font-semibold"
									:class="
										getStatusIndex(order.status) >= index
											? 'text-gray-900 dark:text-white'
											: 'text-gray-400 dark:text-gray-500'
									"
								>
									{{ status.label }}
								</p>
								<p
									v-if="getStatusIndex(order.status) >= index && status.timestamp"
									class="text-sm text-gray-600 dark:text-gray-400 mt-1"
								>
									{{ status.timestamp }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Order Details -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Detalles del Pedido
					</h2>
					<div class="space-y-4">
						<div
							v-for="item in order.items"
							:key="item.id"
							class="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
						>
							<div>
								<p class="font-medium text-gray-900 dark:text-white">
									{{ item.name }}
								</p>
								<p
									v-if="item.notes"
									class="text-sm text-gray-600 dark:text-gray-400 mt-1"
								>
									Nota: {{ item.notes }}
								</p>
							</div>
							<div class="text-right">
								<p class="font-medium text-gray-900 dark:text-white">
									${{ item.price.toFixed(2) }}
								</p>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									x{{ item.quantity }}
								</p>
							</div>
						</div>
					</div>
					<div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
						<div class="flex justify-between text-lg font-bold">
							<span class="text-gray-900 dark:text-white">Total</span>
							<span class="text-purple-600 dark:text-purple-400">
								${{ order.totalAmount.toFixed(2) }}
							</span>
						</div>
					</div>
				</div>

				<!-- Delivery Information -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Información de Entrega
					</h2>
					<div class="space-y-2 text-gray-700 dark:text-gray-300">
						<p><strong>Dirección:</strong> {{ order.address }}</p>
						<p><strong>Teléfono:</strong> {{ order.phone }}</p>
						<p v-if="order.email">
							<strong>Email:</strong> {{ order.email }}
						</p>
						<p v-if="order.specialInstructions">
							<strong>Instrucciones:</strong> {{ order.specialInstructions }}
						</p>
					</div>
				</div>

				<!-- Payment Information -->
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
					<h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
						Información de Pago
					</h2>
					<div class="flex justify-between items-center">
						<span class="text-gray-700 dark:text-gray-300">
							Método: {{ paymentMethodLabels[order.paymentMethod] }}
						</span>
						<span
							class="px-3 py-1 rounded-full text-sm font-semibold"
							:class="
								order.paymentStatus === 'paid'
									? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
									: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
							"
						>
							{{
								order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'
							}}
						</span>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex gap-4">
					<button
						@click="router.push({ name: 'OrdersPage' })"
						class="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
					>
						Ver Todos los Pedidos
					</button>
					<button
						v-if="order.status === 'delivered'"
						@click="router.push({ name: 'ReviewPage', query: { orderId: order.id } })"
						class="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
					>
						Dejar Reseña
					</button>
				</div>
			</div>

			<div v-else class="text-center py-12">
				<p class="text-gray-600 dark:text-gray-400">Pedido no encontrado</p>
				<button
					@click="router.push({ name: 'OrdersPage' })"
					class="mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
				>
					Volver a Pedidos
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { getOrder, trackOrder } from '@/features/customer/services/customer.service';
import type { Order } from '@/features/customer/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const order = ref<Order | null>(null);
const loading = ref(true);
let trackingInterval: ReturnType<typeof setInterval> | null = null;

const statusLabels: Record<string, string> = {
	new: 'Nuevo',
	preparing: 'Preparando',
	ready: 'Listo',
	out_for_delivery: 'En Camino',
	delivered: 'Entregado',
	cancelled: 'Cancelado',
	declined: 'Rechazado',
};

const statusClasses: Record<string, string> = {
	new: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
	preparing: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
	ready: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
	out_for_delivery: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
	delivered: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
	cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
	declined: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const paymentMethodLabels: Record<string, string> = {
	cash: 'Efectivo',
	card: 'Tarjeta',
	online: 'Pago en línea',
};

const orderStatuses: { value: string; label: string; timestamp?: string }[] = [
	{ value: 'new', label: 'Pedido Recibido' },
	{ value: 'preparing', label: 'En Preparación' },
	{ value: 'ready', label: 'Listo para Entrega' },
	{ value: 'out_for_delivery', label: 'En Camino' },
	{ value: 'delivered', label: 'Entregado' },
];

const getStatusIndex = (status: string): number => {
	return orderStatuses.findIndex((s) => s.value === status);
};

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString('es-MX', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

const loadOrder = async () => {
	const orderId = route.params.id as string;
	if (!orderId) {
		toast.error('ID de pedido no válido');
		router.push({ name: 'OrdersPage' });
		return;
	}

	try {
		loading.value = true;
		const orderData = await getOrder(orderId);
		if (!orderData) {
			toast.error('Pedido no encontrado');
			router.push({ name: 'OrdersPage' });
			return;
		}
		order.value = orderData;
	} catch (error) {
		toast.error('Error al cargar el pedido');
	} finally {
		loading.value = false;
	}
};

const startTracking = () => {
	// Poll for order updates every 10 seconds if order is not delivered
	if (order.value && order.value.status !== 'delivered' && order.value.status !== 'cancelled') {
		trackingInterval = setInterval(async () => {
			try {
				const updatedOrder = await trackOrder(order.value!.id);
				if (updatedOrder.status !== order.value!.status) {
					order.value = updatedOrder;
					toast.info(`Estado actualizado: ${statusLabels[updatedOrder.status]}`);
					// Stop tracking if order is delivered or cancelled
					if (
						updatedOrder.status === 'delivered' ||
						updatedOrder.status === 'cancelled'
					) {
						stopTracking();
					}
				}
			} catch (error) {
				console.error('Error tracking order:', error);
			}
		}, 10000);
	}
};

const stopTracking = () => {
	if (trackingInterval) {
		clearInterval(trackingInterval);
		trackingInterval = null;
	}
};

onMounted(async () => {
	await loadOrder();
	startTracking();
});

onUnmounted(() => {
	stopTracking();
});
</script>
