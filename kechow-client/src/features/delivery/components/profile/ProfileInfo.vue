<template>
	<div class="space-y-6">
		<h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Full Name</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="text"
					value="Alex Rodriguez"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Email Address</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="email"
					value="alex.rodriguez@email.com"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Phone Number</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="tel"
					value="+1 (555) 123-4567"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium text-gray-700 mb-2"
					>Date of Birth</label
				>
				<input
					class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					type="date"
				/>
			</div>
		</div>
		<div>
			<label class="block text-sm font-medium text-gray-700 mb-2"
				>Address</label
			>
			<textarea
				rows="3"
				class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
			>
123 Main St, Cityville, ST 12345</textarea
			>
		</div>
		<div class="flex justify-end">
			<button
				class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
			>
				Save Changes
			</button>
		</div>
	</div>
</template>
