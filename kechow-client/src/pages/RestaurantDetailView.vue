<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { restaurants } from '@/shared/data/restaurants';

const route = useRoute();
const restaurantId = parseInt(route.params.id as string);
const restaurant = computed(() =>
	restaurants.find((r) => r.id === restaurantId)
);

const cart = ref<Record<string, number>>({});

function add(item: string) {
	cart.value[item] = (cart.value[item] || 0) + 1;
}

function remove(item: string) {
	if (cart.value[item] > 0) cart.value[item]--;
}

const totalItems = computed(() =>
	Object.values(cart.value).reduce((a, b) => a + b, 0)
);
</script>

<template>
	<div v-if="restaurant" class="pb-24">
		<!-- BACK BUTTON -->
		<!-- HEADER BAR -->
		<div
			class="flex items-center justify-between px-4 py-3 dark:bg-gray-900 shadow-md sticky top-0 z-20"
		>
			<button
				@click="$router.push({ name: 'Home' })"
				class="flex items-center text-primary font-medium"
			>
				<span class="text-lg mr-1">←</span>
				<span class="text-sm">Back</span>
			</button>
			<div class="w-12"></div>
			<!-- spacer to balance layout -->
		</div>

		<!-- TOP IMAGE -->
		<div class="relative w-full h-48 sm:h-56 overflow-hidden">
			<img
				:src="restaurant.image"
				alt=""
				class="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
			/>
			<img
				:src="restaurant.image"
				:alt="restaurant.name"
				class="relative z-10 mx-auto h-full object-contain"
			/>
		</div>

		<!-- RESTAURANT HEADER -->
		<div class="text-center p-4">
			<h1 class="text-2xl font-bold">{{ restaurant.name }}</h1>
			<p class="text-gray-500 text-sm">{{ restaurant.description }}</p>
		</div>

		<!-- MENU ITEMS -->
		<div class="space-y-4 px-4">
			<div
				v-for="(item, index) in restaurant.menu"
				:key="index"
				class="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4"
			>
				<!-- ITEM IMAGE -->
				<img
					:src="item.image || 'https://via.placeholder.com/80'"
					alt=""
					class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
				/>

				<!-- ITEM TEXT -->
				<div class="flex-1">
					<p class="text-base font-semibold">{{ item.name }}</p>
					<p class="text-xs text-gray-500 mb-1 line-clamp-2">
						{{ item.description || 'Delicious and freshly prepared.' }}
					</p>
					<p class="text-sm font-medium text-gray-700">
						${{ item.price || '9.99' }}
					</p>
				</div>

				<!-- CART CONTROLS -->
				<div class="flex items-center gap-2">
					<button
						@click="remove(item.name)"
						:disabled="!cart[item.name]"
						class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
					>
						−
					</button>
					<span class="min-w-[20px] text-center font-medium">{{
						cart[item.name] || 0
					}}</span>
					<button
						@click="add(item.name)"
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
			class="fixed bottom-0 left-0 right-0 bg-primary text-white flex items-center justify-between px-6 py-3 shadow-lg"
		>
			<span>{{ totalItems }} items in cart</span>
			<button class="bg-white text-primary font-bold px-4 py-2 rounded-lg">
				View Cart
			</button>
		</div>
	</div>

	<div v-else class="text-center py-20 text-gray-400">
		Restaurant not found.
	</div>
</template>
