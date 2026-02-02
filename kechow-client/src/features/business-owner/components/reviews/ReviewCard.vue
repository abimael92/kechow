<template>
	<div 
		class="review-card"
		:class="{
			'verified': review.verified,
			'has-response': review.response,
			[cardSize]: true,
			'featured': (review as any).featured,
			'flagged': isFlagged,
			'pinned': isPinned,
			'interactive': interactive,
			'highlighted': isHelpfulClicked
		}"
		:data-review-id="review.id"
	>
		<!-- Header with user info and actions -->
		<div class="review-header">
			<div class="user-info">
				<div class="avatar-container">
					<div 
						class="user-avatar"
						:class="avatarBgColor"
						:aria-label="t('userAvatar', { name: review.customerName })"
					>
						<i :class="avatarIcon" class="avatar-icon"></i>
					</div>
				</div>
				
				<div class="user-details">
					<div class="name-and-badges">
						<h4 class="user-name">
							{{ review.customerName }}
						</h4>
						<div class="user-badges">
							<!-- Verified purchase badge -->
							<span 
								v-if="review.verified" 
								class="verified-badge"
								:aria-label="t('verifiedPurchase')"
							>
								<i class="ri-check-double-fill"></i>
								<span class="badge-text">{{ t('verified') }}</span>
							</span>
							
							<!-- Repeat customer badge -->
							<span 
								v-if="(review as any).repeatCustomer" 
								class="repeat-badge"
								:aria-label="t('repeatCustomer')"
							>
								<i class="ri-history-fill"></i>
								<span class="badge-text">{{ t('regular') }}</span>
							</span>
							
							<!-- Location badge -->
							<span 
								v-if="(review as any).location" 
								class="location-badge"
								:aria-label="t('customerLocation', { location: (review as any).location })"
							>
								<i class="ri-map-pin-2-fill"></i>
								<span class="badge-text">{{ (review as any).location }}</span>
							</span>
						</div>
					</div>
					
					<!-- Rating and date -->
					<div class="rating-and-date">
						<div class="star-rating" :aria-label="`${review.rating} ${t('outOf5Stars')}`">
							<i
								v-for="star in 5"
								:key="star"
								:class="[
									star <= review.rating ? 'ri-star-fill' : 'ri-star-line',
									star <= review.rating && star > Math.floor(review.rating) ? 'ri-star-half-fill' : '',
									'star-icon',
								]"
								:aria-hidden="true"
							></i>
							<span class="rating-text">{{ review.rating.toFixed(1) }}</span>
						</div>
						
						<div class="review-meta">
							<span class="review-date">
								<i class="ri-calendar-line"></i>
								{{ formattedDate }}
							</span>
							
						<span v-if="(review as any).visitTime" class="visit-time">
							<i class="ri-time-line"></i>
							{{ (review as any).visitTime }}
								{{ calculateReadTime }} {{ t('minRead') }}
							</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- Action menu -->
			<div class="action-menu">
				<button
					ref="menuButton"
					@click="toggleMenu"
					class="menu-button"
					:aria-expanded="menuOpen"
					:aria-label="t('moreOptions')"
					:aria-controls="`menu-${review.id}`"
				>
					<i class="ri-more-2-fill"></i>
				</button>
				
				<!-- Dropdown menu -->
				<div 
					v-if="menuOpen" 
					:id="`menu-${review.id}`"
					class="dropdown-menu"
					ref="menu"
					@click.stop
				>
					<button @click="pinReview" class="menu-item">
						<i :class="isPinned ? 'ri-pushpin-fill' : 'ri-pushpin-line'"></i>
						{{ isPinned ? t('unpinReview') : t('pinReview') }}
					</button>
					
					<button @click="toggleFlag" class="menu-item">
						<i :class="isFlagged ? 'ri-flag-fill' : 'ri-flag-line'"></i>
						{{ isFlagged ? t('removeFlag') : t('flagReview') }}
					</button>
					
					<button v-if="!review.response" @click="emitReply" class="menu-item">
						<i class="ri-reply-line"></i>
						{{ t('reply') }}
					</button>
					
					<button v-if="review.response" @click="emitEditResponse" class="menu-item">
						<i class="ri-edit-line"></i>
						{{ t('editResponse') }}
					</button>
					
					<button @click="emitShare" class="menu-item">
						<i class="ri-share-line"></i>
						{{ t('shareReview') }}
					</button>
					
					<button @click="emitDelete" class="menu-item delete-item">
						<i class="ri-delete-bin-line"></i>
						{{ t('deleteReview') }}
					</button>
				</div>
			</div>
		</div>

		<!-- Review content -->
		<div class="review-content">
			<!-- Review title (optional) -->
			<h3 v-if="(review as any).title" class="review-title">
				{{ (review as any).title }}
			</h3>
			
			<!-- Main comment with expand/collapse -->
			<div class="comment-container">
				<p 
					class="review-comment"
					:class="{ 'expanded': isExpanded, 'truncated': !isExpanded && shouldTruncate }"
					ref="comment"
				>
					{{ review.comment }}
				</p>
				
				<!-- Show more/less toggle -->
				<button 
					v-if="shouldTruncate"
					@click="toggleExpand"
					class="expand-toggle"
					:aria-expanded="isExpanded"
				>
					{{ isExpanded ? t('showLess') : t('readMore') }}
					<i :class="isExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
				</button>
			</div>

			<!-- Order items -->
			<div v-if="review.orderItems && review.orderItems.length > 0" class="order-items">
				<p class="order-items-label">
					<i class="ri-restaurant-line"></i>
					{{ t('orderedItems') }}:
				</p>
				<div class="items-grid">
					<div
						v-for="(item, index) in review.orderItems"
						:key="index"
						class="order-item"
						:class="getItemClass(item)"
					>
						<i :class="getItemIcon(item)" class="item-icon"></i>
						<span class="item-name">{{ item }}</span>
						<!-- Popular item badge -->
						<span 
							v-if="isPopularItem(item)" 
							class="popular-badge"
							:title="t('popularItem')"
						>
							<i class="ri-fire-fill"></i>
						</span>
					</div>
				</div>
			</div>

			<!-- Photos/Videos -->
			<div v-if="(review as any).media && (review as any).media.length > 0" class="review-media">
				<p class="media-label">
					<i class="ri-image-line"></i>
					{{ t('photosVideos') }} ({{ (review as any).media.length }})
				</p>
				<div class="media-grid">
					<div
						v-for="(media, index) in (review as any).media"
						:key="index"
						class="media-item"
						@click="openMediaViewer(Number(index))"
					>
						<img 
							v-if="media.type === 'image'" 
							:src="media.url" 
							:alt="t('reviewPhoto')"
							class="media-thumbnail"
						>
						<div v-else class="video-thumbnail">
							<i class="ri-play-circle-fill"></i>
							<span>{{ t('video') }}</span>
						</div>
						<!-- Media count overlay -->
						<div v-if="(review as any).media.length > 3 && index === 2" class="media-count">
							+{{ (review as any).media.length - 3 }}
						</div>
					</div>
				</div>
			</div>

			<!-- Restaurant response -->
			<div 
				v-if="review.response" 
				class="restaurant-response"
				:class="{ 'expanded': isResponseExpanded }"
			>
				<div class="response-header" @click="toggleResponseExpand">
					<div class="response-badge">
						<i class="ri-store-2-fill"></i>
						<span class="response-label">{{ t('restaurantResponse') }}</span>
						<span class="response-time">
							<i class="ri-time-line"></i>
							{{ t('recently') }}
						</span>
					</div>
					<button class="expand-response-button">
						<i :class="isResponseExpanded ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'"></i>
					</button>
				</div>
				
				<div class="response-content">
					<p class="response-text">{{ review.response }}</p>
					
					<!-- Response actions -->
					<div v-if="showResponseActions" class="response-actions">
						<button @click="emitEditResponse" class="response-action">
							<i class="ri-edit-line"></i>
							{{ t('edit') }}
						</button>
						<button @click="emitDeleteResponse" class="response-action delete">
							<i class="ri-delete-bin-line"></i>
							{{ t('deleteResponse') }}
						</button>
					</div>
				</div>
			</div>

			<!-- Review tags -->
			<div v-if="(review as any).tags && (review as any).tags.length > 0" class="review-tags">
				<div class="tags-container">
					<span
						v-for="tag in (review as any).tags"
						:key="tag"
						class="review-tag"
						:class="getTagClass(tag)"
					>
						{{ tag }}
					</span>
				</div>
			</div>
		</div>

		<!-- Footer actions -->
		<div class="review-footer">
			<div class="action-buttons">
				<!-- Helpful button -->
				<button
					@click="toggleHelpful"
					class="action-button helpful-button"
					:class="{ 'active': isHelpfulClicked }"
					:aria-pressed="isHelpfulClicked"
					:aria-label="t('markAsHelpful')"
				>
					<i :class="isHelpfulClicked ? 'ri-thumb-up-fill' : 'ri-thumb-up-line'"></i>
					<span class="action-text">
						{{ t('helpful') }}
					</span>
					<span class="action-count">
						{{ helpfulCount }}
					</span>
				</button>

				<!-- Share button -->
				<button
					@click="emitShare"
					class="action-button share-button"
					:aria-label="t('shareReview')"
				>
					<i class="ri-share-line"></i>
					<span class="action-text">{{ t('share') }}</span>
				</button>

				<!-- Report button -->
				<button
					@click="emitReport"
					class="action-button report-button"
					:class="{ 'reported': isReported }"
					:aria-label="t('reportReview')"
				>
					<i :class="isReported ? 'ri-flag-fill' : 'ri-flag-line'"></i>
					<span class="action-text">{{ t('report') }}</span>
				</button>
			</div>

			<!-- Translate button -->
			<div v-if="showTranslation" class="translation-section">
				<button
					@click="toggleTranslation"
					class="translate-button"
					:aria-label="t('translateReview')"
				>
					<i class="ri-translate-2"></i>
					<span>{{ showOriginal ? t('showOriginal') : t('translate') }}</span>
				</button>
				
				<!-- Language selector -->
				<select
					v-if="showTranslationOptions"
					v-model="selectedLanguage"
					@change="changeLanguage"
					class="language-selector"
					:aria-label="t('selectLanguage')"
				>
					<option value="en">{{ t('english') }}</option>
					<option value="es">{{ t('spanish') }}</option>
					<option value="fr">{{ t('french') }}</option>
					<option value="de">{{ t('german') }}</option>
				</select>
			</div>

			<!-- Reply button -->
			<button
				v-if="!review.response && showReplyButton"
				@click="emitReply"
				class="reply-button"
				:aria-label="t('replyToReview')"
			>
				<i class="ri-reply-line"></i>
				{{ t('reply') }}
			</button>
		</div>

		<!-- Tooltip for helpful count -->
		<div v-if="showHelpfulTooltip" class="helpful-tooltip">
			{{ t('peopleFoundHelpful', { count: helpfulCount }) }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Review } from '../../types';

const { t, locale } = useI18n();

const props = withDefaults(defineProps<{
	review: Review;
	cardSize?: 'small' | 'medium' | 'large';
	avatarBgColor?: string;
	avatarIcon?: string;
	showTranslation?: boolean;
	showReplyButton?: boolean;
	showResponseActions?: boolean;
	interactive?: boolean;
	popularItems?: string[];
}>(), {
	cardSize: 'medium',
	avatarBgColor: 'bg-orange-100',
	avatarIcon: 'ri-user-line',
	showTranslation: false,
	showReplyButton: true,
	showResponseActions: false,
	interactive: true,
	popularItems: () => []
});

const emit = defineEmits<{
	(event: 'reply', reviewId: string): void;
	(event: 'flag', reviewId: string): void;
	(event: 'helpful', reviewId: string): void;
	(event: 'share', reviewId: string): void;
	(event: 'report', reviewId: string): void;
	(event: 'delete', reviewId: string): void;
	(event: 'edit-response', reviewId: string): void;
	(event: 'delete-response', reviewId: string): void;
	(event: 'pin', reviewId: string, pinned: boolean): void;
	(event: 'translate', reviewId: string, language: string): void;
	(event: 'view-media', reviewId: string, index: number): void;
}>();

// Reactive state
const menuOpen = ref(false);
const isExpanded = ref(false);
const isResponseExpanded = ref(true);
const isHelpfulClicked = ref(false);
const isFlagged = ref(false);
const isPinned = ref(false);
const isReported = ref(false);
const showOriginal = ref(true);
const selectedLanguage = ref('es');
const showHelpfulTooltip = ref(false);
const shouldTruncate = ref(false);
const commentElement = ref<HTMLElement | null>(null);
const menu = ref<HTMLElement | null>(null);
const menuButton = ref<HTMLElement | null>(null);

// Computed properties
const formattedDate = computed(() => {
	return new Date(props.review.date).toLocaleDateString(locale.value, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
});

const helpfulCount = computed(() => {
	const baseCount = props.review.helpfulCount || 0;
	return isHelpfulClicked.value ? baseCount + 1 : baseCount;
});

const calculateReadTime = computed(() => {
	const words = props.review.comment.split(' ').length;
	const minutes = Math.ceil(words / 200); // 200 words per minute
	return minutes > 0 ? minutes : 1;
});

const showTranslationOptions = computed(() => {
	return props.showTranslation && !showOriginal.value;
});

// Methods
const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString(locale.value, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
};

const toggleMenu = () => {
	menuOpen.value = !menuOpen.value;
};

const toggleExpand = () => {
	isExpanded.value = !isExpanded.value;
};

const toggleResponseExpand = () => {
	isResponseExpanded.value = !isResponseExpanded.value;
};

const toggleHelpful = () => {
	isHelpfulClicked.value = !isHelpfulClicked.value;
	emit('helpful', props.review.id);
	
	// Show tooltip
	showHelpfulTooltip.value = true;
	setTimeout(() => {
		showHelpfulTooltip.value = false;
	}, 2000);
};

const toggleFlag = () => {
	isFlagged.value = !isFlagged.value;
	emit('flag', props.review.id);
	menuOpen.value = false;
};

const pinReview = () => {
	isPinned.value = !isPinned.value;
	emit('pin', props.review.id, isPinned.value);
	menuOpen.value = false;
};

const toggleTranslation = () => {
	showOriginal.value = !showOriginal.value;
	if (!showOriginal.value) {
		emit('translate', props.review.id, selectedLanguage.value);
	}
};

const changeLanguage = () => {
	emit('translate', props.review.id, selectedLanguage.value);
};

const isPopularItem = (item: string) => {
	return props.popularItems.includes(item);
};

const getItemClass = (item: string) => {
	if (isPopularItem(item)) return 'popular-item';
	return '';
};

const getItemIcon = (item: string) => {
	if (item.toLowerCase().includes('discada')) return 'ri-fire-fill';
	if (item.toLowerCase().includes('tortilla')) return 'ri-bread-fill';
	if (item.toLowerCase().includes('carne')) return 'ri-dribbble-fill';
	if (item.toLowerCase().includes('queso')) return 'ri-cheese-fill';
	return 'ri-restaurant-2-line';
};

const getTagClass = (tag: string) => {
	const tagLower = tag.toLowerCase();
	if (tagLower.includes('recomendado') || tagLower.includes('excelente')) return 'tag-positive';
	if (tagLower.includes('regular') || tagLower.includes('normal')) return 'tag-neutral';
	return 'tag-default';
};

const openMediaViewer = (index: number) => {
	emit('view-media', props.review.id, index);
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

const emitShare = () => {
	emit('share', props.review.id);
};

const emitReport = () => {
	isReported.value = true;
	emit('report', props.review.id);
};

const emitDelete = () => {
	emit('delete', props.review.id);
};

const emitEditResponse = () => {
	emit('edit-response', props.review.id);
};

const emitDeleteResponse = () => {
	emit('delete-response', props.review.id);
};

// Check if comment should be truncated
const checkTruncation = () => {
	if (commentElement.value) {
		const lineHeight = parseInt(getComputedStyle(commentElement.value).lineHeight);
		const maxHeight = lineHeight * 3; // 3 lines
		shouldTruncate.value = commentElement.value.scrollHeight > maxHeight;
	}
};

// Close menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
	if (menuOpen.value && menu.value && menuButton.value) {
		if (!menu.value.contains(event.target as Node) && !menuButton.value.contains(event.target as Node)) {
			menuOpen.value = false;
		}
	}
};

// Lifecycle
onMounted(() => {
	nextTick(() => {
		checkTruncation();
	});
	
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});

// Watch for locale changes
watch(locale, () => {
	// Refresh any localized content
});
</script>

<style scoped>
/* Base card styles */
.review-card {
	background: var(--color-card);
	border-radius: 1rem;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	padding: 1.5rem;
	transition: all 0.3s ease;
	position: relative;
}

.review-card.interactive:hover {
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	transform: translateY(-2px);
}

.review-card.featured {
	border-color: #f59e0b;
	box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
}

.review-card.flagged {
	border-color: #ef4444;
	background-color: #fef2f2;
}

.review-card.pinned {
	border-color: #8b5cf6;
	position: relative;
}

.review-card.pinned::before {
	content: '';
	position: absolute;
	top: -1px;
	left: -1px;
	right: -1px;
	height: 4px;
	background: linear-gradient(90deg, #8b5cf6, #3b82f6);
	border-radius: 1rem 1rem 0 0;
}

.review-card.highlighted {
	animation: highlightPulse 2s ease;
}

/* Card sizes */
.review-card.small {
	padding: 1rem;
}

.review-card.medium {
	padding: 1.5rem;
}

.review-card.large {
	padding: 2rem;
}

/* Review header */
.review-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 1rem;
}

.user-info {
	display: flex;
	gap: 1rem;
	align-items: flex-start;
	flex: 1;
}

.avatar-container {
	position: relative;
}

.user-avatar {
	width: 3rem;
	height: 3rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.review-card.small .user-avatar {
	width: 2.5rem;
	height: 2.5rem;
}

.review-card.large .user-avatar {
	width: 4rem;
	height: 4rem;
}

.avatar-icon {
	font-size: 1.5rem;
	color: #ea580c;
}

.online-indicator {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 0.75rem;
	height: 0.75rem;
	background-color: #10b981;
	border: 2px solid white;
	border-radius: 50%;
}

.premium-badge {
	position: absolute;
	top: -0.25rem;
	right: -0.25rem;
	background: linear-gradient(135deg, #f59e0b, #d97706);
	color: white;
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
}

.user-details {
	flex: 1;
	min-width: 0;
}

.name-and-badges {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
	margin-bottom: 0.5rem;
}

.user-name {
	font-weight: 600;
	color: #111827;
	font-size: 1rem;
	margin: 0;
}

.user-badges {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
}

.verified-badge {
	background-color: #d1fae5;
	color: #059669;
	padding: 0.25rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}

.repeat-badge {
	background-color: #f0f9ff;
	color: #3b82f6;
	padding: 0.25rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}

.location-badge {
	background-color: #f3f4f6;
	color: #6b7280;
	padding: 0.25rem 0.5rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
}

.badge-text {
	display: inline;
}

.rating-and-date {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
}

.star-rating {
	display: flex;
	align-items: center;
	gap: 0.125rem;
}

.star-icon {
	color: #fbbf24;
	font-size: 1rem;
}

.rating-text {
	font-size: 0.875rem;
	font-weight: 600;
	color: #111827;
	margin-left: 0.25rem;
}

.review-meta {
	display: flex;
	gap: 1rem;
	align-items: center;
	color: #6b7280;
	font-size: 0.875rem;
}

.review-meta i {
	font-size: 0.875rem;
	margin-right: 0.25rem;
}

/* Action menu */
.action-menu {
	position: relative;
}

.menu-button {
	width: 2rem;
	height: 2rem;
	border-radius: 0.5rem;
	border: none;
	background: none;
	color: #9ca3af;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s;
}

.menu-button:hover {
	background-color: #f3f4f6;
	color: #374151;
}

.dropdown-menu {
	position: absolute;
	top: 100%;
	right: 0;
	background: var(--color-card);
	border-radius: 0.75rem;
	box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
	border: 1px solid #e5e7eb;
	min-width: 12rem;
	z-index: 50;
	margin-top: 0.5rem;
	overflow: hidden;
}

.menu-item {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	width: 100%;
	padding: 0.75rem 1rem;
	border: none;
	background: none;
	color: #374151;
	font-size: 0.875rem;
	cursor: pointer;
	transition: background-color 0.2s;
	text-align: left;
}

.menu-item:hover {
	background-color: #f9fafb;
}

.menu-item i {
	font-size: 1rem;
	color: #6b7280;
}

.delete-item {
	color: #dc2626;
}

.delete-item:hover {
	background-color: #fef2f2;
}

.delete-item i {
	color: #dc2626;
}

/* Review content */
.review-content {
	margin-bottom: 1.5rem;
}

.review-title {
	font-size: 1.25rem;
	font-weight: 600;
	color: #111827;
	margin: 0 0 0.75rem 0;
}

.comment-container {
	position: relative;
}

.review-comment {
	color: #374151;
	line-height: 1.6;
	margin: 0 0 1rem 0;
	white-space: pre-line;
}

.review-comment.truncated {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.expand-toggle {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	background: none;
	border: none;
	color: #3b82f6;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	padding: 0.25rem 0.5rem;
	margin-top: 0.5rem;
	border-radius: 0.375rem;
	transition: background-color 0.2s;
}

.expand-toggle:hover {
	background-color: #f0f9ff;
}

/* Order items */
.order-items {
	margin-top: 1rem;
}

.order-items-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
	margin-bottom: 0.75rem;
}

.items-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.order-item {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	background-color: #f3f4f6;
	padding: 0.5rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.875rem;
	color: #374151;
	position: relative;
}

.order-item.popular-item {
	background-color: #fef3c7;
	color: #92400e;
}

.item-icon {
	font-size: 1rem;
	color: #9ca3af;
}

.order-item.popular-item .item-icon {
	color: #d97706;
}

.popular-badge {
	position: absolute;
	top: -0.25rem;
	right: -0.25rem;
	background-color: #dc2626;
	color: white;
	width: 1rem;
	height: 1rem;
	border-radius: 50%;
	font-size: 0.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
}

/* Media gallery */
.review-media {
	margin-top: 1.5rem;
}

.media-label {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
	margin-bottom: 0.75rem;
}

.media-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
	gap: 0.5rem;
}

.media-item {
	position: relative;
	border-radius: 0.75rem;
	overflow: hidden;
	cursor: pointer;
	aspect-ratio: 1;
}

.media-thumbnail {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s;
}

.media-thumbnail:hover {
	transform: scale(1.05);
}

.video-thumbnail {
	width: 100%;
	height: 100%;
	background-color: #3b82f6;
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0.25rem;
}

.video-thumbnail i {
	font-size: 1.5rem;
}

.media-count {
	position: absolute;
	inset: 0;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.25rem;
	font-weight: 600;
}

/* Restaurant response */
.restaurant-response {
	background-color: #fffbeb;
	border: 1px solid #fcd34d;
	border-radius: 0.75rem;
	padding: 1rem;
	margin-top: 1.5rem;
}

.response-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.response-badge {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	color: #92400e;
	font-weight: 600;
	font-size: 0.875rem;
}

.response-badge i {
	font-size: 1rem;
}

.response-time {
	color: #d97706;
	font-size: 0.75rem;
	font-weight: normal;
	margin-left: 1rem;
}

.expand-response-button {
	background: none;
	border: none;
	color: #92400e;
	cursor: pointer;
	padding: 0.25rem;
	border-radius: 0.375rem;
}

.expand-response-button:hover {
	background-color: rgba(245, 158, 11, 0.1);
}

.response-content {
	margin-top: 0.75rem;
}

.response-text {
	color: #92400e;
	line-height: 1.6;
	margin: 0 0 1rem 0;
}

.restaurant-response:not(.expanded) .response-content {
	display: none;
}

.response-actions {
	display: flex;
	gap: 0.75rem;
}

.response-action {
	display: inline-flex;
	align-items: center;
	gap: 0.25rem;
	background: none;
	border: 1px solid #fbbf24;
	color: #92400e;
	padding: 0.375rem 0.75rem;
	border-radius: 0.5rem;
	font-size: 0.75rem;
	cursor: pointer;
	transition: all 0.2s;
}

.response-action:hover {
	background-color: #fbbf24;
	color: #92400e;
}

.response-action.delete {
	border-color: #fca5a5;
	color: #dc2626;
}

.response-action.delete:hover {
	background-color: #fca5a5;
	color: #dc2626;
}

/* Review tags */
.review-tags {
	margin-top: 1rem;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.review-tag {
	padding: 0.25rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 500;
}

.tag-positive {
	background-color: #d1fae5;
	color: #059669;
}

.tag-neutral {
	background-color: #f3f4f6;
	color: #6b7280;
}

.tag-default {
	background-color: #f0f9ff;
	color: #3b82f6;
}

/* Footer actions */
.review-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 1rem;
	padding-top: 1rem;
	border-top: 1px solid #e5e7eb;
}

.action-buttons {
	display: flex;
	gap: 0.5rem;
}

.action-button {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.5rem 0.75rem;
	border-radius: 0.75rem;
	border: 1px solid #e5e7eb;
	background: var(--color-card);
	color: #6b7280;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.action-button:hover {
	background-color: #f9fafb;
	border-color: #d1d5db;
}

.action-button.active {
	background-color: #3b82f6;
	color: white;
	border-color: #3b82f6;
}

.action-button.active:hover {
	background-color: #2563eb;
}

.action-count {
	font-weight: 600;
}

.share-button:hover {
	background-color: #f0f9ff;
	color: #3b82f6;
	border-color: #3b82f6;
}

.report-button {
	color: #ef4444;
}

.report-button:hover {
	background-color: #fef2f2;
	border-color: #fca5a5;
}

.report-button.reported {
	background-color: #fef2f2;
	color: #dc2626;
	border-color: #fca5a5;
}

/* Translation section */
.translation-section {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.translate-button {
	display: flex;
	align-items: center;
	gap: 0.375rem;
	padding: 0.375rem 0.75rem;
	background: none;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	color: #6b7280;
	font-size: 0.875rem;
	cursor: pointer;
	transition: all 0.2s;
}

.translate-button:hover {
	background-color: #f9fafb;
	border-color: #9ca3af;
}

.language-selector {
	padding: 0.375rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.5rem;
	background: var(--color-card);
	color: #374151;
	font-size: 0.875rem;
	cursor: pointer;
}

.language-selector:focus {
	outline: none;
	border-color: #3b82f6;
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Reply button */
.reply-button {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: linear-gradient(135deg, #f59e0b, #ea580c);
	color: white;
	border: none;
	border-radius: 0.75rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s;
	box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
}

.reply-button:hover {
	transform: translateY(-1px);
	box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
}

/* Tooltip */
.helpful-tooltip {
	position: absolute;
	bottom: 100%;
	left: 0;
	margin-bottom: 0.5rem;
	padding: 0.5rem 0.75rem;
	background-color: #374151;
	color: white;
	font-size: 0.75rem;
	border-radius: 0.5rem;
	white-space: nowrap;
	z-index: 10;
	animation: fadeIn 0.2s ease;
}

.helpful-tooltip::after {
	content: '';
	position: absolute;
	top: 100%;
	left: 1rem;
	border-width: 0.375rem;
	border-style: solid;
	border-color: #374151 transparent transparent transparent;
}

/* Animations */
@keyframes highlightPulse {
	0% {
		box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
	}
	70% {
		box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
	}
	100% {
		box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(0.5rem);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

/* Responsive design */
@media (max-width: 768px) {
	.review-header {
		flex-direction: column;
		gap: 1rem;
	}
	
	.action-menu {
		align-self: flex-end;
	}
	
	.user-info {
		width: 100%;
	}
	
	.review-footer {
		flex-direction: column;
		align-items: stretch;
	}
	
	.translation-section {
		justify-content: center;
	}
	
	.reply-button {
		width: 100%;
		justify-content: center;
	}
}

@media (max-width: 640px) {
	.user-details {
		width: 100%;
	}
	
	.name-and-badges {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.rating-and-date {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.media-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	
	.action-buttons {
		width: 100%;
		justify-content: center;
	}
}

@media (max-width: 480px) {
	.review-card {
		padding: 1rem;
	}
	
	.user-avatar {
		width: 2.5rem;
		height: 2.5rem;
	}
	
	.avatar-icon {
		font-size: 1.25rem;
	}
	
	.user-badges {
		flex-direction: column;
		align-items: flex-start;
	}
	
	.media-grid {
		grid-template-columns: repeat(2, 1fr);
	}
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
	.review-card {
		background-color: #1f2937;
		border-color: #374151;
		color: #f3f4f6;
	}
	
	.user-name {
		color: #f9fafb;
	}
	
	.review-comment {
		color: #d1d5db;
	}
	
	.order-item {
		background-color: #374151;
		color: #d1d5db;
	}
	
	.order-item.popular-item {
		background-color: #92400e;
		color: #fef3c7;
	}
	
	.restaurant-response {
		background-color: #451a03;
		border-color: #92400e;
	}
	
	.response-text {
		color: #fef3c7;
	}
	
	.action-button {
		background-color: #374151;
		border-color: #4b5563;
		color: #d1d5db;
	}
	
	.action-button:hover {
		background-color: #4b5563;
	}
	
	.action-button.active {
		background-color: #3b82f6;
		color: white;
	}
}
</style>