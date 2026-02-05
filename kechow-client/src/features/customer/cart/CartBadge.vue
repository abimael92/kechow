<template>
	<button
		type="button"
		class="relative flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-xl text-primary-500 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-colors"
		:aria-label="`Ver carrito, ${itemCount} artículo${itemCount !== 1 ? 's' : ''}`"
		@click="handleClick"
	>
		<svg
			class="w-6 h-6 sm:w-7 sm:h-7"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
			/>
		</svg>
		<span
			v-if="itemCount > 0"
			class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-primary-500 text-white text-xs font-bold"
		>
			{{ itemCount > 99 ? '99+' : itemCount }}
		</span>
	</button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useCartStore } from './cart.store';
import { useCartPanel } from './useCartPanel';

const props = withDefaults(
	defineProps<{ useOverlay?: boolean }>(),
	{ useOverlay: true }
);

const router = useRouter();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);
const { openCartPanel } = useCartPanel();

function handleClick() {
	if (props.useOverlay) {
		openCartPanel();
	} else {
		router.push({ name: 'CartPage' });
	}
}
</script>
