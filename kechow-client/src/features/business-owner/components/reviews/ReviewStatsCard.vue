<template>
	<div 
		class="metric-card"
		:class="{ 
			'interactive': interactive, 
			'active': isActive,
			[cardSize]: true 
		}"
		@click="handleCardClick"
		:role="interactive ? 'button' : undefined"
		:tabindex="interactive ? '0' : undefined"
		@keyup.enter="interactive ? handleCardClick() : null"
	>
		<div class="card-content">
			<div class="metric-info">
				<p class="metric-title" :lang="currentLang">
					{{ translatedTitle }}
				</p>
				
				<p class="metric-value">
					{{ formattedValue }}
				</p>

				<!-- Star Rating -->
				<div 
					v-if="showStars && stars !== undefined" 
					class="star-rating"
					:aria-label="`${stars} out of 5 stars`"
				>
					<i
						v-for="star in 5"
						:key="star"
						:class="[
							star <= Math.floor(stars) ? 'ri-star-fill' : 'ri-star-line',
							star <= stars && star > Math.floor(stars) ? 'ri-star-half-fill' : '',
							'star-icon',
						]"
						:aria-hidden="true"
					></i>
					<span class="sr-only">{{ stars }} / 5</span>
				</div>

				<!-- Change indicator with arrow -->
				<div v-if="change" class="change-indicator">
					<p class="change-text" :class="changeTypeClass">
						<i 
							:class="changeArrowClass"
							class="change-arrow"
							aria-hidden="true"
						></i>
						{{ formattedChange }}
						<span v-if="isPercentage" class="change-percent">%</span>
					</p>
					<p v-if="changePeriod" class="change-period">
						{{ changePeriod }}
					</p>
				</div>
				
				<!-- Toggle switch (if enabled) -->
				<div v-if="showToggle" class="toggle-container">
					<button
						type="button"
						class="toggle-switch"
						:class="{ 'toggle-on': isToggled }"
						@click.stop="toggleActive"
						:aria-pressed="isToggled"
						:aria-label="toggleLabel"
					>
						<span class="toggle-slider"></span>
					</button>
					<span class="toggle-label">{{ toggleText }}</span>
				</div>
			</div>
			
			<!-- Icon with optional badge -->
			<div class="icon-container">
				<div
					:class="[
						'icon-wrapper',
						bgColor,
						{ 'with-badge': showBadge }
					]"
					:aria-label="iconDescription"
				>
					<i
						:class="[
							icon,
							iconColor,
							'icon',
						]"
						aria-hidden="true"
					></i>
					<!-- Badge for notifications/alerts -->
					<span v-if="showBadge" class="icon-badge">
						{{ badgeCount }}
					</span>
				</div>

				<!-- Action buttons (if enabled) -->
				<div v-if="showActions" class="action-buttons">
					<button
						v-for="action in actions"
						:key="action.id"
						@click.stop="handleAction(action.id)"
						class="action-button"
						:class="action.class"
						:aria-label="action.label"
					>
						<i :class="action.icon" aria-hidden="true"></i>
					</button>
				</div>
			</div>
		</div>

		<!-- Progress bar (optional) -->
		<div v-if="showProgress" class="progress-container">
			<div class="progress-bar" :style="{ width: progress + '%' }">
				<span class="progress-text">{{ progress }}%</span>
			</div>
		</div>

		<!-- Tooltip -->
		<div v-if="tooltip" class="tooltip">
			{{ tooltip }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

// Define props with more comprehensive options
const props = withDefaults(defineProps<{
	title: string;
	value: string | number;
	change?: string;
	changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
	changePeriod?: string;
	showStars?: boolean;
	stars?: number;
	icon: string;
	bgColor: string;
	iconColor: string;
	iconDescription?: string;

	// New features
	interactive?: boolean;
	showToggle?: boolean;
	toggleText?: string;
	initialToggleState?: boolean;
	showBadge?: boolean;
	badgeCount?: number;
	showProgress?: boolean;
	progress?: number;
	showActions?: boolean;
	actions?: Array<{
		id: string;
		icon: string;
		label: string;
		class?: string;
	}>;
	tooltip?: string;
	cardSize?: 'small' | 'medium' | 'large';
	locale?: string;
	formatOptions?: Intl.NumberFormatOptions;
	isPercentage?: boolean;
}>(), {
	changeType: 'neutral',
	interactive: false,
	showToggle: false,
	initialToggleState: false,
	showBadge: false,
	badgeCount: 0,
	showProgress: false,
	progress: 0,
	showActions: false,
	actions: () => [],
	cardSize: 'medium',
	locale: 'en-US',
	isPercentage: false,
	iconDescription: 'Metric icon'
});

const emit = defineEmits<{
	'card-click': [value: string | number];
	'toggle-change': [state: boolean];
	'action-click': [actionId: string];
	'locale-change': [locale: string];
}>();

// Reactive state
const isActive = ref(false);
const isToggled = ref(props.initialToggleState);
const currentLang = ref(props.locale);

// i18n setup (assuming you have vue-i18n installed)
// const { t } = useI18n();

// Computed properties
const translatedTitle = computed(() => {
	// In a real app, use vue-i18n:
	// return t(props.title);
	// For demo, return as-is or implement translation logic
	return props.title;
});

const formattedValue = computed(() => {
	if (typeof props.value === 'number') {
		return new Intl.NumberFormat(currentLang.value, props.formatOptions).format(props.value);
	}
	return props.value;
});

const formattedChange = computed(() => {
	if (!props.change) return '';
	// Remove any existing % sign if isPercentage is true
	const cleanChange = props.change.replace('%', '');
	return cleanChange;
});

const changeTypeClass = computed(() => {
	switch (props.changeType) {
		case 'positive':
			return 'change-positive';
		case 'negative':
			return 'change-negative';
		case 'warning':
			return 'change-warning';
		case 'neutral':
		default:
			return 'change-neutral';
	}
});

const changeArrowClass = computed(() => {
	switch (props.changeType) {
		case 'positive':
			return 'ri-arrow-up-line';
		case 'negative':
			return 'ri-arrow-down-line';
		case 'warning':
			return 'ri-alert-line';
		case 'neutral':
			return 'ri-arrow-right-line';
		default:
			return 'ri-information-line';
	}
});

const toggleLabel = computed(() => {
	return isToggled.value ? `Disable ${props.title}` : `Enable ${props.title}`;
});

// Methods
const handleCardClick = () => {
	if (props.interactive) {
		isActive.value = !isActive.value;
		emit('card-click', props.value);
	}
};

const toggleActive = () => {
	if (props.showToggle) {
		isToggled.value = !isToggled.value;
		emit('toggle-change', isToggled.value);
	}
};

const handleAction = (actionId: string) => {
	emit('action-click', actionId);
};

// Watch for locale changes
watch(() => props.locale, (newLocale) => {
	currentLang.value = newLocale;
	emit('locale-change', newLocale);
});
</script>

<style scoped>
/* Base card styles */
.metric-card {
	background-color: white;
	padding: 1.5rem;
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	transition: all 0.3s ease;
	position: relative;
	overflow: hidden;
}

.metric-card.interactive {
	cursor: pointer;
	user-select: none;
}

.metric-card.interactive:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	border-color: #3b82f6;
}

.metric-card.interactive.active {
	background-color: #f0f9ff;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.metric-card.interactive:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Card sizes */
.metric-card.small {
	padding: 1rem;
}

.metric-card.medium {
	padding: 1.5rem;
}

.metric-card.large {
	padding: 2rem;
}

/* Card content layout */
.card-content {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
}

.metric-info {
	flex: 1;
	min-width: 0; /* Prevent overflow */
}

/* Title and value */
.metric-title {
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
	margin-bottom: 0.25rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
}

.metric-value {
	font-size: 2.25rem;
	font-weight: 700;
	color: #111827;
	margin: 0.25rem 0;
	line-height: 1;
}

.metric-card.small .metric-value {
	font-size: 1.75rem;
}

.metric-card.large .metric-value {
	font-size: 3rem;
}

/* Star rating */
.star-rating {
	display: flex;
	gap: 0.125rem;
	margin: 0.5rem 0;
}

.star-icon {
	width: 1rem;
	height: 1rem;
	color: #fbbf24;
	font-size: 1rem;
}

/* Change indicator */
.change-indicator {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 0.5rem;
	flex-wrap: wrap;
}

.change-text {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	font-size: 0.875rem;
	font-weight: 600;
}

.change-arrow {
	font-size: 0.875rem;
}

.change-positive {
	color: #059669;
}

.change-negative {
	color: #dc2626;
}

.change-warning {
	color: #d97706;
}

.change-neutral {
	color: #6b7280;
}

.change-period {
	color: #9ca3af;
	font-size: 0.75rem;
}

.change-percent {
	font-size: 0.75em;
	margin-left: 0.125rem;
}

/* Toggle switch */
.toggle-container {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	margin-top: 1rem;
}

.toggle-switch {
	position: relative;
	width: 3rem;
	height: 1.5rem;
	border-radius: 0.75rem;
	background-color: #d1d5db;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;
	padding: 0;
}

.toggle-switch.toggle-on {
	background-color: #059669;
}

.toggle-slider {
	position: absolute;
	top: 0.125rem;
	left: 0.125rem;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	background-color: white;
	transition: transform 0.3s ease;
}

.toggle-switch.toggle-on .toggle-slider {
	transform: translateX(1.5rem);
}

.toggle-label {
	font-size: 0.875rem;
	color: #4b5563;
}

/* Icon container */
.icon-container {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 0.5rem;
	flex-shrink: 0;
}

.icon-wrapper {
	width: 3rem;
	height: 3rem;
	border-radius: 0.75rem;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.metric-card.small .icon-wrapper {
	width: 2.5rem;
	height: 2.5rem;
}

.metric-card.large .icon-wrapper {
	width: 4rem;
	height: 4rem;
}

.icon {
	font-size: 1.5rem;
	width: 1.5rem;
	height: 1.5rem;
}

.metric-card.small .icon {
	font-size: 1.25rem;
	width: 1.25rem;
	height: 1.25rem;
}

.metric-card.large .icon {
	font-size: 2rem;
	width: 2rem;
	height: 2rem;
}

.icon-wrapper.with-badge::after {
	content: attr(data-badge);
	position: absolute;
	top: -0.5rem;
	right: -0.5rem;
	background-color: #dc2626;
	color: white;
	font-size: 0.75rem;
	font-weight: 600;
	min-width: 1.25rem;
	height: 1.25rem;
	border-radius: 0.625rem;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 0.25rem;
}

/* Action buttons */
.action-buttons {
	display: flex;
	gap: 0.25rem;
}

.action-button {
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	border: 1px solid #e5e7eb;
	background-color: white;
	color: #6b7280;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s ease;
}

.action-button:hover {
	background-color: #f3f4f6;
	color: #374151;
	border-color: #d1d5db;
}

/* Progress bar */
.progress-container {
	margin-top: 1rem;
	height: 0.5rem;
	background-color: #e5e7eb;
	border-radius: 0.25rem;
	overflow: hidden;
}

.progress-bar {
	height: 100%;
	background: linear-gradient(90deg, #3b82f6, #8b5cf6);
	border-radius: 0.25rem;
	position: relative;
	transition: width 0.5s ease;
}

.progress-text {
	position: absolute;
	right: 0.25rem;
	top: 50%;
	transform: translateY(-50%);
	font-size: 0.625rem;
	color: white;
	font-weight: 600;
}

/* Tooltip */
.tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	margin-bottom: 0.5rem;
	padding: 0.5rem 0.75rem;
	background-color: #1f2937;
	color: white;
	font-size: 0.75rem;
	border-radius: 0.375rem;
	white-space: nowrap;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.2s ease, visibility 0.2s ease;
	z-index: 10;
}

.metric-card:hover .tooltip {
	opacity: 1;
	visibility: visible;
}

.tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	border-width: 0.25rem;
	border-style: solid;
	border-color: #1f2937 transparent transparent transparent;
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

/* Responsive design */
@media (max-width: 768px) {
	.card-content {
		flex-direction: column;
		align-items: stretch;
	}
	
	.icon-container {
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		margin-top: 1rem;
	}
	
	.metric-value {
		font-size: 1.875rem;
	}
	
	.metric-card.large .metric-value {
		font-size: 2.25rem;
	}
}

@media (max-width: 480px) {
	.metric-card {
		padding: 1rem;
	}
	
	.metric-value {
		font-size: 1.5rem;
	}
	
	.icon-wrapper {
		width: 2.5rem;
		height: 2.5rem;
	}
	
	.icon {
		font-size: 1.25rem;
	}
	
	.toggle-container {
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25rem;
	}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
	.metric-card {
		background-color: #1f2937;
		border-color: #374151;
		color: #f3f4f6;
	}
	
	.metric-title {
		color: #9ca3af;
	}
	
	.metric-value {
		color: #f9fafb;
	}
	
	.metric-card.interactive.active {
		background-color: #111827;
	}
	
	.action-button {
		background-color: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.action-button:hover {
		background-color: #4b5563;
		color: #f3f4f6;
	}
	
	.progress-container {
		background-color: #374151;
	}
}
</style>