<template>
	<div class="space-y-6">
		<!-- Notification Preferences -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-gray-900 mb-6">{{ t('notificationPreferences') }}</h3>

			<div class="space-y-6">
				<!-- Order Notifications -->
				<div>
					<h4 class="text-lg font-bold text-gray-900 mb-4">
						{{ t('orderNotifications') }}
					</h4>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-700">{{ t('newOrders') }}</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">{{ t('orderCancellations') }}</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
					</div>
				</div>

				<!-- Review Notifications -->
				<div>
					<h4 class="text-lg font-bold text-gray-900 mb-4">
						{{ t('reviewNotifications') }}
					</h4>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-700">{{ t('newReviews') }}</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">{{ t('reviewResponses') }}</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex justify-end space-x-4">
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
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
