<template>
	<div class="space-y-6">
		<h3 class="text-lg font-semibold text-gray-900">Schedule</h3>
		<p class="text-gray-600">Manage your availability for deliveries.</p>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Available From</label
				>
				<input
					type="time"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Available To</label
				>
				<input
					type="time"
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
			</div>
		</div>
	</div>
</template>
