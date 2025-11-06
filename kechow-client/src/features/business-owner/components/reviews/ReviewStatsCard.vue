<template>
	<div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
		<div class="flex items-center justify-between">
			<div>
				<p class="text-white text-sm">{{ title }}</p>
				<p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>

				<div v-if="showStars" class="flex mt-2">
					<i
						v-for="star in 5"
						:key="star"
						:class="[
							star <= Math.floor(stars || 0) ? 'ri-star-fill' : 'ri-star-line',
							'text-yellow-400 w-4 h-4 flex items-center justify-center',
						]"
					></i>
				</div>

				<p v-if="change" class="text-sm mt-1" :class="changeTypeClass">
					{{ change }}
				</p>
			</div>
			<div
				:class="[
					'w-12 h-12 rounded-xl flex items-center justify-center',
					bgColor,
				]"
			>
				<i
					:class="[
						icon,
						iconColor,
						'text-xl w-6 h-6 flex items-center justify-center',
					]"
				></i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	title: string;
	value: string;
	change?: string;
	changeType?: 'positive' | 'negative' | 'neutral';
	showStars?: boolean;
	stars?: number;
	icon: string;
	bgColor: string;
	iconColor: string;
}>();

const changeTypeClass = computed(() => {
	switch (props.changeType) {
		case 'positive':
			return 'text-green-600';
		case 'negative':
			return 'text-red-600';
		case 'neutral':
			return 'text-orange-600';
		default:
			return 'text-white';
	}
});
</script>
