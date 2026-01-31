<template>
	<div v-if="error" class="error-boundary">
		<div class="error-boundary__card">
			<div class="error-boundary__icon" aria-hidden="true">
				<i class="ri-error-warning-line"></i>
			</div>
			<h2 class="error-boundary__title">{{ title }}</h2>
			<p class="error-boundary__message">{{ message }}</p>
			<div class="error-boundary__actions">
				<button
					type="button"
					class="error-boundary__btn error-boundary__btn--primary min-h-[44px] px-4"
					@click="handleRetry"
				>
					{{ retryLabel }}
				</button>
				<button
					type="button"
					class="error-boundary__btn error-boundary__btn--secondary min-h-[44px] px-4"
					@click="handleReload"
				>
					{{ reloadLabel }}
				</button>
			</div>
		</div>
	</div>
	<slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const props = withDefaults(
	defineProps<{
		title?: string;
		message?: string;
		retryLabel?: string;
		reloadLabel?: string;
	}>(),
	{
		title: 'Algo salió mal',
		message: 'Ocurrió un error inesperado. Puedes intentar de nuevo o recargar la página.',
		retryLabel: 'Reintentar',
		reloadLabel: 'Recargar página',
	}
);

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
	error.value = err;
	return false; // prevent propagation
});

function handleRetry() {
	error.value = null;
}

function handleReload() {
	window.location.reload();
}
</script>

<style scoped>
.error-boundary {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 280px;
	padding: 1rem;
	overflow: auto;
}
.error-boundary__card {
	text-align: center;
	max-width: 24rem;
	min-width: 0;
	padding: 1.5rem;
	background: var(--color-bg-light, #f9fafb);
	border: 1px solid var(--color-text-muted, #e5e7eb);
	border-radius: 0.75rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.dark .error-boundary__card {
	background: var(--color-bg-dark, #1f2937);
	border-color: #374151;
}
.error-boundary__icon {
	font-size: 2.5rem;
	color: #f59e0b;
	margin-bottom: 0.75rem;
}
.error-boundary__title {
	font-size: 1.25rem;
	font-weight: 700;
	color: var(--color-text-primary, #111827);
	margin-bottom: 0.5rem;
}
.dark .error-boundary__title {
	color: #f9fafb;
}
.error-boundary__message {
	font-size: 0.875rem;
	color: var(--color-text-secondary, #6b7280);
	margin-bottom: 1.25rem;
	line-height: 1.5;
}
.error-boundary__actions {
	display: flex;
	gap: 0.75rem;
	justify-content: center;
	flex-wrap: wrap;
}
.error-boundary__btn {
	padding: 0.5rem 1rem;
	border-radius: 0.5rem;
	font-weight: 600;
	font-size: 0.875rem;
	cursor: pointer;
	border: none;
	transition: opacity 0.2s;
}
.error-boundary__btn:focus-visible {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}
.error-boundary__btn--primary {
	background: #7e22ce;
	color: white;
}
.error-boundary__btn--primary:hover {
	background: #6b21a8;
}
.error-boundary__btn--secondary {
	background: transparent;
	color: var(--color-text-primary, #374151);
	border: 1px solid var(--color-text-muted, #d1d5db);
}
.dark .error-boundary__btn--secondary {
	color: #e5e7eb;
	border-color: #4b5563;
}
</style>
