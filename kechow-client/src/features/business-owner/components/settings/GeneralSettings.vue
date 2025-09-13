<template>
	<div class="space-y-6">
		<!-- Restaurant Information -->
		<div
			class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6"
		>
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-bold text-gray-900">Restaurant Information</h3>
				<button
					v-if="editingInfoChanged"
					@click="saveRestaurantInfo"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					Save
				</button>
				<button
					v-else
					@click="toggleEditingInfo"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingInfo ? 'Cancel' : 'Edit' }}
				</button>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<!-- Name (Always Label) -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Restaurant Name</label
					>
					<p
						class="px-4 py-3 bg-gray-100 rounded-lg text-gray-800 cursor-not-allowed"
					>
						{{ restaurantInfo.name }}
					</p>
				</div>

				<!-- Phone -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Phone Number</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.phone"
						type="tel"
						placeholder="E.g. +52 123 456 7890"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.phone }}</template>
					</component>
				</div>

				<!-- Email -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Contact Email</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.email"
						type="email"
						placeholder="E.g. contact@restaurant.com"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.email }}</template>
					</component>
				</div>

				<!-- Website -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Website</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.website"
						type="url"
						placeholder="E.g. https://myrestaurant.com"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.website }}</template>
					</component>
				</div>

				<!-- Address -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Address</label
					>
					<component
						:is="editingInfo ? 'input' : 'p'"
						v-model="restaurantInfo.address"
						placeholder="Street, City, State, ZIP"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.address }}</template>
					</component>
				</div>

				<!-- Description -->
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Description</label
					>
					<component
						:is="editingInfo ? 'textarea' : 'p'"
						v-model="restaurantInfo.description"
						rows="4"
						placeholder="Describe your restaurant, specialties, or popular dishes"
						class="w-full px-4 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
					>
						<template #default>{{ restaurantInfo.description }}</template>
					</component>
				</div>
			</div>
		</div>

		<!-- Operating Hours -->
		<div
			class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
		>
			<div class="flex justify-between items-center">
				<h3 class="text-lg font-bold text-gray-900">Operating Hours</h3>
				<button
					@click="toggleEditingHours"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingHours ? 'Save' : 'Edit' }}
				</button>
			</div>
			<div class="space-y-4">
				<OperatingHoursDay />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import OperatingHoursDay from './OperatingHoursDay.vue';
import type { OperatingHours } from '../../types';

const editingInfo = ref(false);
const editingHours = ref(false);

const restaurantInfo = reactive({
	name: "Mario's Kitchen",
	phone: '+1 (555) 123-4567',
	email: 'contact@marioskitchen.com',
	website: 'https://marioskitchen.com',
	address: '123 Restaurant Street, Food City, FC 12345',
	description:
		'Authentic Italian cuisine with fresh ingredients and traditional recipes.',
});

const originalInfo = reactive({ ...restaurantInfo });

const editingInfoChanged = computed(() => {
	return (
		editingInfo.value &&
		(restaurantInfo.phone !== originalInfo.phone ||
			restaurantInfo.email !== originalInfo.email ||
			restaurantInfo.website !== originalInfo.website ||
			restaurantInfo.address !== originalInfo.address ||
			restaurantInfo.description !== originalInfo.description)
	);
});

function toggleEditingInfo() {
	if (editingInfo) {
		// Cancel edits, reset values
		Object.assign(restaurantInfo, originalInfo);
	}
	editingInfo.value = !editingInfo.value;
}

function saveRestaurantInfo() {
	Object.assign(originalInfo, restaurantInfo);
	editingInfo.value = false;
	console.log('Saved restaurant info:', restaurantInfo);
}

const operatingHours = reactive<OperatingHours[]>([
	{
		id: 'monday',
		day: 'Monday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'tuesday',
		day: 'Tuesday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'wednesday',
		day: 'Wednesday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'thursday',
		day: 'Thursday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'friday',
		day: 'Friday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'saturday',
		day: 'Saturday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
	{
		id: 'sunday',
		day: 'Sunday',
		openTime: '10:00',
		closeTime: '22:00',
		closed: false,
	},
]);

function toggleEditingHours() {
	editingHours.value = !editingHours.value;
	if (!editingHours.value) {
		// Save logic here
		console.log('Saved operating hours', operatingHours);
	}
}

function updateOperatingHours(updatedDay: OperatingHours) {
	const index = operatingHours.findIndex((day) => day.id === updatedDay.id);
	if (index !== -1) operatingHours[index] = updatedDay;
}
</script>
