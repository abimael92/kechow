<template>
	<div class="space-y-4 sm:space-y-6 mb-4">
		<!-- Header Section -->
		<div class="flex items-start gap-3">
			<!-- Left icon -->
			<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
				<i class="ri-motorbike-line text-white text-lg sm:text-xl md:text-2xl"></i>
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
					:aria-checked="driverStore.isOnline"
					:disabled="driverStore.hasActiveOrder"
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

		<!-- Stats Cards - IMPROVED UI -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<!-- Today Orders -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Pedidos hoy</p>
						<p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statsStore.todayOrders }}</p>
						<p class="text-xs text-green-600 mt-1">+12% vs ayer</p>
					</div>
					<div class="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
						<i class="ri-shopping-bag-line text-blue-600 dark:text-blue-400 text-xl"></i>
					</div>
				</div>
			</div>

			<!-- Earnings -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Ganancias</p>
						<p class="text-3xl font-bold text-gray-900 dark:text-white">${{ formatEarnings(statsStore.earnings) }}</p>
						<p class="text-xs text-green-600 mt-1">+$45 esta hora</p>
					</div>
					<div class="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
						<i class="ri-money-dollar-circle-line text-green-600 dark:text-green-400 text-xl"></i>
					</div>
				</div>
			</div>

			<!-- Rating -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Calificación</p>
						<div class="flex items-baseline gap-1">
							<p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statsStore.rating }}</p>
							<span class="text-yellow-400 text-xl">★</span>
						</div>
						<p class="text-xs text-gray-500 mt-1">Excelente</p>
					</div>
					<div class="w-12 h-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
						<i class="ri-star-line text-yellow-600 dark:text-yellow-400 text-xl"></i>
					</div>
				</div>
			</div>

			<!-- Completed -->
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Completados</p>
						<p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statsStore.completed }}</p>
						<p class="text-xs text-blue-600 mt-1">Meta: 50</p>
					</div>
					<div class="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
						<i class="ri-checkbox-circle-line text-purple-600 dark:text-purple-400 text-xl"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Quick tips based on state -->
		<div v-if="driverStore.isOnline && !driverStore.hasActiveOrder" class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
			<i class="ri-information-line text-blue-600 dark:text-blue-400 text-xl"></i>
			<p class="text-sm text-blue-800 dark:text-blue-200">
				<span class="font-semibold">{{ filteredOrders.length }} pedidos disponibles</span> · Toca cualquier pedido para ver detalles
			</p>
		</div>

		<div v-if="driverStore.hasActiveOrder" class="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 flex items-center gap-3">
			<i class="ri-timer-line text-yellow-600 dark:text-yellow-400 text-xl"></i>
			<p class="text-sm text-yellow-800 dark:text-yellow-200">
				<span class="font-semibold">Entrega en curso</span> · Completa esta entrega para recibir nuevos pedidos
			</p>
		</div>

		<!-- Current Delivery Banner - IMPROVED UI -->
		<div v-if="deliveryStore.activeOrder" class="relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-orange-400 rounded-2xl shadow-xl mb-6 border-2 border-orange-400">
			<!-- Background pattern -->
			<div class="absolute inset-0 opacity-10">
				<div class="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"></div>
				<div class="absolute -left-10 -bottom-10 w-40 h-40 bg-white rounded-full"></div>
			</div>
			
			<div class="relative p-6">
				<!-- Header with clear status -->
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-[4.5rem] h-[4.5rem] bg-white/60 backdrop-blur rounded-2xl flex items-center justify-center">
							<i class="ri-truck-line text-orange-500 text-4xl"></i>
						</div>
						<div>
							<div class="flex items-center gap-2 mb-1">
								<h2 class="text-5xl font-bold text-orange-900">Entrega activa</h2>
								<span class="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
									URGENTE
								</span>
							</div>
							<p class="text-orange-700">Completa esta entrega para recibir nuevos pedidos</p>
						</div>
					</div>
					<span class="px-4 py-2 bg-white/20 backdrop-blur text-white font-mono text-sm rounded-xl">
						#{{ deliveryStore.activeOrder.id }}
					</span>
				</div>

				<!-- Two-column layout for better readability -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
					<!-- Pickup Column -->
					<div class="bg-orange-50 backdrop-blur rounded-xl p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center">
								<i class="ri-store-2-line text-white"></i>
							</div>
							<span class="text-orange-800 font-bold text-xl text-center">RECOGER EN</span>
						</div>
						<p class="text-orange-800 text-lg font-medium mb-2">{{ deliveryStore.activeOrder.pickup }}</p>
						<div class="flex items-center gap-2 text-black text-sm">
							<i class="ri-time-line"></i>
							<span>Preparando pedido</span>
						</div>
					</div>

					<!-- Dropoff Column -->
					<div class="bg-green-50 backdrop-blur rounded-xl p-4">
						<div class="flex items-center gap-2 mb-3">
							<div class="w-8 h-8 bg-green-400 rounded-lg flex items-center justify-center">
								<i class="ri-map-pin-line text-white"></i>
							</div>
							<span class="text-green-800 font-bold text-xl text-center">ENTREGAR EN</span>
						</div>
						<p class="text-green-800 text-lg font-medium mb-2">{{ deliveryStore.activeOrder.dropoff }}</p>
						<div class="flex items-center gap-2 text-black text-sm">
							<i class="ri-road-map-line"></i>
							<span>{{ deliveryStore.activeOrder.distance || '2.5' }} km · 15 min</span>
						</div>
					</div>
				</div>

				<!-- Important info row -->
				<div class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-white/20">
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<i class="ri-money-dollar-circle-line text-white text-2xl"></i>
							<div>
								<p class="text-orange-800 text-sm font-semibold">Ganancia total</p>
								<p class="text-white text-2xl font-bold">${{ deliveryStore.activeOrder.amount }}</p>
							</div>
						</div>
						<div class="w-px h-10 bg-white/20"></div>
						<div class="flex items-center gap-2">
							<i class="ri-customer-service-line text-white text-2xl"></i>
							<div>
								<p class="text-orange-800 text-sm font-semibold">Cliente</p>
								<p class="text-white font-medium">Juan Pérez</p>
							</div>
						</div>
					</div>
					
					<button
						@click="goToDeliveryDetails"
						class="px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
					>
						Ver detalles completos
						<i class="ri-arrow-right-line"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Search and Filters -->
		<div v-if="driverStore.isOnline && !driverStore.hasActiveOrder" class="space-y-3">
			<!-- Search Bar -->
			<div class="relative">
				<i class="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
				<input
					v-model="searchQuery"
					type="text"
					placeholder="Buscar por restaurante o dirección..."
					class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
				/>
				<button
					v-if="searchQuery"
					@click="searchQuery = ''"
					class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
				>
					<i class="ri-close-line"></i>
				</button>
			</div>

			<!-- Filter Chips -->
			<div class="flex flex-wrap gap-2">
				<button
					v-for="filter in orderFilters"
					:key="filter.value"
					@click="selectedFilter = filter.value"
					:class="[
						'px-4 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px]',
						selectedFilter === filter.value
							? 'bg-primary-500 text-white shadow-md'
							: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
					]"
				>
					<i :class="filter.icon" class="mr-1.5"></i>
					{{ filter.label }}
				</button>
			</div>
		</div>

		<!-- Available Orders -->
		<div class="space-y-4">
			<div v-if="driverStore.isOnline && !driverStore.hasActiveOrder">
				<!-- Section Header -->
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
						<i class="ri-stack-line text-primary-500"></i>
						Pedidos disponibles
						<span v-if="filteredOrders.length" class="text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
							{{ filteredOrders.length }}
						</span>
					</h2>
					
					<button
						@click="refreshOrders"
						class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
						:disabled="isRefreshing"
					>
						<i class="ri-refresh-line text-gray-600 dark:text-gray-400" :class="{ 'animate-spin': isRefreshing }"></i>
					</button>
				</div>

				<!-- Loading State -->
				<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div v-for="n in 4" :key="n" class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md animate-pulse">
						<div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
						<div class="flex justify-between items-center">
							<div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
							<div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
						</div>
					</div>
				</div>

				<!-- Orders Grid -->
				<div v-else-if="filteredOrders.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div
						v-for="order in filteredOrders"
						:key="order.id"
						class="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-l-4 border-transparent hover:border-primary-500 hover:scale-[1.02]"
					>
						<!-- Order Header -->
						<div class="flex justify-between items-start mb-3">
							<div>
								<h3 class="font-semibold text-gray-800 dark:text-gray-200">
									{{ order.restaurant?.name || 'Restaurante' }}
								</h3>
								<p class="text-xs text-gray-500">Pedido #{{ order.id }}</p>
							</div>
							<span class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs rounded-full">
								{{ order.distance?.toFixed(1) || '?' }} km
							</span>
						</div>

						<!-- Locations -->
						<div class="space-y-2 mb-4">
							<div class="flex items-start gap-2 text-sm">
								<i class="ri-store-2-line text-primary-500 mt-0.5"></i>
								<span class="text-gray-700 dark:text-gray-300">{{ order.pickup }}</span>
							</div>
							<div class="flex items-start gap-2 text-sm">
								<i class="ri-map-pin-line text-red-500 mt-0.5"></i>
								<span class="text-gray-600 dark:text-gray-400">{{ order.dropoff }}</span>
							</div>
						</div>

						<!-- Time Estimate -->
						<div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
							<i class="ri-time-line"></i>
							<span>{{ order.estimatedTime || 15 }} min aprox.</span>
						</div>

						<!-- Footer -->
						<div class="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
							<div>
								<p class="text-xs text-gray-500">Ganancia total</p>
								<p class="text-xl font-bold text-green-600">${{ order.amount }}</p>
							</div>
							
							<button
								@click="acceptOrder(order.id)"
								:disabled="loading"
								class="flex items-center gap-1 bg-primary-500 hover:bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 group-hover:shadow-lg"
							>
								<i class="ri-check-line"></i>
								Aceptar
							</button>
						</div>

						<!-- Items Preview -->
						<div v-if="order.items?.length" class="mt-3 pt-2">
							<p class="text-xs text-gray-500 mb-1">Productos:</p>
							<div class="flex flex-wrap gap-1">
								<span
									v-for="item in order.items.slice(0, 2)"
									:key="item.id"
									class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
								>
									{{ item.quantity }}x {{ item.name }}
								</span>
								<span v-if="order.items.length > 2" class="text-xs text-gray-500">
									+{{ order.items.length - 2 }} más
								</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty State -->
				<div v-else class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-md">
					<div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
						<i class="ri-inbox-line text-4xl text-gray-400"></i>
					</div>
					<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay pedidos disponibles</h3>
					<p class="text-gray-500 mb-4">Prueba a actualizar o espera nuevos pedidos</p>
					<button
						@click="refreshOrders"
						class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition"
					>
						<i class="ri-refresh-line"></i>
						Actualizar
					</button>
				</div>
			</div>

			<!-- Offline State -->
			<div v-else-if="!driverStore.isOnline" class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-md">
				<div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="ri-wifi-off-line text-4xl text-gray-400"></i>
				</div>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Modo desconectado</h3>
				<p class="text-gray-500 mb-4">Activa el modo en línea para ver pedidos disponibles</p>
				<button
					@click="handleToggleOnline"
					class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition"
				>
					<i class="ri-play-line"></i>
					Conectarse
				</button>
			</div>

			<!-- Has Active Order State -->
			<div v-else-if="driverStore.hasActiveOrder" class="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-md">
				<div class="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
					<i class="ri-truck-line text-4xl text-primary-500"></i>
				</div>
				<h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Tienes una entrega activa</h3>
				<p class="text-gray-500 mb-4">Completa tu entrega actual para ver nuevos pedidos</p>
				<button
					@click="goToDeliveryDetails"
					class="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition"
				>
					<i class="ri-eye-line"></i>
					Ver entrega activa
				</button>
			</div>
		</div>

		<!-- Floating Refresh Button (Mobile) -->
		<Transition name="slide-up">
			<button
				v-if="driverStore.isOnline && !driverStore.hasActiveOrder && filteredOrders.length"
				@click="refreshOrders"
				class="lg:hidden fixed bottom-6 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all active:scale-95 z-40"
				:class="{ 'animate-spin': isRefreshing }"
			>
				<i class="ri-refresh-line text-xl"></i>
			</button>
		</Transition>

		<!-- Network Status Banner -->
		<Transition
			enter-active-class="transition duration-300 ease-out"
			enter-from-class="transform translate-y-2 opacity-0"
			enter-to-class="transform translate-y-0 opacity-100"
			leave-active-class="transition duration-200 ease-in"
			leave-from-class="transform translate-y-0 opacity-100"
			leave-to-class="transform translate-y-2 opacity-0"
		>
			<div
				v-if="!networkOnline"
				class="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm p-4 rounded-xl bg-amber-500 text-white shadow-lg z-50"
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

		<!-- Loading Overlay -->
		<div
			v-if="globalLoading"
			class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
		>
			<div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-xs w-full mx-4">
				<div class="flex flex-col items-center gap-4">
					<div class="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
					<p class="text-center text-gray-700 dark:text-gray-300">Procesando...</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDriverStore } from '../store/driver.store'
import { useDeliveryStore } from '../store/delivery.store'
import { useStatsStore } from '../store/stats.store'
import echo from '../services/echo'

// Interfaces
interface OrderItem {
	id: string | number
	quantity: number
	name: string
	price?: number
}

interface Restaurant {
	name: string
	address?: string
	location?: {
		latitude: number
		longitude: number
	}
}

interface Order {
	id: number
	restaurant?: Restaurant
	pickup: string
	dropoff: string
	distance?: number
	estimatedTime?: number
	amount: number
	items?: OrderItem[]
	status?: string
}

interface FilterOption {
	label: string
	value: 'all' | 'nearby' | 'highpay' | 'fastest'
	icon: string
}

const router = useRouter()
const driverStore = useDriverStore()
const deliveryStore = useDeliveryStore()
const statsStore = useStatsStore()

// Debug logs
console.log('DriverStore initialized:', {
	isOnline: driverStore.isOnline,
	hasActiveOrder: driverStore.hasActiveOrder,
	availableJobsCount: driverStore.availableJobs?.length,
})

console.log('DeliveryStore initialized:', {
	hasActiveOrder: deliveryStore.hasActiveOrder,
	availableJobsCount: deliveryStore.availableJobs?.length,
	currentDelivery: deliveryStore.activeOrder?.id,
})

console.log('StatsStore initialized:', {
	todayOrders: statsStore.todayOrders,
	earnings: statsStore.earnings,
})

// Local state
const searchQuery = ref('')
const selectedFilter = ref<'all' | 'nearby' | 'highpay' | 'fastest'>('all')
const loading = ref(false)
const globalLoading = ref(false)
const isRefreshing = ref(false)
const networkOnline = ref(navigator.onLine)

// Filter options
const orderFilters: FilterOption[] = [
	{ label: 'Todos', value: 'all', icon: 'ri-list-unordered' },
	{ label: 'Cercanos', value: 'nearby', icon: 'ri-map-pin-line' },
	{ label: 'Mejor pago', value: 'highpay', icon: 'ri-money-dollar-circle-line' },
	{ label: 'Más rápidos', value: 'fastest', icon: 'ri-speed-line' },
]

// Format earnings
const formatEarnings = (value: number) => {
	if (value === undefined || value === null) return '0'
	return value.toLocaleString('es-MX', { minimumFractionDigits: 2 })
}

// Filtered orders - usando deliveryStore.availableJobs
const filteredOrders = computed(() => {
	console.log('🔍 Filtering orders with search:', searchQuery.value, 'filter:', selectedFilter.value)
	
	const orders = deliveryStore.availableJobs || []
	console.log('📋 Available jobs from store:', orders.length)
	
	if (!orders.length) return []
	
	let filtered = [...orders]
	
	// Apply search
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		filtered = filtered.filter(o => 
			o.pickup?.toLowerCase().includes(query) ||
			o.dropoff?.toLowerCase().includes(query) ||
			o.restaurant?.name?.toLowerCase().includes(query) ||
			o.id?.toString().includes(query)
		)
		console.log('🔎 After search filter:', filtered.length)
	}
	
	// Apply filters
	switch (selectedFilter.value) {
		case 'nearby':
			filtered = filtered.filter(o => o.distance && o.distance < 3)
			console.log('📍 After nearby filter (<3km):', filtered.length)
			break
		case 'highpay':
			filtered = [...filtered].sort((a, b) => (b.amount || 0) - (a.amount || 0))
			console.log('💰 After highpay sort')
			break
		case 'fastest':
			filtered = [...filtered].sort((a, b) => (a.estimatedTime || 99) - (b.estimatedTime || 99))
			console.log('⚡ After fastest sort')
			break
	}
	
	return filtered
})

// Handle toggle online
const handleToggleOnline = async () => {
	console.log('🔄 Toggle online clicked, current:', driverStore.isOnline)
	
	if (driverStore.hasActiveOrder) {
		console.log('⛔ Cannot toggle: has active order')
		return
	}
	
	globalLoading.value = true
	try {
		await driverStore.toggleOnline()
		console.log('✅ Toggle online successful, new status:', driverStore.isOnline)
		
		if (driverStore.isOnline) {
			await refreshData()
		}
	} catch (error) {
		console.error('❌ Error toggling online:', error)
	} finally {
		globalLoading.value = false
	}
}

// Accept order
const acceptOrder = async (orderId: number) => {
	console.log('📦 Accepting order:', orderId)
	
	loading.value = true
	try {
		// Usar el store correcto
		await deliveryStore.acceptDeliveryOrder(orderId)
		console.log('✅ Order accepted successfully')
		
		await refreshData()
	} catch (error) {
		console.error('❌ Error accepting order:', error)
	} finally {
		loading.value = false
	}
}

// Refresh orders
const refreshOrders = async () => {
	console.log('🔄 Refreshing orders...')
	
	if (isRefreshing.value) {
		console.log('⏳ Already refreshing')
		return
	}
	
	isRefreshing.value = true
	try {
		await deliveryStore.loadAvailableJobs()
		console.log('✅ Orders refreshed, count:', deliveryStore.availableJobs?.length)
	} catch (error) {
		console.error('❌ Error refreshing orders:', error)
	} finally {
		setTimeout(() => {
			isRefreshing.value = false
		}, 1000)
	}
}

// Refresh all data
const refreshData = async () => {
	console.log('Refreshing all data...')
	
	loading.value = true
	try {
		await Promise.all([
			driverStore.initialize(),
			deliveryStore.initialize(),
			statsStore.fetchStats(),
		])
	} catch (error) {
		console.error('❌ Error refreshing data:', error)
	} finally {
		loading.value = false
	}
}

// Go to delivery details
const goToDeliveryDetails = () => {
	if (deliveryStore.activeOrder) {
		console.log('🚚 Navigating to delivery:', deliveryStore.activeOrder.id)
		router.push(`/delivery/${deliveryStore.activeOrder.id}`)
	} else if (driverStore.activeOrder) {
		console.log('🚚 Navigating to driver order:', driverStore.activeOrder.id)
		router.push(`/delivery/${driverStore.activeOrder.id}`)
	}
}

// Network status handlers
const updateNetworkStatus = () => {
	networkOnline.value = navigator.onLine
	console.log('📡 Network status changed:', networkOnline.value ? 'online' : 'offline')
}

// Auto refresh interval
let refreshInterval: ReturnType<typeof setInterval>

// Setup WebSocket listeners
const setupWebSocketListeners = () => {
	console.log('Setting up WebSocket listeners...')
	
	// Escuchar nuevos pedidos disponibles
	echo.channel('delivery.orders')
		.listen('NewOrderAvailable', (event: any) => {
			console.log('New order available via WebSocket:', event)
			if (driverStore.isOnline && !driverStore.hasActiveOrder) {
				deliveryStore.loadAvailableJobs()
			}
		})
	// Escuchar actualizaciones de pedidos
	echo.channel('delivery.orders')
		.listen('OrderStatusUpdated', (event: any) => {
			console.log('Order status updated via WebSocket:', event)
			refreshData()
		})
}

// Lifecycle
onMounted(async () => {
	
	globalLoading.value = true
	try {
		await refreshData()
		
		// Setup WebSocket
		setupWebSocketListeners()
		
		// Set up auto refresh (30 seconds)
		refreshInterval = setInterval(() => {
			console.log('⏰ Auto-refresh triggered')
			if (driverStore.isOnline && !driverStore.hasActiveOrder) {
				deliveryStore.loadAvailableJobs()
			}
		}, 30000)
		
		// Network listeners
		window.addEventListener('online', updateNetworkStatus)
		window.addEventListener('offline', updateNetworkStatus)
		
	} catch (error) {
		console.error('❌ Error initializing:', error)
	} finally {
		globalLoading.value = false
	}
})

onUnmounted(() => {
	
	clearInterval(refreshInterval)
	window.removeEventListener('online', updateNetworkStatus)
	window.removeEventListener('offline', updateNetworkStatus)
	
	// Leave WebSocket channels
	echo.leave('delivery.orders')
})
</script>

<style scoped>


/* Animations */
@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }

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

/* Line clamp */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Min width for toggle */
.min-w-\[100px\] {
	min-width: 100px;
}
</style>