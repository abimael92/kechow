<template>
	<div class="empty-state p-4 sm:p-6 md:p-8 text-center min-w-0" role="status" aria-label="Estado vacío">
		<div class="empty-state__icon flex justify-center mb-3 sm:mb-4" aria-hidden="true">
			<i :class="[icon, 'text-3xl sm:text-4xl text-gray-400 dark:text-gray-500 flex-shrink-0']"></i>
		</div>
		<h3 class="empty-state__title text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words mb-1 sm:mb-2">{{ title }}</h3>
		<p v-if="description" class="empty-state__description text-sm sm:text-base text-gray-600 dark:text-gray-400 break-words max-w-sm mx-auto mb-4 sm:mb-5 leading-relaxed">{{ description }}</p>
		<div v-if="$slots.action" class="empty-state__action flex justify-center flex-wrap gap-2 sm:gap-3">
			<slot name="action" />
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		description?: string;
		icon?: string;
	}>(),
	{ icon: 'ri-inbox-line' }
);
</script>

<style scoped>
/* Responsive padding and text handled by Tailwind in template */
</style>
