<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';

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
			class="w-full min-w-0 px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-colors"
			aria-label="Buscar comida, restaurantes o categorías"
		/>
		<div
			class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none flex-shrink-0"
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
