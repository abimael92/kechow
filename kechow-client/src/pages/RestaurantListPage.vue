<template>
<div class="min-w-0 bg-gradient-to-br from-primary-50 via-primary-100/40 to-primary-200/50 text-secondary-900 dark:bg-secondary-900 dark:text-secondary-100 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-800 font-sans transition-colors duration-300">

		<!-- HEADER -->
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:pt-8">
			<div class="flex items-center gap-2 sm:gap-3 md:gap-4">
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30 flex-shrink-0">
					<i class="ri-store-3-line text-white text-lg sm:text-xl md:text-2xl"></i>
				</div>
				<div class="min-w-0 flex-1">
					<h1 class="text-bubble font-chewy text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-snug">
						Restaurantes
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none line-clamp-1">
						{{ greetingMessage }}
					</p>
				</div>
			</div>
		</div>

		<!-- MAIN CONTENT -->
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
			
			<!-- QUICK ACTIONS - Floating Action Bar -->
			<div class="flex flex-wrap items-center justify-between gap-4 mb-10">
				<div class="flex items-center gap-3">
					<button 
						@click="toggleFilters"
						class="lg:hidden relative px-6 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-slate-700 dark:text-slate-200 font-medium"
					>
						<i class="ri-filter-3-line text-orange-600 text-xl"></i>
						Filtros
						<span v-if="hasActiveFilters" class="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center">
							{{ activeFiltersCount }}
						</span>
					</button>
					
					<!-- Category Pills - Animated -->
					<div class="hidden lg:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
						<button
							v-for="category in categories.slice(0, 5)"
							:key="category.id"
							@click="toggleCategory(category.name)"
							:class="[
								'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap',
								selectedCategory === category.name
									? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-105'
									: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
							]"
						>
							<i :class="category.icon" class="text-lg"></i>
							{{ category.name }}
						</button>
						<button 
							v-if="selectedCategory"
							@click="selectedCategory = ''"
							class="px-5 py-2.5 rounded-full text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300 whitespace-nowrap"
						>
							<i class="ri-close-line text-lg"></i>
							Limpiar
						</button>
					</div>
				</div>
				
				<!-- Sort & View Controls -->
				<div class="flex items-center gap-3">
					<!-- Sort Dropdown - Enhanced -->
					<div class="relative">
						<select 
							v-model="sortOption"
							class="appearance-none pl-5 pr-12 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-lg cursor-pointer"
						>
							<option v-for="option in sortOptions" :key="option.value" :value="option.value">
								Ordenar: {{ option.label }}
							</option>
						</select>
						<div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
							<i class="ri-arrow-down-s-line text-slate-500"></i>
						</div>
					</div>
					
					<!-- View Toggle - Glass Morphism -->
					<div class="flex items-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-200 dark:border-slate-700 p-1 shadow-lg">
						<button 
							@click="viewMode = 'grid'"
							:class="[
								'p-2.5 rounded-lg transition-all duration-300',
								viewMode === 'grid'
									? 'bg-orange-600 text-white shadow-lg'
									: 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'
							]"
						>
							<i class="ri-grid-fill text-lg"></i>
						</button>
						<button 
							@click="viewMode = 'list'"
							:class="[
								'p-2.5 rounded-lg transition-all duration-300',
								viewMode === 'list'
									? 'bg-orange-600 text-white shadow-lg'
									: 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'
							]"
						>
							<i class="ri-list-unordered text-lg"></i>
						</button>
					</div>
				</div>
			</div>

			<!-- FILTERS DRAWER - Mobile -->
			<Transition name="drawer">
				<div v-if="filtersOpen" class="lg:hidden fixed inset-0 z-50 flex items-end">
					<div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="filtersOpen = false"></div>
					<div class="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl animate-slide-up">
						<div class="p-6">
							<div class="flex items-center justify-between mb-6">
								<h3 class="text-xl font-bold text-slate-900 dark:text-white">Filtros</h3>
								<button 
									@click="filtersOpen = false"
									class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
								>
									<i class="ri-close-line text-xl"></i>
								</button>
							</div>
							
							<!-- Mobile Filters Content -->
							<div class="space-y-6 max-h-[70vh] overflow-y-auto pb-6">
								<MobileFilters 
									v-model:price-range="priceRange"
									v-model:delivery-time="deliveryTimeFilter"
									v-model:selected-category="selectedCategory"
									:categories="categories"
									:price-options="priceOptions"
									@close="filtersOpen = false"
								/>
							</div>
						</div>
					</div>
				</div>
			</Transition>

			<!-- DESKTOP SIDEBAR & CONTENT -->
			<div class="lg:grid lg:grid-cols-12 lg:gap-8">
				
				<!-- SIDEBAR - Desktop - Modern Design -->
				<aside class="hidden lg:block lg:col-span-3 space-y-6">
					<!-- Filters Card - Glass Morphism -->
					<div class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl sticky top-24">
						<div class="flex items-center justify-between mb-6">
							<h3 class="font-semibold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
								<i class="ri-filter-3-line text-orange-600"></i>
								Filtros avanzados
							</h3>
							<button 
								v-if="hasActiveFilters"
								@click="resetFilters"
								class="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 flex items-center gap-1 transition-colors font-medium"
							>
								<i class="ri-refresh-line"></i>
								Limpiar
							</button>
						</div>
						
						<div class="space-y-8">
							<!-- Price Range - Interactive -->
							<div>
								<label class="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
									Rango de precios
								</label>
								<div class="grid grid-cols-3 gap-2">
									<button
										v-for="price in priceOptions"
										:key="price.value"
										@click="priceRange = price.value"
										:class="[
											'relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden group',
											priceRange === price.value
												? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
												: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
										]"
									>
										<span class="relative z-10">{{ price.symbol }}</span>
										<span class="absolute inset-0 bg-gradient-to-r from-orange-500 to-teal-500 opacity-0 group-hover:opacity-10 transition-opacity"></span>
									</button>
								</div>
							</div>
							
							<!-- Delivery Time - Slider Style -->
							<div>
								<label class="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
									Tiempo de entrega
								</label>
								<div class="space-y-3">
									<div
										v-for="time in deliveryOptions"
										:key="time.value"
										@click="deliveryTimeFilter = time.value"
										:class="[
											'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 border-2',
											deliveryTimeFilter === time.value
												? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
												: 'border-transparent bg-slate-50 dark:bg-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
										]"
									>
										<div class="flex items-center gap-3">
											<div :class="[
												'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
												deliveryTimeFilter === time.value
													? 'border-orange-600 bg-orange-600'
													: 'border-slate-400'
											]">
												<div v-if="deliveryTimeFilter === time.value" class="w-2 h-2 bg-white rounded-full"></div>
											</div>
											<span class="font-medium">{{ time.label }}</span>
										</div>
										<span class="text-sm text-slate-500">{{ time.range }}</span>
									</div>
								</div>
							</div>
							
							<!-- Dietary Preferences -->
							<div>
								<label class="block text-sm font-medium mb-4 text-slate-700 dark:text-slate-300">
									Preferencias
								</label>
								<div class="space-y-2">
									<label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
										<span class="flex items-center gap-3">
											<i class="ri-plant-line text-orange-600"></i>
											<span class="text-sm">Vegetariano</span>
										</span>
										<input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500">
									</label>
									<label class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
										<span class="flex items-center gap-3">
											<i class="ri-heart-pulse-line text-rose-600"></i>
											<span class="text-sm">Saludable</span>
										</span>
										<input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500">
									</label>
								</div>
							</div>
						</div>
						
						<!-- Active Filters Tags -->
						<div v-if="hasActiveFilters" class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
							<p class="text-xs font-medium text-slate-500 mb-3">Filtros activos:</p>
							<div class="flex flex-wrap gap-2">
								<span 
									v-if="selectedCategory"
									class="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1.5 rounded-full text-xs font-medium"
								>
									{{ selectedCategory }}
									<button @click.stop="selectedCategory = ''" class="hover:text-orange-900">
										<i class="ri-close-line"></i>
									</button>
								</span>
								<span 
									v-if="priceRange !== 'all'"
									class="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium"
								>
									{{ getPriceLabel(priceRange) }}
									<button @click.stop="priceRange = 'all'" class="hover:text-blue-900">
										<i class="ri-close-line"></i>
									</button>
								</span>
							</div>
						</div>
					</div>
				</aside>

				<!-- MAIN CONTENT - Restaurant Grid/List -->
				<main class="lg:col-span-9 space-y-8">
					
					<!-- Loading State - Modern Skeleton -->
					<div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						<div v-for="i in 6" :key="i" class="animate-pulse">
							<div class="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
								<div class="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
								<div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
								<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
								<div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
							</div>
						</div>
					</div>
					
					<!-- Empty State - Engaging Design -->
					<div v-else-if="filteredRestaurants.length === 0" class="text-center py-20">
						<div class="relative inline-block">
							<div class="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-orange-100 to-teal-100 dark:from-orange-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center">
								<i class="ri-restaurant-line text-6xl text-orange-600 dark:text-orange-400"></i>
							</div>
							<div class="absolute -top-2 -right-2 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white animate-bounce">
								<i class="ri-search-line"></i>
							</div>
						</div>
						<h3 class="text-3xl font-bold mb-3 text-slate-900 dark:text-white">¡Ups! No encontramos nada</h3>
						<p class="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto text-lg">
							{{ getEmptyStateMessage }}
						</p>
						<button
							@click="resetFilters"
							class="px-8 py-4 bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 inline-flex items-center gap-2"
						>
							<i class="ri-refresh-line text-xl"></i>
							Explorar todos los restaurantes
						</button>
					</div>
					
					<!-- Restaurant Grid/List with Stagger Animation -->
					<div v-else>
						<!-- Results Header -->
						<div class="flex items-center justify-between mb-6">
							<div>
								<h2 class="text-2xl font-bold text-slate-900 dark:text-white">
									<!-- <span class="bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
										{{ filteredRestaurants.length }}
									</span> restaurantes encontrados -->
								</h2>
								<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
									{{ search ? `Resultados para "${search}"` : 'Los mejores lugares cerca de ti' }}
								</p>
							</div>
							<p class="text-sm text-slate-500 hidden sm:block">
								Página {{ currentPage }} de {{ totalPages }}
							</p>
						</div>

						<TransitionGroup 
							:name="viewMode === 'grid' ? 'stagger-grid' : 'stagger-list'"
							tag="div"
							:class="[
								viewMode === 'grid' 
									? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
									: 'space-y-4'
							]"
						>
							<RestaurantCard
								v-for="(restaurant, index) in paginatedRestaurants"
								:key="restaurant.id"
								:restaurant="restaurant"
								:view-mode="viewMode"
								:style="{ animationDelay: `${index * 50}ms` }"
								@favorite="toggleFavorite"
								@click="viewRestaurantDetails"
								class="cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
							/>
						</TransitionGroup>
						
						<!-- Modern Pagination -->
						<div v-if="totalPages > 1" class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-12 pt-6 border-t border-slate-200 dark:border-slate-700">
							<p class="text-sm text-slate-600 dark:text-slate-400 order-2 sm:order-1">
								Mostrando <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> - 
								<span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredRestaurants.length) }}</span> 
								de <span class="font-semibold">{{ filteredRestaurants.length }}</span> restaurantes
							</p>
							
							<div class="flex items-center justify-center sm:justify-end gap-2 order-1 sm:order-2">
								<button
									@click="prevPage"
									:disabled="currentPage === 1"
									:class="[
										'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300',
										currentPage === 1
											? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
											: 'bg-white dark:bg-slate-800 hover:bg-orange-600 hover:text-white border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-orange-600/30'
									]"
								>
									<i class="ri-arrow-left-line text-lg"></i>
								</button>
								
								<div class="flex items-center gap-1">
									<button
										v-for="page in visiblePages"
										:key="page"
										@click="goToPage(page)"
										:class="[
											'w-11 h-11 rounded-xl text-sm font-medium transition-all duration-300',
											currentPage === page
												? 'bg-gradient-to-r from-orange-600 to-teal-600 text-white shadow-lg shadow-orange-600/30 scale-110'
												: page === '...'
													? 'cursor-default bg-transparent'
													: 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
										]"
									>
										{{ page }}
									</button>
								</div>
								
								<button
									@click="nextPage"
									:disabled="currentPage === totalPages"
									:class="[
										'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300',
										currentPage === totalPages
											? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
											: 'bg-white dark:bg-slate-800 hover:bg-orange-600 hover:text-white border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-orange-600/30'
									]"
								>
									<i class="ri-arrow-right-line text-lg"></i>
								</button>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>

		<!-- BOTTOM NAVIGATION - Mobile First Design -->
		<!-- <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 px-4 py-2 z-40">
			<div class="flex items-center justify-around">
				<button 
					v-for="item in bottomNavItems" 
					:key="item.label"
					@click="handleNavigation(item.action)"
					class="flex flex-col items-center p-2 rounded-xl transition-all duration-300"
					:class="[currentRoute === item.action ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400']"
				>
					<div :class="['p-1.5 rounded-lg transition-all', currentRoute === item.action ? 'bg-orange-100 dark:bg-orange-900/30' : '']">
						<i :class="[item.icon, 'text-xl']"></i>
					</div>
					<span class="text-[10px] font-medium mt-1">{{ item.label }}</span>
				</button>
			</div>
		</nav> -->

		<!-- SCROLL TO TOP - Floating Action -->
		<Transition name="slide-fade">
			<button
				v-if="showScrollToTop"
				@click="scrollToTop"
				class="fixed bottom-24 lg:bottom-8 right-6 w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl hover:scale-110 transition-all duration-500 z-50 group"
			>
				<i class="ri-arrow-up-line text-2xl group-hover:-translate-y-1 transition-transform"></i>
			</button>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { AppConfig } from '@/app/config';
import type { Restaurant } from '@/shared/data/restaurants';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const API_BASE_URL = `${AppConfig.apiBaseUrl}/api`;

import RestaurantCard from '@/components/RestaurantCard.vue';
import MobileFilters from '@/components/MobileFilters.vue';
import { categoryIcons } from '@/assets/svg/food';

// ============================================
// TYPES & INTERFACES
// ============================================

interface SortOption {
	value: 'name' | 'rating' | 'deliveryTime';
	label: string;
}

interface PriceOption {
	value: string;
	label: string;
	symbol: string;
}

interface DeliveryOption {
	value: string;
	label: string;
	range: string;
}

// ============================================
// CONSTANTS
// ============================================

const sortOptions: SortOption[] = [
	{ value: 'name', label: 'Nombre' },
	{ value: 'rating', label: 'Mejor calificados' },
	{ value: 'deliveryTime', label: 'Menor tiempo' }
];

const priceOptions: PriceOption[] = [
	{ value: 'all', label: 'Todos', symbol: '💰' },
	{ value: '$', label: 'Económico', symbol: '$' },
	{ value: '$$', label: 'Moderado', symbol: '$$' },
	{ value: '$$$', label: 'Premium', symbol: '$$$' }
];

const deliveryOptions: DeliveryOption[] = [
	{ value: 'all', label: 'Todos', range: 'Cualquier tiempo' },
	{ value: 'fast', label: 'Rápido', range: '< 30 min' },
	{ value: 'medium', label: 'Normal', range: '30-45 min' },
	{ value: 'slow', label: 'Express', range: '< 60 min' }
];

const bottomNavItems = [
	{ label: 'Inicio', icon: 'ri-home-5-line', action: 'home' },
	{ label: 'Buscar', icon: 'ri-search-line', action: 'search' },
	{ label: 'Pedidos', icon: 'ri-shopping-bag-3-line', action: 'orders' },
	{ label: 'Favoritos', icon: 'ri-heart-3-line', action: 'favorites' },
	{ label: 'Perfil', icon: 'ri-user-3-line', action: 'profile' }
];

// ============================================
// STATE
// ============================================

// Data
const restaurants = ref<any[]>([]);
const loading = ref(true);
const currentRoute = ref('home');

// Categories
const categories = ref([
	{ id: 'c1', name: 'Mariscos', icon: categoryIcons.Seafood, count: 0 },
	{ id: 'c2', name: 'Mexicana', icon: categoryIcons.MexicanFood, count: 0 },
	{ id: 'c3', name: 'Italiana', icon: 'ri-restaurant-2-line', count: 0 },
	{ id: 'c4', name: 'Japonesa', icon: 'ri-sushi-line', count: 0 },
	{ id: 'c5', name: 'Vegetariana', icon: categoryIcons.Vegan, count: 0 },
	{ id: 'c6', name: 'Comida Rápida', icon: categoryIcons.FastFood, count: 0 },
	{ id: 'c7', name: 'Cafeterías', icon: 'ri-cup-line', count: 0 },
	{ id: 'c8', name: 'Postres', icon: 'ri-cake-3-line', count: 0 },
]);

// Filters
const search = ref('');
const selectedCategory = ref('');
const sortOption = ref<'name' | 'rating' | 'deliveryTime'>('rating');
const priceRange = ref('all');
const deliveryTimeFilter = ref('all');
const viewMode = ref<'grid' | 'list'>('grid');
const filtersOpen = ref(false);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 12;

// UI State
const showScrollToTop = ref(false);

// ============================================
// API FUNCTIONS - Laravel Backend
// ============================================

async function fetchRestaurants() {
	try {
		loading.value = true;
		
		const response = await fetch(`${API_BASE_URL}/restaurants`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-Requested-With': 'XMLHttpRequest'
			}
		});
		
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		
		const json = await response.json();
		const restaurantList = json.data || json;
		
		if (!Array.isArray(restaurantList)) {
			restaurants.value = [];
			return;
		}
		
		// Transform Laravel models to frontend format
		restaurants.value = restaurantList.map((item: any) => {
			const isOpen = checkIfOpenNow(item);
			
			return {
				id: item.id,
				name: item.name,
				description: item.description || '',
				image: item.logo_url || item.cover_image || '/images/restaurant-placeholder.jpg',
				cuisine: item.cuisine_type || 'Internacional',
				priceRange: item.price_range || '$$',
				deliveryTime: item.avg_prep_time_minutes || 35,
				deliveryFee: item.delivery_fee || 0,
				minimumOrder: item.minimum_order || 0,
				address: item.address || '',
				city: item.city || '',
				rating: item.rating || 4.5,
				reviewCount: item.reviews_count || 0,
				isOpen: isOpen,
				isFavorite: false,
				promotion: item.has_promotion ? '20% OFF' : null,
				tags: item.tags || []
			};
		});
		
		// Update category counts
		updateCategoryCounts();
		
	} catch (error) {
		console.error('Error fetching restaurants:', error);
		toast.error('Error al cargar restaurantes');
		restaurants.value = [];
	} finally {
		loading.value = false;
	}
}

function checkIfOpenNow(restaurant: any): boolean {
	if (!restaurant.is_active) return false;
	
	const now = new Date();
	const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
	
	// Default hours if not specified
	const openTime = restaurant.opening_time?.substring(0, 5) || '09:00';
	const closeTime = restaurant.closing_time?.substring(0, 5) || '22:00';
	
	return currentTime >= openTime && currentTime <= closeTime;
}

async function toggleFavorite(restaurant: any) {
	try {
		const token = localStorage.getItem('token');
		if (!token) {
			toast.warning('Inicia sesión para guardar favoritos');
			return;
		}
		
		const newState = !restaurant.isFavorite;
		const method = newState ? 'POST' : 'DELETE';
		
		const response = await fetch(`${API_BASE_URL}/favorites`, {
			method,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
				'X-Requested-With': 'XMLHttpRequest'
			},
			body: JSON.stringify({ restaurant_id: restaurant.id })
		});
		
		if (response.ok) {
			restaurant.isFavorite = newState;
			toast.success(newState 
				? `${restaurant.name} agregado a favoritos`
				: `${restaurant.name} eliminado de favoritos`
			);
		}
	} catch (error) {
		console.error('Failed to toggle favorite:', error);
		toast.error('Error al actualizar favoritos');
	}
}

// ============================================
// COMPUTED PROPERTIES
// ============================================

const greetingMessage = computed(() => {
	const hour = new Date().getHours();
	if (hour < 12) return '¡Buenos días! ¿Qué se te antoja hoy?';
	if (hour < 18) return '¡Buenas tardes! Hora de comer algo rico';
	return '¡Buenas noches! ¿Pedimos algo?';
});

const hasActiveFilters = computed(() => {
	return selectedCategory.value || priceRange.value !== 'all' || deliveryTimeFilter.value !== 'all';
});

const activeFiltersCount = computed(() => {
	let count = 0;
	if (selectedCategory.value) count++;
	if (priceRange.value !== 'all') count++;
	if (deliveryTimeFilter.value !== 'all') count++;
	return count;
});

const topRatedCount = computed(() => {
	return restaurants.value.filter(r => (r.rating || 0) >= 4.5).length;
});

const filteredRestaurants = computed(() => {
	return restaurants.value.filter((restaurant) => {
		const matchesSearch = !search.value ||
			restaurant.name.toLowerCase().includes(search.value.toLowerCase()) ||
			restaurant.description?.toLowerCase().includes(search.value.toLowerCase()) ||
			restaurant.cuisine?.toLowerCase().includes(search.value.toLowerCase());
		
		const matchesCategory = !selectedCategory.value ||
			restaurant.cuisine?.toLowerCase().includes(selectedCategory.value.toLowerCase());
		
		const matchesPrice = priceRange.value === 'all' ||
			restaurant.priceRange === priceRange.value;
		
		const matchesDeliveryTime = deliveryTimeFilter.value === 'all' ||
			(deliveryTimeFilter.value === 'fast' && restaurant.deliveryTime < 30) ||
			(deliveryTimeFilter.value === 'medium' && restaurant.deliveryTime >= 30 && restaurant.deliveryTime <= 45) ||
			(deliveryTimeFilter.value === 'slow' && restaurant.deliveryTime <= 60);
		
		return matchesSearch && matchesCategory && matchesPrice && matchesDeliveryTime;
	});
});

const sortedRestaurants = computed(() => {
	const sorted = [...filteredRestaurants.value];
	
	switch (sortOption.value) {
		case 'name':
			return sorted.sort((a, b) => a.name.localeCompare(b.name));
		case 'rating':
			return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
		case 'deliveryTime':
			return sorted.sort((a, b) => (a.deliveryTime || 999) - (b.deliveryTime || 999));
		default:
			return sorted;
	}
});

const paginatedRestaurants = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return sortedRestaurants.value.slice(start, end);
});

const totalPages = computed(() => 
	Math.ceil(sortedRestaurants.value.length / itemsPerPage)
);

const visiblePages = computed(() => {
	const pages = [];
	const maxVisible = 5;
	const total = totalPages.value;
	const current = currentPage.value;
	
	if (total <= maxVisible) {
		for (let i = 1; i <= total; i++) pages.push(i);
	} else if (current <= 3) {
		pages.push(1, 2, 3, 4, '...', total);
	} else if (current >= total - 2) {
		pages.push(1, '...', total - 3, total - 2, total - 1, total);
	} else {
		pages.push(1, '...', current - 1, current, current + 1, '...', total);
	}
	
	return pages;
});

const averageDeliveryTime = computed(() => {
	const times = filteredRestaurants.value.map(r => r.deliveryTime).filter(Boolean);
	if (times.length === 0) return 0;
	return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
});

const getEmptyStateMessage = computed(() => {
	if (search.value) return `No encontramos "${search.value}"`;
	if (selectedCategory.value) return `No hay restaurantes en ${selectedCategory.value}`;
	if (priceRange.value !== 'all') return `No hay restaurantes en este rango de precio`;
	return 'Prueba con otros filtros';
});

// ============================================
// METHODS
// ============================================

function updateCategoryCounts() {
	const counts: Record<string, number> = {};
	
	restaurants.value.forEach(restaurant => {
		const cuisine = restaurant.cuisine;
		if (cuisine) {
			counts[cuisine] = (counts[cuisine] || 0) + 1;
		}
	});
	
	categories.value = categories.value.map(cat => ({
		...cat,
		count: counts[cat.name] || 0
	}));
}

function toggleCategory(category: string) {
	selectedCategory.value = selectedCategory.value === category ? '' : category;
	currentPage.value = 1;
	filtersOpen.value = false;
}

function toggleFilters() {
	filtersOpen.value = !filtersOpen.value;
}

function resetFilters() {
	search.value = '';
	selectedCategory.value = '';
	sortOption.value = 'rating';
	priceRange.value = 'all';
	deliveryTimeFilter.value = 'all';
	currentPage.value = 1;
	filtersOpen.value = false;
	
	toast.info('Filtros limpiados');
}

function getPriceLabel(value: string): string {
	const option = priceOptions.find(p => p.value === value);
	return option ? option.label : value;
}

function viewRestaurantDetails(restaurant: Restaurant) {
	router.push({ 
		name: 'RestaurantDetail', 
		params: { id: String(restaurant.id) } 
	});
}

function handleNavigation(action: string) {
	currentRoute.value = action;
	
	switch(action) {
		case 'home':
			router.push('/');
			break;
		case 'search':
			router.push('/search');
			break;
		case 'orders':
			router.push('/orders');
			break;
		case 'favorites':
			router.push('/favorites');
			break;
		case 'profile':
			router.push('/profile');
			break;
	}
}

// Pagination methods
function prevPage() {
	if (currentPage.value > 1) {
		currentPage.value--;
		scrollToTop();
	}
}

function nextPage() {
	if (currentPage.value < totalPages.value) {
		currentPage.value++;
		scrollToTop();
	}
}

function goToPage(page: number | string) {
	if (typeof page === 'number') {
		currentPage.value = page;
		scrollToTop();
	}
}

// Scroll methods
function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

function checkScroll() {
	showScrollToTop.value = window.scrollY > 600;
}

// ============================================
// WATCHERS
// ============================================

watch([search, selectedCategory, sortOption, priceRange, deliveryTimeFilter], () => {
	currentPage.value = 1;
});

watch(() => route.path, (path) => {
	// Update current route for bottom nav
	if (path === '/') currentRoute.value = 'home';
	else if (path.includes('search')) currentRoute.value = 'search';
	else if (path.includes('orders')) currentRoute.value = 'orders';
	else if (path.includes('favorites')) currentRoute.value = 'favorites';
	else if (path.includes('profile')) currentRoute.value = 'profile';
});

// ============================================
// LIFECYCLE HOOKS
// ============================================

onMounted(async () => {
	await fetchRestaurants();
	
	window.addEventListener('scroll', checkScroll);
	window.addEventListener('keydown', (e) => {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			document.querySelector('input')?.focus();
		}
	});
	
	// Initialize route
	if (route.path === '/') currentRoute.value = 'home';
});

onUnmounted(() => {
	window.removeEventListener('scroll', checkScroll);
});
</script>

<style scoped>
/* Modern Animations */
@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

@keyframes scaleIn {
	from {
		opacity: 0;
		transform: scale(0.9);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

@keyframes slideInRight {
	from {
		opacity: 0;
		transform: translateX(30px);
	}
	to {
		opacity: 1;
		transform: translateX(0);
	}
}

.animate-slide-up {
	animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-fade-in {
	animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-in {
	animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animation-delay-300 {
	animation-delay: 300ms;
	opacity: 0;
	animation-fill-mode: forwards;
}

.animation-delay-600 {
	animation-delay: 600ms;
	opacity: 0;
	animation-fill-mode: forwards;
}

/* Stagger Animations for Grid */
.stagger-grid-enter-active,
.stagger-grid-leave-active {
	transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stagger-grid-enter-from {
	opacity: 0;
	transform: scale(0.8) translateY(30px);
}

.stagger-grid-leave-to {
	opacity: 0;
	transform: scale(0.8) translateY(30px);
}

.stagger-list-enter-active,
.stagger-list-leave-active {
	transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.stagger-list-enter-from {
	opacity: 0;
	transform: translateX(-30px);
}

.stagger-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}

/* Drawer Animation */
.drawer-enter-active,
.drawer-leave-active {
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-from,
.drawer-leave-to {
	transform: translateY(100%);
	opacity: 0;
}

/* Slide Fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(20px);
}

/* Custom Scrollbar */
.scrollbar-thin {
	scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
	height: 6px;
	width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
	background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
	background-color: rgba(156, 163, 175, 0.5);
	border-radius: 20px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
	background-color: rgba(75, 85, 99, 0.5);
}

/* Mobile Bottom Navigation */
@media (max-width: 1023px) {
	main {
		padding-bottom: 80px;
	}
}

/* Glass Morphism Effects */
.backdrop-blur-xl {
	backdrop-filter: blur(24px);
	-webkit-backdrop-filter: blur(24px);
}

/* Hover Effects */
.hover-lift {
	transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-lift:hover {
	transform: translateY(-4px);
	box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
}

.dark .hover-lift:hover {
	box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.5);
}

/* Smooth Transitions */
* {
	transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 150ms;
}

/* Font Optimization */
.font-inter {
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive Typography */
@media (max-width: 640px) {
	h1 {
		font-size: clamp(2rem, 8vw, 2.5rem);
	}
}
</style>