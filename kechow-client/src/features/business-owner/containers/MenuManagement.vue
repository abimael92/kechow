<template>
	<div class="p-6">
		<MenuItemsList :items="menuItems" @edit="editItem" @delete="deleteItem" />
		<MenuItemModal
			:isOpen="isModalOpen"
			:categories="categories"
			:initialData="editingItem"
			@submit="handleSubmit"
			@close="closeModal"
		/>
		<button @click="openModal" class="btn">Add New Item</button>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMenuStore } from '@/features/business-owner/store/menu.store';
import MenuItemsList from '../components/MenuItemsList.vue';
import MenuItemModal from '../components/MenuItemModal.vue';

const menuStore = useMenuStore();
const menuItems = ref([]);
const isModalOpen = ref(false);
const editingItem = ref({
	name: '',
	description: '',
	price: 0,
	category: '',
	imageUrl: '',
});
const categories = ref([
	{ id: 1, name: 'Appetizers' },
	{ id: 2, name: 'Main Course' },
]);

const loadMenu = async () => {
	menuItems.value = await menuStore.fetchMenuItems(123);
};
onMounted(loadMenu);

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
const closeModal = () => (isModalOpen.value = false);
const editItem = (item) => {
	editingItem.value = { ...item };
	isModalOpen.value = true;
};
const deleteItem = async (id) => {
	await menuStore.deleteMenuItem(id);
	menuItems.value = menuItems.value.filter((i) => i.id !== id);
};
const handleSubmit = async (data) => {
	editingItem.value.id
		? await menuStore.updateMenuItem(data.id, data)
		: await menuStore.createMenuItem(data);
	closeModal();
	loadMenu();
};
</script>
