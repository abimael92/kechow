<template>
	<div class="space-y-4 sm:space-y-6 mb-4">
		<!-- Header Section -->
		<div class="flex items-start gap-3">
			<!-- Left icon -->
			<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
				<i class="ri-shopping-cart-line text-white text-lg sm:text-xl md:text-2xl"></i>
			</div>
			
			<!-- Center content -->
			<div class="flex-1">
				<h1 class="text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
					Tablero de repartidor
				</h1>
				<p class="text-gray-600 dark:text-gray-400 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-2">
					{{ driverStore.isOnline ? 'Listo para recibir pedidos' : 'Activa tu disponibilidad' }}
				</p>
			</div>

			<!-- Right side with toggle -->
			<div class="flex flex-col items-end gap-1 min-w-[100px]">
				<span
					:class="[
						'text-sm font-medium transition-colors duration-200 text-right',
						driverStore.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400',
					]"
				>
					{{ driverStore.isOnline ? 'En línea' : 'Desconectado' }}
				</span>
				
				<button
					role="switch"
					:aria-checked="driverStore.isOnline.value"
					:disabled="driverStore.hasActiveOrder.value"
					@click="handleToggleOnline"
					:class="[
						'relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
						driverStore.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
						driverStore.hasActiveOrder ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105',
					]"
				>
					<span
						:class="[
							'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-all duration-300',
							driverStore.isOnline ? 'translate-x-7' : 'translate-x-1',
						]"
					></span>
				</button>

				<div v-if="driverStore.isOnline" class="flex justify-end mt-1">
					<div class="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span class="text-xs text-green-600 dark:text-green-400">Activo</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Stats Component with error boundary -->
		<DriverStats v-if="driverStore" />

		<!-- Main content -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
			<!-- Current delivery -->
			<div class="order-2 lg:order-1">
				<CurrentDelivery v-if="driverStore.hasActiveOrder" />
				<div v-else class="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
					<p class="text-gray-500">No hay entregas activas</p>
				</div>
			</div>

			<!-- Available orders -->
			<div class="order-1 lg:order-2 space-y-4">
				<!-- Search and filter bar -->
				<div v-if="driverStore.isOnline && !driverStore.hasActiveOrder" class="flex flex-col sm:flex-row gap-2">
					<div class="relative flex-1">
						<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Buscar pedidos..."
							class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						/>
					</div>
					<button
						@click="showFilters = !showFilters"
						class="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center min-w-[44px]"
					>
						<i class="ri-filter-3-line"></i>
						<span class="hidden sm:inline">Filtros</span>
					</button>
				</div>

				<!-- Filter panel -->
				<div 
					v-if="showFilters && driverStore.isOnline && !driverStore.hasActiveOrder"
					class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
					:class="{ 'animate-slideDown': showFilters }"
				>
					<div class="flex flex-wrap gap-3">
						<button
							v-for="filter in orderFilters"
							:key="filter.value"
							@click="selectedFilter = filter.value"
							:class="[
								'px-3 py-1.5 rounded-full text-sm font-medium transition-all min-h-[44px]',
								selectedFilter === filter.value
									? 'bg-primary-500 text-white'
									: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
							]"
						>
							{{ filter.label }}
						</button>
					</div>
				</div>

				<!-- Available orders with error handling -->
				<AvailableOrders 
					v-if="driverStore.availableOrders.value?.length"
					:orders="driverStore.availableOrders.value"
					:search-query="searchQuery"
					:filter="selectedFilter"
					@order-accepted="handleOrderAccepted"
				/>
				<div v-else-if="driverStore.isOnline && !driverStore.hasActiveOrder" class="text-center py-8 bg-white dark:bg-gray-800 rounded-xl">
					<i class="ri-inbox-line text-4xl text-gray-400 mb-2"></i>
					<p class="text-gray-500">No hay pedidos disponibles</p>
				</div>

				<!-- Floating refresh button -->
				<Transition name="slide-up">
					<button
						v-if="driverStore.isOnline && !driverStore.hasActiveOrder"
						@click="refreshOrders"
						class="lg:hidden fixed bottom-20 right-4 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all active:scale-95 z-40"
						:class="{ 'animate-spin': isRefreshing }"
					>
						<i class="ri-refresh-line text-xl"></i>
					</button>
				</Transition>
			</div>
		</div>

		<!-- Quick stats -->
		<div v-if="driverStore.isOnline" class="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
			<div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 text-center">
				<p class="text-xs text-gray-600 dark:text-gray-400">Hoy</p>
				<p class="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">{{ driverStore.todayDeliveries || 0 }}</p>
			</div>
			<div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center">
				<p class="text-xs text-gray-600 dark:text-gray-400">Ganancias</p>
				<p class="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">${{ formatEarnings(driverStore.todayEarnings.value) }}</p>
			</div>
			<div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-3 text-center">
				<p class="text-xs text-gray-600 dark:text-gray-400">Rating</p>
				<p class="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">{{ driverStore.rating || '5.0' }} ⭐</p>
			</div>
		</div>

		<!-- Offline banner -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="transform translate-y-2 opacity-0"
			enter-to-class="transform translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="transform translate-y-0 opacity-100"
			leave-to-class="transform translate-y-2 opacity-0"
		>
			<div
				v-if="!isOnline"
				class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm p-4 rounded-xl bg-amber-500 text-white shadow-lg z-50 backdrop-blur-lg bg-opacity-95"
			>
				<div class="flex items-center gap-3">
					<i class="ri-wifi-off-line text-xl"></i>
					<div>
						<p class="font-medium">Sin conexión</p>
						<p class="text-sm opacity-90">Las acciones se guardarán cuando vuelvas a tener conexión</p>
					</div>
				</div>
			</div>
		</Transition>

		<!-- Loading overlay -->
		<div
			v-if="isLoading"
			class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-xs w-full mx-4">
				<div class="flex flex-col items-center gap-4">
					<div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
					<p class="text-center text-gray-700 dark:text-gray-300">Procesando...</p>
				</div>
			</div>
		</div>

		<!-- Pull to refresh indicator -->
		<div
			v-if="isPullToRefresh"
			class="fixed top-0 left-0 right-0 flex justify-center pt-4 z-50 pointer-events-none"
		>
			<div class="bg-primary-500 text-white px-4 py-2 rounded-full text-sm shadow-lg">
				<i class="ri-refresh-line animate-spin mr-2"></i>
				Actualizando...
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Mock store for development - replace with actual store import
const useDriverStore = () => {
	const isOnline = ref(false);
	const hasActiveOrder = ref(false);
	const todayDeliveries = ref(0);
	const todayEarnings = ref(0);
	const rating = ref(4.8);
	const availableOrders = ref([]);
	
	const toggleOnline = async () => {
		isOnline.value = !isOnline.value;
	};
	
	const refreshOrders = async () => {
		console.log('Refreshing orders...');
	};
	
	const initialize = async () => {
		console.log('Initializing driver store...');
	};
	
	const stopAutoRefresh = () => {
		console.log('Stopping auto refresh...');
	};
	
	return {
		isOnline,
		hasActiveOrder,
		todayDeliveries,
		todayEarnings,
		rating,
		availableOrders,
		toggleOnline,
		refreshOrders,
		initialize,
		stopAutoRefresh
	};
};

// Mock composable
const useDriverLocation = () => {
	console.log('Location tracking initialized');
};

const driverStore = useDriverStore();
const searchQuery = ref('');
const showFilters = ref(false);
const selectedFilter = ref('all');
const isLoading = ref(false);
const isRefreshing = ref(false);
const isPullToRefresh = ref(false);
const isOnline = ref(navigator.onLine);
let pullToRefreshStart = 0;
let refreshInterval: ReturnType<typeof setInterval>;

// Filter options
const orderFilters = [
	{ label: 'Todos', value: 'all' },
	{ label: 'Cercanos', value: 'nearby' },
	{ label: 'Prioridad', value: 'priority' },
	{ label: 'Restaurante', value: 'restaurant' },
];

// Format earnings
const formatEarnings = (value: number) => {
	if (value === undefined || value === null) return '0';
	return value.toLocaleString('es-MX', { minimumFractionDigits: 2 });
};

// Initialize location tracking
useDriverLocation();

// Handle online toggle
const handleToggleOnline = async () => {
	if (driverStore.hasActiveOrder.value) return;
	
	if (!driverStore.isOnline.value) {
		if (confirm('¿Activar modo en línea? Comenzarás a recibir pedidos.')) {
			await driverStore.toggleOnline();
		}
	} else {
		await driverStore.toggleOnline();
	}
};

// Handle order acceptance
const handleOrderAccepted = (orderId: number) => {
	console.log('Order accepted:', orderId);
	showFilters.value = false;
};

// Refresh orders
const refreshOrders = async () => {
	if (isRefreshing.value) return;
	
	isRefreshing.value = true;
	await driverStore.refreshOrders();
	setTimeout(() => {
		isRefreshing.value = false;
	}, 1000);
};

// Pull to refresh
const handleTouchStart = (e: TouchEvent) => {
	if (window.scrollY === 0) {
		pullToRefreshStart = e.touches[0].clientY;
	}
};

const handleTouchMove = (e: TouchEvent) => {
	if (pullToRefreshStart > 0 && window.scrollY === 0) {
		const currentY = e.touches[0].clientY;
		const diff = currentY - pullToRefreshStart;
		
		if (diff > 100 && !isPullToRefresh.value) {
			isPullToRefresh.value = true;
			refreshOrders().finally(() => {
				isPullToRefresh.value = false;
			});
		}
	}
};

const handleTouchEnd = () => {
	pullToRefreshStart = 0;
};

// Network status handlers
const updateOnlineStatus = () => {
	isOnline.value = navigator.onLine;
};

// Lifecycle
onMounted(async () => {
	try {
		await driverStore.initialize();
		
		// Set up auto-refresh
		refreshInterval = setInterval(() => {
			if (driverStore.isOnline.value && !driverStore.hasActiveOrder.value) {
				driverStore.refreshOrders();
			}
		}, 30000);
		
		// Add event listeners
		document.addEventListener('touchstart', handleTouchStart);
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);
		window.addEventListener('online', updateOnlineStatus);
		window.addEventListener('offline', updateOnlineStatus);
	} catch (error) {
		console.error('Failed to initialize:', error);
	}
});

onUnmounted(() => {
	driverStore.stopAutoRefresh();
	clearInterval(refreshInterval);
	document.removeEventListener('touchstart', handleTouchStart);
	document.removeEventListener('touchmove', handleTouchMove);
	document.removeEventListener('touchend', handleTouchEnd);
	window.removeEventListener('online', updateOnlineStatus);
	window.removeEventListener('offline', updateOnlineStatus);
});
</script>

<style scoped>

/* Animations */
@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-slideDown {
	animation: slideDown 0.3s ease-out;
}

@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Slide up transition */
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateY(100%);
	opacity: 0;
}

/* Touch feedback */
@media (hover: none) {
	button:active {
		transform: scale(0.95);
		transition: transform 0.1s;
	}
}

/* Safe area for notches */
.fixed {
	padding-bottom: env(safe-area-inset-bottom);
	padding-left: env(safe-area-inset-left);
	padding-right: env(safe-area-inset-right);
}

/* Pull to refresh indicator */
@keyframes slideDown {
	from {
		transform: translateY(-100%);
	}
	to {
		transform: translateY(0);
	}
}

.fixed.top-0 {
	animation: slideDown 0.3s ease-out;
}

/* Responsive font sizing */
@media (max-width: 640px) {
	.text-3xl {
		font-size: 1.875rem;
	}
}

@media (max-width: 480px) {
	.min-w-\[100px\] {
		min-width: 80px;
	}
	
	.text-3xl {
		font-size: 1.5rem;
	}
}

/* Ensure toggle is properly aligned */
.min-w-\[100px\] {
	min-width: 100px;
}

/* Line clamp */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: compact;
	overflow: hidden;
}
</style>