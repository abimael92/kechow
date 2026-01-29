<template>
	<div
		:class="['skeleton', variantClass, roundedClass]"
		:style="style"
		role="presentation"
		aria-hidden="true"
	/>
</template>

<script setup lang="ts">
import { computed } from 'vue';

/** Skeleton loader: performance-safe, respects prefers-reduced-motion. */
const props = withDefaults(
	defineProps<{
		width?: string;
		height?: string;
		variant?: 'text' | 'avatar' | 'card' | 'block';
		rounded?: 'none' | 'sm' | 'md' | 'full';
	}>(),
	{ variant: 'block', rounded: 'md' }
);

const style = computed(() => {
	const w = props.width;
	const h =
		props.height ??
		(props.variant === 'text'
			? '1em'
			: props.variant === 'avatar'
				? '2.5rem'
				: props.variant === 'card'
					? '12rem'
					: '4rem');
	return {
		width: w ?? (props.variant === 'avatar' ? '2.5rem' : undefined),
		height: h,
	};
});

const variantClass = computed(() => {
	switch (props.variant) {
		case 'text':
			return 'h-4';
		case 'avatar':
			return 'rounded-full';
		case 'card':
			return 'h-48';
		default:
			return '';
	}
});

const roundedClass = computed(() => {
	switch (props.rounded) {
		case 'none':
			return 'rounded-none';
		case 'sm':
			return 'rounded';
		case 'full':
			return 'rounded-full';
		default:
			return 'rounded-lg';
	}
});
</script>
