<template>
	<div class="space-y-4 sm:space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-restaurant-line text-white text-xl sm:text-2xl md:text-3xl"></i>
                </div>
                <div class="flex-1 min-w-0">
                    <h1 class="text-bubble text-3xl sm:text-4xl md:text-5xl lg:text-6xl shadow-primary-500 leading-tight sm:leading-snug">
                        {{ $t('menuManagement') }}
                    </h1>
                    <p class="text-neutral-950 dark:text-neutral-200 font-normal text-sm sm:text-base md:text-lg lg:text-xl select-none truncate">
                        {{ $t('trackMenuItems') }}
                        <span v-if="menuItems.length > 0" class="ml-1 sm:ml-2 text-tertiary-800 dark:text-tertiary-400 font-medium">
                            ({{ menuItems.length }} {{ $t('products', menuItems.length) }})
                        </span>
                    </p>
                </div>
            </div>
			
			<div class="flex flex-col xs:flex-row gap-2 sm:gap-3">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-0">
					<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm sm:text-base"></i>
					<input
						v-model="searchQuery"
						:placeholder="$t('searchMenuPlaceholder')"
						class="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-sm sm:text-base"
						@input="handleSearch"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<i class="ri-close-line text-sm sm:text-base"></i>
					</button>
				</div>

				<!-- Add Item Button -->
				<button
					@click="openAddModal"
					class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
				>
					<i class="ri-add-line text-base sm:text-lg"></i>
					{{ $t('addMenuItem') }}
				</button>
			</div>
		</div>

		<!-- Stats Overview - Responsive -->
		<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
			<div 
				v-for="stat in computedStats" 
				:key="stat.label"
				class="bg-white dark:bg-gray-800 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
			>
				<div class="flex items-center justify-between">
					<div class="min-w-0 flex-1">
						<p class="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
							{{ stat.displayValue }}
						</p>
						<p class="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate">
							{{ $t(stat.label) }}
						</p>
						<div v-if="stat.trend" class="flex items-center gap-1 mt-1 sm:mt-2">
							<i :class="[stat.trendIcon, 'text-xs sm:text-sm', stat.trend > 0 ? 'text-emerald-500' : 'text-red-500']"></i>
							<span class="text-xs font-medium" :class="stat.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
								{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
							</span>
							<span class="text-xs text-gray-500 dark:text-gray-400 ml-1 hidden sm:inline">
								{{ $t('changeFromLastMonth') }}
							</span>
						</div>
					</div>
					<div class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2" :class="stat.bgColor">
						<i :class="stat.icon" class="text-base sm:text-lg md:text-xl" :style="{ color: stat.color }"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Category Filter Tabs - Responsive -->
		<div class="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
			<!-- Tabs with horizontal scroll on mobile -->
			<div class="relative">
				<div class="overflow-x-auto pb-2 -mx-1 sm:mx-0">
					<div class="flex gap-1 sm:gap-2 px-1 min-w-max">
						<button
							v-for="category in categories"
							:key="category.value"
							@click="setActiveCategory(category.value)"
							:class="[
								'px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-1 sm:gap-2 flex-shrink-0',
								activeCategory === category.value
									? 'shadow-md transform scale-105'
									: 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
							]"
							:style="activeCategory === category.value ? categoryStyle(category.color) : {}"
						>
							<i :class="category.icon" class="text-xs sm:text-sm"></i>
							<span class="truncate max-w-[80px] sm:max-w-none">
								{{ $t(category.translationKey) }}
							</span>
							<span 
								class="ml-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-semibold flex-shrink-0"
								:class="activeCategory === category.value ? 'bg-white/20' : 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-300'"
							>
								{{ getItemCountByCategory(category.value) }}
							</span>
						</button>
					</div>
				</div>
				<!-- Scroll indicator for mobile -->
				<div class="sm:hidden text-center mt-2">
					<p class="text-xs text-gray-500 dark:text-gray-400">
						{{ $t('swipeForMoreCategories') }}
					</p>
				</div>
			</div>
			
			<!-- Quick Actions Bar - Responsive -->
			<div class="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-3">
				<button
					@click="exportMenu"
					class="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center"
				>
					<i class="ri-download-line text-sm"></i>
					{{ $t('export') }}
				</button>
				<button
					@click="printMenu"
					class="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center"
				>
					<i class="ri-printer-line text-sm"></i>
					{{ $t('printMenu') }}
				</button>
				<button
					@click="toggleAllAvailability"
					class="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-500 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-800/40 transition-colors flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none justify-center"
				>
					<i :class="[allItemsAvailable ? 'ri-toggle-line' : 'ri-toggle-fill', 'text-sm']"></i>
					{{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}
				</button>
			</div>
		</div>

		<!-- Loading State -->
		<div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			<div v-for="n in 6" :key="n" class="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
				<div class="space-y-3 sm:space-y-4">
					<div class="h-32 sm:h-40 md:h-48 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl"></div>
					<div class="space-y-2 sm:space-y-3">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
						<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Empty State -->
		<div v-else-if="filteredItems.length === 0" class="text-center py-8 sm:py-12">
			<div class="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 text-gray-300 dark:text-gray-600">
				<i class="ri-restaurant-2-line text-4xl sm:text-5xl md:text-6xl"></i>
			</div>
			<h3 class="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
				{{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base max-w-md mx-auto px-4">
				{{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}
			</p>
			<button
				v-if="!searchQuery"
				@click="openAddModal"
				class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
			>
				<i class="ri-add-line"></i>
				{{ $t('addMenuItem') }}
			</button>
		</div>

		<!-- Menu Items Grid - Responsive -->
		<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			<MenuItemCard
				v-for="item in paginatedItems"
				:key="item.id"
				:item="item"
				@edit="openEditModal"
				@delete="confirmDelete"
				@toggle-availability="toggleAvailability"
				@quick-edit="handleQuickEdit"
			/>
			
			<!-- Add New Item Card -->
			<button
				@click="openAddModal"
				class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 group flex flex-col items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]"
			>
				<div class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
					<i class="ri-add-line text-xl sm:text-2xl text-primary-600 dark:text-primary-400"></i>
				</div>
				<h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
					{{ $t('addNewItem') }}
				</h3>
				<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
					{{ $t('addNewItemDescription') }}
				</p>
			</button>
		</div>

		<!-- Pagination -->
		<div v-if="filteredItems.length > itemsPerPage" class="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
			<p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
				{{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} {{ $t('of') }} {{ filteredItems.length }} {{ $t('items', filteredItems.length) }}
			</p>
			<div class="flex gap-1.5 sm:gap-2 order-1 sm:order-2">
				<button
					@click="prevPage"
					:disabled="currentPage === 1"
					class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-xs sm:text-sm"
				>
					<i class="ri-arrow-left-s-line text-sm"></i>
					{{ $t('previous') }}
				</button>
				<button
					@click="nextPage"
					:disabled="currentPage * itemsPerPage >= filteredItems.length"
					class="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1 text-xs sm:text-sm"
				>
					{{ $t('next') }}
					<i class="ri-arrow-right-s-line text-sm"></i>
				</button>
			</div>
		</div>
	</div>

	<!-- Add/Edit Modal -->
	<MenuModal
		v-if="showModal"
		:mode="modalMode"
		:item="selectedItem"
		@close="closeModal"
		@save="handleSave"
	/>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import MenuItemCard from '../components/MenuItemCard.vue';
import MenuModal from '../components/MenuModal.vue';
import {
	fetchMenuItems,
	createMenuItem,
	updateMenuItem,
	deleteMenuItem,
	toggleMenuItemAvailability,
} from '../services/businessOwner.service';
import type { MenuItem } from '../types/';

const { t } = useI18n();

const menuItems = ref<MenuItem[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const activeCategory = ref('all');
const currentPage = ref(1);
const itemsPerPage = 12;
const showModal = ref(false);
const modalMode = ref<'add' | 'edit'>('add');
const selectedItem = ref<MenuItem | null>(null);

const categories = [
	{ value: 'all', translationKey: 'allItems', icon: 'ri-list-check', color: '#8b34e0' },
	{ value: 'plato principal', translationKey: 'categories.platoprincipal', icon: 'ri-bowl-line', color: '#ef4444' },
	{ value: 'sopas', translationKey: 'categories.sopas', icon: 'ri-fire-line', color: '#f59e0b' },
	{ value: 'ensaladas', translationKey: 'categories.ensaladas', icon: 'ri-leaf-line', color: '#10b981' },
	{ value: 'postres', translationKey: 'categories.postres', icon: 'ri-cake-line', color: '#ec4899' },
	{ value: 'bebidas', translationKey: 'categories.bebidas', icon: 'ri-drinks-line', color: '#3b82f6' }
];

const computedStats = computed(() => {
	const totalItems = menuItems.value.length;
	const availableItems = menuItems.value.filter(item => item.available).length;
	const outOfStockItems = totalItems - availableItems;
	const averagePrice = totalItems > 0 
		? menuItems.value.reduce((sum, item) => sum + item.price, 0) / totalItems 
		: 0;

	const trends = {
	    total: menuItems.value.length > 0 ? Math.floor(Math.random() * 8) + 4 : 0,
	    available: availableItems > 0 ? Math.floor(Math.random() * 6) + 2 : 0,
	    outOfStock: outOfStockItems > 0 ? -(Math.floor(Math.random() * 3) + 1) : 0,
	    averagePrice: averagePrice > 50 ? Math.floor(Math.random() * 5) + 1 : 0
	};

	return [
		{
			label: 'totalItems',
			value: totalItems,
			displayValue: totalItems,
			icon: 'ri-restaurant-line',
			color: '#3b82f6',
			bgColor: 'bg-blue-100 dark:bg-blue-900/30',
			trend: trends.total,
			trendIcon: trends.total > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
		},
		{
			label: 'availableItems',
			value: availableItems,
			displayValue: availableItems,
			icon: 'ri-check-line',
			color: '#10b981',
			bgColor: 'bg-green-100 dark:bg-green-900/30',
			trend: trends.available,
			trendIcon: trends.available > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
		},
		{
			label: 'outOfStockItems',
			value: outOfStockItems,
			displayValue: outOfStockItems,
			icon: 'ri-close-line',
			color: '#ef4444',
			bgColor: 'bg-red-100 dark:bg-red-900/30',
			trend: trends.outOfStock,
			trendIcon: trends.outOfStock < 0 ? 'ri-arrow-down-line' : 'ri-arrow-up-line'
		},
		{
			label: 'averagePrice',
			value: averagePrice,
			displayValue: `$${averagePrice.toFixed(2)} MXN`,
			icon: 'ri-price-tag-line',
			color: '#f59e0b',
			bgColor: 'bg-orange-100 dark:bg-orange-900/30',
			trend: trends.averagePrice,
			trendIcon: trends.averagePrice > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line'
		}
	];
});

const allItemsAvailable = computed(() => {
	return menuItems.value.every(item => item.available);
});

const filteredItems = computed(() => {
	let filtered = [...menuItems.value];
	
	if (activeCategory.value !== 'all') {
		filtered = filtered.filter(item => item.category === activeCategory.value);
	}
	
	if (searchQuery.value.trim()) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(item => 
			item.name.toLowerCase().includes(query) ||
			item.description.toLowerCase().includes(query) ||
			((item as any).tags && (item as any).tags.some((tag: string) => tag.toLowerCase().includes(query)))
		);
	}
	
	return filtered;
});

const paginatedItems = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;
	return filteredItems.value.slice(start, end);
});

// Functions
const getItemCountByCategory = (category: string) => {
	if (category === 'all') return menuItems.value.length;
	return menuItems.value.filter(item => item.category === category).length;
};

const categoryStyle = (color: string) => ({
	background: `linear-gradient(135deg, ${color}, ${color}80)`,
	color: 'white'
});

const setActiveCategory = (category: string) => {
	activeCategory.value = category;
	currentPage.value = 1;
};

const handleSearch = () => {
	currentPage.value = 1;
};

const clearSearch = () => {
	searchQuery.value = '';
	currentPage.value = 1;
};

const nextPage = () => {
	if (currentPage.value * itemsPerPage < filteredItems.value.length) {
		currentPage.value++;
	}
};

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
	}
};

const openAddModal = () => {
	modalMode.value = 'add';
	selectedItem.value = null;
	showModal.value = true;
};

const openEditModal = (item: MenuItem) => {
	modalMode.value = 'edit';
	selectedItem.value = { ...item };
	showModal.value = true;
};

const closeModal = () => {
	showModal.value = false;
	selectedItem.value = null;
};

const handleSave = async (itemData: Partial<MenuItem>) => {
	try {
		loading.value = true;
		if (modalMode.value === 'add') {
			await createMenuItem(itemData as any);
		} else if (selectedItem.value) {
			await updateMenuItem(selectedItem.value.id, itemData);
		}
		await loadMenuItems();
		closeModal();
	} catch (error) {
		console.error('Failed to save menu item:', error);
	} finally {
		loading.value = false;
	}
};

const handleQuickEdit = (item: MenuItem, field: string, value: any) => {
	console.log('Quick edit:', { item, field, value });
};

const confirmDelete = async (item: MenuItem) => {
	if (confirm(t('confirmDeleteItem', { name: item.name }))) {
		try {
			loading.value = true;
			await deleteMenuItem(item.id);
			await loadMenuItems();
		} catch (error) {
			console.error('Failed to delete menu item:', error);
		} finally {
			loading.value = false;
		}
	}
};

const toggleAvailability = async (item: MenuItem) => {
	try {
		loading.value = true;
		await toggleMenuItemAvailability(item.id);
		await loadMenuItems();
	} catch (error) {
		console.error('Failed to toggle availability:', error);
	} finally {
		loading.value = false;
	}
};

const toggleAllAvailability = async () => {
	try {
		const newAvailability = !allItemsAvailable.value;
		const updates = menuItems.value.map(item => ({
			...item,
			available: newAvailability
		}));
		
		for (const item of updates) {
			await updateMenuItem(item.id, item);
		}
		
		await loadMenuItems();
	} catch (error) {
		console.error('Failed to toggle all availability:', error);
	}
};

const exportMenu = () => {
	console.log('Exporting menu...');
};

const printMenu = () => {
	console.log('Printing menu...');
};

const loadMenuItems = async () => {
	try {
		loading.value = true;
		menuItems.value = await fetchMenuItems();
	} catch (error) {
		console.error('Failed to load menu items:', error);
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	loadMenuItems();
});
</script>

<style scoped>
/* Responsive text bubble */
.text-bubble {
	font-size: clamp(2rem, 5vw, 3.5rem);
}

/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Hover effects */
button:hover {
	transform: translateY(-1px);
}

/* Active state */
button:active {
	transform: translateY(0);
}

/* Touch-friendly targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 44px;
		min-width: 44px;
	}
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

.overflow-x-auto {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* Loading animation */
@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive breakpoints */
@media (max-width: 640px) {
	.space-y-4 > * + * {
		margin-top: 1rem;
	}
}

@media (min-width: 641px) and (max-width: 1024px) {
	.space-y-6 > * + * {
		margin-top: 1.5rem;
	}
}

/* Accessibility */
button:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}
</style>