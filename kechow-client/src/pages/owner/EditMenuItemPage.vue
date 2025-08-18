<template>
	<div class="p-6 max-w-2xl mx-auto">
		<h1 class="text-2xl font-bold mb-6">
			{{ isNew ? 'Add New Menu Item' : 'Edit Menu Item' }}
		</h1>

		<form @submit.prevent="submitForm" class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-700">Name</label>
				<input
					v-model="form.name"
					type="text"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700"
					>Description</label
				>
				<textarea
					v-model="form.description"
					rows="3"
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
				></textarea>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700">Price</label>
				<input
					v-model="form.price"
					type="number"
					step="0.01"
					min="0"
					required
					class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
				/>
			</div>

			<div class="flex justify-end space-x-4">
				<router-link
					to="/owner/menu"
					class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					Cancel
				</router-link>
				<button
					type="submit"
					class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
				>
					Save
				</button>
			</div>
		</form>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMenuStore } from '@/features/business-owner/store/menuStore';

const route = useRoute();
const router = useRouter();
const menuStore = useMenuStore();

const isNew = computed(() => route.params.id === 'new');

const form = ref({
	name: '',
	description: '',
	price: 0,
});

onMounted(async () => {
	if (!isNew.value) {
		const item = await menuStore.getMenuItem(route.params.id);
		form.value = { ...item };
	}
});

const submitForm = async () => {
	if (isNew.value) {
		await menuStore.createMenuItem(form.value);
	} else {
		await menuStore.updateMenuItem(route.params.id, form.value);
	}
	router.push('/owner/menu');
};
</script>
