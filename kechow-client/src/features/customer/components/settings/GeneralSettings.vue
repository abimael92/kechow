<template>
	<div class="space-y-6">
		<!-- Restaurant Information -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-6">
				Restaurant Information
			</h3>
			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Restaurant Name</label
					>
					<input
						v-model="restaurantInfo.name"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
						type="text"
					/>
				</div>
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Phone Number</label
					>
					<input
						v-model="restaurantInfo.phone"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
						type="tel"
					/>
				</div>
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Address</label
					>
					<input
						v-model="restaurantInfo.address"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
						type="text"
					/>
				</div>
				<div class="md:col-span-2">
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Description</label
					>
					<textarea
						v-model="restaurantInfo.description"
						rows="4"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Operating Hours -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-bold text-gray-900">Operating Hours</h3>
				<div class="flex items-center">
					<span class="text-sm text-gray-600 mr-3">Currently</span>
					<button
						@click="toggleRestaurantStatus"
						:class="[
							'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer',
							restaurantInfo.isOpen ? 'bg-orange-600' : 'bg-gray-300',
						]"
					>
						<span
							:class="[
								'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
								restaurantInfo.isOpen ? 'translate-x-6' : 'translate-x-1',
							]"
						></span>
					</button>
					<span
						class="ml-3 text-sm font-medium"
						:class="restaurantInfo.isOpen ? 'text-green-600' : 'text-red-600'"
					>
						{{ restaurantInfo.isOpen ? 'Open' : 'Closed' }}
					</span>
				</div>
			</div>

			<div class="space-y-4">
				<OperatingHoursDay
					v-for="day in operatingHours"
					:key="day.id"
					:day="day"
					@update-hours="updateOperatingHours"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import OperatingHoursDay from './OperatingHoursDay.vue';
import type { RestaurantSettings, OperatingHours } from '../../types';

const restaurantInfo = reactive<RestaurantSettings>({
	name: "Mario's Kitchen",
	phone: '+1 (555) 123-4567',
	address: '123 Restaurant Street, Food City, FC 12345',
	description:
		'Authentic Italian cuisine with fresh ingredients and traditional recipes. Family-owned restaurant serving delicious pizza, pasta, and more since 1985.',
	isOpen: true,
});

const operatingHours = ref<OperatingHours[]>([
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

const toggleRestaurantStatus = () => {
	restaurantInfo.isOpen = !restaurantInfo.isOpen;
};

const updateOperatingHours = (updatedDay: OperatingHours) => {
	const index = operatingHours.value.findIndex(
		(day) => day.id === updatedDay.id
	);
	if (index !== -1) {
		operatingHours.value[index] = updatedDay;
	}
};
</script>
