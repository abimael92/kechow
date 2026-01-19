<template>
	<div class="space-y-6 p-6">
		<h1 class="text-3xl font-bold text-gray-900">{{ t('businessSettings.title') }}</h1>
		<p class="text-gray-700">
			{{ t('businessSettings.subtitle') }}
		</p>

		<!--  Business Category & Menu Description  -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">{{ t('businessSettings.category.title') }}</h2>
				<button
					@click="editingCategory = !editingCategory"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingCategory ? t('common.save') : t('common.edit') }}
				</button>
			</div>

			<div class="space-y-3">
				<div>
					<label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.primaryCuisine') }}</label>
					<select
						v-model="restaurantCategory.primary"
						:disabled="!editingCategory"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						:title="t('businessSettings.category.primaryCuisineTooltip')"
					>
						<option value="">{{ t('businessSettings.category.selectCuisine') }}</option>
						<option value="pizza">{{ t('cuisine.pizza') }}</option>
						<option value="burger">{{ t('cuisine.burger') }}</option>
						<option value="sushi">{{ t('cuisine.sushi') }}</option>
						<option value="mexican">{{ t('cuisine.mexican') }}</option>
						<option value="dessert">{{ t('cuisine.dessert') }}</option>
						<option value="other">{{ t('cuisine.other') }}</option>
					</select>
				</div>

				<div>
					<label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.additionalTags') }}</label>
					<input
						type="text"
						v-model="restaurantCategory.tags"
						:readonly="!editingCategory"
						:placeholder="t('businessSettings.category.tagsPlaceholder')"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						:title="t('businessSettings.category.tagsTooltip')"
					/>
				</div>

				<div>
					<label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.category.menuDescription') }}</label>
					<textarea
						v-model="restaurantCategory.menuDescription"
						:readonly="!editingCategory"
						:placeholder="t('businessSettings.category.descriptionPlaceholder')"
						class="w-full px-4 py-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						:title="t('businessSettings.category.descriptionTooltip')"
					></textarea>
				</div>
			</div>
		</section>

		<!-- Delivery & Pre-order Settings -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">
					{{ t('businessSettings.delivery.title') }}
				</h2>
				<button
					@click="editingDelivery = !editingDelivery"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingDelivery ? t('common.save') : t('common.edit') }}
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
						<span class="text-gray-700 text-lg">{{ t('businessSettings.delivery.enablePickup') }}</span>
					</label>
					<label class="flex items-center space-x-2">
						<input
							type="checkbox"
							v-model="deliveryOptions.delivery"
							:disabled="!editingDelivery"
							class="h-5 w-5"
						/>
						<span class="text-gray-700 text-lg">{{ t('businessSettings.delivery.enableDelivery') }}</span>
					</label>
				</div>
			</div>
		</section>

		<!-- Promotions / Free Delivery -->
		<section class="bg-white p-6 rounded-xl shadow-sm space-y-4">
			<div class="flex justify-between items-center">
				<h2 class="text-xl font-semibold text-gray-800">
					{{ t('businessSettings.promotions.title') }}
				</h2>
				<button
					@click="editingPromo = !editingPromo"
					class="text-blue-600 hover:text-blue-800 font-medium"
				>
					{{ editingPromo ? t('common.save') : t('common.edit') }}
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
					<span class="text-gray-700 text-lg">{{ t('businessSettings.promotions.enableFreeDelivery') }}</span>
				</div>

				<div v-if="promoSettings.freeDeliveryEnabled" class="space-y-2">
					<div>
						<label class="text-gray-700 font-medium text-lg">{{ t('businessSettings.promotions.minimumOrder') }}</label>
						<input
							type="number"
							v-model="promoSettings.minOrder"
							:readonly="!editingPromo"
							min="0"
							:placeholder="t('businessSettings.promotions.minOrderPlaceholder')"
							class="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
							:title="t('businessSettings.promotions.minOrderTooltip')"
						/>
					</div>
					<!-- Promo Schedule (like weekly availability) -->
					<div class="mt-2">
						<label class="block text-gray-700 font-medium text-lg mb-2">{{ t('businessSettings.promotions.activeSchedule') }}</label>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div
								v-for="day in promoSettings.days"
								:key="day.id"
								class="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
							>
								<span class="w-24 font-medium">{{ t(`days.${day.label.toLowerCase()}`) }}</span>

								<label class="flex items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										v-model="day.active"
										:disabled="!editingPromo"
										class="rounded"
									/>
									<span class="text-sm text-gray-700">{{ t('businessSettings.promotions.active') }}</span>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const editingCategory = ref(false);
const editingDelivery = ref(false);
const editingPromo = ref(false);

const promoSettings = reactive({
	freeDeliveryEnabled: false,
	minOrder: 0,
	days: [
		{ id: 1, label: 'monday', from: '09:00', to: '17:00', active: false },
		{ id: 2, label: 'tuesday', from: '09:00', to: '17:00', active: false },
		{ id: 3, label: 'wednesday', from: '09:00', to: '17:00', active: false },
		{ id: 4, label: 'thursday', from: '09:00', to: '17:00', active: false },
		{ id: 5, label: 'friday', from: '09:00', to: '17:00', active: false },
		{ id: 6, label: 'saturday', from: '10:00', to: '14:00', active: false },
		{ id: 7, label: 'sunday', from: '10:00', to: '14:00', active: false },
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