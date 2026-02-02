<template>
	<div 
		class="rating-distribution-card"
		:class="[cardSize, cardVariant]"
	>
		<!-- Header -->
		<div class="card-header">
			<div class="title-section">
				<h3 class="card-title">
					<i class="ri-bar-chart-2-fill title-icon"></i>
					{{ t('ratingDistribution') }}
				</h3>
				<p v-if="showSubtitle" class="card-subtitle">
					{{ t('basedOnReviews', { count: totalReviews }) }}
				</p>
			</div>
			
			<!-- View toggle -->
			<div v-if="showViewToggle" class="view-toggle">
				<button
					@click="toggleViewMode"
					class="toggle-button"
					:class="{ 'active': showChart }"
					:aria-label="t('switchToChartView')"
				>
					<i class="ri-bar-chart-2-line"></i>
				</button>
				<button
					@click="toggleViewMode"
					class="toggle-button"
					:class="{ 'active': !showChart }"
					:aria-label="t('switchToListView')"
				>
					<i class="ri-list-check"></i>
				</button>
			</div>
		</div>

		<!-- Chart View -->
		<div v-if="showChart" class="chart-view">
			<!-- Rating bars -->
			<div class="rating-bars">
				<div
					v-for="(rating, index) in sortedDistribution"
					:key="rating.stars"
					class="rating-bar-wrapper"
					:class="{ 'highest': rating.percentage === highestPercentage }"
					@mouseenter="hoveredRating = rating.stars"
					@mouseleave="hoveredRating = null"
				>
					<div class="rating-label">
						<span class="stars-text">
							{{ rating.stars }}
							<i class="ri-star-fill"></i>
						</span>
						<span v-if="showPercentage" class="percentage-text">
							{{ rating.percentage.toFixed(0) }}%
						</span>
					</div>
					
					<div class="progress-container">
						<div
							class="progress-bar"
							:class="getRatingClass(rating.stars)"
							:style="{ 
								width: rating.percentage + '%',
								'--animation-delay': index * 0.1 + 's'
							}"
							:aria-label="t('ratingBarLabel', { 
								stars: rating.stars, 
								percentage: rating.percentage, 
								count: rating.count 
							})"
						>
							<!-- Hover tooltip -->
							<div v-if="hoveredRating === rating.stars" class="bar-tooltip">
								{{ rating.count }} {{ t('reviews') }}
							</div>
						</div>
						<span v-if="showCountOnBar" class="count-on-bar">
							{{ rating.count }}
						</span>
					</div>
					
					<div class="rating-stats">
						<span v-if="showCount" class="count-text">
							{{ rating.count }}
						</span>
						<button
							v-if="showViewReviews"
							@click="viewReviewsByRating(rating.stars)"
							class="view-reviews-button"
							:aria-label="t('viewReviewsWithStars', { stars: rating.stars })"
						>
							<i class="ri-eye-line"></i>
							{{ t('view') }}
						</button>
					</div>
				</div>
			</div>

			<!-- Summary stats -->
			<div v-if="showSummary" class="summary-stats">
				<div class="stat-item">
					<span class="stat-label">{{ t('averageRating') }}</span>
					<div class="stat-value">
						<div class="average-rating">
							<span class="rating-number">{{ averageRating.toFixed(1) }}</span>
							<div class="average-stars">
								<i
									v-for="star in 5"
									:key="star"
									:class="[
										star <= Math.floor(averageRating) ? 'ri-star-fill' : 
										star <= averageRating ? 'ri-star-half-fill' : 'ri-star-line',
										'star-icon average',
									]"
								></i>
							</div>
						</div>
					</div>
				</div>
				
				<div class="stat-item">
					<span class="stat-label">{{ t('totalReviews') }}</span>
					<span class="stat-value">{{ totalReviews }}</span>
				</div>
				
				<div class="stat-item">
					<span class="stat-label">{{ t('positiveReviews') }}</span>
					<span class="stat-value positive">
						{{ positivePercentage }}%
					</span>
				</div>
			</div>
		</div>

		<!-- List View -->
		<div v-else class="list-view">
			<div class="rating-list">
				<div
					v-for="rating in sortedDistribution"
					:key="rating.stars"
					class="rating-item"
					@click="viewReviewsByRating(rating.stars)"
				>
					<div class="stars-display">
						<div class="stars-row">
							<i
								v-for="star in 5"
								:key="star"
								:class="[
									star <= rating.stars ? 'ri-star-fill' : 'ri-star-line',
									'star-icon',
									getRatingColorClass(rating.stars),
								]"
							></i>
						</div>
						<span class="stars-count">{{ rating.stars }} {{ t('stars') }}</span>
					</div>
					
					<div class="rating-details">
						<div class="detail-item">
							<span class="detail-label">{{ t('count') }}</span>
							<span class="detail-value">{{ rating.count }}</span>
						</div>
						<div class="detail-item">
							<span class="detail-label">{{ t('percentage') }}</span>
							<span class="detail-value">{{ rating.percentage.toFixed(1) }}%</span>
						</div>
					</div>
					
					<button class="action-button">
						<i class="ri-arrow-right-s-line"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Filter controls -->
		<div v-if="showFilters" class="filter-controls">
			<div class="filter-group">
				<label class="filter-label">{{ t('filterByDate') }}</label>
				<select 
					v-model="dateFilter" 
					@change="applyFilters"
					class="filter-select"
				>
					<option value="all">{{ t('allTime') }}</option>
					<option value="month">{{ t('thisMonth') }}</option>
					<option value="week">{{ t('thisWeek') }}</option>
					<option value="today">{{ t('today') }}</option>
				</select>
			</div>
			
			<div class="filter-group">
				<label class="filter-label">{{ t('sortBy') }}</label>
				<select 
					v-model="sortBy" 
					@change="applyFilters"
					class="filter-select"
				>
					<option value="stars-high">{{ t('starsHighToLow') }}</option>
					<option value="stars-low">{{ t('starsLowToHigh') }}</option>
					<option value="count-high">{{ t('countHighToLow') }}</option>
					<option value="percentage-high">{{ t('percentageHighToLow') }}</option>
				</select>
			</div>
		</div>

		<!-- Progress indicators -->
		<div v-if="showProgressIndicators" class="progress-indicators">
			<div class="indicator">
				<div class="indicator-bar" :style="{ width: excellentPercentage + '%' }"></div>
				<span class="indicator-label">{{ t('excellent') }}</span>
				<span class="indicator-value">{{ excellentPercentage }}%</span>
			</div>
			<div class="indicator">
				<div class="indicator-bar good" :style="{ width: goodPercentage + '%' }"></div>
				<span class="indicator-label">{{ t('good') }}</span>
				<span class="indicator-value">{{ goodPercentage }}%</span>
			</div>
			<div class="indicator">
				<div class="indicator-bar average" :style="{ width: averagePercentage + '%' }"></div>
				<span class="indicator-label">{{ t('average') }}</span>
				<span class="indicator-value">{{ averagePercentage }}%</span>
			</div>
			<div class="indicator">
				<div class="indicator-bar poor" :style="{ width: poorPercentage + '%' }"></div>
				<span class="indicator-label">{{ t('poor') }}</span>
				<span class="indicator-value">{{ poorPercentage }}%</span>
			</div>
		</div>

		<!-- Legend -->
		<div v-if="showLegend" class="legend">
			<div class="legend-items">
				<div class="legend-item">
					<div class="legend-color excellent"></div>
					<span class="legend-text">5 {{ t('stars') }}</span>
				</div>
				<div class="legend-item">
					<div class="legend-color good"></div>
					<span class="legend-text">4 {{ t('stars') }}</span>
				</div>
				<div class="legend-item">
					<div class="legend-color average"></div>
					<span class="legend-text">3 {{ t('stars') }}</span>
				</div>
				<div class="legend-item">
					<div class="legend-color poor"></div>
					<span class="legend-text">1-2 {{ t('stars') }}</span>
				</div>
			</div>
		</div>

		<!-- Comparison (optional) -->
		<div v-if="showComparison && previousData" class="comparison-section">
			<h4 class="comparison-title">{{ t('comparedToPrevious') }}</h4>
			<div class="comparison-stats">
				<div class="comparison-stat">
					<span class="comparison-label">{{ t('ratingChange') }}</span>
					<span class="comparison-value" :class="getChangeClass(ratingChange)">
						<i :class="getChangeIcon(ratingChange)"></i>
						{{ Math.abs(ratingChange).toFixed(1) }}
					</span>
				</div>
				<div class="comparison-stat">
					<span class="comparison-label">{{ t('reviewChange') }}</span>
					<span class="comparison-value" :class="getChangeClass(reviewCountChange)">
						<i :class="getChangeIcon(reviewCountChange)"></i>
						{{ Math.abs(reviewCountChange) }}
					</span>
				</div>
			</div>
		</div>

		<!-- Export/Share -->
		<div v-if="showExport" class="export-section">
			<button @click="exportData" class="export-button">
				<i class="ri-download-line"></i>
				{{ t('exportData') }}
			</button>
			<button @click="shareData" class="share-button">
				<i class="ri-share-line"></i>
				{{ t('share') }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

// Props
const props = withDefaults(defineProps<{
	ratingDistribution?: Array<{
		stars: number;
		count: number;
		percentage: number;
	}>;
	cardSize?: 'small' | 'medium' | 'large' | 'compact';
	cardVariant?: 'default' | 'minimal' | 'detailed';
	showChart?: boolean;
	showViewToggle?: boolean;
	showPercentage?: boolean;
	showCount?: boolean;
	showCountOnBar?: boolean;
	showSummary?: boolean;
	showFilters?: boolean;
	showLegend?: boolean;
	showComparison?: boolean;
	showExport?: boolean;
	showSubtitle?: boolean;
	showViewReviews?: boolean;
	showProgressIndicators?: boolean;
	previousData?: Array<{
		stars: number;
		count: number;
		percentage: number;
	}>;
	sortOrder?: 'descending' | 'ascending';
}>(), {
	ratingDistribution: () => [
		{ stars: 5, count: 3, percentage: 60 },
		{ stars: 4, count: 1, percentage: 20 },
		{ stars: 3, count: 1, percentage: 20 },
		{ stars: 2, count: 0, percentage: 0 },
		{ stars: 1, count: 0, percentage: 0 },
	],
	cardSize: 'medium',
	cardVariant: 'default',
	showChart: true,
	showViewToggle: true,
	showPercentage: true,
	showCount: true,
	showCountOnBar: false,
	showSummary: true,
	showFilters: false,
	showLegend: false,
	showComparison: false,
	showExport: false,
	showSubtitle: true,
	showViewReviews: true,
	showProgressIndicators: false,
	sortOrder: 'descending'
});

// Emits
const emit = defineEmits<{
	(event: 'rating-click', stars: number): void;
	(event: 'view-change', isChart: boolean): void;
	(event: 'filter-change', filters: any): void;
	(event: 'export'): void;
	(event: 'share'): void;
	(event: 'compare'): void;
}>();

// Reactive state
const showChart = ref(props.showChart);
const hoveredRating = ref<number | null>(null);
const dateFilter = ref('all');
const sortBy = ref('stars-high');

// Computed properties
const sortedDistribution = computed(() => {
	const distribution = [...props.ratingDistribution];
	
	switch (sortBy.value) {
		case 'stars-high':
			return distribution.sort((a, b) => b.stars - a.stars);
		case 'stars-low':
			return distribution.sort((a, b) => a.stars - b.stars);
		case 'count-high':
			return distribution.sort((a, b) => b.count - a.count);
		case 'percentage-high':
			return distribution.sort((a, b) => b.percentage - a.percentage);
		default:
			return props.sortOrder === 'descending' 
				? distribution.sort((a, b) => b.stars - a.stars)
				: distribution.sort((a, b) => a.stars - b.stars);
	}
});

const totalReviews = computed(() => {
	return props.ratingDistribution.reduce((sum, rating) => sum + rating.count, 0);
});

const averageRating = computed(() => {
	const totalStars = props.ratingDistribution.reduce(
		(sum, rating) => sum + (rating.stars * rating.count), 
		0
	);
	return totalReviews.value > 0 ? totalStars / totalReviews.value : 0;
});

const highestPercentage = computed(() => {
	return Math.max(...props.ratingDistribution.map(r => r.percentage));
});

const positivePercentage = computed(() => {
	const positiveReviews = props.ratingDistribution
		.filter(r => r.stars >= 4)
		.reduce((sum, r) => sum + r.count, 0);
	return totalReviews.value > 0 
		? Math.round((positiveReviews / totalReviews.value) * 100) 
		: 0;
});

// Progress indicators
const excellentPercentage = computed(() => {
	const rating = props.ratingDistribution.find(r => r.stars === 5);
	return rating ? rating.percentage : 0;
});

const goodPercentage = computed(() => {
	const rating = props.ratingDistribution.find(r => r.stars === 4);
	return rating ? rating.percentage : 0;
});

const averagePercentage = computed(() => {
	const rating = props.ratingDistribution.find(r => r.stars === 3);
	return rating ? rating.percentage : 0;
});

const poorPercentage = computed(() => {
	const poorRatings = props.ratingDistribution
		.filter(r => r.stars <= 2)
		.reduce((sum, r) => sum + r.percentage, 0);
	return poorRatings;
});

// Comparison calculations
const ratingChange = computed(() => {
	if (!props.previousData) return 0;
	
	const previousTotal = props.previousData.reduce((sum, r) => sum + r.count, 0);
	const previousStars = props.previousData.reduce(
		(sum, r) => sum + (r.stars * r.count), 
		0
	);
	
	const previousAvg = previousTotal > 0 ? previousStars / previousTotal : 0;
	return averageRating.value - previousAvg;
});

const reviewCountChange = computed(() => {
	if (!props.previousData) return 0;
	
	const previousTotal = props.previousData.reduce((sum, r) => sum + r.count, 0);
	return totalReviews.value - previousTotal;
});

// Methods
const getRatingClass = (stars: number) => {
	if (stars === 5) return 'rating-excellent';
	if (stars === 4) return 'rating-good';
	if (stars === 3) return 'rating-average';
	return 'rating-poor';
};

const getRatingColorClass = (stars: number) => {
	if (stars === 5) return 'text-excellent';
	if (stars === 4) return 'text-good';
	if (stars === 3) return 'text-average';
	return 'text-poor';
};

const toggleViewMode = () => {
	showChart.value = !showChart.value;
	emit('view-change', showChart.value);
};

const viewReviewsByRating = (stars: number) => {
	emit('rating-click', stars);
};

const applyFilters = () => {
	emit('filter-change', {
		date: dateFilter.value,
		sortBy: sortBy.value
	});
};

const exportData = () => {
	emit('export');
};

const shareData = () => {
	emit('share');
};

const getChangeClass = (change: number) => {
	if (change > 0) return 'change-positive';
	if (change < 0) return 'change-negative';
	return 'change-neutral';
};

const getChangeIcon = (change: number) => {
	if (change > 0) return 'ri-arrow-up-fill';
	if (change < 0) return 'ri-arrow-down-fill';
	return 'ri-arrow-right-fill';
};

// Watch for locale changes
watch(locale, () => {
	// Refresh any localized content
});

// Initialize
onMounted(() => {
	// Any initialization logic
});
</script>

<style scoped>
/* Base card styles */
.rating-distribution-card {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	padding: 1.5rem;
	transition: all 0.3s ease;
}

/* Card sizes */
.rating-distribution-card.small {
	padding: 1rem;
}

.rating-distribution-card.medium {
	padding: 1.5rem;
}

.rating-distribution-card.large {
	padding: 2rem;
}

.rating-distribution-card.compact {
	padding: 1rem;
}

/* Card variants */
.rating-distribution-card.minimal {
	border: none;
	box-shadow: none;
	background: var(--color-app-bg);
}

.rating-distribution-card.detailed {
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Header */
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 1.5rem;
}

.title-section {
	flex: 1;
}

.card-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.125rem;
	font-weight: 700;
	color: #111827;
	margin: 0 0 0.25rem 0;
}

.title-icon {
	color: #f59e0b;
	font-size: 1.25rem;
}

.card-subtitle {
	color: #6b7280;
	font-size: 0.875rem;
	margin: 0;
}

/* View toggle */
.view-toggle {
	display: flex;
	gap: 0.25rem;
	background: #FFEDD5;
	padding: 0.25rem;
	border-radius: 0.75rem;
}

.toggle-button {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 0.5rem;
	border: none;
	background: transparent;
	color: #6b7280;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.toggle-button:hover {
	background: #e5e7eb;
	color: #374151;
}

.toggle-button.active {
	background: var(--color-card);
	color: #3b82f6;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-button i {
	font-size: 1.25rem;
}

/* Chart View */
.chart-view {
	animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.rating-bars {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
	margin-bottom: 2rem;
}

.rating-bar-wrapper {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: 1rem;
	padding: 0.5rem;
	border-radius: 0.75rem;
	transition: background-color 0.2s;
}

.rating-bar-wrapper:hover {
	background-color: #f9fafb;
}

.rating-bar-wrapper.highest {
	background-color: #fffbeb;
}

.rating-label {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	min-width: 60px;
}

.stars-text {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	font-weight: 600;
	color: #111827;
}

.stars-text i {
	color: #fbbf24;
	font-size: 0.875rem;
}

.percentage-text {
	font-size: 0.875rem;
	color: #6b7280;
	font-weight: 500;
}

/* Progress bars */
.progress-container {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.progress-bar {
	height: 1rem;
	border-radius: 9999px;
	background: linear-gradient(90deg, #3b82f6, #8b5cf6);
	position: relative;
	transition: width 1s ease;
	animation-delay: var(--animation-delay);
}

.progress-bar::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(90deg, 
		rgba(255, 255, 255, 0.2) 0%, 
		rgba(255, 255, 255, 0) 50%,
		rgba(255, 255, 255, 0.2) 100%
	);
	border-radius: inherit;
}

/* Rating colors */
.rating-excellent {
	background: linear-gradient(90deg, #10b981, #34d399);
}

.rating-good {
	background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.rating-average {
	background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.rating-poor {
	background: linear-gradient(90deg, #ef4444, #f87171);
}

.count-on-bar {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	font-size: 0.75rem;
	font-weight: 600;
	color: #374151;
	background: var(--color-card);
	padding: 0.125rem 0.5rem;
	border-radius: 9999px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Tooltip */
.bar-tooltip {
	position: absolute;
	top: -2.5rem;
	left: 50%;
	transform: translateX(-50%);
	background: #374151;
	color: white;
	padding: 0.5rem 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	white-space: nowrap;
	z-index: 10;
}

.bar-tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	border-width: 0.375rem;
	border-style: solid;
	border-color: #374151 transparent transparent transparent;
}

.rating-stats {
	display: flex;
	align-items: center;
	gap: 1rem;
	min-width: 80px;
	justify-content: flex-end;
}

.count-text {
	font-weight: 600;
	color: #111827;
	min-width: 2rem;
	text-align: right;
}

.view-reviews-button {
	display: flex;
	align-items: center;
	gap: 0.25rem;
	padding: 0.375rem 0.75rem;
	background: #FFEDD5;
	border: 1px solid #e5e7eb;
	border-radius: 0.5rem;
	color: #6b7280;
	font-size: 0.75rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.view-reviews-button:hover {
	background: #e5e7eb;
	color: #374151;
}

/* Summary stats */
.summary-stats {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1.5rem;
	padding: 1.5rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	margin-top: 2rem;
}

.stat-item {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.stat-label {
	font-size: 0.875rem;
	color: #6b7280;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 700;
	color: #111827;
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.average-rating {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.rating-number {
	font-size: 2rem;
	font-weight: 800;
	color: #111827;
}

.average-stars {
	display: flex;
	gap: 0.125rem;
}

.average-stars .star-icon {
	font-size: 1.25rem;
}

.average-stars .star-icon.average {
	color: #f59e0b;
}

.stat-value.positive {
	color: #10b981;
}

/* List View */
.list-view {
	animation: fadeIn 0.3s ease;
}

.rating-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.rating-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid transparent;
}

.rating-item:hover {
	background: var(--color-card);
	border-color: #e5e7eb;
	transform: translateY(-2px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stars-display {
	display: flex;
	align-items: center;
	gap: 1rem;
	min-width: 120px;
}

.stars-row {
	display: flex;
	gap: 0.125rem;
}

.stars-row .star-icon {
	font-size: 1rem;
}

.stars-count {
	font-weight: 600;
	color: #111827;
}

.rating-details {
	display: flex;
	gap: 2rem;
}

.detail-item {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
	min-width: 60px;
}

.detail-label {
	font-size: 0.75rem;
	color: #6b7280;
}

.detail-value {
	font-weight: 600;
	color: #111827;
}

.action-button {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
	background: var(--color-card);
	color: #6b7280;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
}

.action-button:hover {
	background: #FFEDD5;
	color: #374151;
	border-color: #d1d5db;
}

/* Filter controls */
.filter-controls {
	display: flex;
	flex-wrap: wrap;
	gap: 1.5rem;
	padding: 1.5rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	margin-top: 1.5rem;
}

.filter-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	min-width: 150px;
}

.filter-label {
	font-size: 0.875rem;
	font-weight: 500;
	color: #374151;
}

.filter-select {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: var(--color-card);
	color: #374151;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.filter-select:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Progress indicators */
.progress-indicators {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin-top: 2rem;
	padding-top: 1.5rem;
	border-top: 1px solid #e5e7eb;
}

.indicator {
	display: flex;
	align-items: center;
	gap: 1rem;
	position: relative;
}

.indicator-bar {
	height: 0.5rem;
	border-radius: 9999px;
	background: #10b981;
	transition: width 1s ease;
}

.indicator-bar.good {
	background: #3b82f6;
}

.indicator-bar.average {
	background: #f59e0b;
}

.indicator-bar.poor {
	background: #ef4444;
}

.indicator-label {
	font-size: 0.875rem;
	color: #374151;
	min-width: 80px;
}

.indicator-value {
	font-weight: 600;
	color: #111827;
}

/* Legend */
.legend {
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid #e5e7eb;
}

.legend-items {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.legend-color {
	width: 1rem;
	height: 1rem;
	border-radius: 0.25rem;
}

.legend-color.excellent {
	background: #10b981;
}

.legend-color.good {
	background: #3b82f6;
}

.legend-color.average {
	background: #f59e0b;
}

.legend-color.poor {
	background: #ef4444;
}

.legend-text {
	font-size: 0.875rem;
	color: #6b7280;
}

/* Comparison section */
.comparison-section {
	margin-top: 2rem;
	padding: 1.5rem;
	background: var(--color-app-bg);
	border-radius: 0.75rem;
	border: 1px solid #dbeafe;
}

.comparison-title {
	font-size: 1rem;
	font-weight: 600;
	color: #1e40af;
	margin: 0 0 1rem 0;
}

.comparison-stats {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}

.comparison-stat {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.comparison-label {
	font-size: 0.875rem;
	color: #6b7280;
}

.comparison-value {
	font-size: 1.25rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	gap: 0.25rem;
}

.comparison-value.change-positive {
	color: #10b981;
}

.comparison-value.change-negative {
	color: #ef4444;
}

.comparison-value.change-neutral {
	color: #6b7280;
}

/* Export section */
.export-section {
	display: flex;
	gap: 1rem;
	margin-top: 1.5rem;
	padding-top: 1.5rem;
	border-top: 1px solid #e5e7eb;
}

.export-button,
.share-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border-radius: 0.75rem;
	font-weight: 500;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
	border: 1px solid;
}

.export-button {
	background: var(--color-card);
	border-color: #d1d5db;
	color: #374151;
}

.export-button:hover {
	background: var(--color-app-bg);
	border-color: #9ca3af;
}

.share-button {
	background: #3b82f6;
	border-color: #3b82f6;
	color: white;
}

.share-button:hover {
	background: #2563eb;
	border-color: #2563eb;
}

/* Text color classes for stars */
.text-excellent {
	color: #10b981;
}

.text-good {
	color: #3b82f6;
}

.text-average {
	color: #f59e0b;
}

.text-poor {
	color: #ef4444;
}

/* Responsive design */
@media (max-width: 768px) {
	.rating-distribution-card {
		padding: 1rem;
	}
	
	.card-header {
		flex-direction: column;
		gap: 1rem;
	}
	
	.view-toggle {
		align-self: flex-start;
	}
	
	.rating-bar-wrapper {
		grid-template-columns: 1fr;
		gap: 0.5rem;
	}
	
	.rating-label {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
	
	.rating-stats {
		justify-content: flex-start;
	}
	
	.summary-stats {
		grid-template-columns: 1fr;
	}
	
	.rating-item {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}
	
	.rating-details {
		width: 100%;
		justify-content: space-between;
	}
	
	.action-button {
		align-self: flex-end;
	}
	
	.filter-controls {
		flex-direction: column;
		gap: 1rem;
	}
	
	.export-section {
		flex-direction: column;
	}
}

@media (max-width: 480px) {
	.rating-bars {
		gap: 1rem;
	}
	
	.progress-container {
		flex-direction: column;
		align-items: stretch;
		gap: 0.5rem;
	}
	
	.count-on-bar {
		position: relative;
		transform: none;
		align-self: flex-start;
	}
	
	.legend-items {
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.comparison-stats {
		flex-direction: column;
		gap: 1rem;
	}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
	.rating-distribution-card {
		background: #1f2937;
		border-color: #374151;
		color: #f3f4f6;
	}
	
	.card-title {
		color: #f9fafb;
	}
	
	.card-subtitle {
		color: #d1d5db;
	}
	
	.toggle-button {
		background: #374151;
		color: #9ca3af;
	}
	
	.toggle-button.active {
		background: #3b82f6;
		color: white;
	}
	
	.rating-bar-wrapper:hover {
		background: #374151;
	}
	
	.rating-bar-wrapper.highest {
		background: #451a03;
	}
	
	.stars-text {
		color: #f9fafb;
	}
	
	.count-on-bar {
		background: #374151;
		color: #f9fafb;
	}
	
	.summary-stats {
		background: #111827;
	}
	
	.rating-item {
		background: #111827;
	}
	
	.rating-item:hover {
		background: #374151;
		border-color: #4b5563;
	}
	
	.filter-controls {
		background: #111827;
	}
	
	.filter-select {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.comparison-section {
		background: #1e3a8a;
		border-color: #3b82f6;
	}
	
	.export-button {
		background: #374151;
		border-color: #4b5563;
		color: #f3f4f6;
	}
	
	.export-button:hover {
		background: #4b5563;
	}
}
</style>