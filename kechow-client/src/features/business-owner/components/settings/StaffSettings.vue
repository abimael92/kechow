<template>
	<div class="space-y-6">
		<!-- Staff Management -->
		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
			<div class="flex justify-between items-center mb-6">
				<h3 class="text-lg font-bold text-gray-900">Staff Management</h3>
				<button
					class="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-add-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i>
					Add Staff
				</button>
			</div>

			<div class="space-y-4">
				<!-- Staff Member 1 -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<div
							class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3"
						>
							<i
								class="ri-user-line text-orange-600 w-5 h-5 flex items-center justify-center"
							></i>
						</div>
						<div>
							<p class="font-medium text-gray-900">Mario Rossi</p>
							<p class="text-sm text-white">Owner • mario@marioskitchen.com</p>
						</div>
					</div>
					<span
						class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
						>Active</span
					>
				</div>

				<!-- Staff Member 2 -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<div
							class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
						>
							<i
								class="ri-user-line text-blue-600 w-5 h-5 flex items-center justify-center"
							></i>
						</div>
						<div>
							<p class="font-medium text-gray-900">Anna Smith</p>
							<p class="text-sm text-white">Manager • anna@marioskitchen.com</p>
						</div>
					</div>
					<span
						class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
						>Active</span
					>
				</div>

				<!-- Staff Member 3 -->
				<div
					class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
				>
					<div class="flex items-center">
						<div
							class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3"
						>
							<i
								class="ri-user-line text-purple-600 w-5 h-5 flex items-center justify-center"
							></i>
						</div>
						<div>
							<p class="font-medium text-gray-900">John Chef</p>
							<p class="text-sm text-white">
								Kitchen Staff • john@marioskitchen.com
							</p>
						</div>
					</div>
					<span
						class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"
						>Pending</span
					>
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
// Staff settings component
</script>
