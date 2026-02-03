<template>
	<div class="min-h-screen min-w-0 overflow-x-hidden p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
		<!-- Header -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
			<div class="flex items-center gap-3">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-home-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Tablero
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
						¡Bienvenido de nuevo!
					</p>
				</div>
			</div>
			<div class="hidden sm:block text-right">
				<p class="text-neutral-600 dark:text-neutral-400 text-sm md:text-base">
					{{ authStore.user?.name || 'Usuario' }}
				</p>
				<p class="text-neutral-500 dark:text-neutral-500 text-xs md:text-sm">
					Último acceso: {{ formatLastLogin() }}
				</p>
			</div>
		</div>

		<!-- 1. Today's Stats -->
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

		<!-- 2. Active Orders List -->
		<section>
			<div class="flex items-center justify-between mb-3">
				<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide">
					Pedidos activos
				</h2>
				<router-link
					to="/owner/orders"
					class="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
				>
					Ver todos
				</router-link>
			</div>
			<div class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
				<div v-if="loadingOrders" class="p-6 text-center text-neutral-500">
					<i class="ri-loader-4-line animate-spin text-2xl"></i>
					<p class="text-sm mt-2">Cargando pedidos...</p>
				</div>
				<div v-else-if="activeOrders.length === 0" class="p-6 text-center text-neutral-500 dark:text-neutral-400">
					<i class="ri-shopping-bag-line text-3xl mb-2 opacity-50"></i>
					<p class="text-sm">No hay pedidos activos</p>
				</div>
				<div v-else class="divide-y divide-neutral-200 dark:divide-neutral-700">
					<div
						v-for="order in activeOrders"
						:key="order.id"
						class="flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
					>
						<div class="min-w-0 flex-1">
							<p class="font-medium text-neutral-900 dark:text-white">#{{ order.id }}</p>
							<p class="text-xs text-neutral-500 mt-0.5">
								{{ formatTime(order.createdAt) }} · {{ order.items?.length || 0 }} items
							</p>
						</div>
						<div class="flex items-center gap-3 flex-shrink-0 ml-3">
							<span
								:class="statusBadgeClass(order.status)"
								class="px-2 py-1 rounded-full text-xs font-medium"
							>
								{{ statusLabel(order.status) }}
							</span>
							<p class="font-semibold text-neutral-900 dark:text-white">
								{{ formatCurrency(order.totalAmount) }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- 3. Driver Availability -->
		<section>
			<h2 class="text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wide">
				Disponibilidad de repartidores
			</h2>
			<div class="bg-card dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
						<i class="ri-user-follow-line text-green-600 dark:text-green-400"></i>
					</div>
					<div>
						<p class="font-semibold text-neutral-900 dark:text-white">{{ driverAvailability.online }} en línea</p>
						<p class="text-xs text-neutral-500">{{ driverAvailability.offline }} desconectados</p>
					</div>
				</div>
				<div class="text-right">
					<p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ driverAvailability.online }}</p>
					<p class="text-xs text-neutral-500">disponibles</p>
				</div>
			</div>
		</section>

		<!-- 4. Peak Hours Alert -->
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
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/app/store/auth/auth.store';
import { getOrderStats, fetchOrders } from '@/features/business-owner/services/businessOwner.service';
import type { Order } from '@/features/business-owner/types';

const authStore = useAuthStore();

const todayStats = ref({
	orders: 0,
	revenue: 0,
	avgOrderValue: 0,
});

const activeOrders = ref<Order[]>([]);
const loadingOrders = ref(true);

const driverAvailability = ref({ online: 3, offline: 2 });

function formatLastLogin(): string {
	return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

function formatCurrency(n: number): string {
	return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);
}

function formatTime(iso: string): string {
	const d = new Date(iso);
	return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
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

const ACTIVE_STATUSES = ['new', 'preparing', 'ready', 'out_for_delivery'];

async function loadActiveOrders() {
	loadingOrders.value = true;
	try {
		const orders = await fetchOrders({ status: ACTIVE_STATUSES as Order['status'][] });
		activeOrders.value = (orders ?? []).slice(0, 10);
	} catch {
		activeOrders.value = [];
	} finally {
		loadingOrders.value = false;
	}
}

onMounted(() => {
	loadStats();
	loadActiveOrders();
});
</script>

<style scoped>
.text-bubble {
	font-size: clamp(1.5rem, 4vw, 2rem);
}
</style>
