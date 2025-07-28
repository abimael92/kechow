<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
	category: {
		type: Object as () => { id: string; name: string; icon: string },
		required: true,
	},
	selected: Boolean,
});
</script>

<template>
	<button
		class="chip flex flex-col items-center gap-1"
		:class="{ 'bg-primary/20': selected }"
	>
		<span>{{ category.name }}</span>
		<img
			:src="category.icon"
			alt="category icon"
			class="w-6 h-6 text-primary"
		/>
	</button>
</template>
