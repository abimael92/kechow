<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { restaurants } from '@/shared/data/restaurants';
import type { MenuItem } from '../types';

const route = useRoute();
const router = useRouter();

// Find restaurant by ID
const restaurantId = computed(() => route.params.id?.toString());
const restaurant = computed(() =>
	restaurants.find((r) => r.id.toString() === restaurantId.value)
);

// Cart state
const cart = ref<Record<number, number>>({});
const showAddedFeedback = ref<number | null>(null); // For item add feedback

onMounted(() => {
	restaurant.value?.menu.forEach((item) => {
		if (!(item.id in cart.value)) cart.value[item.id] = 0;
	});
});

function add(id: number) {
	if (!cart.value[id]) cart.value[id] = 0;

	const item = restaurant.value?.menu.find((i) => i.id === id) as
		| MenuItem
		| undefined;

	const maxQuantity = Math.min(20, item?.stock ?? 0);

	if (cart.value[id] < maxQuantity) {
		cart.value[id]++;

		// Show feedback animation
		showAddedFeedback.value = id;
		setTimeout(() => {
			showAddedFeedback.value = null;
		}, 600);
	}
}

function remove(id: number) {
	if (!cart.value[id]) cart.value[id] = 0;
	cart.value[id] = Math.max(cart.value[id] - 1, 0);
}

function setQuantity(id: number, quantity: number) {
	const item = restaurant.value?.menu.find((i) => i.id === id) as
		| MenuItem
		| undefined;

	const maxQuantity = Math.min(20, item?.stock ?? 20);
	cart.value[id] = Math.max(0, Math.min(quantity, maxQuantity));
}

const totalItems = computed(() =>
	Object.values(cart.value).reduce((a, b) => a + b, 0)
);

const totalPrice = computed(() => {
	return Object.entries(cart.value).reduce((total, [id, quantity]) => {
		const item = restaurant.value?.menu.find((i) => i.id === Number(id));
		return total + (item?.price || 0) * quantity;
	}, 0);
});

// Safe back navigation
function goBack() {
	if (window.history.length > 1) router.back();
	else router.push({ name: 'Home' });
}
</script>

<template>
	<div class="restaurant-detail-root">
	<div v-if="restaurant" class="min-h-screen py-6">
		<div class="max-w-4xl mx-auto px-4 sm:px-6">
			<header class="sticky top-0 z-30 shadow-sm">
				<div class="flex items-center justify-between px-4 py-3">
					<button
						@click="goBack"
						class="flex items-center gap-1 px-3 py-2 text-white-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
						aria-label="Volver"
					>
						<span class="text-lg">←</span>
						<span class="font-medium">Volver</span>
					</button>

					<div class="flex-1 px-4 text-center">
						<h1
							class="text-3xl sm:text-6xl font-extrabold text-gray-900 leading-snug"
						>
							{{ restaurant.name }}
						</h1>
						<p
							class="text-lg sm:text-2xl text-gray-600 mt-2 max-w-2xl mx-auto text-white"
						>
							{{ restaurant.description }}
						</p>
					</div>

					<!-- Cart indicator in header -->
					<div class="relative">
						<button
							@click="router.push({ name: 'CartPage' })"
							class="relative p-2 rounded-lg transition-colors duration-200"
							:class="
								totalItems
									? 'text-primary hover:bg-primary/10'
									: 'text-gray-400'
							"
							aria-label="Ver carrito"
						>
							<!-- Cart Icon -->
							<svg
								class="w-6 h-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								viewBox="0 0 24 24"
							>
								<circle cx="9" cy="21" r="1"></circle>
								<circle cx="20" cy="21" r="1"></circle>
								<path
									d="M1 1h4l2.68 13.39a1 1 0 0 0 1 .61h9a1 1 0 0 0 1-.76l1.38-7.59H6"
								></path>
							</svg>

							<!-- Item count badge -->
							<span
								v-if="totalItems"
								class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
							>
								{{ totalItems }}
							</span>
						</button>
					</div>
				</div>
			</header>

			<!-- BANNER - Improved loading and aspect ratio -->
			<div class="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
				<img
					:src="restaurant.image"
					:alt="restaurant.name"
					class="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
					loading="eager"
				/>
				<img
					:src="restaurant.image"
					:alt="restaurant.name"
					class="relative z-10 mx-auto h-full object-contain"
				/>
				<div class="absolute inset-0 bg-black/20"></div>
			</div>

			<!-- MENU ITEMS - Enhanced interaction feedback -->
			<main class="space-y-4 p-4">
				<div
					v-for="(item, index) in restaurant.menu"
					:key="item.id"
					class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all duration-300 group"
					:class="{ 'ring-2 ring-primary/20': showAddedFeedback === item.id }"
				>
					<div class="flex gap-4 items-start">
						<!-- IMAGE -->
						<!-- :src="item.image || '/images/placeholder-image.png'" -->
						<div class="flex-shrink-0 relative">
							<img
								:src="'/images/placeholder-image.png'"
								:alt="item.name"
								class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow duration-300"
								loading="lazy"
							/>
							<!-- Stock indicator -->
							<div
								v-if="item.stock !== undefined && item.stock < 10"
								class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded"
							>
								Pocas unidades
							</div>
						</div>

						<!-- INFO -->
						<div class="flex-1 min-w-0">
							<div class="flex justify-between items-start gap-2">
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-gray-900 truncate">
										{{ item.name }}
									</h3>
									<p class="text-sm text-gray-600 mt-1 line-clamp-2">
										{{ item.description || 'Hecho al momento y delicioso.' }}
									</p>
								</div>
								<p class="text-lg font-bold text-primary whitespace-nowrap">
									${{ (item.price || 9.99).toFixed(2) }}
								</p>
							</div>

							<!-- CART CONTROLS - Enhanced with quantity input -->
							<div class="flex items-center justify-between mt-3">
								<!-- Stock info -->
								<div class="text-xs text-gray-500">
									<span v-if="'stock' in item">
										{{ item.stock }} disponibles
									</span>
									<span v-else>En existencia</span>
								</div>

								<!-- Controls -->
								<div class="flex items-center gap-3">
									<button
										@click="remove(item.id)"
										:disabled="(cart[item.id] ?? 0) <= 0"
										:aria-label="`Quitar uno: ${item.name}`"
										class="w-[60px] h-8 flex items-center justify-center rounded-full text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
									>
										−
									</button>

									<!-- Quantity input with direct editing -->
									<input
										type="number"
										:value="cart[item.id] || 0"
										@input="
											setQuantity(
												item.id,
												parseInt(($event.target as HTMLInputElement).value) ||
													0
											)
										"
										@blur="
											($event.target as HTMLInputElement).value = String(
												cart[item.id] || 0
											)
										"
										min="0"
										:max="Math.min(20, item.stock ?? 20)"
										class="w-18 text-center border border-gray-300 rounded-md text-lg font-medium text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200"
										aria-label="Quantity"
									/>

									<button
										@click="add(item.id)"
										:disabled="
											(cart[item.id] ?? 0) >= 20 ||
											(item.stock !== undefined &&
												(cart[item.id] ?? 0) >= item.stock)
										"
										:aria-label="`Agregar uno: ${item.name}`"
										class="w-[60px] h-8 flex items-center justify-center rounded-full bg-primary text-white text-lg font-bold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
									>
										+
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<!-- FLOATING CART BAR - Enhanced with price and better positioning -->
			<Transition
				enter-active-class="transition-transform duration-300"
				enter-from-class="translate-y-full"
				enter-to-class="translate-y-0"
				leave-active-class="transition-transform duration-300"
				leave-from-class="translate-y-0"
				leave-to-class="translate-y-full"
			>
				<div
					v-if="totalItems"
					class="fixed bottom-4 left-4 right-4 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 p-4 z-40"
				>
					<div class="flex items-center justify-between">
						<div class="flex-1">
							<p class="font-semibold text-sm">
								{{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}
							</p>
							<p class="text-primary font-bold text-lg">
								${{ totalPrice.toFixed(2) }}
							</p>
						</div>
						<button
							@click="router.push({ name: 'Cart' })"
							class="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-sm flex items-center gap-2"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
								/>
							</svg>
							View Cart
						</button>
					</div>
				</div>
			</Transition>
		</div>
	</div>

	<!-- ERROR STATE - Improved error handling -->
	<div
		v-else
		class="flex flex-col items-center justify-center min-h-screen p-8 text-center"
	>
		<div
			class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"
		>
			<span class="text-4xl">🍕</span>
		</div>
		<h2 class="text-xl font-semibold text-gray-900 mb-2">
			Restaurante no encontrado
		</h2>
		<p class="text-gray-500 mb-6">
			El restaurante que buscas no existe o ha sido eliminado.
		</p>
		<button
			@click="router.push({ name: 'Home' })"
			class="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
		>
			Ver restaurantes
		</button>
	</div>
	</div>
</template>

<style scoped>
/* Custom scrollbar for better mobile experience */
@media (max-width: 640px) {
	.space-y-4 > * + * {
		margin-top: 1rem;
	}
}

/* Improve touch targets for mobile */
button,
input {
	min-height: 44px;
	min-width: 44px;
}

/* Smooth transitions for all interactive elements */
* {
	transition-property: color, background-color, border-color, transform,
		box-shadow;
	transition-duration: 200ms;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
	-webkit-appearance: none;
	margin: 0;
}
input[type='number'] {
	-moz-appearance: textfield;
}
</style>
