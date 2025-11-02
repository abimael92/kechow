<template>
	<div
		class="space-y-6 p-4 sm:p-6 bg-white rounded-xl border border-gray-100 shadow-sm"
	>
		<h3 class="text-lg font-semibold text-gray-900">Vehicle Information</h3>

		<!-- Vehicle Details -->
		<section>
			<div class="flex justify-between items-center mb-3">
				<h4 class="font-medium text-gray-800">Details</h4>
				<button
					@click="detailsEditable = !detailsEditable"
					class="text-blue-600 text-sm"
				>
					{{ detailsEditable ? 'Save' : 'Edit' }}
				</button>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm text-white mb-1">Vehicle Type</label>
					<select
						v-model="vehicle.type"
						:disabled="!detailsEditable"
						class="form-input w-full"
					>
						<option>Bicycle</option>
						<option>Motorbike</option>
						<option>Car</option>
						<option>Van</option>
					</select>
				</div>
				<div>
					<label class="block text-sm text-white mb-1">Model</label>
					<input
						v-model="vehicle.model"
						:readonly="!detailsEditable"
						class="form-input w-full"
						placeholder="Model"
					/>
				</div>
				<div>
					<label class="block text-sm text-white mb-1">License Plate</label>
					<input
						v-model="vehicle.plate"
						:readonly="!detailsEditable"
						class="form-input w-full"
						placeholder="ABC-1234"
					/>
				</div>
				<div>
					<label class="block text-sm text-white mb-1">Color</label>
					<input
						v-model="vehicle.color"
						:readonly="!detailsEditable"
						class="form-input w-full"
						placeholder="Blue"
					/>
				</div>
			</div>
		</section>

		<!-- Documents -->
		<section>
			<h4 class="font-medium text-gray-800 mb-3">Documents</h4>
			<div class="space-y-4">
				<div
					v-for="doc in vehicle.documents"
					:key="doc.id"
					class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
				>
					<div>
						<label class="block text-sm text-white">{{ doc.label }}</label>
						<span
							:class="
								doc.verified ? 'text-green-600 text-sm' : 'text-red-500 text-sm'
							"
						>
							{{ doc.verified ? 'Verified' : 'Pending' }}
						</span>
					</div>
					<input
						type="file"
						@change="uploadDoc(doc.id, $event)"
						class="text-sm"
					/>
				</div>
			</div>
		</section>

		<!-- Maintenance -->
		<section>
			<h4 class="font-medium text-gray-800 mb-3">Maintenance</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm text-white mb-1">Last Maintenance</label>
					<input
						type="date"
						v-model="vehicle.lastMaintenance"
						class="form-input w-full"
					/>
				</div>
				<div>
					<label class="block text-sm text-white mb-1">Notes</label>
					<textarea
						v-model="vehicle.notes"
						class="form-input w-full"
						rows="2"
						placeholder="e.g. Needs tire replacement"
					></textarea>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.form-input {
	@apply px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100;
}
</style>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const detailsEditable = ref(false);

const vehicle = reactive({
	type: 'Bicycle',
	model: 'Trek FX',
	plate: 'ABC-1234',
	color: 'Blue',
	documents: [
		{ id: 'reg', label: 'Registration', verified: true },
		{ id: 'ins', label: 'Insurance', verified: false },
		{ id: 'lic', label: 'Driver License', verified: true },
	],
	lastMaintenance: '2025-08-10',
	notes: '',
});

function uploadDoc(id: string, e: Event) {
	console.log('Uploading', id, (e.target as HTMLInputElement).files);
}
</script>
