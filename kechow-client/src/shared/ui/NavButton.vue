<template>
	<router-link
		:to="to"
		class="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700"
		active-class="bg-blue-100 dark:bg-blue-900"
	>
		<span class="material-icons-outlined text-base mr-1">{{ icon }}</span>
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
