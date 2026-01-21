<script setup lang="ts">
const props = defineProps<{
	category: { id: string; name: string; icon: string };
	selected: boolean;
}>();

const emit = defineEmits<{
	(e: 'click'): void;
}>();

function handleClick() {
	emit('click');
}
</script>

<template>
	<button
		@click="handleClick"
		class="flex flex-col items-center min-w-[72px] px-3 py-2 rounded-lg border text-xs text-white sm:text-sm transition-colors duration-200"
		:class="{
			'border-primary text-primary font-semibold': selected,
			'border-gray-200 dark:border-gray-700 bg-primary/200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-purple-200 hover:text-primary':
				!selected,
		}"
	>
		<img :src="category.icon" alt="icon" class="w-6 h-6 mb-1" />
		<span class="whitespace-nowrap">{{ category.name }}</span>
	</button>
</template>
