<template>
	<div
		v-if="!isOnline"
		class="sticky top-0 z-50 flex items-center justify-center gap-2 py-3 px-4 min-h-[44px] bg-amber-500 text-gray-900 dark:bg-amber-400 dark:text-gray-900 font-semibold text-sm sm:text-base shadow-md"
		role="alert"
		aria-live="polite"
	>
		<i class="ri-wifi-off-line text-lg flex-shrink-0" aria-hidden="true"></i>
		<span class="leading-snug">{{ props.message }}</span>
	</div>
</template>

<script setup lang="ts">
import { useOnline } from '@shared/composables/useOnline';

const props = withDefaults(
	defineProps<{ message?: string }>(),
	{ message: 'Sin conexión. Algunas acciones no están disponibles.' }
);

const { isOnline } = useOnline();
</script>
