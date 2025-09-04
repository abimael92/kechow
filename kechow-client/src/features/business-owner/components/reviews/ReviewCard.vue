<template>
	<div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
		<div class="flex justify-between items-start mb-4">
			<div class="flex items-start space-x-4">
				<div
					class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center"
				>
					<i
						class="ri-user-line text-orange-600 text-lg w-6 h-6 flex items-center justify-center"
					></i>
				</div>
				<div>
					<div class="flex items-center space-x-2 mb-1">
						<h4 class="font-semibold text-gray-900">
							{{ review.customerName }}
						</h4>
						<span
							v-if="review.verified"
							class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
							>Verified</span
						>
					</div>
					<div class="flex items-center space-x-2">
						<div class="flex">
							<i
								v-for="star in 5"
								:key="star"
								:class="[
									star <= review.rating ? 'ri-star-fill' : 'ri-star-line',
									'text-yellow-400 w-4 h-4 flex items-center justify-center',
								]"
							></i>
						</div>
						<span class="text-sm text-gray-500">{{
							formatDate(review.date)
						}}</span>
					</div>
				</div>
			</div>
			<button class="text-gray-400 hover:text-gray-600 cursor-pointer">
				<i class="ri-more-line w-5 h-5 flex items-center justify-center"></i>
			</button>
		</div>

		<p class="text-gray-700 mb-4">{{ review.comment }}</p>

		<div v-if="review.orderItems && review.orderItems.length > 0" class="mb-4">
			<p class="text-sm text-gray-600 mb-2">Order items:</p>
			<div class="flex flex-wrap gap-2">
				<span
					v-for="item in review.orderItems"
					:key="item"
					class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
				>
					{{ item }}
				</span>
			</div>
		</div>

		<div
			v-if="review.response"
			class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4"
		>
			<div class="flex items-center mb-2">
				<i
					class="ri-store-2-line text-orange-600 mr-2 w-4 h-4 flex items-center justify-center"
				></i>
				<span class="font-medium text-orange-800">Restaurant Response</span>
			</div>
			<p class="text-orange-700">{{ review.response }}</p>
		</div>

		<div class="flex justify-between items-center">
			<div class="flex items-center space-x-4">
				<button
					@click="emitHelpful"
					class="flex items-center text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
				>
					<i
						class="ri-thumb-up-line mr-1 w-4 h-4 flex items-center justify-center"
					></i>
					<span class="text-sm">{{ review.helpfulCount }} helpful</span>
				</button>
			</div>
			<div class="flex space-x-3">
				<button
					v-if="!review.response"
					@click="emitReply"
					class="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap"
				>
					<i
						class="ri-reply-line mr-2 w-4 h-4 flex items-center justify-center inline"
					></i
					>Reply
				</button>
				<button
					@click="emitFlag"
					class="text-gray-600 hover:text-gray-800 p-2 cursor-pointer"
				>
					<i class="ri-flag-line w-4 h-4 flex items-center justify-center"></i>
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Review } from '../../types';

const props = defineProps<{
	review: Review;
}>();

const emit = defineEmits<{
	(event: 'reply', reviewId: string): void;
	(event: 'flag', reviewId: string): void;
	(event: 'helpful', reviewId: string): void;
}>();

const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const emitReply = () => {
	emit('reply', props.review.id);
};

const emitFlag = () => {
	emit('flag', props.review.id);
};

const emitHelpful = () => {
	emit('helpful', props.review.id);
};
</script>
