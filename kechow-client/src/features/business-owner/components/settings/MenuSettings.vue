<template>
	<div class="space-y-6 p-6">
		<h1 class="text-3xl font-bold text-gray-900">Business Settings</h1>
		<p class="text-gray-700">
			Manage your business info, delivery options, and promotions.
		</p>

		<!--  Buisness Category & Menu Description  -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">Restaurant Category</h2>
				<button
					@click="editingCategory = !editingCategory"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingCategory ? 'Save' : 'Edit' }}
				</button>
			</div>

			<div class="space-y-3">
				<div>
					<label class="text-gray-700 font-medium text-lg"
						>Primary Cuisine</label
					>
					<select
						v-model="restaurantCategory.primary"
						:disabled="!editingCategory"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						title="Select the main type of cuisine for your restaurant"
					>
						<option value="">Select Cuisine</option>
						<option value="pizza">Pizza</option>
						<option value="burger">Burgers</option>
						<option value="sushi">Sushi</option>
						<option value="mexican">Mexican</option>
						<option value="dessert">Dessert</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div>
					<label class="text-gray-700 font-medium text-lg"
						>Additional Tags</label
					>
					<input
						type="text"
						v-model="restaurantCategory.tags"
						:readonly="!editingCategory"
						placeholder="E.g. Vegan, Gluten-Free, Fast Food"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						title="Add keywords to describe your restaurant (comma separated)"
					/>
				</div>

				<div>
					<label class="text-gray-700 font-medium text-lg"
						>Short Description for Menu</label
					>
					<textarea
						v-model="restaurantCategory.menuDescription"
						:readonly="!editingCategory"
						placeholder="E.g. Homemade pizzas with fresh ingredients"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						title="Displayed on the menu for quick info"
					></textarea>
				</div>
			</div>
		</section>

		<!-- Delivery & Pre-order Settings -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">
					Delivery Options & Pre-orders
				</h2>
				<button
					@click="editingDelivery = !editingDelivery"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingDelivery ? 'Save' : 'Edit' }}
				</button>
			</div>

			<div class="space-y-3">
				<div class="flex items-center space-x-4">
					<label class="flex items-center space-x-2">
						<input
							type="checkbox"
							v-model="deliveryOptions.pickup"
							:disabled="!editingDelivery"
							class="h-5 w-5"
						/>
						<span class="text-gray-700 text-lg">Enable Pickup</span>
					</label>
					<label class="flex items-center space-x-2">
						<input
							type="checkbox"
							v-model="deliveryOptions.delivery"
							:disabled="!editingDelivery"
							class="h-5 w-5"
						/>
						<span class="text-gray-700 text-lg">Enable Delivery</span>
					</label>
				</div>
			</div>
		</section>

		<!-- Promotions / Free Delivery -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">
					Promotions & Free Delivery
				</h2>
				<button
					@click="editingPromo = !editingPromo"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingPromo ? 'Save' : 'Edit' }}
				</button>
			</div>

			<div class="space-y-3">
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						v-model="promoSettings.freeDeliveryEnabled"
						:disabled="!editingPromo"
						class="h-5 w-5"
					/>
					<span class="text-gray-700 text-lg">Enable Free Delivery Promo</span>
				</div>

				<div v-if="promoSettings.freeDeliveryEnabled" class="space-y-2">
					<div>
						<label class="text-gray-700 font-medium text-lg"
							>Minimum Order Amount</label
						>
						<input
							type="number"
							v-model="promoSettings.minOrder"
							:readonly="!editingPromo"
							min="0"
							placeholder="e.g. 500"
							class="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							title="Customers must meet this minimum to get free delivery"
						/>
					</div>
					<!-- Promo Schedule (like weekly availability) -->
					<div class="mt-2">
						<label class="block text-gray-700 font-medium text-lg mb-2"
							>Active Days / Hours</label
						>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								v-for="day in promoSettings.days"
								:key="day.id"
								class="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
							>
								<span class="w-24 font-medium">{{ day.label }}</span>

								<label class="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										v-model="day.active"
										:disabled="!editingPromo"
										class="rounded"
									/>
									<span class="text-sm text-gray-700">Active</span>
								</label>

								<div v-if="day.active" class="flex-1 flex gap-2">
									<input
										type="time"
										v-model="day.from"
										:readonly="!editingPromo"
										class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
									/>
									<input
										type="time"
										v-model="day.to"
										:readonly="!editingPromo"
										class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const editingCategory = ref(false);
const editingDelivery = ref(false);
const editingPromo = ref(false);

const promoSettings = reactive({
	freeDeliveryEnabled: false,
	minOrder: 0,
	days: [
		{ id: 1, label: 'Monday', from: '09:00', to: '17:00', active: false },
		{ id: 2, label: 'Tuesday', from: '09:00', to: '17:00', active: false },
		{ id: 3, label: 'Wednesday', from: '09:00', to: '17:00', active: false },
		{ id: 4, label: 'Thursday', from: '09:00', to: '17:00', active: false },
		{ id: 5, label: 'Friday', from: '09:00', to: '17:00', active: false },
		{ id: 6, label: 'Saturday', from: '10:00', to: '14:00', active: false },
		{ id: 7, label: 'Sunday', from: '10:00', to: '14:00', active: false },
	],
});

const restaurantCategory = reactive({
	primary: '', // e.g., pizza, sushi
	tags: '', // comma separated
	menuDescription: '',
});

const deliveryOptions = reactive({
	pickup: true,
	delivery: true,
	preorderHours: 3, // customers can pre-order up to 3 hours in advance
});
</script>
