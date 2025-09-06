<template>
	<div class="space-y-6">
		<h3 class="text-lg font-semibold text-gray-900">Vehicle Information</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Vehicle Type</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="text"
					value="Bicycle"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>License Plate</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="text"
					value="ABC-1234"
				/>
			</div>
		</div>
	</div>
</template>
