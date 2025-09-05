<template>
	<div class="p-6">
		<div class="space-y-6">
			<!-- Main Content -->
			<div class="lg:w-3/4">
				<div class="space-y-6">
					<!-- Restaurant Info -->
					<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<h3 class="text-lg font-bold text-gray-900 mb-6">
							Restaurant Information
						</h3>
						<div class="grid md:grid-cols-2 gap-6">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Restaurant Name
								</label>
								<input
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
									type="text"
									value="Mario's Kitchen"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Phone Number
								</label>
								<input
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
									type="tel"
									value="+1 (555) 123-4567"
								/>
							</div>
							<div class="md:col-span-2">
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Address
								</label>
								<input
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
									type="text"
									value="123 Restaurant Street, Food City, FC 12345"
								/>
							</div>
							<div class="md:col-span-2">
								<label class="block text-sm font-medium text-gray-700 mb-2">
									Description
								</label>
								<textarea
									rows="4"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
								>
Authentic Italian cuisine with fresh ingredients and traditional recipes. Family-owned restaurant serving delicious pizza, pasta, and more since 1985.
</textarea
								>
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
									class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer bg-orange-600"
								>
									<span
										class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"
									></span>
								</button>
								<span class="ml-3 text-sm font-medium text-green-600"
									>Open</span
								>
							</div>
						</div>

						<div class="space-y-4">
							<div
								v-for="day in [
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday',
									'Sunday',
								]"
								:key="day"
								class="flex items-center justify-between"
							>
								<span class="text-gray-700 w-24">{{ day }}</span>
								<div class="flex items-center space-x-4">
									<input
										class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
										type="time"
										value="10:00"
									/>
									<span class="text-gray-500">to</span>
									<input
										class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
										type="time"
										value="22:00"
									/>
									<label class="flex items-center">
										<input
											class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
											type="checkbox"
										/>
										<span class="ml-2 text-sm text-gray-600">Closed</span>
									</label>
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
// Settings component (static for now)
</script>
