<template>
	<router-link
		:to="to"
		class="flex items-center min-h-[44px] min-w-0 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors gap-2 break-words"
		active-class="bg-blue-100 dark:bg-blue-900 dark:text-white"
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
