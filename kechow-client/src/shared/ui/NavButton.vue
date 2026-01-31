<template>
	<router-link
		:to="to"
		class="flex items-center min-h-[44px] min-w-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-button text-sm sm:text-base font-medium hover:bg-panel text-secondary-900 dark:hover:bg-secondary-700 dark:text-secondary-200 transition-colors gap-2 break-words"
		active-class="bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
	>
		<span v-if="icon" class="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-current" aria-hidden="true">
			<i v-if="icon.startsWith('ri-')" :class="icon" class="text-lg sm:text-xl"></i>
			<span v-else class="material-icons-outlined text-base sm:text-lg">{{ icon }}</span>
		</span>
		<span class="min-w-0 truncate"><slot /></span>
	</router-link>
</template>

<script setup>
defineProps({
	to: {
		type: String,
		required: true,
	},
	icon: {
		type: String,
		default: '',
	},
});
</script>
