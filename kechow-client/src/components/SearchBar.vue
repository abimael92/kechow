<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits(['update:search']);
const search = ref('');

watch(search, (val) => {
	emit('update:search', val);
});
</script>

<template>
	<div class="relative w-full min-w-0">
		<input
			v-model="search"
			type="search"
			placeholder="Buscar comida, restaurantes, categorías…"
			class="w-full min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base text-secondary-900 dark:text-secondary-100 bg-card border border-secondary-300 dark:border-secondary-600 rounded-input placeholder-secondary-400 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-colors"
			aria-label="Buscar comida, restaurantes o categorías"
		/>
		<div
			class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 pointer-events-none flex-shrink-0"
			aria-hidden="true"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-4 h-4 sm:w-5 sm:h-5"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
		</div>
	</div>
</template>
