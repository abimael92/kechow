<script setup>
defineProps({
	name: String,
	size: {
		type: String,
		default: '6',
	},
});
</script>

<template>
	<component :is="name" :class="`w-${size} h-${size}`" />
</template>
