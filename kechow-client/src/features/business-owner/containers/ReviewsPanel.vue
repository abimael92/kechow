<template>
	<div class="space-y-6">
		<!-- Header Section -->
		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex items-center gap-4">
				<div class="w-16 h-16 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 flex items-center justify-center shadow-md shadow-primary-500/30">
					<i class="ri-star-line text-white text-xl"></i>
				</div>
				<div>
					<h1 class="text-bubble text-6xl shadow-primary-500">
						{{ $t('customerReviews') }}
					</h1>
					<p class="text-neutral-950 dark:text-neutral-200 font-normal text-xl select-none">
						{{ $t('manageRespondFeedback') }}
						<span v-if="reviews.length > 0" class="ml-2 text-tertiary-800 font-medium">
							({{ reviews.length }} {{ $t('reviews', reviews.length) }})
						</span>
					</p>
				</div>
			</div>
			
			<div class="flex flex-wrap gap-3">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-[200px]">
					<i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"></i>
					<input
						v-model="searchQuery"
						:placeholder="$t('searchReviews')"
						class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
						@input="handleSearch"
					/>
					<button
						v-if="searchQuery"
						@click="clearSearch"
						class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<i class="ri-close-line"></i>
					</button>
				</div>
				
				<!-- Filter Button with Dropdown -->
				<div class="relative">
					<button
						@click="toggleFilterDropdown"
						class="bg-tertiary-800 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
					>
						<i class="ri-filter-line text-lg"></i>
						{{ $t('filter') }}
						<i class="ri-arrow-down-s-line text-sm transition-transform duration-200" :class="{ 'rotate-180': showFilterDropdown }"></i>
					</button>
					
					<!-- Filter Dropdown -->
					<transition name="fade">
						<div 
							v-if="showFilterDropdown" 
							class="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden"
						>
							<div class="p-4 space-y-4">
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('filterByRating') }}</h3>
									<div class="space-y-2">
										<label v-for="rating in ratingOptions" :key="rating.value" class="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												:value="rating.value"
												v-model="selectedRatings"
												@change="applyFilters"
												class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
											/>
											<div class="flex items-center gap-1">
												<span v-for="star in rating.value" :key="star" class="text-amber-500">
													<i class="ri-star-fill text-sm"></i>
												</span>
											</div>
											<span class="text-gray-700 dark:text-gray-300 ml-2">({{ getRatingCount(rating.value) }})</span>
										</label>
									</div>
								</div>
								
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('filterByStatus') }}</h3>
									<div class="space-y-2">
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												v-model="showOnlyUnread"
												@change="applyFilters"
												class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
											/>
											<span class="text-gray-700 dark:text-gray-300">{{ $t('unreadOnly') }}</span>
										</label>
										<label class="flex items-center gap-2 cursor-pointer">
											<input
												type="checkbox"
												v-model="showOnlyUnresponded"
												@change="applyFilters"
												class="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400"
											/>
											<span class="text-gray-700 dark:text-gray-300">{{ $t('unrespondedOnly') }}</span>
										</label>
									</div>
								</div>
								
								<div>
									<h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ $t('sortBy') }}</h3>
									<select
										v-model="sortBy"
										@change="applyFilters"
										class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
									>
										<option value="newest">{{ $t('newestFirst') }}</option>
										<option value="oldest">{{ $t('oldestFirst') }}</option>
										<option value="highest">{{ $t('highestRating') }}</option>
										<option value="lowest">{{ $t('lowestRating') }}</option>
										<option value="helpful">{{ $t('mostHelpful') }}</option>
									</select>
								</div>
								
								<button
									@click="resetFilters"
									class="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
								>
									{{ $t('resetFilters') }}
								</button>
							</div>
						</div>
					</transition>
				</div>
				
				<!-- Export Button -->
				<button
					@click="exportReviews"
					class="bg-tertiary-800 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
				>
					<i class="ri-download-line"></i>
					{{ $t('export') }}
				</button>
				
				<!-- Refresh Button with Loading State -->
				<button
					@click="loadReviews"
					:disabled="loading"
					class="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<i 
						class="ri-refresh-line text-lg transition-transform duration-500" 
						:class="{ 'animate-spin': loading }"
					></i>
					{{ loading ? $t('refreshing') : $t('refresh') }}
				</button>
			</div>
		</div>

		<!-- Stats Overview -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
			<ReviewStatsCard
				:title="$t('averageRating')"
				:value="averageRating.toFixed(1)"
				:showStars="true"
				:stars="averageRating"
				:change="ratingChange"
				:changeType="ratingChangeType"
				icon="ri-star-line"
				bgColor="bg-amber-100 dark:bg-amber-900/30"
				iconColor="text-amber-600 dark:text-amber-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				:title="$t('totalReviews')"
				:value="reviews.length.toString()"
				:change="reviewsChange"
				:changeType="reviewsChangeType"
				icon="ri-message-line"
				bgColor="bg-blue-100 dark:bg-blue-900/30"
				iconColor="text-blue-600 dark:text-blue-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				:title="$t('responseRate')"
				:value="responseRate"
				:change="responseRateChange"
				:changeType="responseRateChangeType"
				icon="ri-chat-check-line"
				bgColor="bg-emerald-100 dark:bg-emerald-900/30"
				iconColor="text-emerald-600 dark:text-emerald-400"
				:loading="loading"
			/>

			<ReviewStatsCard
				:title="$t('positiveReviews')"
				:value="positiveReviewsCount.toString()"
				:change="positiveReviewsChange"
				:changeType="positiveReviewsChangeType"
				icon="ri-thumb-up-line"
				bgColor="bg-green-100 dark:bg-green-900/30"
				iconColor="text-green-600 dark:text-green-400"
				:loading="loading"
			/>
		</div>

		<!-- Rating Distribution -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
			<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
				<h2 class="text-xl font-bold text-gray-900 dark:text-white">
					{{ $t('ratingDistribution') }}
				</h2>
				<div class="flex items-center gap-2">
					<span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('total') }}: {{ reviews.length }} {{ $t('reviews', reviews.length) }}</span>
					<span class="text-sm px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
						{{ $t('avg') }}: {{ averageRating.toFixed(1) }}
					</span>
				</div>
			</div>
			<RatingDistribution 
				:ratings="ratingDistribution"
				:loading="loading"
				@rating-click="filterByRating"
			/>
		</div>

		<!-- Filter Tabs -->
		<div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
			<div class="flex flex-wrap gap-2 overflow-x-auto pb-2">
				<button
					v-for="filter in filterTabs"
					:key="filter.id"
					@click="setActiveFilter(filter.id)"
					:class="[
						'px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer whitespace-nowrap flex items-center gap-2',
						activeFilter === filter.id 
							? 'shadow-md transform scale-105'
							: 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
					]"
					:style="activeFilter === filter.id ? filterStyle(filter.color) : {}"
				>
					<i :class="filter.icon"></i>
					{{ filter.label }}
					<span 
						class="ml-2 px-2 py-1 rounded-full text-xs font-semibold"
						:class="activeFilter === filter.id ? 'bg-white/20' : 'bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-300'"
					>
						{{ filter.count }}
					</span>
				</button>
			</div>
			
			<!-- Bulk Actions -->
			<div v-if="selectedReviews.length > 0" class="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-2">
						<i class="ri-checkbox-multiple-fill text-primary-600 dark:text-primary-400"></i>
						<span class="text-sm font-medium text-gray-900 dark:text-white">
							{{ selectedReviews.length }} {{ $t('reviews', selectedReviews.length) }} {{ $t('selected') }}
						</span>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							@click="markSelectedAsRead"
							class="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
						>
							<i class="ri-check-line"></i>
							{{ $t('markAsRead') }}
						</button>
						<button
							@click="deleteSelectedReviews"
							class="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
						>
							<i class="ri-delete-bin-line"></i>
							{{ $t('delete') }}
						</button>
					</div>
				</div>
			</div>
		</div>

		<!-- Reviews List -->
		<div v-if="loading" class="space-y-6">
			<div v-for="n in 3" :key="n" class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
				<div class="flex items-start gap-4">
					<div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
					<div class="flex-1 space-y-3">
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
						<div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
						<div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
					</div>
				</div>
			</div>
		</div>
		
		<div v-else-if="filteredReviews.length === 0" class="text-center py-12">
			<div class="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
				<i class="ri-message-line text-6xl"></i>
			</div>
			<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
				{{ searchQuery ? $t('noReviewsFound') : $t('noReviews') }}
			</h3>
			<p class="text-gray-500 dark:text-gray-400 mb-6">
				{{ searchQuery ? $t('tryDifferentSearchReview') : $t('noReviewsDescription') }}
			</p>
		</div>

		<div v-else class="space-y-6">
			<ReviewCard
				v-for="review in paginatedReviews"
				:key="review.id"
				:review="review"
				:selected="selectedReviews.includes(review.id)"
				@select="toggleReviewSelection"
				@reply="handleReply"
				@flag="handleFlag"
				@helpful="handleHelpful"
				@read="markAsRead"
			/>
			
			<!-- Pagination -->
			<div v-if="filteredReviews.length > itemsPerPage" class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
				<p class="text-sm text-gray-600 dark:text-gray-400">
					{{ $t('showing') }} {{ (currentPage - 1) * itemsPerPage + 1 }}–{{ Math.min(currentPage * itemsPerPage, filteredReviews.length) }} {{ $t('of') }} {{ filteredReviews.length }} {{ $t('reviews', filteredReviews.length) }}
				</p>
				<div class="flex gap-2">
					<button
						@click="prevPage"
						:disabled="currentPage === 1"
						class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
					>
						<i class="ri-arrow-left-s-line"></i>
						{{ $t('previous') }}
					</button>
					<button
						@click="nextPage"
						:disabled="currentPage * itemsPerPage >= filteredReviews.length"
						class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
					>
						{{ $t('next') }}
						<i class="ri-arrow-right-s-line"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
	
	<!-- Click Outside Listener -->
	<div v-if="showFilterDropdown" class="fixed inset-0 z-40" @click="closeFilterDropdown"></div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ReviewStatsCard from '../components/reviews/ReviewStatsCard.vue';
import RatingDistribution from '../components/reviews/RatingDistribution.vue';
import ReviewCard from '../components/reviews/ReviewCard.vue';
import { fetchReviews, addReviewResponse, markReviewHelpful, flagReview } from '../services/businessOwner.service';
import type { Review } from '../types/';

const { t } = useI18n();

const reviews = ref<Review[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const showFilterDropdown = ref(false);
const activeFilter = ref('all');
const selectedRatings = ref<number[]>([]);
const showOnlyUnread = ref(false);
const showOnlyUnresponded = ref(false);
const sortBy = ref('newest');
const selectedReviews = ref<string[]>([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const ratingOptions = [
  { value: 5, label: '5 Stars' },
  { value: 4, label: '4 Stars' },
  { value: 3, label: '3 Stars' },
  { value: 2, label: '2 Stars' },
  { value: 1, label: '1 Star' }
];

// Computed properties
const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0;
  const sum = reviews.value.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.value.length;
});

const positiveReviewsCount = computed(() => {
  return reviews.value.filter(review => review.rating >= 4).length;
});

const responseRate = computed(() => {
  if (reviews.value.length === 0) return '0%';
  const responded = reviews.value.filter(review => review.response).length;
  return `${Math.round((responded / reviews.value.length) * 100)}%`;
});

const ratingDistribution = computed(() => {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.value.forEach(review => {
    distribution[review.rating as keyof typeof distribution]++;
  });
  return distribution;
});

// Mock changes (in real app, compare with previous period)
const ratingChange = computed(() => `+0.2 ${t('fromLastMonth')}`);
const ratingChangeType = computed(() => 'positive' as const);
const reviewsChange = computed(() => `+12 ${t('fromLastMonth')}`);
const reviewsChangeType = computed(() => 'positive' as const);
const responseRateChange = computed(() => `+5% ${t('fromLastMonth')}`);
const responseRateChangeType = computed(() => 'positive' as const);
const positiveReviewsChange = computed(() => `+80% ${t('ofTotal')}`);
const positiveReviewsChangeType = computed(() => 'positive' as const);

const filterTabs = computed(() => [
  { id: 'all', label: t('allReviews'), count: reviews.value.length, icon: 'ri-list-check', color: '#8b34e0' },
  { id: '5', label: t('stars', { n: 5 }), count: ratingDistribution.value[5], icon: 'ri-star-fill', color: '#10b981' },
  { id: '4', label: t('stars', { n: 4 }), count: ratingDistribution.value[4], icon: 'ri-star-fill', color: '#3b82f6' },
  { id: '3', label: t('stars', { n: 3 }), count: ratingDistribution.value[3], icon: 'ri-star-half-fill', color: '#f59e0b' },
  { id: '2', label: t('stars', { n: 2 }), count: ratingDistribution.value[2], icon: 'ri-star-line', color: '#ef4444' },
  { id: '1', label: t('stars', { n: 1 }), count: ratingDistribution.value[1], icon: 'ri-star-line', color: '#dc2626' }
]);

const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  // Apply rating filter
  if (selectedRatings.value.length > 0) {
    filtered = filtered.filter(review => selectedRatings.value.includes(review.rating));
  }

  // Apply active filter tab
  if (activeFilter.value !== 'all') {
    const rating = parseInt(activeFilter.value);
    filtered = filtered.filter(review => review.rating === rating);
  }

  // Apply status filters
  if (showOnlyUnread.value) {
    // Assuming there's a read property on reviews
    filtered = filtered.filter(review => !(review as any).read);
  }

  if (showOnlyUnresponded.value) {
    filtered = filtered.filter(review => !review.response);
  }

  // Apply search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(review => 
      review.customerName.toLowerCase().includes(query) ||
      review.comment.toLowerCase().includes(query) ||
      (review.response && review.response.toLowerCase().includes(query))
    );
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'oldest':
      filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case 'highest':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'lowest':
      filtered.sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      filtered.sort((a, b) => b.helpfulCount - a.helpfulCount);
      break;
  }

  return filtered;
});

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredReviews.value.slice(start, end);
});

// Functions
const getRatingCount = (rating: number) => {
  return reviews.value.filter(review => review.rating === rating).length;
};

const filterStyle = (color: string) => ({
  background: `linear-gradient(135deg, ${color}, ${color}80)`,
  color: 'white'
});

const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId;
  currentPage.value = 1;
};

const filterByRating = (rating: number) => {
  if (selectedRatings.value.includes(rating)) {
    selectedRatings.value = selectedRatings.value.filter(r => r !== rating);
  } else {
    selectedRatings.value.push(rating);
  }
  currentPage.value = 1;
};

const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

const closeFilterDropdown = () => {
  showFilterDropdown.value = false;
};

const applyFilters = () => {
  currentPage.value = 1;
  closeFilterDropdown();
};

const resetFilters = () => {
  selectedRatings.value = [];
  showOnlyUnread.value = false;
  showOnlyUnresponded.value = false;
  sortBy.value = 'newest';
  activeFilter.value = 'all';
  currentPage.value = 1;
  closeFilterDropdown();
};

const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
};

const toggleReviewSelection = (reviewId: string) => {
  const index = selectedReviews.value.indexOf(reviewId);
  if (index > -1) {
    selectedReviews.value.splice(index, 1);
  } else {
    selectedReviews.value.push(reviewId);
  }
};

const markSelectedAsRead = async () => {
  // Implementation for marking reviews as read
  console.log('Marking reviews as read:', selectedReviews.value);
  selectedReviews.value = [];
};

const deleteSelectedReviews = async () => {
  if (confirm(t('confirmDeleteReviews', { count: selectedReviews.value.length }))) {
    // Implementation for deleting reviews
    console.log('Deleting reviews:', selectedReviews.value);
    selectedReviews.value = [];
    await loadReviews();
  }
};

const markAsRead = async (reviewId: string) => {
  // Implementation for marking single review as read
  console.log('Marking review as read:', reviewId);
};

const nextPage = () => {
  if (currentPage.value * itemsPerPage < filteredReviews.value.length) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const exportReviews = () => {
  console.log('Exporting reviews...');
  // Implement export logic
};

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

const handleReply = async (reviewId: string) => {
  // The ReviewCard component should emit both reviewId and response
  // This is a placeholder - implement based on your ReviewCard component's emit structure
  console.log('Reply handler called for review:', reviewId);
  await loadReviews();
};

const handleFlag = async (reviewId: string) => {
  try {
    const reason = 'inappropriate'; // Default reason or prompt user
    await flagReview(reviewId, reason);
    await loadReviews();
  } catch (error) {
    console.error('Failed to flag review:', error);
  }
};

const handleHelpful = async (reviewId: string) => {
  try {
    await markReviewHelpful(reviewId);
    await loadReviews();
  } catch (error) {
    console.error('Failed to mark as helpful:', error);
  }
};

onMounted(() => {
  loadReviews();
});
</script>
