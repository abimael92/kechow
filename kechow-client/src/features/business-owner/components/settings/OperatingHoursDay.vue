<template>
	<div class="flex items-center justify-between">
		<span class="text-gray-700 w-24">{{ day.day }}</span>
		<div class="flex items-center space-x-4">
			<input
				v-model="localDay.openTime"
				:disabled="localDay.closed"
				class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
				type="time"
				@change="emitUpdate"
			/>
			<span class="text-gray-500">to</span>
			<input
				v-model="localDay.closeTime"
				:disabled="localDay.closed"
				class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
				type="time"
				@change="emitUpdate"
			/>
			<label class="flex items-center">
				<input
					v-model="localDay.closed"
					class="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
					type="checkbox"
					@change="emitUpdate"
				/>
				<span class="ml-2 text-sm text-gray-600">Closed</span>
			</label>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { OperatingHours } from '../../types';

const props = defineProps<{
	day: OperatingHours;
}>();

const emit = defineEmits<{
	(event: 'update-hours', day: OperatingHours): void;
}>();

const localDay = ref({ ...props.day });

watch(
	() => props.day,
	(newDay) => {
		localDay.value = { ...newDay };
	}
);

const emitUpdate = () => {
	emit('update-hours', { ...localDay.value });
};
</script>
