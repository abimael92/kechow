<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Menu Items</h1>
			<button
				@click="openModal"
				class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
			>
				Add New Item
			</button>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div
				v-for="item in menuItems"
				:key="item.id"
				class="border rounded-lg p-4 hover:shadow-md transition"
			>
				<div class="flex justify-between">
					<h3 class="font-bold">{{ item.name }}</h3>
					<span class="text-green-600">${{ item.price }}</span>
				</div>
				<p class="text-gray-600 mt-2">{{ item.description }}</p>
				<div class="mt-4 flex gap-2">
					<button
						@click="editItem(item)"
						class="text-sm bg-blue-500 text-white px-3 py-1 rounded"
					>
						Edit
					</button>
					<button
						@click="deleteItem(item.id)"
						class="text-sm bg-red-500 text-white px-3 py-1 rounded"
					>
						Delete
					</button>
				</div>
			</div>
		</div>

		<!-- Modal -->
		<MenuItemModal
			:isOpen="isModalOpen"
			:categories="categories"
			:restaurantId="restaurantId"
			:initialData="editingItem"
			@close="closeModal"
			@submit="handleSubmit"
		/>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenuStore } from '@/features/business-owner/store/menuStore';
import MenuItemModal from './MenuItemModal.vue';

const menuStore = useMenuStore();
const menuItems = ref([]);
const categories = ref([
	{ id: 1, name: 'Appetizers' },
	{ id: 2, name: 'Main Course' },
	{ id: 3, name: 'Desserts' },
]);

const restaurantId = 123; // replace with actual owner's restaurant ID

const isModalOpen = ref(false);
const editingItem = ref({
	name: '',
	description: '',
	price: 0,
	category: '',
	imageUrl: '',
});

onMounted(async () => {
	await loadMenu();
});

const loadMenu = async () => {
	try {
		menuItems.value = await menuStore.fetchMenuItems(restaurantId);
	} catch (err) {
		console.error(err);
		alert('Failed to load menu items');
	}
};

const openModal = () => {
	editingItem.value = {
		name: '',
		description: '',
		price: 0,
		category: '',
		imageUrl: '',
	};
	isModalOpen.value = true;
};

const editItem = (item) => {
	editingItem.value = { ...item };
	isModalOpen.value = true;
};

const closeModal = () => {
	isModalOpen.value = false;
};

const handleSubmit = async (data) => {
	try {
		if (editingItem.value.id) {
			await menuStore.updateMenuItem(data.id, data);
		} else {
			await menuStore.createMenuItem(data);
		}
		closeModal();
		await loadMenu();
	} catch (err) {
		console.error(err);
		alert('Failed to save menu item');
	}
};

const deleteItem = async (id) => {
	if (!confirm('Are you sure you want to delete this item?')) return;
	try {
		await menuStore.deleteMenuItem(id);
		menuItems.value = menuItems.value.filter((i) => i.id !== id);
	} catch (err) {
		console.error(err);
		alert('Failed to delete item');
	}
};
</script>
