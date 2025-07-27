<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { restaurants } from '@/data/restaurants';

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
</script>

<template>
	<div v-if="restaurant" class="p-6 max-w-4xl mx-auto">
		<!-- TOP IMAGE -->
		<div class="relative w-full h-52 overflow-hidden rounded-xl mb-6">
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
		<div class="text-center mb-6">
			<h1 class="text-3xl font-bold">{{ restaurant.name }}</h1>
			<p class="text-gray-500">{{ restaurant.description }}</p>
		</div>

		<!-- MENU ITEMS -->
		<div class="space-y-6">
			<div
				v-for="(item, index) in restaurant.menu"
				:key="index"
				class="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4"
			>
				<!-- ITEM IMAGE -->
				<img
					:src="item.image || 'https://via.placeholder.com/80'"
					alt=""
					class="w-20 h-20 object-cover rounded-lg"
				/>

				<!-- ITEM TEXT -->
				<div class="flex-1">
					<p class="text-lg font-semibold">{{ item.name }}</p>
					<p class="text-sm text-gray-500 mb-1">
						{{ item.description || 'Delicious and freshly prepared.' }}
					</p>
					<p class="text-sm text-gray-400">${{ item.price || '9.99' }}</p>
				</div>

				<!-- CART CONTROLS -->
				<div class="flex items-center gap-2">
					<button
						@click="remove(item.name)"
						:disabled="!cart[item.name]"
						class="px-2 py-1 text-lg font-bold rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-40"
					>
						−
					</button>
					<span class="min-w-[20px] text-center">{{
						cart[item.name] || 0
					}}</span>
					<button
						@click="add(item.name)"
						class="px-2 py-1 text-lg font-bold rounded bg-primary text-white"
					>
						+
					</button>
				</div>
			</div>
		</div>
	</div>

	<div v-else class="text-center py-20 text-gray-400">
		Restaurant not found.
	</div>
</template>
