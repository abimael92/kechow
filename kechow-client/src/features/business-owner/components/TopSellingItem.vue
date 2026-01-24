<template>
	<div 
		class="top-item-container"
		:class="{
			'top-ranked': rank === '1',
			'highlighted': highlighted,
			'interactive': interactive,
			[itemSize]: true
		}"
		@click="handleClick"
		:role="interactive ? 'button' : undefined"
		:tabindex="interactive ? '0' : undefined"
		@keyup.enter="interactive ? handleClick() : null"
		:aria-label="getAriaLabel"
	>
		<div class="item-content">
			<!-- Rank Badge -->
			<div 
				class="rank-badge"
				:class="getRankBadgeClass"
				:aria-label="`Rank ${rank}`"
			>
				<span class="rank-number">{{ rank }}</span>
				<!-- Trend indicator for rank changes -->
				<div v-if="showTrend" class="rank-trend" :class="trendClass">
					<i :class="trendIcon"></i>
					<span v-if="trendValue" class="trend-value">{{ Math.abs(trendValue) }}</span>
				</div>
			</div>
			
			<!-- Item Info -->
			<div class="item-info">
				<div class="item-header">
					<h4 class="item-name">
						{{ name }}
						<!-- Popular/Featured badge -->
						<span v-if="isPopular" class="popular-badge" :title="$t('popularItem')">
							<i class="ri-fire-fill"></i>
						</span>
						<span v-if="isNew" class="new-badge" :title="$t('newItem')">
							{{ $t('new') }}
						</span>
					</h4>
					
					<!-- Item category/tags -->
					<div v-if="category || tags?.length" class="item-meta">
						<span v-if="category" class="item-category">
							<i class="ri-price-tag-3-line"></i>
							{{ category }}
						</span>
						<div v-if="tags?.length" class="item-tags">
							<span
								v-for="tag in tags"
								:key="tag"
								class="item-tag"
							>
								{{ tag }}
							</span>
						</div>
					</div>
				</div>
				
				<!-- Order Stats -->
				<div class="item-stats">
					<div class="stat-item">
						<i class="ri-shopping-cart-line stat-icon"></i>
						<div class="stat-details">
							<span class="stat-value">{{ orders }}</span>
							<span class="stat-label">{{ orderLabel }}</span>
						</div>
					</div>
					
					<!-- Additional stats -->
					<div v-if="showAdditionalStats" class="additional-stats">
						<div v-if="averageRating" class="stat-item">
							<i class="ri-star-line stat-icon"></i>
							<div class="stat-details">
								<span class="stat-value">{{ averageRating }}</span>
								<span class="stat-label">{{ $t('rating') }}</span>
							</div>
						</div>
						
						<div v-if="successRate" class="stat-item">
							<i class="ri-checkbox-circle-line stat-icon"></i>
							<div class="stat-details">
								<span class="stat-value">{{ successRate }}%</span>
								<span class="stat-label">{{ $t('successRate') }}</span>
							</div>
						</div>
					</div>
				</div>
				
				<!-- Progress bar (optional) -->
				<div v-if="showProgress && maxValue" class="progress-container">
					<div class="progress-label">
						<span>{{ $t('progress') }}</span>
						<span class="progress-percentage">{{ progressPercentage }}%</span>
					</div>
					<div class="progress-bar">
						<div 
							class="progress-fill" 
							:class="progressClass"
							:style="{ width: progressPercentage + '%' }"
							:aria-label="`${progressPercentage}% progress`"
						></div>
					</div>
				</div>
			</div>
			
			<!-- Revenue/Value -->
			<div class="item-value">
				<div class="value-content">
					<span class="value-amount">{{ revenue }}</span>
					<div v-if="showCurrency" class="value-currency">{{ currency }}</div>
				</div>
				
				<!-- Growth indicator -->
				<div v-if="growthPercentage !== null && growthPercentage !== undefined" class="growth-indicator" :class="growthClass">
					<i :class="growthIcon"></i>
					<span class="growth-value">{{ Math.abs(growthPercentage ?? 0) }}%</span>
				</div>
				
				<!-- Comparison to previous period -->
				<div v-if="showComparison && previousRevenue" class="comparison">
					<span class="comparison-label">{{ $t('vsPrevious') }}</span>
					<span class="comparison-value">{{ comparisonValue }}</span>
				</div>
			</div>
			
			<!-- Action Buttons -->
			<div v-if="showActions" class="item-actions">
				<button
					v-for="action in actions"
					:key="action.id"
					@click.stop="handleAction(action.id)"
					class="action-button"
					:class="action.class"
					:aria-label="action.label"
				>
					<i :class="action.icon"></i>
				</button>
			</div>
		</div>
		
		<!-- Hover/Selected state overlay -->
		<div v-if="interactive" class="interactive-overlay"></div>
		
		<!-- Tooltip for additional info -->
		<div v-if="tooltip" class="item-tooltip">
			{{ tooltip }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

const props = withDefaults(defineProps<{
	rank: string;
	name: string;
	orders: number | string;
	revenue: string;
	category?: string;
	tags?: string[];
	averageRating?: number;
	successRate?: number;
	growthPercentage?: number | null;
	previousRevenue?: string;
	maxValue?: number;
	highlighted?: boolean;
	interactive?: boolean;
	showTrend?: boolean;
	trendValue?: number;
	showProgress?: boolean;
	showComparison?: boolean;
	showActions?: boolean;
	showCurrency?: boolean;
	showAdditionalStats?: boolean;
	itemSize?: 'small' | 'medium' | 'large';
	isPopular?: boolean;
	isNew?: boolean;
	tooltip?: string;
	currency?: string;
	actions?: Array<{
		id: string;
		icon: string;
		label: string;
		class?: string;
	}>;
}>(), {
	highlighted: false,
	interactive: false,
	showTrend: false,
	showProgress: false,
	showComparison: false,
	showActions: false,
	showCurrency: false,
	showAdditionalStats: false,
	itemSize: 'medium',
	isPopular: false,
	isNew: false,
	currency: '$',
	actions: () => []
});

const emit = defineEmits<{
	(event: 'click', data: { rank: string; name: string }): void;
	(event: 'action', actionId: string): void;
	(event: 'view-details'): void;
}>();

// Computed properties
const getRankBadgeClass = computed(() => {
	const rankNum = parseInt(props.rank);
	if (rankNum === 1) return 'rank-first';
	if (rankNum === 2) return 'rank-second';
	if (rankNum === 3) return 'rank-third';
	return 'rank-other';
});

const trendClass = computed(() => {
	if (!props.trendValue) return 'trend-neutral';
	return props.trendValue > 0 ? 'trend-up' : 'trend-down';
});

const trendIcon = computed(() => {
	if (!props.trendValue) return 'ri-minimize-line';
	return props.trendValue > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
});

const orderLabel = computed(() => {
	const orderCount = typeof props.orders === 'number' ? props.orders : parseInt(props.orders);
	return orderCount === 1 ? t('order') : t('orders', orderCount);
});

const growthClass = computed(() => {
	if (props.growthPercentage === null || props.growthPercentage === undefined) return 'growth-neutral';
	return props.growthPercentage > 0 ? 'growth-positive' : 'growth-negative';
});

const growthIcon = computed(() => {
	if (props.growthPercentage === null || props.growthPercentage === undefined) return 'ri-minus-line';
	return props.growthPercentage > 0 ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
});

const progressPercentage = computed(() => {
	if (!props.maxValue || !props.revenue) return 0;
	
	// Extract numeric value from revenue string (remove currency symbols, commas, etc.)
	const revenueValue = parseFloat(props.revenue.replace(/[^0-9.-]+/g, ''));
	return Math.min(Math.round((revenueValue / props.maxValue) * 100), 100);
});

const progressClass = computed(() => {
	const percentage = progressPercentage.value;
	if (percentage >= 80) return 'progress-high';
	if (percentage >= 50) return 'progress-medium';
	return 'progress-low';
});

const comparisonValue = computed(() => {
	if (!props.previousRevenue) return '';
	
	// Simple comparison logic - in real app, use proper calculation
	const current = parseFloat(props.revenue.replace(/[^0-9.-]+/g, ''));
	const previous = parseFloat(props.previousRevenue.replace(/[^0-9.-]+/g, ''));
	const diff = current - previous;
	const percentage = previous > 0 ? (diff / previous) * 100 : 0;
	
	return percentage >= 0 ? `+${percentage.toFixed(1)}%` : `${percentage.toFixed(1)}%`;
});

const getAriaLabel = computed(() => {
	return t('topItemAriaLabel', {
		rank: props.rank,
		name: props.name,
		orders: props.orders,
		revenue: props.revenue
	});
});

// Methods
const handleClick = () => {
	if (props.interactive) {
		emit('click', { rank: props.rank, name: props.name });
		emit('view-details');
	}
};

const handleAction = (actionId: string) => {
	emit('action', actionId);
};
</script>

<style scoped>
/* Base container */
.top-item-container {
	background: white;
	border-radius: 1rem;
	padding: 1rem;
	transition: all 0.3s ease;
	position: relative;
}

/* Item sizes */
.top-item-container.small {
	padding: 0.75rem;
}

.top-item-container.medium {
	padding: 1rem;
}

.top-item-container.large {
	padding: 1.25rem;
}

/* Highlighted and top-ranked states */
.top-item-container.highlighted {
	background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	border: 2px solid #f59e0b;
}

.top-item-container.top-ranked {
	background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
	box-shadow: 0 8px 25px rgba(245, 158, 11, 0.2);
	transform: translateY(-2px);
}

.top-item-container.interactive {
	cursor: pointer;
	user-select: none;
}

.top-item-container.interactive:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	background: #f9fafb;
}

.top-item-container.interactive:focus-visible {
	outline: 2px solid #f59e0b;
	outline-offset: 2px;
}

/* Content layout */
.item-content {
	display: flex;
	align-items: center;
	gap: 1rem;
	position: relative;
	z-index: 1;
}

.top-item-container.small .item-content {
	gap: 0.75rem;
}

.top-item-container.large .item-content {
	gap: 1.25rem;
}

/* Rank Badge */
.rank-badge {
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 0.75rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-weight: 700;
	position: relative;
	flex-shrink: 0;
}

.top-item-container.small .rank-badge {
	width: 2rem;
	height: 2rem;
	font-size: 0.875rem;
}

.top-item-container.large .rank-badge {
	width: 3rem;
	height: 3rem;
	font-size: 1.125rem;
}

.rank-first {
	background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.rank-second {
	background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.rank-third {
	background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
	color: white;
	box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
}

.rank-other {
	background: #f3f4f6;
	color: #6b7280;
}

.rank-number {
	font-size: 1.125rem;
	font-weight: 800;
	line-height: 1;
}

.top-item-container.small .rank-number {
	font-size: 0.875rem;
}

.top-item-container.large .rank-number {
	font-size: 1.25rem;
}

.rank-trend {
	position: absolute;
	top: -0.25rem;
	right: -0.25rem;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.5rem;
}

.trend-up {
	background: #10b981;
	color: white;
}

.trend-down {
	background: #ef4444;
	color: white;
}

.trend-neutral {
	background: #6b7280;
	color: white;
}

.trend-value {
	font-size: 0.375rem;
	font-weight: 700;
}

/* Item Info */
.item-info {
	flex: 1;
	min-width: 0; /* Prevent overflow */
}

.item-header {
	margin-bottom: 0.5rem;
}

.item-name {
	font-size: 1rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.25rem 0;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.top-item-container.small .item-name {
	font-size: 0.875rem;
}

.top-item-container.large .item-name {
	font-size: 1.125rem;
}

.popular-badge {
	background: #dc2626;
	color: white;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.625rem;
}

.new-badge {
	background: #3b82f6;
	color: white;
	padding: 0.125rem 0.5rem;
	border-radius: 0.75rem;
	font-size: 0.625rem;
	font-weight: 600;
	text-transform: uppercase;
}

.item-meta {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	flex-wrap: wrap;
}

.item-category {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.75rem;
	color: #6b7280;
	background: #f3f4f6;
	padding: 0.25rem 0.5rem;
	border-radius: 0.5rem;
}

.item-category i {
	font-size: 0.75rem;
}

.item-tags {
	display: flex;
	gap: 0.25rem;
	flex-wrap: wrap;
}

.item-tag {
	font-size: 0.625rem;
	color: #8b5cf6;
	background: rgba(139, 92, 246, 0.1);
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
}

/* Item Stats */
.item-stats {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 0.75rem;
}

.stat-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.stat-icon {
	font-size: 0.875rem;
	color: #9ca3af;
}

.top-item-container.small .stat-icon {
	font-size: 0.75rem;
}

.stat-details {
	display: flex;
	align-items: baseline;
	gap: 0.25rem;
}

.stat-value {
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
}

.top-item-container.small .stat-value {
	font-size: 0.75rem;
}

.stat-label {
	font-size: 0.75rem;
	color: #6b7280;
}

.top-item-container.small .stat-label {
	font-size: 0.625rem;
}

.additional-stats {
	display: flex;
	gap: 1rem;
}

/* Progress bar */
.progress-container {
	margin-top: 0.75rem;
}

.progress-label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 0.25rem;
	font-size: 0.75rem;
	color: #6b7280;
}

.progress-percentage {
	font-weight: 600;
	color: #111827;
}

.progress-bar {
	height: 0.5rem;
	background: #f3f4f6;
	border-radius: 0.25rem;
	overflow: hidden;
}

.progress-fill {
	height: 100%;
	border-radius: 0.25rem;
	transition: width 0.5s ease;
}

.progress-high {
	background: linear-gradient(90deg, #10b981, #34d399);
}

.progress-medium {
	background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.progress-low {
	background: linear-gradient(90deg, #6b7280, #9ca3af);
}

/* Item Value */
.item-value {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.25rem;
	min-width: 80px;
}

.value-content {
	display: flex;
	align-items: baseline;
	gap: 0.125rem;
}

.value-amount {
	font-size: 1.125rem;
	font-weight: 700;
	color: #111827;
}

.top-item-container.small .value-amount {
	font-size: 0.875rem;
}

.top-item-container.large .value-amount {
	font-size: 1.25rem;
}

.value-currency {
	font-size: 0.875rem;
	color: #6b7280;
	font-weight: 500;
}

.growth-indicator {
	display: inline-flex;
	align-items: center;
	gap: 0.125rem;
	padding: 0.125rem 0.375rem;
	border-radius: 0.25rem;
	font-size: 0.625rem;
	font-weight: 600;
}

.growth-positive {
	background: rgba(16, 185, 129, 0.1);
	color: #10b981;
}

.growth-negative {
	background: rgba(239, 68, 68, 0.1);
	color: #ef4444;
}

.growth-neutral {
	background: rgba(107, 114, 128, 0.1);
	color: #6b7280;
}

.growth-indicator i {
	font-size: 0.5rem;
}

.comparison {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.125rem;
}

.comparison-label {
	font-size: 0.625rem;
	color: #9ca3af;
}

.comparison-value {
	font-size: 0.75rem;
	font-weight: 600;
	color: #10b981;
}

/* Action Buttons */
.item-actions {
	display: flex;
	gap: 0.25rem;
	opacity: 0;
	transition: opacity 0.2s ease;
}

.top-item-container.interactive:hover .item-actions {
	opacity: 1;
}

.action-button {
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
	background: white;
	color: #6b7280;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
	font-size: 0.875rem;
}

.top-item-container.small .action-button {
	width: 1.75rem;
	height: 1.75rem;
	font-size: 0.75rem;
}

.action-button:hover {
	background: #f3f4f6;
	color: #374151;
	border-color: #d1d5db;
}

/* Interactive Overlay */
.interactive-overlay {
	position: absolute;
	inset: 0;
	border-radius: inherit;
	background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
	opacity: 0;
	transition: opacity 0.2s ease;
	pointer-events: none;
}

.top-item-container.interactive:hover .interactive-overlay {
	opacity: 1;
}

/* Tooltip */
.item-tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	margin-bottom: 0.5rem;
	padding: 0.5rem 0.75rem;
	background: #374151;
	color: white;
	font-size: 0.75rem;
	border-radius: 0.375rem;
	white-space: nowrap;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.2s ease, visibility 0.2s ease;
	z-index: 10;
}

.top-item-container:hover .item-tooltip {
	opacity: 1;
	visibility: visible;
}

.item-tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	border-width: 0.25rem;
	border-style: solid;
	border-color: #374151 transparent transparent transparent;
}

/* Responsive Design */
@media (max-width: 768px) {
	.item-content {
		flex-wrap: wrap;
	}
	
	.item-value {
		width: 100%;
		align-items: flex-start;
		margin-top: 0.75rem;
	}
	
	.item-actions {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		opacity: 1;
	}
	
	.item-info {
		width: calc(100% - 3.5rem);
	}
}

@media (max-width: 480px) {
	.top-item-container {
		padding: 0.75rem;
	}
	
	.item-content {
		gap: 0.75rem;
	}
	
	.item-info {
		width: calc(100% - 3rem);
	}
	
	.additional-stats {
		flex-direction: column;
		gap: 0.25rem;
	}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
	.top-item-container {
		background: #1f2937;
		color: #f3f4f6;
	}
	
	.top-item-container.highlighted {
		background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
		border-color: #d97706;
	}
	
	.top-item-container.top-ranked {
		background: linear-gradient(135deg, #451a03 0%, #92400e 100%);
		box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
	}
	
	.top-item-container.interactive:hover {
		background: #374151;
	}
	
	.item-name {
		color: #f9fafb;
	}
	
	.rank-other {
		background: #374151;
		color: #d1d5db;
	}
	
	.item-category {
		background: #374151;
		color: #d1d5db;
	}
	
	.item-tag {
		background: rgba(168, 85, 247, 0.2);
		color: #c084fc;
	}
	
	.stat-value {
		color: #f9fafb;
	}
	
	.stat-label {
		color: #d1d5db;
	}
	
	.progress-bar {
		background: #374151;
	}
	
	.value-amount {
		color: #f9fafb;
	}
	
	.value-currency {
		color: #d1d5db;
	}
	
	.comparison-value {
		color: #34d399;
	}
	
	.action-button {
		background: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.action-button:hover {
		background: #4b5563;
		color: #f3f4f6;
	}
	
	.item-tooltip {
		background: #111827;
	}
	
	.item-tooltip::after {
		border-color: #111827 transparent transparent transparent;
	}
}

/* Animation for rank changes */
@keyframes rankChange {
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
}

.top-item-container.top-ranked .rank-badge {
	animation: rankChange 1s ease;
}

/* Accessibility */
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>