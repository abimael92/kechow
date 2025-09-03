<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Menu Management</h1>
				<p class="text-gray-600 mt-1">
					Add, edit, and manage your restaurant menu items
				</p>
			</div>
			<button
				@click="openAddModal"
				class="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
			>
				<i
					class="ri-add-line mr-2 w-5 h-5 flex items-center justify-center inline"
				></i
				>Add Menu Item
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center">
					<div
						class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
					>
						<i
							class="ri-restaurant-line text-blue-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
					<div class="ml-4">
						<p class="text-2xl font-bold text-gray-900">
							{{ stats.totalItems }}
						</p>
						<p class="text-gray-600 text-sm">Total Items</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center">
					<div
						class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"
					>
						<i
							class="ri-check-line text-green-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
					<div class="ml-4">
						<p class="text-2xl font-bold text-gray-900">
							{{ stats.availableItems }}
						</p>
						<p class="text-gray-600 text-sm">Available</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center">
					<div
						class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
					>
						<i
							class="ri-close-line text-red-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
					<div class="ml-4">
						<p class="text-2xl font-bold text-gray-900">
							{{ stats.outOfStockItems }}
						</p>
						<p class="text-gray-600 text-sm">Out of Stock</p>
					</div>
				</div>
			</div>

			<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
				<div class="flex items-center">
					<div
						class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"
					>
						<i
							class="ri-price-tag-line text-orange-600 text-xl w-6 h-6 flex items-center justify-center"
						></i>
					</div>
					<div class="ml-4">
						<p class="text-2xl font-bold text-gray-900">
							${{ stats.averagePrice.toFixed(2) }}
						</p>
						<p class="text-gray-600 text-sm">Avg. Price</p>
					</div>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
			<div class="flex space-x-2 overflow-x-auto">
				<button
					v-for="category in categories"
					:key="category"
					@click="setActiveCategory(category)"
					:class="[
						'px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap',
						activeCategory === category
							? 'bg-orange-100 text-orange-600'
							: 'text-gray-600 hover:bg-gray-50',
					]"
				>
					{{ category }}
				</button>
			</div>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			<MenuItemCard
				v-for="item in filteredItems"
				:key="item.id"
				:item="item"
				@edit="openEditModal"
				@delete="confirmDelete"
				@toggle-availability="toggleAvailability"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MenuItemCard from '../components/MenuItemCard.vue';
import {
	fetchMenuItems,
	getMenuStats,
} from '../services/businessOwner.service';
import type { MenuItem } from '../types/';

const menuItems = ref<MenuItem[]>([]);
const activeCategory = ref('All Items');
const loading = ref(false);

const categories = [
	'All Items',
	'Pizza',
	'Pasta',
	'Salads',
	'Desserts',
	'Drinks',
];

const stats = computed(() => {
	const totalItems = menuItems.value.length;
	const availableItems = menuItems.value.filter(
		(item) => item.available
	).length;
	const outOfStockItems = totalItems - availableItems;
	const averagePrice =
		totalItems > 0
			? menuItems.value.reduce((sum, item) => sum + item.price, 0) / totalItems
			: 0;

	return {
		totalItems,
		availableItems,
		outOfStockItems,
		averagePrice,
	};
});

const filteredItems = computed(() => {
	if (activeCategory.value === 'All Items') {
		return menuItems.value;
	}
	return menuItems.value.filter(
		(item) => item.category === activeCategory.value.toLowerCase()
	);
});

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

const setActiveCategory = (category: string) => {
	activeCategory.value = category;
};

const openAddModal = () => {
	// Implement modal opening logic
	console.log('Open add modal');
};

const openEditModal = (item: MenuItem) => {
	// Implement edit modal logic
	console.log('Edit item:', item);
};

const confirmDelete = (item: MenuItem) => {
	// Implement delete confirmation
	console.log('Delete item:', item);
};

const toggleAvailability = (item: MenuItem) => {
	// Implement toggle availability
	console.log('Toggle availability:', item);
};

onMounted(() => {
	loadMenuItems();
});
</script>
