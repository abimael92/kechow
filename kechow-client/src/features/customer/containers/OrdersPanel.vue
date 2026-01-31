<template>
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
	

		<!-- Greeting Banner -->
		<div class="hidden lg:block bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 lg:p-8 rounded-2xl mb-6 lg:mb-8">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
				<div>
					<h1 class="text-2xl lg:text-3xl font-bold mb-2">
						{{ getGreeting() }} {{ userName.split(' ')[0] }}!
					</h1>
					<p class="text-white/90">
						Descubre comida deliciosa cerca de ti
					</p>
				</div>
				<div class="flex items-center gap-4 mt-4 lg:mt-0">
					<button 
						@click="toggleLanguage"
						class="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors flex items-center gap-2"
					>
						<i class="ri-translate-2"></i>
						<span>Idioma</span>
					</button>
					<button 
						@click="viewCart"
						class="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors relative"
					>
						<i class="ri-shopping-cart-line"></i>
						<span v-if="cartItemCount > 0" class="ml-2">{{ cartItemCount }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile Greeting -->
		<div class="lg:hidden mb-6">
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
				{{ getGreeting() }} {{ userName.split(' ')[0] }}!
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Descubre comida deliciosa cerca de ti
			</p>
		</div>

		<!-- Search bar -->
		<div class="mb-6 lg:mb-8">
			<div class="relative">
				<i
					class="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 flex items-center justify-center"
				></i>
				<input
					placeholder="Buscar pedidos..."
					class="w-full pl-12 pr-10 py-3 lg:py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm lg:text-base placeholder-gray-500 dark:placeholder-gray-400"
					type="text"
					v-model="searchQuery"
					@input="filterOrders"
				/>
				<button
					v-if="searchQuery"
					@click="clearSearch"
					class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
				>
					<i class="ri-close-line"></i>
				</button>
			</div>
		</div>

		<!-- Categories -->
		<div class="mb-6 lg:mb-8">
			<div class="flex space-x-2 overflow-x-auto pb-3 -mb-3 scrollbar-hide">
				<button
					v-for="cat in categories"
					:key="cat.id"
					@click="selectCategory(cat.id)"
					:class="[
						'px-4 lg:px-6 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer flex-shrink-0',
						selectedCategory === cat.id
							? 'bg-orange-600 text-white'
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
					]"
				>
					{{ cat.name.es }}
				</button>
			</div>
		</div>


		<!-- Orders List -->
		<div v-if="activeTab === 'orders'">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
				<h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
					Mis pedidos
				</h2>
				<div class="flex items-center gap-2">
					<button
						@click="refreshOrders"
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						:title="!isOnline ? 'Sin conexión' : 'Actualizar'"
						:disabled="loading || !isOnline"
					>
						<i class="ri-refresh-line" :class="{ 'animate-spin': loading }"></i>
					</button>
					<button
						@click="filterOrders"
						class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						title="Filtrar"
					>
						<i class="ri-filter-line"></i>
					</button>
				</div>
			</div>
			
			<div v-if="loading" class="space-y-4">
				<div v-for="i in 3" :key="i" class="bg-white dark:bg-neutral-900 p-4 lg:p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
					<Skeleton variant="text" class="mb-4 w-1/4" />
					<Skeleton variant="text" class="mb-2 w-3/4" />
					<Skeleton variant="text" class="w-1/2" />
				</div>
			</div>

			<div v-else-if="loadError" class="py-8">
				<EmptyState
					title="Error al cargar pedidos"
					description="No se pudieron cargar los pedidos. Revisa tu conexión e inténtalo de nuevo."
					icon="ri-error-warning-line"
				>
					<template #action>
						<button
							@click="refreshOrders"
							:disabled="!isOnline"
							class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
						>
							Reintentar
						</button>
					</template>
				</EmptyState>
			</div>
			
			<div v-else class="space-y-4">
				<template v-if="filteredOrders.length === 0">
					<EmptyState
						title="No hay pedidos"
						:description="searchQuery ? 'Prueba con otra búsqueda' : 'Realiza tu primer pedido'"
						icon="ri-shopping-bag-line"
					>
						<template #action>
							<button
								@click="browseRestaurants"
								class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
							>
								Ver restaurantes
							</button>
						</template>
					</EmptyState>
				</template>
				<template v-else>
				<div
					v-for="order in filteredOrders"
					:key="order.id"
					class="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
					@click="viewOrderDetails(order)"
				>
					<div class="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
						<div class="flex-1">
							<div class="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 mb-2">
								<h3 class="font-semibold text-gray-900 dark:text-white text-lg">{{ order.restaurant }}</h3>
								<span
									:class="getStatusClass(order.status)"
									class="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
								>
									{{ statusText(order.status) }}
								</span>
							</div>
							<p class="text-gray-500 dark:text-gray-400 text-sm mb-2">
								Pedido #{{ order.id }} • {{ order.items.length }} {{ order.items.length === 1 ? 'artículo' : 'artículos' }}
							</p>
							<div class="text-sm text-gray-600 dark:text-gray-300 line-clamp-1 mb-2">
								{{ order.items.join(', ') }}
							</div>
							<div class="flex items-center gap-4 text-sm">
								<span class="font-semibold text-gray-900 dark:text-white">
									{{ formatCurrency(order.total) }}
								</span>
								<span class="text-gray-500 dark:text-gray-400">
									{{ formatDate(order.date) }}
								</span>
							</div>
						</div>
					</div>
					
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
						<div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<i class="ri-time-line"></i>
							<span>{{ getDeliveryTime(order) }}</span>
						</div>
						<div class="flex gap-2">
							<button
								@click.stop="trackOrder(order)"
								class="px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
							>
								<i class="ri-map-pin-line"></i>
								<span class="hidden xs:inline">Rastrear</span>
							</button>
							<button
								@click.stop="reorder(order)"
								class="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium cursor-pointer flex items-center gap-2"
							>
								<i class="ri-repeat-line"></i>
								<span class="hidden xs:inline">Volver a pedir</span>
							</button>
						</div>
					</div>
				</div>
				
				<!-- Pagination -->
				<div v-if="filteredOrders.length > itemsPerPage" class="flex justify-center mt-8">
					<div class="flex items-center gap-2">
						<button
							@click="previousPage"
							:disabled="currentPage === 1"
							:class="[
								'p-2 rounded-lg transition-colors',
								currentPage === 1
									? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
									: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
							]"
						>
							<i class="ri-arrow-left-s-line"></i>
						</button>
						<span class="text-sm text-gray-600 dark:text-gray-400">
							Página {{ currentPage }} de {{ totalPages }}
						</span>
						<button
							@click="nextPage"
							:disabled="currentPage === totalPages"
							:class="[
								'p-2 rounded-lg transition-colors',
								currentPage === totalPages
									? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
									: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
							]"
						>
							<i class="ri-arrow-right-s-line"></i>
						</button>
					</div>
				</div>
				</template>
			</div>
		</div>

		<!-- Favorites Tab -->
		<div v-if="activeTab === 'favorites'" class="space-y-6">
			<h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Favoritos</h2>
			
			<EmptyState
				v-if="favorites.length === 0"
				title="Aún no tienes favoritos"
				description="Guarda tus restaurantes favoritos para encontrarlos rápido"
				icon="ri-heart-line"
			>
				<template #action>
					<button
						@click="browseRestaurants"
						class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
					>
						Ver restaurantes
					</button>
				</template>
			</EmptyState>
			
			<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
				<div
					v-for="fav in visibleFavorites"
					:key="fav.id"
					class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden group"
				>
					<div class="relative h-40 bg-gray-200 dark:bg-gray-700 overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
						<button
							@click.stop="toggleFavorite(fav)"
							class="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-colors"
						>
							<i class="ri-heart-fill text-red-500 text-lg"></i>
						</button>
					</div>
					<div class="p-4">
						<div class="flex items-start justify-between mb-3">
							<div class="flex-1 min-w-0">
								<h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate">{{ fav.name }}</h3>
								<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ fav.cuisine }}</p>
							</div>
						</div>
						<div class="flex items-center gap-2 mb-4">
							<div class="flex text-yellow-400">
								<i v-for="star in 5" :key="star" class="ri-star-fill"></i>
							</div>
							<span class="text-sm text-gray-600 dark:text-gray-400">4.8 • 20-30 min</span>
						</div>
						<button
							@click="viewRestaurant(fav)"
							class="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium cursor-pointer"
						>
							Ver menú
						</button>
					</div>
				</div>
			</div>
			
			<!-- Load More Button -->
			<div v-if="favorites.length > favoritesToShow" class="text-center pt-4">
				<button
					@click="showAllFavorites"
					class="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium cursor-pointer"
				>
					Cargar más
				</button>
			</div>
		</div>

		<!-- Profile Tab -->
		<div v-if="activeTab === 'profile'" class="space-y-6">
			<h2 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Perfil</h2>
			
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
				<!-- Profile Header -->
				<div class="p-6 border-b border-gray-100 dark:border-gray-700">
					<div class="flex flex-col sm:flex-row sm:items-center gap-4">
						<div class="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
							{{ userInitials }}
						</div>
						<div class="flex-1 min-w-0">
							<h3 class="font-semibold text-gray-900 dark:text-white text-xl">{{ userName }}</h3>
							<p class="text-gray-500 dark:text-gray-400 mt-1">{{ userEmail }}</p>
							<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
								<i class="ri-map-pin-line"></i>
								{{ userAddress }}
							</p>
						</div>
						<button
							@click="editProfile"
							class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium cursor-pointer"
						>
							Editar perfil
						</button>
					</div>
				</div>
				
				<!-- Stats -->
				<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-100 dark:border-gray-700">
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ totalOrders }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Total de pedidos</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ favoriteRestaurants }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Favoritos</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900 dark:text-white">{{ userSince }}</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Miembro desde</p>
					</div>
					<div class="text-center">
						<p class="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
						<p class="text-sm text-gray-500 dark:text-gray-400">Calificación</p>
					</div>
				</div>
				
				<!-- Menu Items -->
				<div class="divide-y divide-gray-100 dark:divide-gray-700">
					<button
						v-for="item in profileMenuItems"
						:key="item.id"
						@click="handleProfileMenuClick(item)"
						class="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
					>
						<div class="flex items-center gap-3">
							<div :class="item.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center">
								<i :class="[item.icon, item.iconColor]" class="text-lg"></i>
							</div>
							<div class="text-left">
								<p class="font-medium text-gray-900 dark:text-white">{{ profileLabel(item.label) }}</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">{{ profileDesc(item.description) }}</p>
							</div>
						</div>
						<i class="ri-arrow-right-s-line text-gray-400"></i>
					</button>
				</div>
			</div>
			
			<!-- Settings Card -->
			<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
				<h3 class="font-semibold text-gray-900 dark:text-white text-lg mb-4">Configuración</h3>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium text-gray-900 dark:text-white">Notificaciones</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">Recibe alertas de tus pedidos y ofertas</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" v-model="notificationsEnabled" class="sr-only peer">
							<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
						</label>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium text-gray-900 dark:text-white">Modo oscuro</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">Usar tema oscuro en la interfaz</p>
						</div>
						<label class="relative inline-flex items-center cursor-pointer">
							<input type="checkbox" v-model="darkModeEnabled" @change="toggleDarkMode" class="sr-only peer">
							<div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
						</label>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="font-medium text-gray-900 dark:text-white">Idioma</p>
							<p class="text-sm text-gray-500 dark:text-gray-400">Idioma de la aplicación</p>
						</div>
						<button
							@click="toggleLanguage"
							class="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium cursor-pointer flex items-center gap-2"
						>
							<i class="ri-translate-2"></i>
							<span>Idioma</span>
						</button>
					</div>
				</div>
			</div>
		</div>


		<!-- Fixed Cart Button for Desktop -->
		<button
			@click="viewCart"
			class="hidden lg:fixed lg:flex bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-300 cursor-pointer z-40 group items-center justify-center"
			aria-label="Carrito"
		>
			<i class="ri-shopping-cart-line text-xl"></i>
			<span
				v-if="cartItemCount > 0"
				class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
			>
				{{ cartItemCount }}
			</span>
		</button>
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCustomerOrders } from '@/features/customer/services/customer.service';
import Skeleton from '@/shared/ui/Skeleton.vue';
import EmptyState from '@/shared/ui/EmptyState.vue';
import { useOnline } from '@/shared/composables/useOnline';

const router = useRouter();

// Spanish-only UI labels
const statusTextMap: Record<string, string> = {
	delivered: 'Entregado',
	Entregado: 'Entregado',
	on_the_way: 'En camino',
	'En camino': 'En camino',
	preparing: 'Preparando',
	Preparando: 'Preparando',
	cancelled: 'Cancelado',
	Cancelado: 'Cancelado',
	new: 'Nuevo',
	ready: 'Listo',
	out_for_delivery: 'En camino',
	declined: 'Rechazado',
};
const profileLabels: Record<string, string> = {
	addresses: 'Direcciones',
	paymentMethods: 'Métodos de pago',
	orderHistory: 'Historial de pedidos',
	helpSupport: 'Ayuda y soporte',
	logout: 'Cerrar sesión',
};
const profileDescs: Record<string, string> = {
	addressesDescription: 'Gestiona tus direcciones de entrega',
	paymentMethodsDescription: 'Tarjetas y métodos de pago',
	orderHistoryDescription: 'Ver todos tus pedidos',
	helpSupportDescription: 'Preguntas frecuentes y contacto',
	logoutDescription: 'Cerrar sesión de tu cuenta',
};
function statusText(status: string): string {
	return statusTextMap[status] ?? status;
}
function profileLabel(key: string): string {
	return profileLabels[key] ?? key;
}
function profileDesc(key: string): string {
	return profileDescs[key] ?? key;
}

// Types
type Order = {
	id: number;
	status: string;
	total: number;
	date: string;
	items: string[];
	restaurant: string;
	estimatedDelivery?: string;
};

type Favorite = {
	id: number;
	name: string;
	cuisine: string;
};

type Category = {
	id: string;
	name: {
		en: string;
		es: string;
	};
};

type Tab = {
	id: string;
	label: string;
	count?: number;
};

const { isOnline } = useOnline();

// State
const orders = ref<Order[]>([]);
const filteredOrders = ref<Order[]>([]);
const loading = ref(true);
const loadError = ref<Error | null>(null);
const searchQuery = ref('');
const selectedCategory = ref('all');
const activeTab = ref('orders');
const cartItemCount = ref(3);
const favoritesToShow = ref(6);
const showAllFavoritesFlag = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;
const mobileMenuOpen = ref(false);
const notificationsEnabled = ref(true);
const darkModeEnabled = ref(false);

// User data
const userName = ref('Juan Pérez');
const userEmail = ref('juan.perez@example.com');
const userAddress = ref('Av. Principal 123, Centro');
const userSince = ref('2023');
const totalOrders = ref(24);
const favoriteRestaurants = ref(6);

// Categories with translations
const categories = ref<Category[]>([
	{ id: 'all', name: { en: 'All', es: 'Todos' } },
	{ id: 'mexican', name: { en: 'Mexican', es: 'Mexicana' } },
	{ id: 'northern', name: { en: 'Northern', es: 'Norteña' } },
	{ id: 'tacos', name: { en: 'Tacos', es: 'Tacos' } },
	{ id: 'japanese', name: { en: 'Japanese', es: 'Japonesa' } },
	{ id: 'italian', name: { en: 'Italian', es: 'Italiana' } },
	{ id: 'american', name: { en: 'American', es: 'Americana' } },
	{ id: 'chinese', name: { en: 'Chinese', es: 'China' } },
	{ id: 'indian', name: { en: 'Indian', es: 'India' } },
	{ id: 'healthy', name: { en: 'Healthy', es: 'Saludable' } },
]);

// Tabs with counts
const tabs = ref<Tab[]>([
	{ id: 'orders', label: 'myOrders', count: 5 },
	{ id: 'favorites', label: 'favorites', count: 6 },
	{ id: 'profile', label: 'profile' },
]);

// Favorites
const favorites = ref<Favorite[]>([
	{ id: 1, name: "La Fonda de Doña Chole", cuisine: "Mexicana" },
	{ id: 2, name: "El Ranchito Norteño", cuisine: "Norteña" },
	{ id: 3, name: "Tacos El Güero", cuisine: "Tacos" },
	{ id: 4, name: "Sushi Zen", cuisine: "Japonesa" },
	{ id: 5, name: "Pizzas Napoli", cuisine: "Italiana" },
	{ id: 6, name: "Burger House", cuisine: "Americana" },
	{ id: 7, name: "Comida China Express", cuisine: "China" },
	{ id: 8, name: "Restaurante India", cuisine: "India" },
	{ id: 9, name: "Ensaladas Frescas", cuisine: "Saludable" },
]);

// Profile menu items
const profileMenuItems = ref([
	{ id: 'addresses', label: 'addresses', description: 'addressesDescription', icon: 'ri-map-pin-line', iconBg: 'bg-blue-100 dark:bg-blue-900/30', iconColor: 'text-blue-600 dark:text-blue-400' },
	{ id: 'payment', label: 'paymentMethods', description: 'paymentMethodsDescription', icon: 'ri-bank-card-line', iconBg: 'bg-green-100 dark:bg-green-900/30', iconColor: 'text-green-600 dark:text-green-400' },
	{ id: 'orders', label: 'orderHistory', description: 'orderHistoryDescription', icon: 'ri-shopping-bag-line', iconBg: 'bg-purple-100 dark:bg-purple-900/30', iconColor: 'text-purple-600 dark:text-purple-400' },
	{ id: 'help', label: 'helpSupport', description: 'helpSupportDescription', icon: 'ri-question-line', iconBg: 'bg-gray-100 dark:bg-gray-700', iconColor: 'text-gray-600 dark:text-gray-400' },
	{ id: 'logout', label: 'logout', description: 'logoutDescription', icon: 'ri-logout-box-r-line', iconBg: 'bg-red-100 dark:bg-red-900/30', iconColor: 'text-red-600 dark:text-red-400' },
]);

// Mobile navigation
const mobileNavItems = ref([
	{ id: 'orders', label: 'myOrders', icon: 'ri-shopping-bag-line', count: 5 },
	{ id: 'favorites', label: 'favorites', icon: 'ri-heart-line', count: 6 },
	{ id: 'search', label: 'search', icon: 'ri-search-line' },
	{ id: 'profile', label: 'profile', icon: 'ri-user-line' },
]);

// Computed Properties
const userInitials = computed(() => {
	return userName.value
		.split(' ')
		.map(word => word[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
});

const visibleFavorites = computed(() => {
	if (showAllFavoritesFlag.value) {
		return favorites.value;
	}
	return favorites.value.slice(0, favoritesToShow.value);
});

const paginatedOrders = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filteredOrders.value.slice(start, end);
});

const totalPages = computed(() => {
	return Math.ceil(filteredOrders.value.length / itemsPerPage);
});

// Methods
const getGreeting = () => {
	const hour = new Date().getHours();
	if (hour < 12) return 'Buenos días';
	if (hour < 18) return 'Buenas tardes';
	return 'Buenas noches';
};

const getStatusClass = (status: string) => {
	switch (status) {
		case 'delivered':
		case 'Entregado':
			return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
		case 'on_the_way':
		case 'En camino':
			return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
		case 'preparing':
		case 'Preparando':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
		case 'cancelled':
		case 'Cancelado':
			return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
	}
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	
	if (diffDays === 0) return 'Hoy';
	if (diffDays === 1) return 'Ayer';
	if (diffDays < 7) return `Hace ${diffDays} días`;
	
	return date.toLocaleDateString('es', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	});
};

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat('es-MX', {
		style: 'currency',
		currency: 'MXN',
		minimumFractionDigits: 2
	}).format(amount);
};

const getDeliveryTime = (order: Order) => {
	if (order.estimatedDelivery) {
		const date = new Date(order.estimatedDelivery);
		return `Entrega estimada: ${date.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`;
	}
	return 'Hora de entrega no disponible';
};

const filterOrders = () => {
	if (!searchQuery.value.trim()) {
		filteredOrders.value = [...orders.value];
	} else {
		const query = searchQuery.value.toLowerCase();
		filteredOrders.value = orders.value.filter(order =>
			order.restaurant.toLowerCase().includes(query) ||
			order.items.some(item => item.toLowerCase().includes(query)) ||
			order.id.toString().includes(query)
		);
	}
	currentPage.value = 1;
};

const clearSearch = () => {
	searchQuery.value = '';
	filteredOrders.value = [...orders.value];
};

const selectCategory = (categoryId: string) => {
	selectedCategory.value = categoryId;
	// In a real app, filter orders by category
	console.log('Selected category:', categoryId);
};

const refreshOrders = async () => {
	loadError.value = null;
	loading.value = true;
	try {
		const ordersData = await getCustomerOrders();
		orders.value = ordersData.map((o) => ({
			id: parseInt(o.id),
			status: o.status === 'out_for_delivery' ? 'on_the_way' : o.status,
			total: o.totalAmount,
			date: o.createdAt,
			items: o.items.map((item) => item.name),
			restaurant: o.customerName || 'Restaurante',
			estimatedDelivery: o.status === 'out_for_delivery' ? o.updatedAt : undefined,
		}));
		filterOrders();
	} catch (error) {
		loadError.value = error instanceof Error ? error : new Error(String(error));
		console.error('Error loading orders:', error);
	} finally {
		loading.value = false;
	}
};

const viewOrderDetails = (order: Order) => {
	router.push({ name: 'OrderTracking', params: { id: order.id.toString() } });
};

const trackOrder = (order: Order) => {
	router.push({ name: 'OrderTracking', params: { id: order.id.toString() } });
};

const reorder = (order: Order) => {
	console.log('Reorder:', order);
	cartItemCount.value += order.items.length;
	alert(`${order.items.length} artículo(s) agregado(s) al carrito`);
};

const browseRestaurants = () => {
	console.log('Browse restaurants');
	// Navigate to restaurants page
};

const viewRestaurant = (restaurant: Favorite) => {
	console.log('View restaurant:', restaurant);
	// Navigate to restaurant menu
};

const toggleFavorite = (restaurant: Favorite) => {
	const index = favorites.value.findIndex(fav => fav.id === restaurant.id);
	if (index > -1) {
		favorites.value.splice(index, 1);
		alert(`"${restaurant.name}" eliminado de favoritos`);
	} else {
		favorites.value.push(restaurant);
		alert(`"${restaurant.name}" agregado a favoritos`);
	}
};

const showAllFavorites = () => {
	showAllFavoritesFlag.value = !showAllFavoritesFlag.value;
};

const viewCart = () => {
	console.log('View cart');
	// Navigate to cart page
};

const toggleMobileMenu = () => {
	mobileMenuOpen.value = !mobileMenuOpen.value;
};

const toggleLanguage = () => {
	// App is Spanish-only; kept for future i18n.
	localStorage.setItem('preferredLanguage', 'es');
};

const toggleDarkMode = () => {
	if (darkModeEnabled.value) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
	localStorage.setItem('darkMode', darkModeEnabled.value.toString());
};

const handleMobileNavClick = (nav: any) => {
	if (nav.id === 'search') {
		// Focus search input
		const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
		if (searchInput) {
			searchInput.focus();
		}
	} else {
		activeTab.value = nav.id;
	}
};

const handleProfileMenuClick = (item: any) => {
	switch (item.id) {
		case 'addresses':
			viewAddresses();
			break;
		case 'payment':
			paymentMethods();
			break;
		case 'orders':
			activeTab.value = 'orders';
			break;
		case 'help':
			contactSupport();
			break;
		case 'logout':
			logout();
			break;
	}
};

const editProfile = () => {
	console.log('Edit profile');
	// Open profile editor
};

const viewAddresses = () => {
	console.log('View addresses');
	// Open addresses management
};

const paymentMethods = () => {
	console.log('Payment methods');
	// Open payment methods management
};

const contactSupport = () => {
	console.log('Contact support');
	// Open support page
};

const logout = () => {
	console.log('Logout');
	// Handle logout
	alert('¿Cerrar sesión?');
};

const previousPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
};

const nextPage = () => {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
};

// Lifecycle
onMounted(async () => {
	await refreshOrders();

	// Load user preferences
	const savedDarkMode = localStorage.getItem('darkMode');
	if (savedDarkMode === 'true') {
		darkModeEnabled.value = true;
		document.documentElement.classList.add('dark');
	}
});

</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
	height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
	@apply bg-gray-100 dark:bg-gray-800 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
	@apply bg-gray-300 dark:bg-gray-600 rounded-full;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
	@apply bg-gray-400 dark:bg-gray-500;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

/* Line clamp utility */
.line-clamp-1 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}

.line-clamp-2 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
}

/* Animations */
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}

.animate-spin {
	animation: spin 1s linear infinite;
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive utilities */
@media (max-width: 640px) {
	.text-lg {
		font-size: 1.125rem;
	}
	.text-xl {
		font-size: 1.25rem;
	}
	.text-2xl {
		font-size: 1.5rem;
	}
}

/* Smooth transitions */
.transition-all {
	transition-property: all;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 300ms;
}

/* Improve focus states */
button:focus {
	outline: 2px solid #f97316;
	outline-offset: 2px;
}

/* Dark mode adjustments */
.dark .bg-gradient-to-r {
	background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

.dark .from-blue-500 {
	--tw-gradient-from: #3b82f6;
}

.dark .to-purple-500 {
	--tw-gradient-to: #8b5cf6;
}

/* Mobile bottom nav spacing */
@media (max-width: 1024px) {
	main {
		padding-bottom: 80px;
	}
}
</style>