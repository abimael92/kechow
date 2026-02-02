<template>
	<div
		class="bg-card dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600"
	>
		<div class="relative">
			<img
				:alt="item.name"
				:src="item.image"
				class="w-full h-40 sm:h-48 object-cover object-top"
				@error="handleImageError"
				loading="lazy"
			/>
			<!-- Category Badge -->
			<div class="absolute top-2 sm:top-3 left-2 sm:left-3">
				<span
					class="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
				>
				{{ $t(`categories.${item.category.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/g, '')}`) || item.category }}
				</span>
			</div>
			
			<!-- Availability Toggle -->
			<div class="absolute top-2 sm:top-3 right-2 sm:right-3">
				<button
					@click="toggleAvailability"
					:class="[
						'w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-sm hover:shadow-md',
						item.available
							? 'bg-green-500 hover:bg-green-600 text-white'
							: 'bg-red-500 hover:bg-red-600 text-white',
					]"
					:aria-label="item.available ? $t('setUnavailable') : $t('setAvailable')"
				>
					<i
						:class="item.available ? 'ri-check-line' : 'ri-close-line'"
						class="text-sm"
					></i>
				</button>
			</div>
			
			<!-- Popular Badge (Optional) -->
			<div 
				v-if="item.isPopular" 
				class="absolute bottom-2 right-2 sm:bottom-3 sm:right-3"
			>
				<span class="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
					<i class="ri-fire-line mr-1"></i> {{ $t('popular') }}
				</span>
			</div>
		</div>

		<div class="p-3 sm:p-4">
			<!-- Item Name and Price -->
			<div class="flex justify-between items-start mb-2">
				<div class="flex-1 min-w-0 mr-2">
					<h3 class="font-semibold text-gray-900 dark:text-white text-base sm:text-lg truncate">
						{{ item.name }}
					</h3>
					<!-- Optional: Item Code/ID -->
					<p v-if="item.code" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
						#{{ item.code }}
					</p>
				</div>
				<span class="font-bold text-orange-600 dark:text-orange-500 text-base sm:text-lg whitespace-nowrap">
					${{ item.price.toFixed(2) }}
				</span>
			</div>

			<!-- Description -->
			<p class="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
				{{ item.description }}
			</p>

			<!-- Additional Information -->
			<div v-if="item.preparationTime || item.calories" class="flex flex-wrap gap-2 mb-3 sm:mb-4">
				<span 
					v-if="item.preparationTime" 
					class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
				>
					<i class="ri-time-line text-xs"></i>
					{{ item.preparationTime }} {{ $t('minutes') }}
				</span>
				<span 
					v-if="item.calories" 
					class="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
				>
					<i class="ri-fire-line text-xs"></i>
					{{ item.calories }} {{ $t('calories') }}
				</span>
				<!-- Allergens/Ingredients Tags -->
				<div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-1">
					<span 
						v-for="tag in item.tags.slice(0, 2)" 
						:key="tag"
						class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded"
					>
						{{ tag }}
					</span>
					<span 
						v-if="item.tags.length > 2" 
						class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded"
					>
						+{{ item.tags.length - 2 }}
					</span>
				</div>
			</div>

			<!-- Bottom Section: Status and Actions -->
			<div class="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
				<!-- Availability Status -->
				<div class="flex items-center space-x-1 sm:space-x-2">
					<span
						:class="[
							'w-2 h-2 sm:w-3 sm:h-3 rounded-full',
							item.available ? 'bg-green-500' : 'bg-red-500',
						]"
					></span>
					<span class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
						{{
							item.available
								? $t('menuItemAvailable')
								: $t('menuItemOutOfStock')
						}}
					</span>
				</div>

				<!-- Action Buttons -->
				<div class="flex space-x-1 sm:space-x-2">
					<button
						@click="emitEdit"
						class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-1.5 sm:p-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
						:title="$t('editItem')"
						:aria-label="$t('editItem')"
					>
						<i class="ri-edit-line text-sm sm:text-base"></i>
						<span class="sr-only sm:not-sr-only sm:ml-1 sm:text-xs">
							{{ $t('edit') }}
						</span>
					</button>
					<button
						@click="emitDelete"
						class="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
						:title="$t('deleteItem')"
						:aria-label="$t('deleteItem')"
					>
						<i class="ri-delete-bin-line text-sm sm:text-base"></i>
						<span class="sr-only sm:not-sr-only sm:ml-1 sm:text-xs">
							{{ $t('delete') }}
						</span>
					</button>
					<!-- More Actions Dropdown (Optional) -->
					<div class="relative" v-if="showMoreActions">
						<button
							@click="toggleMoreActions"
							class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
							:title="$t('moreActions')"
							:aria-label="$t('moreActions')"
						>
							<i class="ri-more-2-line text-sm sm:text-base"></i>
						</button>
						<!-- More Actions Menu -->
						<div 
							v-if="showActionsMenu" 
							class="absolute right-0 bottom-full mb-1 w-32 bg-card dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10"
						>
							<button
								@click="emitDuplicate"
								class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg flex items-center gap-2"
							>
								<i class="ri-file-copy-line"></i> {{ $t('duplicate') }}
							</button>
							<button
								@click="emitViewDetails"
								class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
							>
								<i class="ri-eye-line"></i> {{ $t('viewDetails') }}
							</button>
							<button
								@click="emitShare"
								class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg flex items-center gap-2"
							>
								<i class="ri-share-line"></i> {{ $t('share') }}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Quick Stats (Optional) -->
		<div v-if="showStats && item.stats" 
		     class="border-t border-gray-100 dark:border-gray-700 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50">
			<div class="grid grid-cols-3 gap-1 sm:gap-2 text-center">
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('orders') }}</p>
					<p class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.stats.orders || 0 }}</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('rating') }}</p>
					<p class="font-semibold text-gray-900 dark:text-white text-sm">
						{{ item.stats.rating || 'N/A' }} ⭐
					</p>
				</div>
				<div>
					<p class="text-xs text-gray-500 dark:text-gray-400">{{ $t('stock') }}</p>
					<p class="font-semibold text-gray-900 dark:text-white text-sm">{{ item.stock || $t('unlimited') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { onMounted, onUnmounted } from 'vue';
import type { MenuItem } from '../types';

const { t } = useI18n();

const props = defineProps<{ 
	item: MenuItem;
	showMoreActions?: boolean;
	showStats?: boolean;
}>();

const emit = defineEmits<{
	(event: 'edit', item: MenuItem): void;
	(event: 'delete', item: MenuItem): void;
	(event: 'toggle-availability', item: MenuItem): void;
	(event: 'duplicate', item: MenuItem): void;
	(event: 'view-details', item: MenuItem): void;
	(event: 'share', item: MenuItem): void;
}>();

const defaultImage = ref('https://demofree.sirv.com/nope-not-here.jpg');
const showActionsMenu = ref(false);

// Computed property for responsive image height
const imageStyle = computed(() => {
	return {
		height: 'clamp(120px, 30vw, 192px)',
		objectFit: 'cover' as const,
		objectPosition: 'center' as const,
	};
});

const handleImageError = (event: Event) => {
	const target = event.target as HTMLImageElement;
	target.src = defaultImage.value;
	target.onerror = null; // Prevent infinite loop
};

const emitEdit = () => {
	emit('edit', props.item);
};

const emitDelete = () => {
	if (confirm(t('confirmDelete', { item: props.item.name }))) {
		emit('delete', props.item);
	}
};

const emitDuplicate = () => {
	emit('duplicate', props.item);
	showActionsMenu.value = false;
};

const emitViewDetails = () => {
	emit('view-details', props.item);
	showActionsMenu.value = false;
};

const emitShare = () => {
	emit('share', props.item);
	showActionsMenu.value = false;
};

const toggleAvailability = () => {
	emit('toggle-availability', props.item);
};

const toggleMoreActions = () => {
	showActionsMenu.value = !showActionsMenu.value;
};

// Close actions menu when clicking outside
const closeActionsMenu = (event: MouseEvent) => {
	const target = event.target as HTMLElement;
	if (!target.closest('.relative')) {
		showActionsMenu.value = false;
	}
};

// Add click outside listener
onMounted(() => {
	document.addEventListener('click', closeActionsMenu);
});

onUnmounted(() => {
	document.removeEventListener('click', closeActionsMenu);
});

// Optional: Keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Escape' && showActionsMenu.value) {
		showActionsMenu.value = false;
	}
};

onMounted(() => {
	document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeyDown);
});

</script>

<style scoped>
/* Custom line clamp utility */
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

/* Smooth transitions */
button, div {
	transition: all 0.2s ease;
}

/* Hover effects */
.hover\:shadow-md:hover {
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Responsive text sizing */
@media (max-width: 640px) {
	.text-lg {
		font-size: 1.125rem;
	}
	.text-base {
		font-size: 0.9375rem;
	}
}

/* Touch-friendly targets on mobile */
@media (max-width: 640px) {
	button {
		min-height: 36px;
		min-width: 36px;
	}
}

/* Hide scrollbar but allow scrolling */
.overflow-x-auto::-webkit-scrollbar {
	display: none;
}

.overflow-x-auto {
	-ms-overflow-style: none;
	scrollbar-width: none;
}

/* Image loading animation */
img {
	background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

@keyframes loading {
	0% { background-position: 200% 0; }
	100% { background-position: -200% 0; }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
	img {
		background: linear-gradient(90deg, #2d3748 25%, #4a5568 50%, #2d3748 75%);
	}
}

/* Accessibility focus styles */
button:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Smooth image loading */
img {
	transition: opacity 0.3s ease;
}

img:not([src]) {
	opacity: 0;
}

img[src] {
	opacity: 1;
}
</style>