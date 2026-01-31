<template>
	<div class="empty-state" role="status" aria-label="Estado vacío">
		<div class="empty-state__icon" aria-hidden="true">
			<i :class="icon"></i>
		</div>
		<h3 class="empty-state__title">{{ title }}</h3>
		<p v-if="description" class="empty-state__description">{{ description }}</p>
		<div v-if="$slots.action" class="empty-state__action">
			<slot name="action" />
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		title: string;
		description?: string;
		icon?: string;
	}>(),
	{ icon: 'ri-inbox-line' }
);
</script>

<style scoped>
.empty-state {
	text-align: center;
	padding: 2rem 1rem;
}
.empty-state__icon {
	font-size: 3rem;
	color: var(--color-text-quaternary, #9ca3af);
	margin-bottom: 1rem;
}
.dark .empty-state__icon {
	color: #6b7280;
}
.empty-state__title {
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--color-text-primary, #111827);
	margin-bottom: 0.5rem;
}
.dark .empty-state__title {
	color: #f9fafb;
}
.empty-state__description {
	font-size: 0.875rem;
	color: var(--color-text-secondary, #6b7280);
	margin-bottom: 1.25rem;
	max-width: 20rem;
	margin-left: auto;
	margin-right: auto;
	line-height: 1.5;
}
.empty-state__action {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 0.5rem;
}
</style>
