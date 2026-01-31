<template>
	<router-link
		:to="to"
		class="flex items-center min-h-[44px] px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
		active-class="bg-blue-100 dark:bg-blue-900 dark:text-white"
	>
		<span class="material-icons-outlined text-base mr-1 flex-shrink-0">{{ icon }}</span>
		<slot />
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
