<template>
	<div class="p-4 sm:p-6 space-y-4 sm:space-y-6">
		<!-- Header -->
		<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
			<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
				<i class="ri-home-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
			</div>
			<div class="min-w-0 flex-1">
				<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
					Tablero
				</h1>
				<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
					¡Bienvenido de nuevo!
				</p>
			</div>
		</div>

		<!-- Today's Stats -->
		<section>
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Estadísticas de hoy
			</h2>
			<div class="grid grid-cols-3 gap-3 sm:gap-4">
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Pedidos</p>
					<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
						{{ todayStats.orders }}
					</p>
				</div>
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Ingresos</p>
					<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
						{{ formatCurrency(todayStats.revenue) }}
					</p>
				</div>
				<div class="bg-card dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
					<p class="text-xs text-neutral-500 dark:text-neutral-400">Ticket promedio</p>
					<p class="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mt-1">
						{{ formatCurrency(todayStats.avgOrderValue) }}
					</p>
				</div>
			</div>
		</section>

		<!-- Active Orders - Big Touch Cards -->
		<section>
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
					Pedidos activos
				</h2>
				<button
					@click="loadAll"
					:disabled="loadingOrders"
					class="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline disabled:opacity-50 flex items-center gap-1"
				>
					<i class="ri-refresh-line" :class="{ 'animate-spin': loadingOrders }"></i>
					Actualizar
				</button>
			</div>

			<div v-if="loadingOrders && activeOrders.length === 0" class="space-y-4">
				<div v-for="n in 3" :key="n" class="bg-card dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 animate-pulse">
					<div class="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
					<div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
					<div class="h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
				</div>
			</div>

			<div v-else-if="activeOrders.length === 0" class="bg-card dark:bg-neutral-900 rounded-2xl p-12 border border-neutral-200 dark:border-neutral-800 text-center">
				<i class="ri-shopping-bag-line text-5xl text-neutral-400 dark:text-neutral-500 mb-4"></i>
				<p class="text-neutral-600 dark:text-neutral-400 font-medium">No hay pedidos activos</p>
				<p class="text-sm text-neutral-500 mt-1">Los nuevos pedidos aparecerán aquí automáticamente</p>
			</div>

			<div v-else class="space-y-4 sm:space-y-5">
				<article
					v-for="order in activeOrders"
					:key="order.id"
					class="bg-card dark:bg-neutral-900 rounded-2xl border-2 shadow-lg overflow-hidden transition-all hover:shadow-xl"
					:class="orderCardBorderClass(order.status)"
				>
					<!-- Order header -->
					<div class="p-4 sm:p-5">
						<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
							<div class="min-w-0">
								<div class="flex items-center gap-2 flex-wrap">
									<h3 class="font-bold text-xl sm:text-2xl text-neutral-900 dark:text-white">
										#{{ order.id }}
									</h3>
									<span :class="statusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-sm font-semibold">
										{{ statusLabel(order.status) }}
									</span>
								</div>
								<p class="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mt-1">
									{{ formatTime(order.createdAt) }} · {{ order.customerName }}
								</p>
							</div>
							<div class="text-right">
								<p class="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
									{{ formatCurrency(order.totalAmount ?? order.total) }}
								</p>
							</div>
						</div>

						<!-- Items list -->
						<div class="mt-3 sm:mt-4 space-y-1">
							<p v-for="item in order.items" :key="item.id" class="text-sm sm:text-base text-neutral-700 dark:text-neutral-300">
								{{ item.quantity }}x {{ item.name }}
								<span class="text-neutral-500 dark:text-neutral-400">${{ ((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2) }}</span>
							</p>
						</div>

						<!-- Driver info (when ready or out_for_delivery) -->
						<div
							v-if="(order.status === 'ready' || order.status === 'out_for_delivery') && order.driver"
							class="mt-4 p-4 rounded-xl bg-tertiary-50 dark:bg-tertiary-900/20 border border-tertiary-200 dark:border-tertiary-800"
						>
							<p class="text-sm font-semibold text-tertiary-800 dark:text-tertiary-200 mb-1">
								<i class="ri-bike-line mr-2"></i>Repartidor
							</p>
							<p class="font-medium text-tertiary-900 dark:text-tertiary-100">{{ order.driver.name }}</p>
							<div class="flex flex-wrap gap-3 mt-2">
								<a
									:href="`tel:${order.driver.phone || ''}`"
									class="inline-flex items-center gap-1 text-sm text-tertiary-600 dark:text-tertiary-400 hover:underline"
								>
									<i class="ri-phone-line"></i>
									{{ formatPhone(order.driver.phone) }}
								</a>
								<a
									:href="`sms:${order.driver.phone || ''}`"
									class="inline-flex items-center gap-1 text-sm text-tertiary-600 dark:text-tertiary-400 hover:underline"
								>
									<i class="ri-message-line"></i>
									Enviar SMS
								</a>
							</div>
						</div>
						<div
							v-else-if="order.status === 'ready' || order.status === 'out_for_delivery'"
							class="mt-4 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
						>
							<p class="text-sm text-neutral-600 dark:text-neutral-400 italic">
								<i class="ri-user-line mr-2"></i>Sin repartidor asignado
							</p>
						</div>
					</div>

					<!-- Action buttons -->
					<div class="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col gap-2">
						<!-- Pending: Accept / Decline -->
						<div v-if="order.status === 'new'" class="grid grid-cols-2 gap-3">
							<button
								@click="updateStatus(order.id, 'preparing')"
								:disabled="updatingId === order.id"
								class="min-h-[52px] sm:min-h-[60px] py-3 px-4 rounded-xl font-bold text-lg sm:text-xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
							>
								<i v-if="updatingId === order.id" class="ri-loader-4-line animate-spin text-2xl"></i>
								<i v-else class="ri-check-line text-2xl"></i>
								<span>ACEPTAR</span>
							</button>
							<button
								@click="updateStatus(order.id, 'declined')"
								:disabled="updatingId === order.id"
								class="min-h-[52px] sm:min-h-[60px] py-3 px-4 rounded-xl font-bold text-lg sm:text-xl bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
							>
								<i v-if="updatingId === order.id" class="ri-loader-4-line animate-spin text-2xl"></i>
								<i v-else class="ri-close-line text-2xl"></i>
								<span>RECHAZAR</span>
							</button>
						</div>

						<!-- Preparing: Mark Ready -->
						<div v-else-if="order.status === 'preparing'">
							<button
								@click="updateStatus(order.id, 'ready')"
								:disabled="updatingId === order.id"
								class="w-full min-h-[52px] sm:min-h-[60px] py-3 px-4 rounded-xl font-bold text-lg sm:text-xl bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
							>
								<i v-if="updatingId === order.id" class="ri-loader-4-line animate-spin text-2xl"></i>
								<i v-else class="ri-check-double-line text-2xl"></i>
								<span>MARCAR LISTO</span>
							</button>
						</div>

						<!-- Ready: Picked Up (driver has order) -->
						<div v-else-if="order.status === 'ready'">
							<button
								@click="updateStatus(order.id, 'out_for_delivery')"
								:disabled="updatingId === order.id"
								class="w-full min-h-[52px] sm:min-h-[60px] py-3 px-4 rounded-xl font-bold text-lg sm:text-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
							>
								<i v-if="updatingId === order.id" class="ri-loader-4-line animate-spin text-2xl"></i>
								<i v-else class="ri-bike-line text-2xl"></i>
								<span>REPARTIDOR RECOGIÓ</span>
							</button>
						</div>

						<!-- Out for delivery: done (no action, driver delivers) -->
						<div v-else-if="order.status === 'out_for_delivery'" class="py-2">
							<p class="text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
								<i class="ri-bike-line mr-1"></i>En camino al cliente
							</p>
						</div>
					</div>
				</article>
			</div>
		</section>

		<!-- Peak Hours Alert -->
		<section>
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Próxima hora pico
			</h2>
			<div class="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 p-4 flex items-center gap-4">
				<div class="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
					<i class="ri-time-line text-amber-600 dark:text-amber-400 text-xl"></i>
				</div>
				<div>
					<p class="font-semibold text-amber-800 dark:text-amber-200">{{ peakHoursAlert.label }}</p>
					<p class="text-sm text-amber-700 dark:text-amber-300">{{ peakHoursAlert.description }}</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getOrderStats, fetchOrders, updateOrderStatus } from '@/features/business-owner/services/businessOwner.service';
import type { Order } from '@/features/business-owner/types';
import { canTransition, normalizeOwnerStatus } from '@shared/order-state-machine';
import { useToast } from 'vue-toastification';

const toast = useToast();

const todayStats = ref({
	orders: 0,
	revenue: 0,
	avgOrderValue: 0,
});

const activeOrders = ref<Order[]>([]);
const loadingOrders = ref(true);
const updatingId = ref<string | null>(null);

const ACTIVE_STATUSES = ['new', 'preparing', 'ready', 'out_for_delivery'] as const;
const POLL_INTERVAL_MS = 8000; // Poll for new orders; use Echo channel 'restaurant.{id}.orders' + event 'order.created' when WebSocket configured

let pollTimer: ReturnType<typeof setInterval> | null = null;

function formatCurrency(n: number): string {
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

function formatTime(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function formatPhone(phone?: string): string {
	if (!phone) return '';
	return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

function statusLabel(status: string): string {
	const map: Record<string, string> = {
		new: 'Nuevo',
		preparing: 'Preparando',
		ready: 'Listo',
		out_for_delivery: 'En camino',
		delivered: 'Entregado',
		declined: 'Rechazado',
		cancelled: 'Cancelado',
	};
	return map[status] || status;
}

function statusBadgeClass(status: string): string {
	const map: Record<string, string> = {
		new: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
		preparing: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
		ready: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
		out_for_delivery: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
	};
	return map[status] || 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300';
}

function orderCardBorderClass(status: string): string {
	const map: Record<string, string> = {
		new: 'border-blue-300 dark:border-blue-700',
		preparing: 'border-amber-300 dark:border-amber-700',
		ready: 'border-green-300 dark:border-green-700',
		out_for_delivery: 'border-purple-300 dark:border-purple-700',
	};
	return map[status] || 'border-neutral-200 dark:border-neutral-800';
}

const peakHoursAlert = computed(() => {
	const hour = new Date().getHours();
	if (hour >= 18 && hour < 21) {
		return {
			label: 'Hora pico activa',
			description: '18:00 - 21:00 · Prepárate para más pedidos',
		};
	}
	if (hour >= 11 && hour < 14) {
		return {
			label: 'Hora pico de comida',
			description: '11:00 - 14:00 · Mayor demanda',
		};
	}
	if (hour < 11) {
		return {
			label: 'Próxima hora pico: comida',
			description: '11:00 - 14:00 · Aproximadamente en ' + (11 - hour) + ' h',
		};
	}
	if (hour < 18) {
		return {
			label: 'Próxima hora pico: cena',
			description: '18:00 - 21:00 · Aproximadamente en ' + (18 - hour) + ' h',
		};
	}
	return {
		label: 'Fuera de hora pico',
		description: 'Próxima mañana 11:00',
	};
});

async function loadStats() {
	try {
		const stats = await getOrderStats();
		todayStats.value = {
			orders: stats.today?.orders ?? 0,
			revenue: stats.today?.revenue ?? 0,
			avgOrderValue: stats.today?.averageOrderValue ?? 0,
		};
	} catch {
		todayStats.value = { orders: 0, revenue: 0, avgOrderValue: 0 };
	}
}

async function loadActiveOrders() {
	try {
		const orders = await fetchOrders({ status: [...ACTIVE_STATUSES] as Order['status'][] });
		activeOrders.value = orders ?? [];
	} catch {
		activeOrders.value = [];
	} finally {
		loadingOrders.value = false;
	}
}

async function loadAll() {
	loadingOrders.value = true;
	await Promise.all([loadStats(), loadActiveOrders()]);
}

async function updateStatus(orderId: string, newStatus: string) {
	const order = activeOrders.value.find((o) => o.id === orderId);
	if (!order) return;

	const fromStatus = normalizeOwnerStatus(order.status);
	const toStatus = normalizeOwnerStatus(newStatus);
	if (!canTransition(fromStatus, toStatus, 'owner')) {
		toast.error('Transición de estado no permitida');
		return;
	}

	updatingId.value = orderId;
	try {
		await updateOrderStatus(orderId, newStatus);
		await loadAll();
		toast.success(`Pedido #${orderId} actualizado`);
	} catch (err) {
		console.error(err);
		toast.error('No se pudo actualizar el pedido');
	} finally {
		updatingId.value = null;
	}
}

onMounted(() => {
	loadAll();
	pollTimer = setInterval(loadActiveOrders, POLL_INTERVAL_MS);
});

onUnmounted(() => {
	if (pollTimer) clearInterval(pollTimer);
});
</script>

<style scoped>
.text-bubble {
	font-size: clamp(1.5rem, 4vw, 2rem);
}
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.animate-spin {
	animation: spin 1s linear infinite;
}
</style>
