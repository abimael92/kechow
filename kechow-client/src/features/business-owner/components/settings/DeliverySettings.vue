<template>
	<div class="flex flex-col lg:flex-row gap-8">
		<!-- Content -->
		<div class="lg:w-3/4">
			<div class="space-y-6">
				<!-- Delivery Settings -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h3 class="text-lg font-bold text-gray-900 mb-6">
						{{ t('deliverySettings') }}
					</h3>
					<div class="grid md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								{{ t('deliveryRadius') }} (km)
							</label>
							<input
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
								type="number"
								value="10"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								{{ t('deliveryFee') }} ($)
							</label>
							<input
								step="0.01"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
								type="number"
								value="3.99"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								{{ t('minimumOrder') }} ($)
							</label>
							<input
								step="0.01"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
								type="number"
								value="15.00"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-2">
								{{ t('averageDeliveryTime') }} ({{ t('minutes') }})
							</label>
							<input
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
								type="number"
								value="30"
							/>
						</div>
					</div>
				</div>

				<!-- Delivery Options -->
				<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
					<h3 class="text-lg font-bold text-gray-900 mb-6">
						{{ t('deliveryOptions') }}
					</h3>
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-medium text-gray-900">
									{{ t('enablePickup') }}
								</h4>
								<p class="text-sm text-white">
									{{ t('allowCustomersPickup') }}
								</p>
							</div>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
						<div class="flex items-center justify-between">
							<div>
								<h4 class="font-medium text-gray-900">
									{{ t('enableDelivery') }}
								</h4>
								<p class="text-sm text-white">
									{{ t('offerDeliveryService') }}
								</p>
							</div>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex justify-end space-x-4 mt-6">
				<button
					class="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ t('cancel') }}
				</button>
				<button
					class="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					{{ t('saveChanges') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
