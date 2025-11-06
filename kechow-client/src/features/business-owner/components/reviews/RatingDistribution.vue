<template>
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
		<h3 class="text-lg font-bold text-gray-900 mb-6">Rating Distribution</h3>
		<div class="space-y-3">
			<div
				v-for="rating in ratingDistribution"
				:key="rating.stars"
				class="flex items-center"
			>
				<span class="text-sm text-white w-8">{{ rating.stars }}</span>
				<i
					class="ri-star-fill text-yellow-400 w-4 h-4 flex items-center justify-center mr-3"
				></i>
				<div class="flex-1 bg-gray-200 rounded-full h-2 mr-4">
					<div
						class="bg-orange-500 h-2 rounded-full transition-all duration-300"
						:style="{ width: rating.percentage + '%' }"
					></div>
				</div>
				<span class="text-sm text-white w-12">{{ rating.count }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const ratingDistribution = computed(() => [
	{ stars: 5, count: 3, percentage: 60 },
	{ stars: 4, count: 1, percentage: 20 },
	{ stars: 3, count: 1, percentage: 20 },
	{ stars: 2, count: 0, percentage: 0 },
	{ stars: 1, count: 0, percentage: 0 },
]);
</script>
