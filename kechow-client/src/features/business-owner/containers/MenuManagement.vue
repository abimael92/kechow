<template>
	<div class="space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-3xl bg-gradient-to-r from-secondary-600 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
                    <i class="ri-restaurant-line text-white text-3xl"></i>
                </div>
                <div>
                    <h1 class="text-bubble text-6xl shadow-primary-500">
                    {{ $t('menuManagement') }}
					</h1>
                    <p class="text-neutral-950 dark:text-neutral-200 font-normal text-xl select-none">
                    {{ $t('trackMenuItems') }}
                        <span v-if="menuItems.length > 0" class="ml-2 text-tertiary-800 font-medium">
							({{ menuItems.length }} {{ $t('products', menuItems.length) }})
						</span>
                    </p>
                </div>
            </div>
			
			<div class="flex gap-3">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-[200px]">
					<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
					<input
						v-model="searchQuery"
						:placeholder="$t('searchPlaceholder')"
						class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						@input="handleSearch"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<i class="ri-close-line"></i>
					</button>
				</div>

				<!-- Add Item Button -->
				<button
					@click="openAddModal"
					class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2"
				>
					<i class="ri-add-line text-lg"></i>
					{{ $t('addMenuItem') }}
				</button>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div 
				v-for="stat in computedStats" 
				:key="stat.label"
				class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
			>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-2xl font-bold text-gray-900 dark:text-white">
							{{ stat.displayValue }}
						</p>
						<p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
							{{ $t(stat.label) }}
						</p>
						<div v-if="stat.trend" class="flex items-center gap-1 mt-2">
						<i :class="[stat.trendIcon, 'text-sm', stat.trend > 0 ? 'text-emerald-500' : 'text-red-500']"></i>
							<span class="text-xs font-medium" :class="stat.trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
								{{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
							</span>
							<span class="text-xs text-gray-500 dark:text-gray-400 ml-1">
								{{ $t('changeFromLastMonth') }}
							</span>
						</div>
					</div>
					<div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="stat.bgColor">
						<i :class="stat.icon" class="text-xl" :style="{ color: stat.color }"></i>
					</div>
				</div>
			</div>
		</div>

		<!-- Category Filter Tabs -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
			<div class="flex flex-wrap gap-2 overflow-x-auto m-4 p-2">
				<button
					v-for="category in categories"
					:key="category.value"
					@click="setActiveCategory(category.value)"
					:class="[
						'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2',
						activeCategory === category.value
							? 'shadow-md transform scale-105'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
					]"
					:style="activeCategory === category.value ? categoryStyle(category.color) : {}"
				>
					<i :class="category.icon"></i>
					{{ $t(category.translationKey) }}
					<span 
						class="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
						:class="activeCategory === category.value ? 'bg-white/20' : 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-300'"
					>
						{{ getItemCountByCategory(category.value) }}
					</span>
				</button>
			</div>
			
			<!-- Quick Actions Bar -->
			<div class="mt-4 flex flex-wrap gap-3">
				<button
					@click="exportMenu"
					class="px-4 py-2 bg-primary-500 dark:bg-primary-700 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
				>
					<i class="ri-download-line"></i>
					{{ $t('export') }}
				</button>
				<button
					@click="printMenu"
					class="px-4 py-2 bg-primary-500 dark:bg-primary-700 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
				>
					<i class="ri-printer-line"></i>
					{{ $t('printMenu') }}
				</button>
				<button
					@click="toggleAllAvailability"
					class="px-4 py-2 bg-primary-500 dark:bg-primary-700 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-medium hover:bg-primary-200 dark:hover:bg-primary-600 transition-colors flex items-center gap-2"
				>
					<i :class="allItemsAvailable ? 'ri-toggle-line' : 'ri-toggle-fill'"></i>
					{{ allItemsAvailable ? $t('disableAll') : $t('enableAll') }}
				</button>
			</div>
		</div>

		<!-- Menu Items Grid -->
		<div v-if="loading" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div v-for="n in 6" :key="n" class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
				<div class="space-y-4">
					<div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
					<div class="space-y-3">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
						<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div v-else-if="filteredItems.length === 0" class="text-center py-12">
			<div class="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
				<i class="ri-restaurant-2-line text-6xl"></i>
			</div>
			<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
				{{ searchQuery ? $t('noMenuItemsFound') : $t('noMenuItems') }}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-6">
				{{ searchQuery ? $t('tryDifferentSearchMenu') : $t('addFirstMenuItemPrompt') }}
			</p>
			<button
				v-if="!searchQuery"
				@click="openAddModal"
				class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 inline-flex items-center gap-2"
			>
				<i class="ri-add-line"></i>
				{{ $t('addMenuItem') }}
			</button>
		</div>

		<div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
				class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 group flex flex-col items-center justify-center min-h-[300px]"
			>
				<div class="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:bg-primary-200 dark:group-hover:bg-primary-800/40 transition-colors">
					<i class="ri-add-line text-2xl text-primary-600 dark:text-primary-400"></i>
				</div>
				<h3 class="text-lg font-semibold text-neutral-100 dark:text-white mb-2">
					{{ $t('addNewItem') }}
				</h3>
				<p class="text-sm text-neutral-200 dark:text-neutral-400 text-center">
					{{ $t('addNewItemDescription') }}
				</p>
			</button>
		</div>

		<!-- Pagination -->
		<div v-if="filteredItems.length > itemsPerPage" class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				{{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredItems.length) }} {{ $t('of') }} {{ filteredItems.length }} {{ $t('items', filteredItems.length) }}
			</p>
			<div class="flex gap-2">
				<button
					@click="prevPage"
					:disabled="currentPage === 1"
					class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
				>
					<i class="ri-arrow-left-s-line"></i>
					{{ $t('previous') }}
				</button>
				<button
					@click="nextPage"
					:disabled="currentPage * itemsPerPage >= filteredItems.length"
					class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
				>
					{{ $t('next') }}
					<i class="ri-arrow-right-s-line"></i>
				</button>
			</div>
		</div>
	</div>

	<!-- Add/Edit Modal (Placeholder) -->
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
import { fetchMenuItems, updateMenuItem } from '../services/businessOwner.service';
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
	{ value: 'pizza', translationKey: 'pizza', icon: 'ri-pizza-line', color: '#ef4444' },
	{ value: 'pasta', translationKey: 'pasta', icon: 'ri-noodles-line', color: '#f59e0b' },
	{ value: 'salads', translationKey: 'salads', icon: 'ri-leaf-line', color: '#10b981' },
	{ value: 'desserts', translationKey: 'desserts', icon: 'ri-cake-line', color: '#ec4899' },
	{ value: 'drinks', translationKey: 'drinks', icon: 'ri-drinks-line', color: '#3b82f6' }
];

const computedStats = computed(() => {
	const totalItems = menuItems.value.length;
	const availableItems = menuItems.value.filter(item => item.available).length;
	const outOfStockItems = totalItems - availableItems;
	const averagePrice = totalItems > 0 
		? menuItems.value.reduce((sum, item) => sum + item.price, 0) / totalItems 
		: 0;

	// Calculate trends (mock data - in real app, compare with previous period)
	const trends = {
		total: totalItems > 5 ? 12 : 0,
		available: availableItems > 3 ? 8 : 0,
		outOfStock: outOfStockItems > 0 ? -5 : 0,
		averagePrice: averagePrice > 15 ? 3 : 0
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
			displayValue: `$${averagePrice.toFixed(2)}`,
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
	
	// Filter by category
	if (activeCategory.value !== 'all') {
		filtered = filtered.filter(item => item.category === activeCategory.value);
	}
	
	// Filter by search query
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
		if (modalMode.value === 'add') {
			// Add new item logic
			console.log('Adding item:', itemData);
		} else {
			// Update existing item logic
			console.log('Updating item:', itemData);
		}
		await loadMenuItems();
		closeModal();
	} catch (error) {
		console.error('Failed to save menu item:', error);
	}
};

const handleQuickEdit = (item: MenuItem, field: string, value: any) => {
	// Handle quick edit (e.g., price change, availability toggle)
	console.log('Quick edit:', { item, field, value });
};

const confirmDelete = (item: MenuItem) => {
	if (confirm(t('confirmDeleteItem', { name: item.name }))) {
		console.log('Deleting item:', item);
		// Implement delete logic
	}
};

const toggleAvailability = async (item: MenuItem) => {
	try {
		const updatedItem = { ...item, available: !item.available };
		await updateMenuItem(item.id, updatedItem);
		await loadMenuItems();
	} catch (error) {
		console.error('Failed to toggle availability:', error);
	}
};

const toggleAllAvailability = async () => {
	try {
		const newAvailability = !allItemsAvailable.value;
		const updates = menuItems.value.map(item => ({
			...item,
			available: newAvailability
		}));
		
		// Batch update all items
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
	// Implement export logic
};

const printMenu = () => {
	console.log('Printing menu...');
	// Implement print logic
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
/* Smooth transitions */
button {
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
</style>