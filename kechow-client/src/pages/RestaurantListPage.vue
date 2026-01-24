<template>
	<div
		class=" bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark font-sans transition-colors duration-300"
	>
		<!-- Mobile Header with Hamburger Menu - STICKY BUT NOT OVERLAPPING -->
		<div class="sticky top-0 z-50 w-full lg:hidden bg-white dark:bg-gray-800 shadow-sm">
			<div class="w-full px-4 py-3">
				<div class="flex items-center justify-between max-w-7xl mx-auto">
					<div class="flex items-center gap-3">
						<button 
							@click="toggleMobileMenu"
							class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
							aria-label="Menu"
						>
							<i class="ri-menu-line text-xl"></i>
						</button>
						<h1 class="text-xl font-bold text-primary-gradient">
								{{ t('restaurants') }}
							</h1>
						</div>
						
						<div class="flex items-center gap-2">
							<!-- Language Toggle -->
							<button 
								@click="toggleLanguage"
								class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium flex items-center gap-1"
								:title="currentLanguage === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'"
							>
								<i class="ri-translate-2"></i>
								<span class="hidden sm:inline">{{ currentLanguage === 'en' ? 'ES' : 'EN' }}</span>
							</button>
							
							<!-- Cart Button -->
							<button 
								@click="openCart"
								class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
								aria-label="Cart"
							>
								<i class="ri-shopping-cart-line text-xl"></i>
								<span 
									v-if="cartItemCount > 0"
									class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
								>
									{{ cartItemCount }}
								</span>
							</button>
						</div>
					</div>
					
					<!-- Mobile Search -->
					<div class="mt-3">
						<SearchBar v-model:search="search" />
					</div>
				</div>
			</div>
		</div>

			<!-- Main Content -->
			<div class="lg:grid lg:grid-cols-4 lg:gap-8">
				<!-- Desktop Sidebar -->
				<aside class="hidden lg:block space-y-6">
					<!-- Filters Section -->
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
						<h3 class="font-semibold text-lg mb-4">{{ t('filters') }}</h3>
						
						<!-- Sort Options -->
						<div class="space-y-4">
							<div>
								<label class="block text-sm font-medium mb-2">{{ t('sortBy') }}</label>
								<select 
									v-model="sortOption"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
								>
									<option value="name">{{ t('name') }}</option>
									<option value="rating">{{ t('rating') }}</option>
									<option value="deliveryTime">{{ t('deliveryTime') }}</option>
								</select>
							</div>
							
							<!-- Price Range -->
							<div>
								<label class="block text-sm font-medium mb-2">{{ t('priceRange') }}</label>
								<div class="space-y-2">
									<label class="flex items-center gap-2">
										<input 
											type="radio" 
											v-model="priceRange" 
											value="all"
											class="text-primary-500 focus:ring-primary-500"
										>
										<span class="text-sm">{{ t('allPrices') }}</span>
									</label>
									<label class="flex items-center gap-2">
										<input 
											type="radio" 
											v-model="priceRange" 
											value="$"
											class="text-primary-500 focus:ring-primary-500"
										>
										<span class="text-sm">$ {{ t('inexpensive') }}</span>
									</label>
									<label class="flex items-center gap-2">
										<input 
											type="radio" 
											v-model="priceRange" 
											value="$$"
											class="text-primary-500 focus:ring-primary-500"
										>
										<span class="text-sm">$$ {{ t('moderate') }}</span>
									</label>
									<label class="flex items-center gap-2">
										<input 
											type="radio" 
											v-model="priceRange" 
											value="$$$"
											class="text-primary-500 focus:ring-primary-500"
										>
										<span class="text-sm">$$$ {{ t('expensive') }}</span>
									</label>
								</div>
							</div>
						</div>
						
						<button 
							@click="resetFilters"
							class="w-full mt-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium"
						>
							{{ t('clearFilters') }}
						</button>
					</div>
					
					<!-- Quick Stats -->
					<div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
						<h3 class="font-semibold text-lg mb-4">{{ t('quickStats') }}</h3>
						<div class="space-y-3">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{{ t('totalRestaurants') }}</span>
								<span class="font-semibold">{{ restaurants.length }}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{{ t('showing') }}</span>
								<span class="font-semibold">{{ filteredRestaurants.length }}</span>
							</div>
						</div>
					</div>
				</aside>

				<!-- Main Content Area -->
				<main class="lg:col-span-3 space-y-8">
					<!-- Categories Section -->
					<section>
						<div class="flex justify-between items-center mb-4">
							<h2 class="section-heading">{{ t('featuredCategories') }}</h2>
							<div class="flex items-center gap-2">
								<button class="link-button" @click="resetFilters">
									{{ t('clear') }}
								</button>
								<span v-if="selectedCategory" class="text-sm text-gray-600 dark:text-gray-400">
									{{ t('selected') }}: {{ selectedCategory }}
								</span>
							</div>
						</div>
						<div class="relative">
							<div class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
								<CategoryChips
									v-for="category in categories"
									:key="category.id"
									:category="category"
									:selected="category.name === selectedCategory"
									@click="toggleCategory(category.name)"
								/>
							</div>
							<!-- Scroll indicators -->
							<div v-if="showLeftScroll" class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
							<div v-if="showRightScroll" class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none"></div>
						</div>
					</section>

					<!-- Active Filters (Mobile) -->
					<section v-if="(selectedCategory || priceRange !== 'all')" class="lg:hidden">
						<div class="flex flex-wrap gap-2">
							<span 
								v-if="selectedCategory"
								class="inline-flex items-center gap-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full text-sm"
							>
								{{ selectedCategory }}
								<button @click="selectedCategory = ''" class="ml-1 hover:text-primary-900 dark:hover:text-primary-100">
									<i class="ri-close-line"></i>
								</button>
							</span>
							<span 
								v-if="priceRange !== 'all'"
								class="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm"
							>
								{{ t('price') }}: {{ priceRange }}
								<button @click="priceRange = 'all'" class="ml-1 hover:text-blue-900 dark:hover:text-blue-100">
									<i class="ri-close-line"></i>
								</button>
							</span>
						</div>
					</section>

					<!-- Restaurants Section -->
					<section>
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
							<h2 class="section-heading">{{ t('featuredRestaurants') }}</h2>
							<div class="flex items-center gap-3">
								<!-- Mobile Sort Dropdown -->
								<select 
									v-model="sortOption"
									class="lg:hidden px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
								>
									<option value="name">{{ t('name') }}</option>
									<option value="rating">{{ t('rating') }}</option>
									<option value="deliveryTime">{{ t('deliveryTime') }}</option>
								</select>
								
								<button 
									@click="toggleViewMode"
									class="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
									:title="viewMode === 'grid' ? t('switchToList') : t('switchToGrid')"
								>
									<i :class="viewMode === 'grid' ? 'ri-list-check' : 'ri-grid-fill'"></i>
								</button>
								
								<button class="link-button" @click="resetFilters">
									{{ t('resetAll') }}
								</button>
							</div>
						</div>
						
						<!-- Loading State -->
						<div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							<div v-for="i in 6" :key="i" class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
								<div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
								<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
								<div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
							</div>
						</div>
						
						<!-- Empty State -->
						<div v-else-if="filteredRestaurants.length === 0" class="text-center py-16">
							<div class="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600">
								<i class="ri-restaurant-line text-6xl"></i>
							</div>
							<h3 class="text-xl font-semibold mb-2">{{ t('noRestaurantsFound') }}</h3>
							<p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
								{{
									search 
										? t('noResultsForSearch', { search })
										: selectedCategory
											? t('noResultsForCategory', { category: selectedCategory })
											: t('tryDifferentFilters')
								}}
							</p>
							<button
								@click="resetFilters"
								class="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
							>
								{{ t('clearFilters') }}
							</button>
						</div>
						
						<!-- Restaurants Grid/List -->
						<div v-else>
							<!-- Grid View -->
							<ul v-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
								<RestaurantCard
									v-for="restaurant in sortedRestaurants"
									:key="restaurant.id"
									:restaurant="restaurant"
									:view-mode="viewMode"
									@favorite="toggleFavorite"
									@click="viewRestaurantDetails"
								/>
							</ul>
							
							<!-- List View -->
							<ul v-else class="space-y-4">
								<RestaurantCard
									v-for="restaurant in sortedRestaurants"
									:key="restaurant.id"
									:restaurant="restaurant"
									:view-mode="viewMode"
									@favorite="toggleFavorite"
									@click="viewRestaurantDetails"
								/>
							</ul>
						</div>
						
						<!-- Pagination (for large datasets) -->
						<div v-if="filteredRestaurants.length > itemsPerPage" class="flex justify-center mt-8">
							<div class="flex gap-1">
								<button
									@click="prevPage"
									:disabled="currentPage === 1"
									:class="[
										'px-3 py-2 rounded-lg transition-colors',
										currentPage === 1
											? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
											: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
									]"
								>
									<i class="ri-arrow-left-line"></i>
								</button>
								
								<button
									v-for="page in visiblePages"
									:key="page"
									@click="goToPage(page)"
									:class="[
										'w-10 h-10 rounded-lg transition-colors',
										currentPage === page
											? 'bg-primary-500 text-white'
											: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
									]"
								>
									{{ page }}
								</button>
								
								<button
									@click="nextPage"
									:disabled="currentPage === totalPages"
									:class="[
										'px-3 py-2 rounded-lg transition-colors',
										currentPage === totalPages
											? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
											: 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
									]"
								>
									<i class="ri-arrow-right-line"></i>
								</button>
							</div>
						</div>
					</section>
				</main>
			</div>

		<!-- Mobile Menu -->
		<div v-if="mobileMenuOpen" class="lg:hidden fixed inset-0 z-50">
			<div class="absolute inset-0 bg-black/50" @click="mobileMenuOpen = false"></div>
			<div class="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-xl animate-slide-in">
				<div class="p-4 border-b border-gray-200 dark:border-gray-700">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-bold">{{ t('menu') }}</h2>
						<button @click="mobileMenuOpen = false" class="p-2">
							<i class="ri-close-line text-xl"></i>
						</button>
					</div>
					
					<!-- Mobile Language Toggle -->
					<button 
						@click="toggleLanguage"
						class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between mb-4"
					>
						<span>{{ t('language') }}</span>
						<span class="font-medium">{{ currentLanguage === 'en' ? 'Español' : 'English' }}</span>
					</button>
				</div>
				
				<div class="p-4 space-y-4">
					<button 
						v-for="item in mobileMenuItems"
						:key="item.label"
						@click="handleMobileMenuClick(item)"
						class="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
					>
						<i :class="item.icon" class="text-lg"></i>
						<span>{{ t(item.label) }}</span>
					</button>
				</div>
			</div>
		</div>

		<!-- Floating Action Button for Mobile -->
		<button
			v-if="showFAB"
			@click="scrollToTop"
			class="lg:hidden fixed bottom-6 right-6 w-12 h-12 bg-primary-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 transition-all active:scale-95 z-40"
			:class="{ 'opacity-0 translate-y-4': !showScrollToTop }"
		>
			<i class="ri-arrow-up-line"></i>
		</button>
	
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Restaurant } from '@/shared/data/restaurants';

import SearchBar from '@/components/SearchBar.vue';
import CategoryChips from '@/components/CategoryChips.vue';
import RestaurantCard from '@/components/RestaurantCard.vue';

import { restaurants as restaurantData } from '@/shared/data/restaurants';
import { categoryIcons } from '@/assets/svg/food';

const { t, locale } = useI18n();

// State
const restaurants = ref<any[]>(restaurantData.map(restaurant => ({
	...restaurant,
	image: restaurant.image || '',
	rating: (restaurant as any).rating || 0,
	isFavorite: (restaurant as any).isFavorite || false
})));
const categories = ref([
	{ id: 'c1', name: 'Mariscos', icon: categoryIcons.Seafood },
	{ id: 'c2', name: 'Mexicana', icon: categoryIcons.MexicanFood },
	{ id: 'c3', name: 'Comida Rápida', icon: categoryIcons.FastFood },
	{ id: 'c4', name: 'Vegetariana', icon: categoryIcons.Vegan },
]);

const search = ref('');
const selectedCategory = ref('');
const sortOption = ref<'name' | 'rating' | 'deliveryTime'>('name');
const priceRange = ref('all');
const viewMode = ref<'grid' | 'list'>('grid');
const mobileMenuOpen = ref(false);
const showScrollToTop = ref(false);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 12;
const cartItemCount = ref(3);
const showLeftScroll = ref(false);
const showRightScroll = ref(false);

// Computed Properties
const currentLanguage = computed(() => locale.value);

// Add this computed property to your script section
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

// Also add paginatedRestaurants if you want pagination
const paginatedRestaurants = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedRestaurants.value.slice(start, end);
});

const filteredRestaurants = computed(() => {
	return restaurants.value.filter((restaurant) => {
		// Search filter
		const matchesSearch = 
			!search.value ||
			restaurant.name.toLowerCase().includes(search.value.toLowerCase()) ||
			restaurant.description.toLowerCase().includes(search.value.toLowerCase()) ||
			((restaurant as any).cuisine || '').toLowerCase().includes(search.value.toLowerCase());
		
		// Category filter
		const matchesCategory = 
			!selectedCategory.value ||
			((restaurant as any).cuisine || '').toLowerCase().includes(selectedCategory.value.toLowerCase());
		
		// Price filter
		const matchesPrice = 
			priceRange.value === 'all' ||
			(restaurant as any).priceRange === priceRange.value;
		
		return matchesSearch && matchesCategory && matchesPrice;
	});
});


const totalPages = computed(() => 
	Math.ceil(sortedRestaurants.value.length / itemsPerPage)
);

const visiblePages = computed(() => {
	const pages = [];
	const maxVisible = 5;
	
	if (totalPages.value <= maxVisible) {
		for (let i = 1; i <= totalPages.value; i++) pages.push(i);
	} else if (currentPage.value <= 3) {
		pages.push(1, 2, 3, 4, '...', totalPages.value);
	} else if (currentPage.value >= totalPages.value - 2) {
		pages.push(1, '...', totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value);
	} else {
		pages.push(1, '...', currentPage.value - 1, currentPage.value, currentPage.value + 1, '...', totalPages.value);
	}
	
	return pages;
});

const showFAB = computed(() => {
	return window.innerWidth < 1024; // Only show on mobile/tablet
});

const mobileMenuItems = computed(() => [
	{ label: 'home', icon: 'ri-home-line', action: 'home' },
	{ label: 'orders', icon: 'ri-shopping-bag-line', action: 'orders' },
	{ label: 'favorites', icon: 'ri-heart-line', action: 'favorites' },
	{ label: 'profile', icon: 'ri-user-line', action: 'profile' },
	{ label: 'settings', icon: 'ri-settings-line', action: 'settings' },
	{ label: 'help', icon: 'ri-question-line', action: 'help' },
]);

// Methods
function toggleCategory(category: string) {
	selectedCategory.value = selectedCategory.value === category ? '' : category;
	currentPage.value = 1;
}

function resetFilters() {
	search.value = '';
	selectedCategory.value = '';
	sortOption.value = 'name';
	priceRange.value = 'all';
	currentPage.value = 1;
}

function toggleViewMode() {
	viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
}

function toggleLanguage() {
	locale.value = currentLanguage.value === 'en' ? 'es' : 'en';
}

function toggleMobileMenu() {
	mobileMenuOpen.value = !mobileMenuOpen.value;
}

function handleMobileMenuClick(item: any) {
	mobileMenuOpen.value = false;
	console.log('Navigate to:', item.action);
	// Add your navigation logic here
}

function toggleFavorite(restaurant: Restaurant) {
    const index = restaurants.value.findIndex(r => r.id === restaurant.id);
    if (index !== -1) {
        (restaurants.value[index] as any).isFavorite = !(restaurants.value[index] as any).isFavorite;
    }
    console.log('Toggle favorite:', restaurant.name, (restaurant as any).isFavorite);
}

function viewRestaurantDetails(restaurant: Restaurant) {
	console.log('View restaurant:', restaurant);
	// Add navigation logic here
}

function openCart() {
	console.log('Open cart');
	// Add cart logic here
}

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: 'smooth' });
}

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

function checkScroll() {
	showScrollToTop.value = window.scrollY > 300;
}

function checkCategoriesScroll() {
	const container = document.querySelector('.scrollbar-hide');
	if (container) {
		showLeftScroll.value = container.scrollLeft > 10;
		showRightScroll.value = container.scrollLeft < container.scrollWidth - container.clientWidth - 10;
	}
}

// Lifecycle
onMounted(() => {
	window.addEventListener('scroll', checkScroll);
	window.addEventListener('resize', checkCategoriesScroll);
	
	// Simulate loading
	loading.value = true;
	setTimeout(() => {
		loading.value = false;
	}, 500);
	
	// Check scroll position for categories
	setTimeout(checkCategoriesScroll, 100);
});

onUnmounted(() => {
	window.removeEventListener('scroll', checkScroll);
	window.removeEventListener('resize', checkCategoriesScroll);
});
</script>

<style scoped>
/* Animation for mobile menu */
@keyframes slideIn {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translateX(0);
	}
}

.animate-slide-in {
	animation: slideIn 0.3s ease-out;
}

/* Transition for FAB */
.fixed {
	transition: all 0.3s ease;
}

/* Responsive typography */
.section-heading {
	@apply text-xl sm:text-2xl font-bold text-gray-900 dark:text-white;
}

.link-button {
	@apply text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors;
}

/* Responsive container */
.container {
	@apply px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl;
}

/* Hide scrollbar but keep functionality */
.scrollbar-hide {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

/* Responsive grid adjustments */
@media (max-width: 640px) {
	.grid-cols-1 {
		grid-template-columns: 1fr;
	}
}

@media (min-width: 641px) and (max-width: 768px) {
	.grid-cols-2 {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 769px) and (max-width: 1024px) {
	.grid-cols-2 {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (min-width: 1025px) and (max-width: 1280px) {
	.grid-cols-3 {
		grid-template-columns: repeat(3, 1fr);
	}
}

@media (min-width: 1281px) {
	.grid-cols-3 {
		grid-template-columns: repeat(3, 1fr);
	}
}
</style>