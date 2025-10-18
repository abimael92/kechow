<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { restaurants } from '@/shared/data/restaurants';

const route = useRoute();
const router = useRouter();

// Find restaurant by ID
const restaurantId = computed(() => route.params.id?.toString());
const restaurant = computed(() =>
	restaurants.find((r) => r.id.toString() === restaurantId.value)
);

// Cart state (use IDs, not names)
const cart = ref<Record<number, number>>({});

function add(id: number) {
	cart.value[id] = (cart.value[id] || 0) + 1;
}
function remove(id: number) {
	if (cart.value[id]) cart.value[id]--;
}

const totalItems = computed(() =>
	Object.values(cart.value).reduce((a, b) => a + b, 0)
);

// Safe back navigation
function goBack() {
	if (window.history.length > 1) router.back();
	else router.push({ name: 'Home' });
}
</script>

<template>
	<div v-if="restaurant" class="pb-24">
		<!-- HEADER -->
		<div
			class="flex items-center justify-between px-4 py-4 sticky top-0 z-20 shadow"
		>
			<button
				@click="goBack"
				class="flex items-center text-white font-medium text-base px-2 py-1 bg-gray-800 rounded-lg shadow"
			>
				<span class="mr-1 text-sm">←</span>
				Back
			</button>
			<div class="w-12"></div>
		</div>

		<!-- BANNER -->
		<div class="relative w-full h-44 sm:h-56 overflow-hidden">
			<img
				:src="restaurant.image"
				class="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
			/>
			<img
				:src="restaurant.image"
				:alt="restaurant.name"
				class="relative z-10 mx-auto h-full object-contain"
			/>
		</div>

		<!-- INFO -->
		<div class="text-center p-4">
			<h1 class="text-xl font-bold">{{ restaurant.name }}</h1>
			<p class="text-gray-500 text-sm">{{ restaurant.description }}</p>
		</div>

		<!-- MENU ITEMS -->
		<div class="space-y-3 px-3">
			<div
				v-for="(item, index) in restaurant.menu"
				:key="index"
				class="bg-white rounded-lg shadow p-3 flex items-center justify-between gap-3 hover:shadow-lg hover:scale-105 transition-transform"
			>
				<!-- LEFT: IMAGE + INFO -->
				<div class="flex gap-3 items-start">
					<img
						:src="item.image || 'https://via.placeholder.com/100'"
						class="w-20 h-20 rounded-md object-cover"
						loading="lazy"
					/>
					<div class="flex-1">
						<p class="text-sm font-semibold">{{ item.name }}</p>
						<p class="text-xs text-gray-500 line-clamp-2">
							{{ item.description || 'Freshly made and tasty.' }}
						</p>
						<p class="text-sm font-bold mt-1">${{ item.price || '9.99' }}</p>
					</div>
				</div>

				<!-- RIGHT: CART CONTROLS -->
				<div class="flex items-center gap-2">
					<button
						@click="remove(item.id)"
						:aria-label="'Remove ' + item.name"
						:disabled="!cart[item.id]"
						class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 disabled:opacity-40"
					>
						−
					</button>
					<span
						class="w-5 text-center font-medium text-primary transition-transform duration-200"
						:class="{ 'scale-110': cart[item.id] > 0 }"
					>
						{{ cart[item.id] || 0 }}
					</span>
					<button
						@click="add(item.id)"
						:aria-label="'Add ' + item.name"
						class="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white"
					>
						+
					</button>
				</div>
			</div>
		</div>

		<!-- CART BAR -->
		<div
			v-if="totalItems"
			class="fixed bottom-0 left-0 right-0 bg-primary text-white flex justify-between items-center px-5 py-4 shadow-lg"
		>
			<span class="font-medium text-sm">{{ totalItems }} items in cart</span>
			<button
				@click="router.push({ name: 'Cart' })"
				class="bg-white text-primary font-semibold px-5 py-2 rounded-lg shadow"
			>
				View Cart
			</button>
		</div>
	</div>

	<!-- ERROR STATE -->
	<div v-else class="text-center py-16 text-gray-400">
		Restaurant not found.
	</div>
</template>
