<template>
	<div class="space-y-6 p-4 sm:p-6">
		<h4 class="font-semibold items-center text-gray-800">
			{{ t('weeklyPreferences') }}
		</h4>
		<p class="text-gray-500">{{ t('weeklyPreferencesDescription') }}</p>

		<div class="bg-white rounded-xl space-y-4">
			<div
				v-for="day in days"
				:key="day.id"
				class="grid grid-cols-12 items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
			>
				<span class="col-span-2 font-medium">{{ t(day.label) }}</span>
				<label class="col-span-2 flex items-center gap-2 cursor-pointer">
					<input type="checkbox" v-model="day.available" class="rounded" />
					<span class="text-sm text-gray-700">{{ t('available') }}</span>
				</label>

				<template v-if="day.available">
					<input
						type="time"
						v-model="day.from"
						class="col-span-3 px-3 py-2 border rounded-lg focus:ring-blue-500"
					/>
					<input
						type="time"
						v-model="day.to"
						class="col-span-3 px-3 py-2 border rounded-lg focus:ring-blue-500"
					/>
					<button
						@click="day.editable = !day.editable"
						class="col-span-2 text-sm font-medium whitespace-nowrap"
					>
						{{ day.editable ? t('save') : t('edit') }}
					</button>
				</template>

				<template v-else>
					<button
						@click="markDayOff(day)"
						class="col-span-8 text-red-400 hover:text-red-800 text-md font-large whitespace-nowrap"
					>
						{{ t('dayOff') }}
					</button>
				</template>
			</div>
		</div>

		<div class="bg-white rounded-xl border p-4 shadow-sm space-y-4">
			<h4 class="font-semibold text-gray-800">{{ t('specialOverrides') }}</h4>
			<div
				v-for="(override, index) in specialOverrides"
				:key="index"
				class="flex flex-col sm:flex-row sm:items-center gap-2 p-2 hover:bg-gray-50"
			>
				<input
					type="date"
					v-model="override.date"
					class="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500"
				/>
				<input
					type="time"
					v-model="override.from"
					class="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500"
				/>
				<input
					type="time"
					v-model="override.to"
					class="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500"
				/>
				<input
					type="text"
					v-model="override.note"
					:placeholder="t('holidayEvent')"
					class="flex-1 px-3 py-2 border rounded-lg focus:ring-blue-500"
				/>
				<button
					@click="removeOverride(index)"
					class="text-red-400 hover:text-red-800 text-md font-large whitespace-nowrap"
				>
					{{ t('remove') }}
				</button>
			</div>
			<button @click="addOverride" class="text-sm font-medium">
				+ {{ t('addSpecialDay') }}
			</button>
		</div>

		<div class="bg-white rounded-xl border p-4 shadow-sm">
			<h4 class="font-semibold text-gray-800">{{ t('yearlyView') }}</h4>
			<p class="text-gray-500 text-sm">{{ t('yearlyViewDescription') }}</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { reactive } from 'vue';
const { t } = useI18n();

const days = reactive([
	{
		id: 1,
		label: 'monday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 2,
		label: 'tuesday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 3,
		label: 'wednesday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 4,
		label: 'thursday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{
		id: 5,
		label: 'friday',
		from: '09:00',
		to: '17:00',
		available: true,
		editable: false,
	},
	{ id: 6, label: 'saturday', available: false, editable: false },
	{ id: 7, label: 'sunday', available: false, editable: false },
]);

const specialOverrides = reactive([{ date: '', from: '', to: '', note: '' }]);
function addOverride() {
	specialOverrides.push({ date: '', from: '', to: '', note: '' });
}
function removeOverride(i: number) {
	specialOverrides.splice(i, 1);
}
function markDayOff(day: any) {
	day.available = false;
	day.from = '';
	day.to = '';
}
</script>
