<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, Ref, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/features/customer/cart/cart.store';
import { useCartPanel } from '@/features/customer/cart/useCartPanel';
import { useRestaurantStore } from '@/features/customer/store/useRestaurantStore';
import { useOfflineSync } from '@/composables/useOfflineSync';



// Interfaces
interface MenuItem {
	id: string; // Change from number to string
	name: string;
	price: number;
	image?: string;
	image_url?: string;
	description?: string;
	category?: string;
	stock?: number;
	is_available?: boolean;
}

interface CartMenuItem {
	id: number;
	name: string;
	price: number;
	image_url?: string;
	stock?: number;
	is_available: boolean;
}

interface Restaurant {
	id: number;
	name: string;
	description?: string;
	logo_url?: string;
	cover_image?: string;
	image?: string;
	rating?: number;
	reviews?: number;
	delivery_time?: string;
	distance?: string;
	is_open?: boolean;
	menu?: MenuItem[];
}

interface OfflineAction {
	type: string;
	payload: {
		restaurantId: number;
		item: CartMenuItem;
		quantity: number;
	};
}

interface OfflineSync {
	isOnline: Ref<boolean>;
	syncOfflineActions: () => Promise<void>;
}

interface CartPanelComposable {
	openCartPanel: () => void;
}

interface RestaurantStore {
	getRestaurantById: (id: number) => Restaurant | undefined;
	fetchRestaurant: (id: number) => Promise<void>;
	refreshRestaurant: (id: number) => Promise<void>;
	queueOfflineAction: (action: OfflineAction) => void;
}

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { openCartPanel }: CartPanelComposable = useCartPanel();
const restaurantStore: RestaurantStore = useRestaurantStore();
// NOTE: useOfflineSync import was commented out due to being undefined
const { isOnline, syncOfflineActions }: OfflineSync = useOfflineSync();

// Temporary mock for restaurantStore to resolve TypeScript error
// const restaurantStore: RestaurantStore = {
// 	getRestaurantById: () => undefined,
// 	fetchRestaurant: async () => {},
// 	refreshRestaurant: async () => {},
// 	queueOfflineAction: () => {},
// };

// Temporary mock for isOnline
// const isOnline = ref(true);
// const syncOfflineActions = async () => {};

// State
const showAddedFeedback = ref<string | null>(null);
const searchQuery = ref('');
const selectedCategory = ref('all');
const showFilters = ref(false);
const isLoading = ref(false);
const isRefreshing = ref(false);
const isPullToRefresh = ref(false);
let pullToRefreshStart = 0;

// Computed
const restaurantId = computed(() => {
	const id = route.params.id;
	return id ? Number(id) : 0;
});

const restaurant = computed(() => restaurantStore.getRestaurantById(restaurantId.value));

const menuItems = computed(() => {
	if (!restaurant.value || !restaurant.value.menu) return [];
	
	let items = [...restaurant.value.menu];
	
	// Filter by search
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		items = items.filter(item => 
			item.name.toLowerCase().includes(query) || 
			item.description?.toLowerCase().includes(query)
		);
	}
	
	// Filter by category
	if (selectedCategory.value !== 'all') {
		items = items.filter(item => item.category === selectedCategory.value);
	}
	
	return items;
});

const categories = computed((): string[] => {
	if (!restaurant.value || !restaurant.value.menu) return [];
	const cats = new Set(restaurant.value.menu.map(item => item.category).filter(Boolean));
	return ['all', ...Array.from(cats)] as string[];
});

const totalItems = computed(() => cartStore.itemCount);
const totalPrice = computed(() => cartStore.subtotal);

// Methods
function cartQuantityFor(itemId: number): number {
	const found = cartStore.items.find((i) => i.menu_item_id === itemId);
	return found?.quantity ?? 0;
}

async function add(item: { id: string | number; name: string; price: number; image?: string; stock?: number }) {
	const itemId = Number(item.id);
	if (!isOnline.value) {
		// Store action for offline sync
		restaurantStore.queueOfflineAction({
			type: 'ADD_TO_CART',
			payload: {
				restaurantId: restaurantId.value,
				item: {
					id: itemId,
					name: item.name,
					price: item.price,
					image_url: item.image,
					stock: item.stock,
					is_available: true,
				},
				quantity: 1
			}
		});
	}
	
	const result = await cartStore.addItem(
		restaurantId.value,
		{
			id: itemId,
			name: item.name,
			price: item.price,
			image_url: item.image,
			stock: item.stock,
			is_available: true,
		},
		1
	);
	
	if (result.success) {
		showAddedFeedback.value = String(item.id);
		setTimeout(() => { showAddedFeedback.value = null; }, 600);
	}
}

async function remove(item: { id: string | number; name: string; price: number; stock?: number }) {
	const itemId = Number(item.id);
	const cartItem = cartStore.items.find((i) => i.menu_item_id === itemId);
	if (!cartItem) return;
	const qty = cartQuantityFor(itemId);
	if (qty <= 1) return;
	await cartStore.updateQuantity(cartItem.id, qty - 1);
}

async function setQuantity(
	item: { id: number; name: string; price: number; stock?: number },
	quantity: number
) {
	const maxQty = Math.min(20, item.stock ?? 20);
	const qty = Math.max(0, Math.min(quantity, maxQty));
	const cartItem = cartStore.items.find((i) => i.menu_item_id === item.id);
	
	if (!cartItem) {
		if (qty > 0) {
			await cartStore.addItem(
				restaurantId.value,
				{
					id: item.id,
					name: item.name,
					price: item.price,
					stock: item.stock,
					is_available: true,
				},
				qty
			);
		}
		return;
	}
	await cartStore.updateQuantity(cartItem.id, qty);
}

function goBack() {
	if (window.history.length > 1) router.back();
	else router.push({ name: 'Home' });
}

function goToCart() {
	openCartPanel();
}

function selectCategory(category: string) {
	selectedCategory.value = category;
	showFilters.value = false;
}

// Refresh restaurant data
const refreshData = async () => {
	if (isRefreshing.value) return;
	
	isRefreshing.value = true;
	await restaurantStore.refreshRestaurant(restaurantId.value);
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
			refreshData().finally(() => {
				isPullToRefresh.value = false;
			});
		}
	}
};

const handleTouchEnd = () => {
	pullToRefreshStart = 0;
};

// Lifecycle
onMounted(async () => {
	isLoading.value = true;
	await restaurantStore.fetchRestaurant(restaurantId.value);
	isLoading.value = false;
	
	// Add pull to refresh listeners
	document.addEventListener('touchstart', handleTouchStart);
	document.addEventListener('touchmove', handleTouchMove);
	document.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
	document.removeEventListener('touchstart', handleTouchStart);
	document.removeEventListener('touchmove', handleTouchMove);
	document.removeEventListener('touchend', handleTouchEnd);
});

// Watch for online status
watch(isOnline, (online) => {
	if (online) {
		syncOfflineActions();
	}
});
</script>

<template>
	<div class="restaurant-detail-root min-w-0 overflow-x-hidden">
		<!-- Loading State -->
		<div v-if="isLoading" class="flex items-center justify-center min-h-screen">
			<div class="text-center">
				<div class="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p class="text-gray-600 dark:text-gray-400">Cargando restaurante...</p>
			</div>
		</div>

		<!-- Restaurant Content -->
		<div v-else-if="restaurant" class="min-h-screen py-4 sm:py-6">
			<div class="max-w-4xl mx-auto px-4 sm:px-6 min-w-0">
				<!-- Header - Similar to driver dashboard style -->
				<header class="sticky top-0 z-30 shadow-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-lg mb-4">
					<div class="flex items-start gap-3 p-4">
						<!-- Left icon/logo -->
						<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0 overflow-hidden">
							<img 
								v-if="restaurant.logo_url" 
								:src="restaurant.logo_url" 
								:alt="restaurant.name"
								class="w-full h-full object-cover"
							/>
							<i v-else class="ri-store-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
						</div>
						
						<!-- Center content -->
						<div class="flex-1">
							<h1 class="text-primary-500 dark:text-primary-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
								{{ restaurant.name }}
							</h1>
							<p class="text-gray-600 dark:text-gray-400 font-normal text-sm sm:text-base line-clamp-2 mt-1">
								{{ restaurant.description || 'Los mejores platillos para ti' }}
							</p>
							
							<!-- Restaurant meta info -->
							<div class="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm">
								<span class="flex items-center gap-1 text-gray-500">
									<i class="ri-star-fill text-yellow-500"></i>
									{{ restaurant.rating || '4.5' }} ({{ restaurant.reviews || 128 }})
								</span>
								<span class="flex items-center gap-1 text-gray-500">
									<i class="ri-time-line"></i>
									{{ restaurant.delivery_time || '30-45' }} min
								</span>
								<span class="flex items-center gap-1 text-gray-500">
									<i class="ri-map-pin-line"></i>
									{{ restaurant.distance || '1.2' }} km
								</span>
							</div>
						</div>

						<!-- Right side with status and cart -->
						<div class="flex flex-col items-end gap-2 min-w-[100px]">
							<!-- Restaurant status -->
							<span
								:class="[
									'text-sm font-medium transition-colors duration-200 text-right px-3 py-1 rounded-full',
									restaurant.is_open 
										? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
										: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
								]"
							>
								{{ restaurant.is_open ? 'Abierto' : 'Cerrado' }}
							</span>
							
							<!-- Cart indicator -->
							<div class="relative">
								<button
									@click="goToCart"
									class="relative p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
									:class="totalItems ? 'text-primary' : 'text-gray-400'"
									aria-label="Ver carrito"
								>
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L4.4 18M7 13l2.5 5.5M17 13l2.5 5.5M16 21a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z" />
									</svg>
									<span
										v-if="totalItems"
										class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse"
									>
										{{ totalItems }}
									</span>
								</button>
							</div>

							<!-- Open indicator dot -->
							<div v-if="restaurant.is_open" class="flex justify-end">
								<div class="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
									<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
									<span class="text-xs text-green-600 dark:text-green-400">Recibiendo órdenes</span>
								</div>
							</div>
						</div>
					</div>
				</header>

				<!-- Search and Filter Bar -->
				<div class="mb-4 space-y-3">
					<div class="flex flex-col sm:flex-row gap-2">
						<div class="relative flex-1">
							<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
							<input
								v-model="searchQuery"
								type="text"
								placeholder="Buscar en el menú..."
								class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
							/>
						</div>
						<button
							@click="showFilters = !showFilters"
							class="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 justify-center min-w-[44px]"
						>
							<i class="ri-filter-3-line"></i>
							<span class="hidden sm:inline">Filtros</span>
						</button>
					</div>

					<!-- Category filters -->
					<Transition name="slide-down">
						<div v-if="showFilters" class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
							<div class="flex flex-wrap gap-2">
								<button
									v-for="category in categories"
									:key="category"
									@click="selectCategory(category as string)"
									:class="[
										'px-4 py-2 rounded-full text-sm font-medium transition-all min-h-[44px]',
										selectedCategory === category
											? 'bg-primary-500 text-white'
											: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
									]"
								>
									{{ category === 'all' ? 'Todos' : category }}
								</button>
							</div>
						</div>
					</Transition>
				</div>

				<!-- Menu Items Count -->
				<div class="mb-3 text-sm text-gray-500">
					{{ menuItems.length }} items encontrados
				</div>

				<!-- BANNER -->
				<div class="relative w-full max-w-full h-40 sm:h-48 md:h-56 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-lg mb-6">
					<img
						:src="restaurant.cover_image || restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'"
						:alt="restaurant.name"
						class="absolute inset-0 w-full h-full max-w-full object-cover"
						loading="eager"
					/>
					<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
				</div>

				<!-- MENU ITEMS -->
				<main class="space-y-4 p-3 sm:p-4 min-w-0">
					<div
						v-for="item in menuItems"
						:key="item.id"
						class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 hover:shadow-md transition-all duration-300 group min-w-0"
						:class="{ 'ring-2 ring-primary/20 scale-[1.02]': showAddedFeedback === item.id }"
					>
						<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-start min-w-0">
							<!-- IMAGE -->
							<div class="flex-shrink-0 relative w-full sm:w-auto flex justify-center sm:block">
								<img
									:src="item.image_url || '/images/placeholder-image.png'"
									:alt="item.name"
									class="w-full max-w-[140px] sm:w-24 sm:max-w-none md:w-32 h-32 sm:h-24 md:h-32 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300 mx-auto sm:mx-0"
									loading="lazy"
								/>
								<!-- Stock indicator -->
								<div
									v-if="item.stock !== undefined && item.stock < 10"
									class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap"
								>
									¡{{ item.stock }} left!
								</div>
							</div>

							<!-- INFO -->
							<div class="flex-1 min-w-0">
								<div class="flex justify-between items-start gap-2">
									<div class="flex-1 min-w-0">
										<h3 class="font-semibold text-gray-900 dark:text-white text-lg truncate">
											{{ item.name }}
										</h3>
										<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
											{{ item.description || 'Delicioso platillo preparado al momento' }}
										</p>
										
										<!-- Item category badge -->
										<span v-if="item.category" class="inline-block mt-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
											{{ item.category }}
										</span>
									</div>
									<p class="text-lg font-bold text-primary-500 whitespace-nowrap">
										${{ (item.price || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
									</p>
								</div>

								<!-- CART CONTROLS -->
								<div class="flex items-center justify-between mt-4">
									<!-- Stock info -->
									<div class="text-xs text-gray-500">
										<span v-if="item.stock !== undefined">
											{{ item.stock }} disponibles
										</span>
										<span v-else>Disponible</span>
									</div>

									<!-- Controls -->
									<div class="flex items-center gap-2">
										<button
											@click="remove(item)"
											:disabled="cartQuantityFor(Number(item.id)) <= 0"
											class="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-primary-500 text-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
											aria-label="Disminuir cantidad"
										>
											−
										</button>

										<!-- Quantity display with direct editing -->
										<div class="relative">
											<input
												type="number"
												:value="cartQuantityFor(Number(item.id))"
												@input="setQuantity({ id: Number(item.id), name: item.name, price: item.price, stock: item.stock }, parseInt(($event.target as HTMLInputElement).value) || 0)"
												@blur="($event.target as HTMLInputElement).value = String(cartQuantityFor(Number(item.id)))"
												min="0"
												:max="Math.min(20, item.stock ?? 20)"
												class="w-20 h-12 text-center border border-gray-300 dark:border-gray-600 rounded-lg text-lg font-medium text-primary-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors duration-200"
												aria-label="Cantidad"
											/>
										</div>

										<button
											@click="add(item)"
											:disabled="
												cartQuantityFor(Number(item.id)) >= 20 ||
												(item.stock !== undefined && cartQuantityFor(Number(item.id)) >= item.stock)
											"
											class="w-12 h-12 flex items-center justify-center rounded-full bg-primary-500 text-white text-2xl font-bold hover:bg-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
											aria-label="Aumentar cantidad"
										>
											+
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Empty state -->
					<div v-if="menuItems.length === 0" class="text-center py-12">
						<div class="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
							<i class="ri-restaurant-line text-4xl text-gray-400"></i>
						</div>
						<h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
							No hay items disponibles
						</h3>
						<p class="text-gray-500">
							Intenta con otra categoría o término de búsqueda
						</p>
					</div>
				</main>

				<!-- FLOATING CART BAR -->
				<Transition
					enter-active-class="transition-transform duration-300 ease-out"
					enter-from-class="translate-y-full"
					enter-to-class="translate-y-0"
					leave-active-class="transition-transform duration-300 ease-in"
					leave-from-class="translate-y-0"
					leave-to-class="translate-y-full"
				>
					<div
						v-if="totalItems"
						class="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl border border-primary-300 dark:border-gray-700 p-4 z-40 min-w-0"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<p class="font-semibold text-sm">
									{{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}
								</p>
								<p class="text-primary-500 font-bold text-lg">
									${{ totalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 }) }}
								</p>
							</div>
							<button
								@click="goToCart"
								class="bg-primary-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-sm flex items-center gap-2 min-w-[120px] justify-center"
							>
								<span>Ver carrito</span>
								<i class="ri-arrow-right-s-line text-xl"></i>
							</button>
						</div>
					</div>
				</Transition>

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
						class="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm p-4 rounded-xl bg-amber-500 text-white shadow-lg z-50 backdrop-blur-lg bg-opacity-95"
					>
						<div class="flex items-center gap-3">
							<i class="ri-wifi-off-line text-xl"></i>
							<div>
								<p class="font-medium">Modo sin conexión</p>
								<p class="text-sm opacity-90">Los cambios se guardarán localmente</p>
							</div>
						</div>
					</div>
				</Transition>

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
		</div>

		<!-- ERROR STATE -->
		<div
			v-else
			class="flex flex-col items-center justify-center min-h-screen p-8 text-center"
		>
			<div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
				<i class="ri-error-warning-line text-4xl text-gray-400"></i>
			</div>
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
				Restaurante no encontrado
			</h2>
			<p class="text-gray-500 dark:text-gray-400 mb-6">
				El restaurante que buscas no existe o ha sido eliminado.
			</p>
			<button
				@click="router.push({ name: 'Home' })"
				class="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200 min-w-[200px]"
			>
				Ver restaurantes
			</button>
		</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar for better mobile experience */
@media (max-width: 640px) {
	.space-y-4 > * + * {
		margin-top: 1rem;
	}
}

/* Improve touch targets for mobile */
button,
input,
[role="button"] {
	min-height: 44px;
	min-width: 44px;
}

/* Smooth transitions for all interactive elements */
* {
	transition-property: color, background-color, border-color, transform, box-shadow, opacity;
	transition-duration: 200ms;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Remove number input spinners */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield;
}

/* Slide down animation */
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease-out;
	overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
.slide-down-enter-to,
.slide-down-leave-from {
	opacity: 1;
	transform: translateY(0);
}

/* Add feedback animation */
@keyframes addedPulse {
	0%, 100% { transform: scale(1); }
	50% { transform: scale(1.02); }
}

.ring-2 {
	animation: addedPulse 0.6s ease-in-out;
}

/* Safe area for notches */
.fixed {
	padding-bottom: env(safe-area-inset-bottom);
	padding-left: env(safe-area-inset-left);
	padding-right: env(safe-area-inset-right);
}

/* Loading spinner */
@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
.animate-spin {
	animation: spin 1s linear infinite;
}

/* Responsive font sizes */
@media (max-width: 640px) {
	.text-2xl {
		font-size: 1.5rem;
	}
}
</style>