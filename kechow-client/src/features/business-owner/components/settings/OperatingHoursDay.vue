<template>
	<div class="space-y-6 p-4 sm:p-6">
		<h3 class="text-xl font-bold text-gray-900">Schedule & Availability</h3>
		<p class="text-gray-600">
			Set your weekly preferences and add special day overrides or days off.
		</p>

		<!-- Weekly Schedule -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-4"
		>
			<h4 class="font-semibold text-gray-800">Weekly Preferences</h4>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div
					v-for="day in days"
					:key="day.id"
					class="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
				>
					<span class="w-full sm:w-24 font-medium">{{ day.label }}</span>

					<!-- Availability toggle -->
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" v-model="day.available" class="rounded" />
						<span class="text-sm text-gray-700">Available</span>
					</label>

					<!-- Time inputs only if available -->
					<div
						v-if="day.available"
						class="flex flex-col sm:flex-row sm:items-center flex-1 gap-2 w-full"
					>
						<input
							type="time"
							v-model="day.from"
							:readonly="!day.editable"
							class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						/>
						<input
							type="time"
							v-model="day.to"
							:readonly="!day.editable"
							class="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
						/>
						<button
							@click="day.editable = !day.editable"
							class="sm:ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium whitespace-nowrap"
						>
							{{ day.editable ? 'Save' : 'Edit' }}
						</button>
					</div>

					<!-- Quick day off -->
					<button
						v-else
						@click="markDayOff(day)"
						class="text-red-600 hover:text-red-800 text-sm font-medium whitespace-nowrap"
					>
						Day Off
					</button>
				</div>
			</div>
		</div>

		<!-- Special Overrides -->
		<div
			class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-4"
		>
			<h4 class="font-semibold text-gray-800">Special / Holiday Overrides</h4>
			<div class="space-y-2">
				<div
					v-for="(override, index) in specialOverrides"
					:key="index"
					class="flex flex-col sm:flex-row sm:items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
				>
					<input
						type="date"
						v-model="override.date"
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="time"
						v-model="override.from"
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="time"
						v-model="override.to"
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
					<input
						type="text"
						v-model="override.note"
						placeholder="Holiday / Event"
						class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
					/>
					<button
						@click="removeOverride(index)"
						class="text-red-600 hover:text-red-800 text-sm font-medium"
					>
						Remove
					</button>
				</div>
				<button
					@click="addOverride"
					class="text-blue-600 hover:text-blue-800 text-sm font-medium"
				>
					+ Add Special Day
				</button>
			</div>
		</div>

		<!-- Yearly / Heatmap View -->
		<div class="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
			<h4 class="font-semibold text-gray-800">Yearly View</h4>
			<p class="text-gray-500 text-sm">
				Here you’ll see a calendar heatmap of hours worked, busy days, and days
				off (placeholder).
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const days = reactive([
	{
		id: 1,
		label: 'Monday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 2,
		label: 'Tuesday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 3,
		label: 'Wednesday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 4,
		label: 'Thursday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 5,
		label: 'Friday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 6,
		label: 'Saturday',
		from: '',
		to: '',
		available: false,
		editable: false,
	},
	{
		id: 7,
		label: 'Sunday',
		from: '',
		to: '',
		available: false,
		editable: false,
	},
]);

const specialOverrides = reactive([{ date: '', from: '', to: '', note: '' }]);

function addOverride() {
	specialOverrides.push({ date: '', from: '', to: '', note: '' });
}

function removeOverride(index: number) {
	specialOverrides.splice(index, 1);
}

function markDayOff(day: any) {
	day.available = false;
	day.from = '';
	day.to = '';
}
</script>
