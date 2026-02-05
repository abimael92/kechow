<template>
	<Teleport to="body">
		<Transition name="overlay">
			<div
				v-if="cartPanelOpen"
				class="fixed inset-0 z-[100] flex"
				role="dialog"
				aria-modal="true"
				aria-label="Carrito"
			>
				<!-- Backdrop -->
				<div
					class="absolute inset-0 bg-black/50"
					aria-hidden="true"
					@click="close"
				/>

				<!-- Panel: mobile bottom sheet, tablet slide-in, desktop modal -->
				<div
					ref="panelRef"
					:class="[
						'relative flex flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto',
						'w-full max-h-[90vh] rounded-t-2xl',
						'md:max-w-md md:ml-auto md:max-h-full md:rounded-none',
						'lg:max-w-lg lg:mx-auto lg:my-8 lg:rounded-2xl lg:max-h-[85vh]',
					]"
				>
					<CartPanel :standalone="false" @close="close" />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import CartPanel from '@/features/customer/containers/CartPanel.vue';
import { useCartPanel } from './useCartPanel';

const { cartPanelOpen, closeCartPanel } = useCartPanel();

function close() {
	closeCartPanel();
}

defineExpose({ close });
</script>

<style scoped>
.overlay-enter-active,
.overlay-leave-active {
	transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
	opacity: 0;
}
.overlay-enter-active .relative,
.overlay-leave-active .relative {
	transition: transform 0.3s ease;
}
.overlay-enter-from .relative,
.overlay-leave-to .relative {
	transform: translateY(100%);
}
@media (min-width: 768px) {
	.overlay-enter-from .relative,
	.overlay-leave-to .relative {
		transform: translateX(100%);
	}
}
@media (min-width: 1024px) {
	.overlay-enter-from .relative,
	.overlay-leave-to .relative {
		transform: scale(0.95);
	}
}
</style>
