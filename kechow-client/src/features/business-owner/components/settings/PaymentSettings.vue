<template>
	<div class="space-y-6">
		<!-- Payment Methods -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-6">Payment Methods</h3>

			<div class="space-y-4">
				<!-- Credit/Debit Cards -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<i
							class="ri-bank-card-line text-2xl text-blue-600 mr-3 w-6 h-6 flex items-center justify-center"
						></i>
						<div>
							<p class="font-medium text-gray-900">Credit/Debit Cards</p>
							<p class="text-sm text-white">
								Visa, Mastercard, American Express
							</p>
						</div>
					</div>
					<input
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
						type="checkbox"
						checked
					/>
				</div>

				<!-- PayPal -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<i
							class="ri-paypal-line text-2xl text-blue-600 mr-3 w-6 h-6 flex items-center justify-center"
						></i>
						<div>
							<p class="font-medium text-gray-900">PayPal</p>
							<p class="text-sm text-white">Digital payment platform</p>
						</div>
					</div>
					<input
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
						type="checkbox"
						checked
					/>
				</div>

				<!-- Cash on Delivery -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<i
							class="ri-money-dollar-circle-line text-2xl text-green-600 mr-3 w-6 h-6 flex items-center justify-center"
						></i>
						<div>
							<p class="font-medium text-gray-900">Cash on Delivery</p>
							<p class="text-sm text-white">Pay when order arrives</p>
						</div>
					</div>
					<input
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
						type="checkbox"
						checked
					/>
				</div>
			</div>
		</div>

		<!-- Tax Settings -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<h3 class="text-lg font-bold text-gray-900 mb-6">Tax Settings</h3>

			<div class="grid md:grid-cols-2 gap-6">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2"
						>Tax Rate (%)</label
					>
					<input
						step="0.1"
						type="number"
						value="8.5"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
					/>
				</div>

				<div class="flex items-center">
					<input
						class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mr-3"
						type="checkbox"
						checked
					/>
					<span class="text-gray-700">Include tax in displayed prices</span>
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
// Payment settings component
</script>
