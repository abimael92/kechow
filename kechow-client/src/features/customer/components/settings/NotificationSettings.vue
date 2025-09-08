<template>
	<div class="space-y-6">
		<!-- Notification Preferences -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-gray-900 mb-6">Notification Preferences</h3>

			<div class="space-y-6">
				<!-- Order Notifications -->
				<div>
					<h4 class="text-lg font-bold text-gray-900 mb-4">
						Order Notifications
					</h4>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-700">New orders</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">Order cancellations</span>
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
						Review Notifications
					</h4>
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-gray-700">New reviews</span>
							<input
								class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
								type="checkbox"
								checked
							/>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-gray-700">Review responses</span>
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
				Cancel
			</button>
			<button
				class="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
			>
				Save Changes
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
// Notification settings component
</script>
