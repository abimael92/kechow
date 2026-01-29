<template>
	<div
		v-if="!isOnline"
		class="network-banner"
		role="alert"
		aria-live="polite"
	>
		<i class="ri-wifi-off-line network-banner__icon" aria-hidden="true"></i>
		<span class="network-banner__text">{{ props.message }}</span>
	</div>
</template>

<script setup lang="ts">
import { useOnline } from '@shared/composables/useOnline';

const props = withDefaults(
	defineProps<{ message?: string }>(),
	{ message: "You're offline. Some actions are unavailable." }
);

const { isOnline } = useOnline();
</script>

<style scoped>
.network-banner {
	position: sticky;
	top: 0;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	background: #f59e0b;
	color: #1f2937;
	font-size: 0.875rem;
	font-weight: 600;
	box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}
.network-banner__icon {
	font-size: 1.25rem;
	flex-shrink: 0;
}
.network-banner__text {
	line-height: 1.4;
}
</style>
