<template>
	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Customer Reviews</h1>
				<p class="text-gray-600 mt-1">
					Manage and respond to customer feedback
				</p>
			</div>
			<div class="flex space-x-3">
				<button
					class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-download-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i
					>Export
				</button>
				<button
					class="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-refresh-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i
					>Refresh
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<ReviewStatsCard
				title="Average Rating"
				value="4.4"
				:showStars="true"
				:stars="4.4"
				icon="ri-star-line"
				bgColor="bg-yellow-100"
				iconColor="text-yellow-600"
			/>

			<ReviewStatsCard
				title="Total Reviews"
				value="5"
				change="+12 this month"
				changeType="positive"
				icon="ri-message-line"
				bgColor="bg-blue-100"
				iconColor="text-blue-600"
			/>

			<ReviewStatsCard
				title="Response Rate"
				value="85%"
				change="+5% this month"
				changeType="neutral"
				icon="ri-chat-check-line"
				bgColor="bg-green-100"
				iconColor="text-green-600"
			/>

			<ReviewStatsCard
				title="Positive Reviews"
				value="4"
				change="80% of total"
				changeType="positive"
				icon="ri-thumb-up-line"
				bgColor="bg-green-100"
				iconColor="text-green-600"
			/>
		</div>

		<RatingDistribution />

		<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
			<div class="flex space-x-2 overflow-x-auto">
				<button
					v-for="filter in reviewFilters"
					:key="filter.id"
					@click="activeFilter = filter.id"
					:class="[
						'px-4 py-2 rounded-lg font-medium text-sm transition-colors cursor-pointer whitespace-nowrap',
						activeFilter === filter.id
							? 'bg-orange-100 text-orange-600'
							: 'text-gray-600 hover:bg-gray-50',
					]"
				>
					{{ filter.label
					}}<span
						class="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
						>{{ filter.count }}</span
					>
				</button>
			</div>
		</div>

		<div class="space-y-6">
			<ReviewCard
				v-for="review in filteredReviews"
				:key="review.id"
				:review="review"
				@reply="handleReply"
				@flag="handleFlag"
				@helpful="handleHelpful"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ReviewStatsCard from '../components/reviews/ReviewStatsCard.vue';
import RatingDistribution from '../components/reviews/RatingDistribution.vue';
import ReviewCard from '../components/reviews/ReviewCard.vue';
import { fetchReviews } from '../services/businessOwner.service';
import type { Review } from '../types/';

const reviews = ref<Review[]>([]);
const activeFilter = ref('all');
const loading = ref(false);

const reviewFilters = [
	{ id: 'all', label: 'All Reviews', count: 5 },
	{ id: '5', label: '5 Stars', count: 3 },
	{ id: '4', label: '4 Stars', count: 1 },
	{ id: '3', label: '3 Stars', count: 1 },
	{ id: '2', label: '2 Stars', count: 0 },
	{ id: '1', label: '1 Star', count: 0 },
];

const filteredReviews = computed(() => {
	if (activeFilter.value === 'all') {
		return reviews.value;
	}
	return reviews.value.filter(
		(review) => review.rating === parseInt(activeFilter.value)
	);
});

const loadReviews = async () => {
	try {
		loading.value = true;
		reviews.value = await fetchReviews();
	} catch (error) {
		console.error('Failed to load reviews:', error);
	} finally {
		loading.value = false;
	}
};

const handleReply = (reviewId: string) => {
	console.log('Reply to review:', reviewId);
	// Implement reply functionality
};

const handleFlag = (reviewId: string) => {
	console.log('Flag review:', reviewId);
	// Implement flag functionality
};

const handleHelpful = (reviewId: string) => {
	console.log('Mark review as helpful:', reviewId);
	// Implement helpful functionality
};

onMounted(() => {
	loadReviews();
});
</script>
