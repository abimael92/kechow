<template>
	<div class="bg-white shadow rounded-lg overflow-hidden">
		<div
			class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center"
		>
			<h3 class="text-lg font-medium leading-6 text-gray-900">
				Gestión del Menú
			</h3>
			<button
				@click="openAddItemModal"
				class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Agregar Platillo
			</button>
		</div>

		<div class="divide-y divide-gray-200">
			<div
				v-for="category in menuCategories"
				:key="category.id"
				class="px-4 py-4"
			>
				<h4 class="text-md font-medium text-gray-900 mb-3">
					{{ category.name }}
				</h4>

				<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<li
						v-for="item in category.items"
						:key="item.id"
						class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:shadow-md transition-shadow"
					>
						<div class="w-full flex items-center justify-between p-4 space-x-4">
							<div class="flex-1 truncate">
								<div class="flex items-center space-x-3">
									<h3 class="text-gray-900 text-sm font-medium truncate">
										{{ item.name }}
									</h3>
									<span
										class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full"
									>
										${{ item.price }}
									</span>
								</div>
								<p class="mt-1 text-gray-500 text-sm truncate">
									{{ item.description }}
								</p>
							</div>
							<img
								v-if="item.image"
								class="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 object-cover"
								:src="item.image"
								:alt="item.name"
							/>
							<div
								v-else
								class="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500"
							>
								<PhotoIcon class="h-8 w-8" />
							</div>
						</div>
						<div>
							<div class="-mt-px flex divide-x divide-gray-200">
								<div class="w-0 flex-1 flex">
									<button
										@click="openEditItemModal(item)"
										class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
									>
										<PencilIcon
											class="w-5 h-5 text-gray-400"
											aria-hidden="true"
										/>
										<span class="ml-3">Editar</span>
									</button>
								</div>
								<div class="-ml-px w-0 flex-1 flex">
									<button
										@click="confirmDeleteItem(item)"
										class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
									>
										<TrashIcon
											class="w-5 h-5 text-gray-400"
											aria-hidden="true"
										/>
										<span class="ml-3">Eliminar</span>
									</button>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- Add/Edit Item Modal -->
		<MenuItemModal
			:open="showItemModal"
			:item="selectedItem"
			@close="closeItemModal"
			@save="handleSaveItem"
		/>

		<!-- Delete Confirmation Modal -->
		<ConfirmationModal
			:open="showDeleteModal"
			title="Eliminar Platillo"
			message="¿Estás seguro que deseas eliminar este platillo? Esta acción no se puede deshacer."
			confirmText="Eliminar"
			cancelText="Cancelar"
			@confirm="deleteItem"
			@cancel="closeDeleteModal"
		/>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/vue/outline';
import MenuItemModal from '@/components/owner/MenuItemModal.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';

const menuCategories = ref([
	{
		id: 1,
		name: 'Entradas',
		items: [
			{
				id: 1,
				name: 'Nachos',
				description: 'Nachos con queso fundido, guacamole y pico de gallo',
				price: 120,
				image: '/images/menu/nachos.jpg',
			},
			{
				id: 2,
				name: 'Alitas',
				description: 'Alitas de pollo bañadas en salsa BBQ o Buffalo',
				price: 150,
				image: null,
			},
		],
	},
	{
		id: 2,
		name: 'Platos Fuertes',
		items: [
			{
				id: 3,
				name: 'Hamburguesa Clásica',
				description:
					'Hamburguesa con queso, lechuga, tomate y aderezo especial',
				price: 180,
				image: '/images/menu/burger.jpg',
			},
		],
	},
]);

const showItemModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref(null);
const itemToDelete = ref(null);

function openAddItemModal() {
	selectedItem.value = null;
	showItemModal.value = true;
}

function openEditItemModal(item) {
	selectedItem.value = { ...item };
	showItemModal.value = true;
}

function closeItemModal() {
	showItemModal.value = false;
}

function confirmDeleteItem(item) {
	itemToDelete.value = item.id;
	showDeleteModal.value = true;
}

function closeDeleteModal() {
	showDeleteModal.value = false;
	itemToDelete.value = null;
}

async function handleSaveItem(itemData) {
	try {
		if (itemData.id) {
			// Update existing item
			const category = menuCategories.value.find((c) =>
				c.items.some((i) => i.id === itemData.id)
			);
			if (category) {
				const itemIndex = category.items.findIndex((i) => i.id === itemData.id);
				if (itemIndex !== -1) {
					category.items[itemIndex] = { ...itemData };
				}
			}
		} else {
			// Add new item
			const newItem = {
				...itemData,
				id:
					Math.max(
						...menuCategories.value.flatMap((c) => c.items.map((i) => i.id))
					) + 1,
			};
			// For simplicity, adding to first category
			menuCategories.value[0].items.push(newItem);
		}
		closeItemModal();
	} catch (error) {
		console.error('Error saving menu item:', error);
	}
}

async function deleteItem() {
	try {
		menuCategories.value.forEach((category) => {
			category.items = category.items.filter(
				(item) => item.id !== itemToDelete.value
			);
		});
		closeDeleteModal();
	} catch (error) {
		console.error('Error deleting menu item:', error);
	}
}
</script>
