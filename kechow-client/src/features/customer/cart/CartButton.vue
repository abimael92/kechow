<template>
	<button
		type="button"
		:disabled="disabled || isLoading"
		:aria-label="ariaLabel"
		class="inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-semibold text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
		@click="handleClick"
	>
		<svg
			v-if="isLoading"
			class="animate-spin w-5 h-5"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			/>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
		<svg
			v-else
			class="w-5 h-5 flex-shrink-0"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
			/>
		</svg>
		<span class="truncate">{{ label }}</span>
	</button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore, type MenuItemForCart } from './cart.store';
import { useToast } from 'vue-toastification';

const props = withDefaults(
	defineProps<{
		restaurantId: number;
		menuItem: MenuItemForCart;
		quantity?: number;
		disabled?: boolean;
		label?: string;
	}>(),
	{ quantity: 1, disabled: false, label: 'Añadir al carrito' }
);

const emit = defineEmits<{ added: [] }>();

const cartStore = useCartStore();
const toast = useToast();

const isLoading = computed(() => cartStore.isLoading);

const ariaLabel = computed(
	() => `Añadir ${props.quantity} ${props.menuItem.name} al carrito`
);

async function handleClick() {
	const result = await cartStore.addItem(
		props.restaurantId,
		props.menuItem,
		props.quantity
	);
	if (result.success) {
		emit('added');
	} else if (result.message) {
		toast.warning(result.message);
	}
}
</script>
