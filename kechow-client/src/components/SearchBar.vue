<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue';

const emit = defineEmits(['update:search']);
const search = ref('');

watch(search, (val) => {
	emit('update:search', val);
});
</script>

<template>
	<div class="relative w-full">
		<input
			v-model="search"
			type="search"
			placeholder="Buscar comida, restaurantes, categorías…"
			class="search-input w-full text-black"
		/>
		<div
			class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5"
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
